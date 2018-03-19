import React from 'react';
import MarkdownIt from 'markdown-it';
import Block from './Block';
import {highlight} from '../util';

import {deleteDatasource, updateInput, fetchData, compileConditionBlock, updateTextLabel} from '../actions';


//import Conditional from 'react-conditionals';

import {If, Then, Else} from 'react-if';

import SelectionPopover from 'react-selection-popover'

const md = new MarkdownIt({highlight, html: true});

var marked = require('marked');
var renderer = new marked.Renderer();

require('marked-forms')(renderer);    // monkey-patches the renderer

//var html = marked(markdown, {renderer:renderer});
//  / <If condition={ this.state.value ==	 3 }>
class TextBlock extends Block {

  constructor(props) {
    super(props);
    this.updateLabel = this.updateLabel.bind(this);
    this.getCondition = this.getCondition.bind(this);
    this.state = {
      condition: false
    };
  }

  rawMarkup(markdown) {
    return {__html: marked(markdown, {renderer: renderer})};
  }

  updateLabel(axis) {
    const { dispatch, block } = this.props;
    const value = this.refs['set-axis-' + axis].value;
    dispatch(updateTextLabel(block.get('id'), axis, value));
  }

  getCondition(open) {
    if (!this.props.editable) {
      return null;
    }
    const block = this.props.block;
    const inputs = [];

    const icons = {
      x: 'right',
      y: 'up'
    };

    /* conditions
    for (let axis of ['Condition', 'Default']) {
      inputs.push(
        <div hidden={open} className="pure-g hint" key={axis}>
          <i className={
            'fa fa-long-arrow-' + icons[axis] + ' pure-u-1-12 pure-u-md-1-24'
          }></i>
          <div className="pure-u-11-12 pure-u-md-5-24">
            <p>{axis}</p>
          </div>
          <div className="pure-u-1 pure-u-md-3-4">
            <input type="text" defaultValue={block.getIn(['labels', axis])}
                   ref={'set-axis-' + axis} onBlur={() => {
              this.updateLabel(axis)
            }}
                   placeholder="No label"/>
          </div>
        </div>
      );
    }

    */
    return (
      <div>
        {inputs}
      </div>
    );
  }

  openCondition(){
    this.state.condition=false;
    this.props.dispatch(updateInput("", ""));
  }


  renderViewerMode() {

    const {block} = this.props;
    const buttons = this.getButtons();

    /*
    buttons.push(
      <i className="fa fa-question" key="condition"
         onClick={() => this.openCondition()} title="Add condition">
      </i>
    );
*/
    const conditions = this.getCondition(this.state.condition);
    var variable = 16;
    return (

      <div className="text-block">

        <div className="editor-buttons">
          {buttons}
        </div>

        <div className="condition">
          {conditions}
        </div>



        <div className="text-block-content"
             dangerouslySetInnerHTML={this.rawMarkup(block.get('content'))}
             onClick={this.enterEdit}>
        </div>

      </div>

    );
  }

}

export default TextBlock;
