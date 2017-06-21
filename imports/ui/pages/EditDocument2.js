/**
 * Created by estri on 11/05/2017.
 */

import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Documents from '../../api/documents/documents';
import DocumentEditor from '../components/DocumentEditor';
import NotFound from './NotFound';
import container from '../../modules/container';

import NotebookReducer from './../reducers';
import Notebook from './../Notebook';

const store = compose(
  applyMiddleware(thunk)
)(createStore)(NotebookReducer);


const EditDocument2 = ({ doc }) => (doc ? (
    <Provider store={store}>
      <div>
        <Notebook />
      </div>
    </Provider>,
      document.getElementById('kajero')
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
