import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import Modal from 'react-awesome-modal';

import {
  updateBlock, deleteBlock, moveBlockUp, moveBlockDown, editBlock
} from '../actions';

export default class Block extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '', visible: false, condition: '', trueValue: ''};

    this.enterEdit = this.enterEdit.bind(this);
    this.textChanged = this.textChanged.bind(this);
    this.getButtons = this.getButtons.bind(this);
    //this.getCondition = this.getCondition.bind(this);
    this.deleteBlock = this.deleteBlock.bind(this);
    this.moveBlockUp = this.moveBlockUp.bind(this);
    this.moveBlockDown = this.moveBlockDown.bind(this);
    this.addCondition = this.addCondition.bind(this);

    this.handleChange = this.handleChange.bind(this);
    //this.openModal = this.openModal.bind(this);
    //this.closeModal = this.closeModal.bind(this);

  }

  enterEdit(e) {

    if (this.props.editable) {
      e.stopPropagation();
      const {dispatch, block} = this.props;
      this.setState({
        text: block.get('content')
      });

      //alert("test");
      //alert(block.get('content'));
      //alert(block.get('id'));
      dispatch(editBlock(block.get('id')));
    }
  }

  textChanged(text) {
    this.setState({text});
  }

  componentDidUpdate() {
    if (this.refs.editarea) {
      this.refs.editarea.focus();
      const domNode = findDOMNode(this.refs.editarea);
      if (domNode.scrollIntoViewIfNeeded) {
        findDOMNode(this.refs.editarea).scrollIntoViewIfNeeded(false);
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.editing && !newProps.editing &&
      this.props.block.get('content') === newProps.block.get('content')) {
      // If exiting edit mode, save text (unless it's an undo))
      this.props.dispatch(
        updateBlock(this.props.block.get('id'), this.state.text)
      );
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  deleteBlock() {
    this.props.dispatch(deleteBlock(this.props.block.get('id')));
  }

  moveBlockUp() {
    this.props.dispatch(moveBlockUp(this.props.block.get('id')));
  }

  moveBlockDown() {
    this.props.dispatch(moveBlockDown(this.props.block.get('id')));
  }

  addCondition() {
    this.setState({showModal: true});
    //this.props.dispatch(moveBlockDown(this.props.block.get('id')));
  }

  getButtons() {
    if (!this.props.editable) {
      return null;
    }
    let buttons = [];
    if (!this.props.isLast) {
      buttons.push(
        <i className="fa fa-arrow-circle-o-down" key="down"
           onClick={this.moveBlockDown} title="Move block down">
        </i>
      );
    }
    if (!this.props.isFirst) {
      buttons.push(
        <i className="fa fa-arrow-circle-o-up" key="up"
           onClick={this.moveBlockUp} title="Move block up">
        </i>
      );
    }


    buttons.push(
      <i className="fa fa-times-circle-o" key="delete"
         onClick={this.deleteBlock} title="Remove block">
      </i>)
    ;

    return buttons;
  }

  /*
   getCondition() {

   let buttons = [];
   if (!this.props.editable) {
   buttons.push(
   <label>
   Name: <input type="text" name="name" onChange={this.handleChange}/>
   </label>);
   }

   return buttons;
   }

   */

  render() {
    const {block, editable, editing} = this.props;

    //alert("BLOCK " + editing + editable + "______");

    if (!(editable && editing)) {
      return this.renderViewerMode();
    }
    //alert("EDIT0");
    const isCodeBlock = (block.get('type') === ( 'code' || 'p5' || 'map' ));
    const id = this.props.block.get('id');
    const options = {
      mode: isCodeBlock ? 'javascript' : 'markdown',
      theme: 'base16-tomorrow-light',
      lineNumbers: true,
      indentUnit: 4,
      preserveScrollPosition: true,
      autoSave: true,
      autoFocus: true,
      lineWrapping: true,
      extraKeys: {
        Tab: (cm) => {
          var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
          cm.replaceSelection(spaces);
        }
      }
    };

    /*
     graphElement = document.getElementById("kajero-graph-" + id);
     if (graphElement) {
     var mapContainerParent = graphElement.parentNode;
     mapContainerParent.removeChild(graphElement);
     }
     graphElement = document.getElementById("resultBlock-" + id);
     if (graphElement) {
     var mapContainerParent = graphElement.parentNode;
     mapContainerParent.removeChild(graphElement);
     }
     */
    //alert(this.state.text);
    //alert("EDIT");
    return (
      <div>
        <div className="edit-box" id={'edit-box-' + id} onClick={(e) => {
          e.stopPropagation()
        }}>
          <Codemirror id={'codemirror-' + id} value={this.state.text} options={options}
                      onChange={this.textChanged} ref="editarea"/>
          <div>

          </div>

        </div>

      </div>

    );
  }

}
