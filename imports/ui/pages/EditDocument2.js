import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import DocumentEditor from '../components/DocumentEditorV2';
import NotFound from './NotFound';
import container from '../../modules/container';


const EditDocument2 = ({ doc }) => (doc ? (

  <div className="EditDocument">
    <DocumentEditor doc={ doc }/>
  </div>
) : <NotFound />);

EditDocument2.propTypes = {
  doc: PropTypes.object,
};

export default container((props, onData) => {
  const documentId = props.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  if (subscription.ready()) {
    const doc = Documents.findOne(documentId);
    onData(null, { doc });
  }
}, EditDocument2);
