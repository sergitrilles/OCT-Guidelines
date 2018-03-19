import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Documents from '../../api/documents/documents';
import { removeDocument, publishDocument, upsertDocument, unpublishDocument } from '../../api/documents/methods';
import NotFound from './NotFound';
import container from '../../modules/container';
import MarkdownRenderer from 'react-markdown-renderer';
import Immutable from 'immutable';



import { parse } from './../markdown';

import Header from './../components/Header';
import Content from './../components/Content';
import Footer from './../components/Footer';

const handleEdit = (_id) => {
  browserHistory.push(`/documents/${_id}/edit`);
};

const handleRemove = (_id) => {
  if (confirm('Are you sure? This is permanent!')) {
    removeDocument.call({ _id }, (error) => {
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
    publishDocument.call({ _id }, (error) => {
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
      unpublishDocument.call({ _id }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document unpublished!', 'success');
        browserHistory.push('/documents');
      }
    });
  }
};



const ViewDocument = ({ doc }) => {
  const sampleNotebook = parse(doc.body);
  const metadata = sampleNotebook.get('metadata');
  var emailUser = "";
  if (Meteor.user())
    emailUser = Meteor.user().emails[0].address;
  var link = "https://github.com/olahol/react-social/", facebookAppId = "7accd96295e614f9312867c48ed600c6", message = "Share!";
  //alert("Hola2");

    // script should be loaded and do something with it.
  //alert("Hola");
  if(Meteor.userId() || (emailUser == "strilles@uji.es")) {
    return doc ? (
        <div className="ViewDocument">
          <div className="page-header clearfix">
            <h4 className="pull-left">{ doc && doc.title }</h4>
            <ButtonToolbar className="pull-right">
              <ButtonGroup bsSize="small">
                <Button onClick={ () => handleEdit(doc._id) }>Edit</Button>
                <Button onClick={ () => handlePublish(doc._id) }>Publish</Button>
                <Button onClick={ () => handleUnpublish(doc._id) }>Unpublish</Button>
                <Button onClick={ () => handleRemove(doc._id) } className="text-danger">Delete</Button>
              </ButtonGroup>
            </ButtonToolbar>


          </div>
          <div className={'pure-u-1 pure-u-md-3-4 pure-u-lg-2-3' + 'editable'}>
            <div className="ViewDocument">
              <div className="page-header clearfix">
                <h4 className="pull-left">{ doc && doc.title }</h4>
              </div>
              <MarkdownRenderer markdown={doc.body} />
            </div>
          </div>
        </div>
      ) : <NotFound />;
  }
  else{
    return doc ? (
        <div className="ViewDocument">
          <div className="page-header clearfix">
            <h4 className="pull-left">{ doc && doc.title }</h4>
          </div>

          <MarkdownRenderer markdown={doc.body} />
        </div>

      ) : <NotFound />;
  }


};

ViewDocument.propTypes = {
  doc: PropTypes.object,
};

export default container((props, onData) => {
  const documentId = props.params._id;

  const subscription = Meteor.subscribe('documents.view', documentId);

  if (subscription.ready()) {
    const doc = Documents.findOne(documentId);
    onData(null, { doc });
  }
}, ViewDocument);
