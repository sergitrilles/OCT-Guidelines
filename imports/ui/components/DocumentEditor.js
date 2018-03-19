/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import documentEditor from '../../modules/document-editor.js';

import handleUpsert from '../../modules/document-editor.js';

import { parse } from './../markdown';

import 'codemirror/mode/markdown/markdown';

import { ReactMde, ReactMdeCommands } from 'react-mde';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

import SaveDialog from './SaveDialog';

import { ReactiveVar } from 'meteor/reactive-var';


import { render } from 'react-dom';

import Immutable from 'immutable';

import { loadMarkdownFromDB, loadMarkdown, fetchData, editBlock } from './../actions';
import { connect } from 'react-redux';
import { editorSelector } from './../selectors';

class DocumentEditor extends React.Component {


  componentDidMount() {

    documentEditor({ component: this });
    //setTimeout(() => { document.querySelector('[name="title"]').focus(); }, 0);
    this.props.dispatch(fetchData());
  }

  constructor(props) {
    super(props);
    const { notebook } = this.props;
    this.deselectBlocks = this.deselectBlocks.bind(this);
  }

  edit()
  {
    documentEditor({ component: this });
  }


  deselectBlocks() {
    this.props.dispatch(editBlock(null));
  }

  componentWillMount() {
    const { doc } = this.props;
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



   submit(e,notebook){

   e.preventDefault();
   handleUpsert(notebook);
   //documentEditor({ component: this },{param: parse(aux)});


   }



  render() {
    editable = true;
    const { saving, activeBlock } = this.props.edit;
    const cssClass = editable ? ' editable' : '';
    const { notebook } = this.props;

    stateGlobal = notebook;
    const { doc } = this.props;
    //const sampleNotebook = parse(doc.body);
    //alert(doc.body);
    //const editable = true;
    const metadata = parse(doc.body).get('metadata');


    const notebookView = (
      <div className={'pure-u-1 pure-u-md-3-4 pure-u-lg-2-3' + cssClass}>
        <Header editable={editable} />
        <hr className="top-sep"></hr>
        <Content editable={editable} activeBlock={activeBlock} />
        <Footer />
      </div>
    );




    const content = saving ? saveView : notebookView;

    return (



      <form
        ref={ form => (this.documentEditorForm = form) }
        onSubmit={  event => event.preventDefault() }
      >

        <div className="pure-g" onClick={this.deselectBlocks}>
          <div className="offset-col pure-u-1 pure-u-md-1-8 pure-u-lg-1-6">
            &nbsp;
          </div>
          {content}


        </div>
        <Button type="submit" bsStyle="success">
          { doc && doc._id ? 'Save Changes' : 'Add Guideline' }
        </Button>

      </form>

    );
  }
}

DocumentEditor.propTypes = {
  doc: PropTypes.object,
};

export default connect(editorSelector)(DocumentEditor);
