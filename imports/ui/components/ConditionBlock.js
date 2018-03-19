import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import CodeBlock from './CodeBlock';
import Visualiser from './visualiser/Visualiser';
import { dataSelector } from '../selectors';
import { highlight } from '../util';
import {
  executeCodeBlock, updateGraphType,
  updateGraphDataPath, updateGraphHint,
  updateGraphLabel, compileGraphBlock, compileConditionBlock, updateConditionLabel
} from '../actions';
import Jutsu from 'jutsu';

class ConditionBlock extends CodeBlock {

  constructor(props) {
    super(props);
    this.state = {
      showHintDialog: Immutable.Map()
    };
    this.getCssClass = this.getCssClass.bind(this);
    this.setGraph = this.setGraph.bind(this);
    this.setDataPath = this.setDataPath.bind(this);
    this.getAxisLabelInputs = this.getAxisLabelInputs.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
    this.toggleHintDialog = this.toggleHintDialog.bind(this);
    this.saveAsCode = this.saveAsCode.bind(this);
    this.smolderSchema = Jutsu().__SMOLDER_SCHEMA;
    this.needsRerun = false;
  }

  getCssClass(button) {
    const css = 'graph-type';
    if (this.props.block.get('graphType') === button) {
      return css + ' selected';
    }
    return css;
  }

  setGraph(graph) {
    const { dispatch, block } = this.props;
    dispatch(updateGraphType(block.get('id'), graph));
  }

  setDataPath(_, path) {
    const { dispatch, block } = this.props;
    dispatch(updateGraphDataPath(block.get('id'), path));
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

  updateLabel(axis) {
    const { dispatch, block } = this.props;
    const value = this.refs['set-axis-' + axis].value;
    dispatch(updateConditionLabel(block.get('id'), axis, value));
  }

  toggleHintDialog(hint) {
    this.setState({
      showHintDialog: this.state.showHintDialog.set(
        hint, !this.state.showHintDialog.get(hint)
      )
    });
  }

  saveAsCode() {
    this.props.dispatch(compileConditionBlock(this.props.block.get('id')));
  }


  getAxisLabelInputs() {
    const block = this.props.block;
    const inputs = [];
    const icons = {
      x: 'right',
      y: 'up'
    };
    for (let axis of ['Condition', 'Default']) {
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
                   ref={'set-axis-' + axis} onBlur={() => {this.updateLabel(axis)}}
                   placeholder="No label" />
          </div>
        </div>
      );
    }
    return (
      <div>
        {inputs}
      </div>
    );
  }

  render() {
    if (!this.props.editable) {
      return this.renderViewerMode();
    }
    const id = this.props.block.get('id');
    const buttons = this.getButtons();
    buttons.push(
      <i className="fa fa-check-circle-o" title="Done - save as code block" onClick={this.saveAsCode} key="done"> </i>
    );
    //alert(this.props.block.get('content'));
    return (

      <div className="graph-creator">
        <div className="editor-buttons">
          {buttons}
        </div>
        <span className={this.getCssClass('pieChart')} onClick={() => this.setGraph('pieChart')}>  <i className="fa fa-pie-chart"></i> Simple condition </span>
        <span className={this.getCssClass('barChart')} onClick={() => this.setGraph('simple')}> <i className="fa fa-bar-chart"></i> Multiple condition </span>
        <hr/>
        <p>Conditions value</p>

        {this.getAxisLabelInputs()}

        <hr/>
        <p>Preview</p>
        <pre dangerouslySetInnerHTML={
          {__html: highlight(this.props.block.get('content'), 'js')}
        }></pre>
      </div>
    );
  }

}

export default connect(dataSelector)(ConditionBlock);
