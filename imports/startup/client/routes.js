import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {Meteor} from 'meteor/meteor';
import App from '../../ui/layouts/App.js';
import Documents from '../../ui/pages/Documents.js';
import NewDocument from '../../ui/pages/NewDocument.js';
import EditDocument from '../../ui/pages/EditDocument.js';
import EditDocument2 from '../../ui/pages/EditDocument2.js';
import ViewDocument from '../../ui/pages/ViewDocument.js';
import Index from '../../ui/pages/Index.js';
import Login from '../../ui/pages/Login.js';
import NotFound from '../../ui/pages/NotFound.js';
import RecoverPassword from '../../ui/pages/RecoverPassword.js';
import ResetPassword from '../../ui/pages/ResetPassword.js';
import Signup from '../../ui/pages/Signup.js';

import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import NotebookReducer from '../../ui/reducers';

import Templates from './../../api/documents/templates';


const authenticate = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname},
    });
  }
};


Meteor.startup(() => {
  aux = "";
  stateGlobal = "";
  importer = false;
  templates = [];
  jsonTemplates = {};
  Meteor.subscribe('usersData');

  /*  Meteor.call('getFile', function(error, file){
   if(error){
   alert('Errorsss');
   }
   else{
   aux = file;
   }
   });
   */
  Meteor.call('getFileTemplates', function (error, file) {
    if (error) {
      alert('Error GetFileTemplate');
    }
    else {
      jsonTemplates = JSON.parse(file);

      for (let i = 0; i < jsonTemplates.templates.length; i++) {
        Meteor.call('getFile', jsonTemplates.templates[i].file, function (error, file) {
          if (error) {
            alert('Error GetFILE');
          }
          else {
            templates[i] = file;
          }
        });
      }
    }
  });


  render(
    <Router history={ browserHistory }>
      <Route path="/" component={ App }>
        <IndexRoute name="index" component={ Index }/>
        <Route name="documents" path="/documents" component={ Documents }/>
        <Route name="newDocument" path="/documents/new" component={ NewDocument } onEnter={ authenticate }/>
        <Route name="editDocument" path="/documents/:_id/edit" component={ EditDocument } onEnter={ authenticate }/>
        <Route name="viewDocument" path="/documents/:_id" component={ EditDocument2 }/>
        <Route name="login" path="/login" component={ Login }/>
        <Route name="recover-password" path="/recover-password" component={ RecoverPassword }/>
        <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword }/>
        <Route name="signup" path="/signup" component={ Signup }/>
        <Route path="*" component={ NotFound }/>
      </Route>
    </Router>,

    document.getElementById('react-root'),
  );
});

