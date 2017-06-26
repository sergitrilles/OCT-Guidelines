import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { ListGroup, ListGroupItem, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import container from '../../modules/container';

import { parse } from './../markdown';


const handleNav = _id => browserHistory.push(`/documents/${_id}`);

const DocumentsList = ({ documents }) => (

  documents.length > 0 ? <ListGroup className="DocumentsList">
      {documents.map(({ _id, title, owner, body }) => (

        Meteor.userId() == owner ?

        <ListGroupItem key={ _id } onClick={ () => handleNav(_id) }>
          <b>{title}</b> - last update: {parse(body).get('metadata').get('created').toString()}
        </ListGroupItem>:
          null
      ))}
    </ListGroup> :
    <Alert bsStyle="warning">No documents yet.</Alert>
);

DocumentsList.propTypes = {
  documents: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find().fetch();
    onData(null, { documents });
  }
}, DocumentsList);
