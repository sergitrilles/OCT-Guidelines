import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import container from '../../modules/container';

const handleNav = _id => browserHistory.push(`/documents/${_id}`);

const DocumentsPublicList = ({ documents }) => (
  documents.length > 0 ? <ListGroup className="DocumentsList">
      {documents.map(({ _id, title, published }) => (
        published == true ?
        <ListGroupItem key={ _id } onClick={ () => handleNav(_id) }>
          { title }
        </ListGroupItem> : null
      ))}
    </ListGroup> :
    <Alert bsStyle="warning">No documents yet.</Alert>
);

DocumentsPublicList.propTypes = {
  documents: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find().fetch();
    onData(null, { documents });
  }
}, DocumentsPublicList);
