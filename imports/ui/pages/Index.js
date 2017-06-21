import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import DocumentsPublicList from '../components/DocumentsPublicList';

const Index = () => (
    <div className="Documents">
    <Row>
    <Col xs={ 12 }>
      <DocumentsPublicList />
    </Col>
    </Row>
    </div>
);

export default Index;
