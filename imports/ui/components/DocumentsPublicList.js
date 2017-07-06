import React from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {ListGroup, Well, Col, Row, Grid, Thumbnail, ListGroupItem, Alert, Button} from 'react-bootstrap';
import {Meteor} from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import container from '../../modules/container';

const handleNav = _id => browserHistory.push(`/documents/${_id}`);


const DocumentsPublicList = ({documents}) => (
  documents.length > 0 ? <Grid><Row>
    {documents.map(({_id, title, published, owner, featured_image}) => (
      published == true ? (
        <Col xs={3} md={4}>
          <Thumbnail src={featured_image} alt="121x100">
            <h4>{ title }</h4>
            <p><Button bsStyle="primary" onClick={ () => handleNav(_id) }>View</Button>&nbsp; </p>
          </Thumbnail>
        </Col> ): null
    ))}
  </Row></Grid> : <Alert bsStyle="warning">No documents yet.</Alert>
);


DocumentsPublicList.propTypes = {
  documents: PropTypes.array,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('documents.list');
  if (subscription.ready()) {
    const documents = Documents.find().fetch();
    onData(null, {documents});
  }
}, DocumentsPublicList);
