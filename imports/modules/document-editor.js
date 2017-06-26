/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertDocument } from '../api/documents/methods.js';
import './validation.js';
import { Meteor } from 'meteor/meteor';
import fm from 'front-matter';
import { parse, render, updateTitle } from './../ui/markdown';
import { getStateGuideline, loadMarkdownFromDB, loadMarkdown, fetchData, editBlock } from './../ui/actions';


let component;


const handleUpsert = () => {
  const { doc } = component.props;
  //const { notebook } = component.props.notebook;
  confirmation = "";
  url = "";

  if (doc && doc._id){
    var bodyContent;
    auxState = render(stateGlobal);
    const metadata = stateGlobal.get('metadata');
    const title = metadata.get('title');

    confirmation =  'Document updated!' ;
    upsert = {
      title: title,
      body: auxState,
      published: doc.published,
      owner: doc.owner,
    };
  }
  else{
    url = "edit";
    confirmation = 'Document added!';

    const user = Meteor.user();
    const name = user && user.profile ? user.profile.name : '';
    nameSurname = name.first + " " + name.last;

    auxState = updateTitle(parse(aux),document.querySelector('[name="title"]').value.trim(), nameSurname);
    //alert(render(notebook));
    upsert = {
      title: document.querySelector('[name="title"]').value.trim(),
      body: render(auxState),
      published: false,
      owner: Meteor.userId(),
    };
  }

  if (doc && doc._id) upsert._id = doc._id;

  upsertDocument.call(upsert, (error, response) => {
    if (error) {
      alert(error);
      Bert.alert(error.reason, 'danger');
    } else {
      component.documentEditorForm.reset();
      Bert.alert(confirmation, 'success');
      browserHistory.push(`/documents/${response.insertedId || doc._id}/`+url);
    }
  });
  //loadMarkdownFromDB(parse(doc.body));
};

const validate = () => {
  $(component.documentEditorForm).validate({
    rules: {
      title: {
        required: true,
      },
      body: {
        required: false,
      },
    },
    messages: {
      title: {
        required: 'Need a title in here, Seuss.',
      },
      body: {
        required: 'This thneeds a body, please.',
      },
    },
    submitHandler() { handleUpsert(); },
  });
};

export default function documentEditor(options) {
  component = options.component;
  validate();
}
