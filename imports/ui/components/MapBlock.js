import React from 'react';
import MarkdownIt from 'markdown-it';
import Block from './Block';
import {highlight} from '../util';

import ReactDOM from 'react-dom';

import {connect} from 'react-redux';

import SelectionPopover from 'react-selection-popover'

import Immutable from 'immutable';

import CodeBlock from './CodeBlock';
import Visualiser from './visualiser/Visualiser';
import {dataSelector} from '../selectors';

import 'leaflet/dist/leaflet.css'

import Jutsu from 'jutsu';

import bbox from 'turf-bbox';

import turf from 'turf-isvalid';

import {
  executeCodeBlock, updateGraphType,
  updateMapDataPath, updateGraphHint,
  updateGraphLabel, compileGraphBlock
} from '../actions';

const md = new MarkdownIt({highlight, html: true});

import {
  Map,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  Circle,
  Rectangle,
  FeatureGroup,
  Overlay,
  Polyline,
  GeoJSON,

} from 'react-leaflet';
import axios from 'axios';

class MapBlock extends Block {

  constructor(props) {
    super(props);
    /*
     this.state = {
     showHintDialog: Immutable.Map()
     };
     */
    this.getCssClass = this.getCssClass.bind(this);
    this.setDataPath = this.setDataPath.bind(this);
    //this.getHintInputs = this.getHintInputs.bind(this);
    this.getPointZoomInputs = this.getPointZoomInputs.bind(this);
    this.updateHint = this.updateHint.bind(this);
    //this.setHint = this.setHint.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.toggleHintDialog = this.toggleHintDialog.bind(this);
    this.saveAsCode = this.saveAsCode.bind(this);
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
    catch(err){
      console.log(err.message);
      return(
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




