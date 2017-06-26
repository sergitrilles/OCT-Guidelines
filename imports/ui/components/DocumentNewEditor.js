import React from 'react';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import documentEditor from '../../modules/document-editor.js';
import handleUpsert from '../../modules/document-editor.js';

import { parse } from './../markdown';

export default class DocumentNewEditor extends React.Component {

  componentDidMount() {
    documentEditor({ component: this });
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

    setTimeout(() => { document.querySelector('[name="title"]').focus(); }, 0);
  }



  render() {
    const { doc } = this.props;
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
      </FormGroup>

      <Button type="submit" bsStyle="success">
        { doc && doc._id ? 'Save Changes' : 'Add Guideline' }
      </Button>
    </form>);

  }
}

DocumentNewEditor.propTypes = {
  doc: React.PropTypes.object,
};
