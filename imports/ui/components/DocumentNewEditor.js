import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import documentEditor from '../../modules/document-editor.js';
import handleUpsert from '../../modules/document-editor.js';

import {parse} from './../markdown';

import Dropzone from 'react-dropzone'

import Modal from 'react-modal';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css';

export default class DocumentNewEditor extends React.Component {


  constructor(props) {
    super(props);

    this.state = {files: [], modalIsOpen: false, selected: {value: "0", label: ""}};

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._onSelect = this._onSelect.bind(this);

  }

  openModal() {
    this.setState({modalIsOpen: true});
  }


  closeModal() {
    this.setState({modalIsOpen: false});
  }


  edit() {
    documentEditor({component: this});
  }

  componentDidMount() {
    documentEditor({component: this});
    const {doc} = this.props;
    /*
     var fs = Npm.require('fs');
     var fs_sync = Meteor.wrapAsync(fs.readFile, fs);

     var fileContents = fs_sync ('/Users/anoop/delete/juhi.txt', 'utf8');
     console.log(fileContents);
     */
    //var self = this;
    /*var test = Meteor.call('getFile', function(error, file){
     if(error){
     alert('Errorsss');
     }
     else{
     ;
     //alert(file);
     //loadMarkdownFromDB(self.i);
     //alert("INICI3");
     aux = file;
     //doc.body(file);
     self.props.dispatch(loadMarkdownFromDB(file));
     //return file;
     }
     });
     */

    //doc.body = parse(aux);
    //alert(doc.body);

    setTimeout(() => {
      document.querySelector('[name="title"]').focus();
    }, 0);
  }


  onDrop(acceptedFiles, rejectedFiles) {
    console.log('Accepted files: ', acceptedFiles);
    console.log('Rejected files: ', rejectedFiles);
    this.setState({
      files: acceptedFiles
    });

    //console.log('Received files: ', files);
    if (rejectedFiles.length == 0) {
      var file = acceptedFiles[0];
      var textType = /text\/plain.*/;

      if (file.type.match(textType)) {

        var reader = new FileReader();

        reader.onload = function (e) {
          newState = parse(reader.result);
          stateGlobal = newState;
          importer = true;
        };

        reader.readAsText(file);


      } else {
        Bert.alert("File not supported!", 'danger');
      }
    }
    else {
      Bert.alert("File not supported!", 'danger');
    }
  }

  _onSelect(option) {

    this.setState({
      selected: option
    });

    index = 0;

    for (var i = 0; i < jsonTemplates.templates.length; i++) {
      if (jsonTemplates.templates[i].value == option.value){
        index = i;
      }
    }

    stateGlobal = parse(templates[index]);

  }

  render() {
    const {doc} = this.props;
    items = this.renderListItems();

    const options = [
      'one', 'two', 'three'
    ];

    return (<form
      ref={ form => (this.documentEditorForm = form) }
      onSubmit={ event => event.preventDefault() }
    >
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <FormControl
          type="text"
          name="title"
          defaultValue={ doc && doc.title }
          placeholder="Oh, The Places You'll Go!"
        />
        <br></br>
        <ControlLabel>Select template</ControlLabel>
        <Dropdown options={items} onChange={this._onSelect} open={stateGlobal = parse(templates[0])} value={items[0]} placeholder="Select an option"/>

        <br></br>
        <center><b>OR</b></center>
        <br></br>
        <ControlLabel>Import</ControlLabel>
        <Dropzone style={{
          height: 100,
          border: '2px dashed #ddd',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'

        }} accept="text/plain" multiple={false} onDrop={this.onDrop.bind(this)}>
          <div>Try dropping your guideline txt here, or click to select file to upload.</div>
        </Dropzone>
        <br></br>
        {this.state.files.length > 0 ? <div>
          <div>Uploaded {this.state.files.map((file) => <li key={file.id}> {file.name} </li>)}</div>
        </div> : null}

      </FormGroup>

      <Button type="submit" bsStyle="success">
        { doc && doc._id ? 'Save Changes' : 'Add Guideline' }
      </Button>
    </form>);

  }

  renderListItems() {
    var items = [];

    for (var i = 0; i < jsonTemplates.templates.length; i++) {
      items.push(jsonTemplates.templates[i].value);
    }
    return items;
  }
}

DocumentNewEditor.propTypes = {
  doc: React.PropTypes.object,
};
