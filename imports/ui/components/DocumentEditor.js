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

import { ReactiveVar } from 'meteor/reactive-var';


import { render } from 'react-dom';

import Immutable from 'immutable';

import { loadMarkdownFromDB, loadMarkdown, fetchData, editBlock } from './../actions';
import { connect } from 'react-redux';
import { editorSelector } from './../selectors';

class DocumentEditor extends React.Component {


  componentDidMount() {
    documentEditor({ component: this });

    setTimeout(() => { document.querySelector('[name="title"]').focus(); }, 0);
  }

  constructor(props) {
    super(props);
  }

  submit(e){

    alert(parse(aux));
    e.preventDefault();
    handleUpsert({component: this},{param:parse(aux)});
    //documentEditor({ component: this },{param: parse(aux)});
    alert('it works!');
    this.props.dispatch(loadMarkdownFromDB(parse(doc.body)));
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
    alert(doc.body);
    this.props.dispatch(loadMarkdownFromDB(parse(doc.body)));

  }



  render() {

    const { doc } = this.props;
    //const sampleNotebook = parse(doc.body);
    alert(doc.body);
    const metadata = parse(doc.body).get('metadata');

    return (

      <form
        ref={ form => (this.documentEditorForm = form) }
        onSubmit={this.submit}
      >

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            name="title"
            defaultValue={ doc && doc.title }
            placeholder="Oh, The Places You'll Go!"
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Guideline</ControlLabel>
          <FormControl
            type="text"
            name="body"
            defaultValue={ doc && doc.body }
            placeholder="Oh, The Places You'll Go!"
          />

        </FormGroup>


        <div className={'pure-u-1 pure-u-md-3-4 pure-u-lg-2-3' + 'editable'}>
          <Header editable={true}  />
          <hr className="top-sep"></hr>
          <Content editable={true} />
          <Footer metadata={metadata} />
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
