import React from 'react';
import PropTypes from 'prop-types';
import {browserHistory} from 'react-router';
import {ListGroup, Well, Grid, Thumbnail, ListGroupItem, Alert } from 'react-bootstrap';
import {Meteor} from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import container from '../../modules/container';

import {userName} from '../util';


import { Row, Col, Card, CardBlock, CardGroup , CardBody, Container, CardColumns, Button, CardTitle, CardText, CardImg } from 'reactstrap';

const handleNav = _id => browserHistory.push(`/documents/${_id}`);

const DocumentsPublicList = ({documents}) => (
  documents.length > 0 ? <CardColumns>
    {documents.map(({_id, title, published, owner, featured_image}) =>
      (
      published == true ? (

            <Card key={_id} style={{
              marginBottom: '10px',
              maxWidth: '500px',
              borderColor: '#c1bdc1',
              border: 'solid 1px #c1bdc1',
              borderRadius : '5px',
            }}>

              <CardImg top width="100%" src={featured_image} alt="Card image cap" />
              <CardBlock style={{ padding: '10px' }}>
                <CardTitle>{ title } </CardTitle>
                <CardText>
                  <small className="text-muted">Created by: {userName(owner)}</small>
                </CardText>
                <Button onClick={ () => handleNav(_id) }>View guideline</Button>
              </CardBlock>
            </Card>
        ): null
    ))}
  </CardColumns>: <Alert bsStyle="warning">No documents yet.</Alert>
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
