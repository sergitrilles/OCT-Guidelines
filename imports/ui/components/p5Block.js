import React from 'react';
import MarkdownIt from 'markdown-it';
import Block from './Block';
import Visualiser from './visualiser/Visualiser';
import { codeToText, highlight } from '../util';
import {
  executeCodeBlock, changeCodeBlockOption, clearGraphData
} from '../actions';

//import P5Wrapper from 'react-p5-wrapper';

//import P5Component from './P5Component';

import Mappa from 'mappa-mundi';

//import p5 from 'p5';

//import 'p5/lib/addons/p5.dom';

const md = new MarkdownIt({highlight});


class p5Block extends Block {

  constructor(props) {
    super(props);

    this.clickPlay = this.clickPlay.bind(this);
    this.clickOption = this.clickOption.bind(this);
    this.getRunButton = this.getRunButton.bind(this);
    this.getOptionButton = this.getOptionButton.bind(this);

  }

  rawMarkup(p5Block) {
    return {
      __html: md.render(codeToText(p5Block))
    };
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
    const {dispatch, block} = this.props;
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

    //const functionP5 = "(function sketch(p5) { " + block.get('content') + " })";
    //const functionP5 = block.get('content');

    try {
      //const skecthAux = eval(functionP5);
      //test = new p5(skecthAux);
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

            {/*<P5Wrapper sketch={skecthAux} id={'P5Wrapper-' + id}/>*/}
            <div id={'p5-' + id} ></div>
            <div className="graph-preview" id={'kajero-graph-' + id}></div>

          </div>}

        </div>
      );
    }catch(e) {
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

            <div id={'p5-' + id} ></div>
            <div className="graph-preview" id={'kajero-graph-' + id}></div>


          </div>}

        </div>
      );
    }

  }

}

export default p5Block;



