import React from "react";
import MarkdownIt from "markdown-it";
import Block from "./Block";
import { codeToText, highlight } from '../util';

import {connect} from "react-redux";
import Visualiser from "./visualiser/Visualiser";
import {dataSelector} from "../selectors";

import "leaflet/dist/leaflet.css";
import Jutsu from "jutsu";

import {compileGraphBlock, executeCodeBlock, updateGraphHint, updateMapDataPath} from "../actions";
import {Overlay} from "react-leaflet";

const md = new MarkdownIt({highlight, html: true});

class MapBlock extends Block {

  constructor(props) {
    super(props);

    this.getCssClass = this.getCssClass.bind(this);
    this.setDataPath = this.setDataPath.bind(this);
    //this.getHintInputs = this.getHintInputs.bind(this);
    this.getPointZoomInputs = this.getPointZoomInputs.bind(this);
    this.updateHint = this.updateHint.bind(this);
    //this.setHint = this.setHint.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.toggleHintDialog = this.toggleHintDialog.bind(this);
    this.saveAsCode = this.saveAsCode.bind(this);

    this.clickPlay = this.clickPlay.bind(this);
    this.clickOption = this.clickOption.bind(this);
    this.getRunButton = this.getRunButton.bind(this);
    this.getOptionButton = this.getOptionButton.bind(this);


    this.smolderSchema = Jutsu().__SMOLDER_SCHEMA;
    this.needsRerun = false;

    this.state = {
      lat: 45.090240,
      lng: -105.512891,
      zoom: 0,
      cont: 0,
      bounds: [0, 0]
    };
    this.layerIndex = -1;
  }


  getCssClass(button) {
    const css = 'graph-type';
    if (this.props.block.get('graphType') === button) {
      return css + ' selected';
    }
    return css;
  }

  setDataPath(_, path) {
    const {dispatch, block} = this.props;
    dispatch(updateMapDataPath(block.get('id'), path));
  }

  clickPlay() {
    const {dispatch, block} = this.props;
    dispatch(executeCodeBlock(block.get('id')));
  }

  clickOption() {
    const {dispatch, block} = this.props;
    dispatch(changeCodeBlockOption(block.get('id')));
  }

  getOptionButton() {
    const option = this.props.block.get('option');
    if (!this.props.editable) {
      return null;
    }
    let icon, text;
    switch (option) {
      case 'runnable':
        icon = 'users';
        text = 'Code is run by readers, by clicking the play button.';
        break;
      case 'auto':
        icon = 'gear';
        text = 'Code is run when the notebook is loaded.';
        break;
      case 'hidden':
        icon = 'user-secret';
        text = 'Code is run when the notebook is loaded, and only the results are displayed.';
        break;
      default:
        return null;
    }
    return (
      <i className={"fa fa-" + icon} onClick={this.clickOption}
         key="option" title={text}>
      </i>
    );
  }

  getRunButton() {
    const option = this.props.block.get('option');
    const icon = this.props.hasBeenRun ? "fa-refresh" : "fa-play-circle-o";
    const showIconOptions = ['runnable', 'auto', 'hidden'];
    if (showIconOptions.indexOf(option) > -1) {
      return (
        <i className={"fa " + icon} onClick={this.clickPlay} key="run"
           title={this.props.hasBeenRun ? "Re-run code" : "Run code"}>
        </i>
      );
    }
  }

  componentDidMount() {
    this.props.dispatch(executeCodeBlock(this.props.block.get('id')));
    this.selectedData = this.props.data;
  }

  componentWillReceiveProps(newProps) {
    const code = this.props.block.get('content');
    const path = this.props.block.get('dataPath');
    const newBlock = newProps.block;
    const newCode = newBlock.get('content');
    if (code !== newCode || (this.props.editable !== newProps.editable)) {
      this.needsRerun = true;
    }
    if (path !== newBlock.get('dataPath')) {
      this.selectedData = new Function(
        ['data'], 'return ' + newBlock.get('dataPath')
      ).call({}, newProps.data);
    }
  }

  componentDidUpdate() {
    if (this.needsRerun) {
      this.needsRerun = false;
      this.props.dispatch(executeCodeBlock(this.props.block.get('id')));
    }
  }

  updateHint(hint) {
    const value = this.refs['set-' + hint].value;
    this.setHint(hint, value, true);
  }

  setHint(hint, value, dontUpdateInput) {
    const {dispatch, block} = this.props;
    dispatch(updateGraphHint(block.get('id'), hint, value));
    if (!dontUpdateInput) {
      this.refs['set-' + hint].value = value;
    }
  }

  updateMap(axis) {
    const {dispatch, block} = this.props;
    dispatch(updateMapDataPath(block.get('id'), path));
    this.setState({
      zoom: value
    });
  }

  toggleHintDialog(hint) {
    this.setState({
      showHintDialog: this.state.showHintDialog.set(
        hint, !this.state.showHintDialog.get(hint)
      )
    });
  }

  rawMarkup(codeBlock) {
    return {
      __html: md.render(codeToText(codeBlock))
    };
  }

  saveAsCode() {
    this.props.dispatch(compileGraphBlock(this.props.block.get('id')));
  }

  getHintInputs() {
    let results = [];
    const block = this.props.block;
    return results;
  }

  getPointZoomInputs() {
    const block = this.props.block;
    const inputs = [];
    const icons = {
      x: 'x',
      y: 'y',
      zoom: 'zoom'
    };

    for (let axis of ['x', 'y', 'zoom']) {
      inputs.push(
        <div className="pure-g hint" key={axis}>
          <i className={
            'fa fa-long-arrow-' + icons[axis] + ' pure-u-1-12 pure-u-md-1-24'
          }></i>
          <div className="pure-u-11-12 pure-u-md-5-24">
            <p>{axis}</p>
          </div>
          <div className="pure-u-1 pure-u-md-3-4">
            <input type="text" defaultValue={block.getIn(['labels', axis])}
                   ref={'set-axis-' + axis} onBlur={() => {
              this.updateMap(axis)
            }}
                   placeholder="No label"/>
          </div>
        </div>
      );
    }
    return (
      <div>
        <hr/>
        <p>Center point and zoom</p>
        {inputs}
      </div>
    );
  }

  renderViewerMode() {

    const {block, hasBeenRun, result, editable} = this.props;

    let buttons = this.getButtons();
    const runButton = this.getRunButton();
    const optionButton = this.getOptionButton();
    const hideBlock = !editable && block.get('option') === 'hidden';
    const containerClass = hideBlock ? ' hiddenCode' : '';
    const id = block.get('id');
    if (buttons == null) {
      buttons = [runButton, optionButton];
    } else {
      buttons.unshift(optionButton);
      buttons.unshift(runButton);
    }

    return (
      <div className={'codeContainer' + containerClass} id={'codeContainer-' + id}>
        <div className="codeBlock" id={'codeBlock-' + id}>
          <div className="editor-buttons" id={'editor-buttons-' + id}>
            {buttons}
          </div>

          <div onClick={this.enterEdit}
               dangerouslySetInnerHTML={this.rawMarkup(block)}>
          </div>
        </div>

        <div hidden={!hasBeenRun} className="graphBlock"
             id={"kajero-graph-" + block.get('id')}>
        </div>
        {<div hidden={!hasBeenRun} className="resultBlock" id={'resultBlock-' + id}>
          <div className="editor-buttons">
            {hideBlock ? buttons : null}
          </div>
          <Visualiser
            data={result}
            useHljs='true'
            id={'visualiser-' + id}
          />
        </div>}
      </div>
    );
  }

  // /*{this.getPointZoomInputs()}*/

  render() {
    if (!this.props.editable) {
      return this.renderViewerMode();
    }
    const id = this.props.block.get('id');
    const buttons = this.getButtons();
    buttons.push(
      <i className="fa fa-check-circle-o" title="Done - save as code block"
         onClick={this.saveAsCode} key="done">
      </i>
    );
    const style = {
      border: 'solid 1px lightblue',
      backgroundColor: '#333333',
      borderRadius: '50%',
      marginTop: '-5px',
      marginLeft: '-5px',
      width: '10px',
      height: '10px'
    };

    this.layerIndex = this.layerIndex + 1;
    boundsNew = [0.0, 0.0];
    try {
      return (
        <div className="graph-creator">
          <div className="editor-buttons">
            {buttons}
          </div>

          <p>Data</p>
          <Visualiser data={this.props.data} useHljs={true}
                      click={this.setDataPath}
                      path='data'
                      name='data'
                      id={'visualiser-' + id}
          />

          <hr/>
          <p>Preview</p>
          <div id={'kajero-graph-' + id}></div>

        </div>
      );

    }
    catch (err) {
      console.log(err.message);
      return (
        <div className="graph-creator">
          <div className="editor-buttons">
            {buttons}
          </div>

          <p>Select a Datasource (GeoJSON)</p>
          <Visualiser data={this.props.data} useHljs={true}
                      click={this.setDataPath}
                      path='data'
                      name='data'
                      id={'visualiser-' + id}
          />
          <hr/>
          <p>Preview (not GEOJSON selected)</p>

        </div>


      );
    }
  }

}

export default connect(dataSelector)(MapBlock);




