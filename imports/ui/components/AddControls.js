import React, {Component} from 'react';
import {addCodeBlock, addTextBlock, addGraphBlock, addMapBlock, addConditionBlock, addp5Block} from '../actions';

export default class AddControls extends Component {

  constructor(props) {
    super(props);
    this.addCodeBlock = this.addCodeBlock.bind(this);
    this.addTextBlock = this.addTextBlock.bind(this);
    this.addGraphBlock = this.addGraphBlock.bind(this);
    this.addMapBlock = this.addMapBlock.bind(this);
    this.addConditionBlock = this.addConditionBlock.bind(this);
    this.addp5Block = this.addp5Block.bind(this);
  }

  addCodeBlock() {
    this.props.dispatch(addCodeBlock(this.props.id));
  }

  addTextBlock() {
    this.props.dispatch(addTextBlock(this.props.id));
  }

  addGraphBlock() {
    this.props.dispatch(addGraphBlock(this.props.id));
  }

  addMapBlock() {
    this.props.dispatch(addMapBlock(this.props.id));
  }

  addConditionBlock() {
    this.props.dispatch(addConditionBlock(this.props.id));
  }

  addp5Block() {
    this.props.dispatch(addp5Block(this.props.id));
  }

  render() {
    const {editable} = this.props;
    if (!editable) {
      return null;
    }
    return (
      <div className="add-controls">
        <i className="fa fa-flag clickable" onClick={this.addp5Block}
           title="New p5 block">
        </i>
        <i className="fa fa-map-o clickable" onClick={this.addMapBlock}
           title="New map block">
        </i>
        <i className="fa fa-file-text-o clickable" onClick={this.addTextBlock}
           title="New text block">
        </i>
        <i className="fa fa-file-code-o clickable" onClick={this.addCodeBlock}
           title="New code block">
        </i>
        <i className="fa fa-bar-chart clickable" onClick={this.addGraphBlock}
           title="New graph">
        </i>
      </div>
    );
  }
}
