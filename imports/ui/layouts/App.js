import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import AppNavigation from '../components/AppNavigation';

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import NotebookReducer from './../reducers';
import { Provider } from 'react-redux';

/*
 const store = compose(
 applyMiddleware(thunk)
 )(createStore)(NotebookReducer);
 */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(NotebookReducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(thunk)
));


const App = ({ children }) => (
  <Provider store={store}>
  <div>
    <AppNavigation />
    <Grid>
      { children }
    </Grid>
  </div>
  </Provider>
);

App.propTypes = {
  children: PropTypes.node,
};

export default App;
