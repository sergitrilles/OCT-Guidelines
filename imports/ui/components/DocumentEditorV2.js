/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import documentEditor from '../../modules/document-editor.js';
import {ButtonToolbar, ButtonGroup} from 'react-bootstrap';
import handleUpsert from '../../modules/document-editor.js';

import {handleImporter, documentImporter} from '../../modules/document-importer.js';


import {browserHistory} from 'react-router';

import {parse, renderString} from './../markdown';

import 'codemirror/mode/markdown/markdown';

import {ReactMde, ReactMdeCommands} from 'react-mde';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

import SaveDialog from './SaveDialog';

import {ReactiveVar} from 'meteor/reactive-var';


import {render} from 'react-dom';

import Immutable from 'immutable';

import FileSaver from 'filesaver.js';

import {loadMarkdownFromDB, loadMarkdown, fetchData, editBlock} from './../actions';
import {connect} from 'react-redux';
import {editorSelector} from './../selectors';

import {removeDocument, publishDocument, upsertDocument, unpublishDocument} from '../../api/documents/methods';

import Dropzone from 'react-dropzone'

import Modal from 'react-modal';

const handleEdit = (_id) => {
  browserHistory.push(`/documents/${_id}/edit`);
};


const handleExport = (markdown) => {
  const file = renderString(markdown);
  var blob = new Blob([file], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, "export.txt");
};

const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
    removeDocument.call({_id}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        browserHistory.push('/documents');
      }
    });
  }
};

const handlePublish = (_id) => {
  if (confirm('Are you sure?')) {
    publishDocument.call({_id}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document published!', 'success');
        browserHistory.push('/documents');
      }
    });
  }
};

const handleUnpublish = (_id) => {
  if (confirm('Are you sure?')) {
    unpublishDocument.call({_id}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document unpublished!', 'success');
        browserHistory.push('/documents');
      }
    });
  }
};


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

let updated = false;

class DocumentEditor extends React.Component {


  componentDidMount() {

    documentEditor({component: this});
    //setTimeout(() => { document.querySelector('[name="title"]').focus(); }, 0);
    this.props.dispatch(fetchData());
  }

  constructor(props) {
    super(props);
    const {notebook} = this.props;

    this.deselectBlocks = this.deselectBlocks.bind(this);
    this.state = {files: [], modalIsOpen: false};

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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

  /*
   submit(e){

   alert(parse(aux));
   e.preventDefault();
   alert('sergi!');
   handleUpsert({component: this},{param:parse(aux)});
   //documentEditor({ component: this },{param: parse(aux)});
   alert('it works!');

   }
   */


  deselectBlocks() {
    this.props.dispatch(editBlock(null));
  }


  componentWillMount() {
    const {doc} = this.props;
    const {notebook} = this.props;
    //alert(renderString(notebook));
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
    this.props.dispatch(loadMarkdownFromDB(parse(doc.body)));

  }


  submit(e, notebook) {
    e.preventDefault();
    handleUpsert(notebook);
    //documentEditor({ component: this },{param: parse(aux)});

  }

  onDrop(files) {
    console.log('Received files: ', files);

    var file = files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {

      this.setState({modalIsOpen: false});
      var reader = new FileReader();

      reader.onload = function (e) {
        alert(reader.result);
        newState = parse(reader.result);
        alert(newState);
        stateGlobal = newState;
        alert("12");
        updated = true;
        //handleImporter({component: this, notebook: stateGlobal});

       // handleImporter(stateGlobal);
        alert("11");

      };

      reader.readAsText(file);
    } else {
      alert("File not supported!");
    }
  }


  render() {
    editable = false;
    const {saving, activeBlock} = this.props.edit;
    const cssClass = editable ? ' editable' : '';

    const {notebook} = this.props;

    if(updated)



    stateGlobal = notebook;
    const {doc} = this.props;
    //const sampleNotebook = parse(doc.body);
    //alert(doc.body);
    //const editable = true;
    const metadata = parse(doc.body).get('metadata');

    const saveView = (
      <div className="pure-u-1 pure-u-md-3-4 pure-u-lg-2-3">
        <SaveDialog />
      </div>
    );

    view = "";


    if (Meteor.userId() == doc.owner) {

      var publishButton = doc.published ? <Button onClick={ () => handleUnpublish(doc._id) }>Unpublish</Button> :
        <Button onClick={ () => handlePublish(doc._id) }>Publish</Button>;
      view = (
        <div>

          <div className="ViewDocument">
            <div className="page-header clearfix">
              <h4 className="pull-left">{ doc && doc.title }</h4>
              <ButtonToolbar className="pull-right">
                <ButtonGroup bsSize="small">
                  <Button onClick={ () => handleEdit(doc._id) }>Edit</Button>
                  {publishButton}
                  <Button onClick={ () => handleRemove(doc._id) } className="text-danger">Delete</Button>
                  <Button onClick={ () => handleExport(notebook) } className="text-danger">Export</Button>
                </ButtonGroup>
              </ButtonToolbar>
              <div>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <Dropzone onDrop={this.onDrop}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                  </Dropzone>
                  <ButtonGroup bsSize="small">

                    <Button onClick={this.closeModal}>Close</Button>
                  </ButtonGroup>
                </Modal>
              </div>
            </div>
          </div>
          <div className="ViewDocument">

            <Header editable={editable}/>
            <hr className="top-sep"></hr>
            <Content editable={editable} activeBlock={activeBlock}/>
            <Footer />

          </div>
        </div>

      )
    }
    else {
      view = (
        <div className="ViewDocument">

          <Header editable={false}/>
          <hr className="top-sep"></hr>
          <Content editable={false} activeBlock={activeBlock}/>
          <Footer />

        </div>
      )
    }

    return (

      <div className="pure-g" onClick={this.deselectBlocks}>
        <div className="offset-col pure-u-1 pure-u-md-1-8 pure-u-lg-1-6">
          &nbsp;
        </div>
        {view}

      </div>
    )
  }
}

DocumentEditor.propTypes = {
  doc: PropTypes.object,
};

export default connect(editorSelector)(DocumentEditor);
