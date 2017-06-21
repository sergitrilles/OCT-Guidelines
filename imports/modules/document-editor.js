/* eslint-disable no-undef */

import { browserHistory } from 'react-router';
import { Bert } from 'meteor/themeteorchef:bert';
import { upsertDocument } from '../api/documents/methods.js';
import './validation.js';
import { Meteor } from 'meteor/meteor';
import fm from 'front-matter';
import { parse, render, updateTitle } from './../ui/markdown';

let component;
const handleUpsert = () => {
  alert("soyyo");
  const { doc } = component.props;
  alert(aux);
  confirmation = "";
  state = parse(aux);
  text = render(state);
  alert(text);

  if (doc && doc._id){
    confirmation =  'Document updated!' ;
    upsert = {
      title: document.querySelector('[name="title"]').value.trim(),
      body: doc.body,
      published: false,
      owner: Meteor.userId(),
    };
  }
  else{
    confirmation = 'Document added!';
    auxState = updateTitle(parse(aux),document.querySelector('[name="title"]').value.trim())


    alert(render(auxState));
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
      browserHistory.push(`/documents/${response.insertedId || doc._id}`);
    }
  });
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
