/* eslint-disable no-undef */

import {browserHistory} from 'react-router';
import {Bert} from 'meteor/themeteorchef:bert';
import {upsertDocument} from '../api/documents/methods.js';
import './validation.js';
import {Meteor} from 'meteor/meteor';
import fm from 'front-matter';
import {parse, render, updateTitle} from './../ui/markdown';
import {getStateGuideline, loadMarkdownFromDB, loadMarkdown, fetchData, editBlock} from './../ui/actions';


let component;


const handleUpsert = () => {
  const {doc} = component.props;
  //const { notebook } = component.props.notebook;
  confirmation = "";
  url = "";

  if (doc && doc._id) {
    var bodyContent;
    auxState = render(stateGlobal);
    const metadata = stateGlobal.get('metadata');
    const title = metadata.get('title');
    featured_image = metadata.get('featured_image');
    if (featured_image == "") {
      featured_image = "http://geo-c.eu/assets/img/geoSlide.jpg";
    }
    confirmation = 'Document updated!';
    upsert = {
      title: title,
      body: auxState,
      published: doc.published,
      owner: doc.owner,
      featured_image: featured_image,
    };
  }
  else {
    url = "edit";
    confirmation = 'Document added!';
    let stateLocal;
    let titleLocal = "";
    let imageLocal = "";

    const user = Meteor.user();
    const name = user && user.profile ? user.profile.name : '';
    nameSurname = name.first + " " + name.last;
    stateLocal = stateGlobal;
    alert(stateGlobal);
    if (importer) {
      importer = false;
      const metadata = stateLocal.get('metadata');
      titleLocal = metadata.get('title');
      imageLocal = metadata.get('featured_image');

    }
    else {
      titleLocal = document.querySelector('[name="title"]').value.trim();
      const metadata = stateLocal.get('metadata');
      imageLocal = metadata.get('featured_image');

    }
    alert(stateLocal);
    auxState = updateTitle(stateLocal, titleLocal, nameSurname);
    //alert(render(notebook));
    upsert = {
      title: titleLocal,
      body: render(auxState),
      published: false,
      owner: Meteor.userId(),
      featured_image: imageLocal,
    };
  }

  if (doc && doc._id) upsert._id = doc._id;

  upsertDocument.call(upsert, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      component.documentEditorForm.reset();
      Bert.alert(confirmation, 'success');
      browserHistory.push(`/documents/${response.insertedId || doc._id}/` + url);
    }
  });
  //loadMarkdownFromDB(parse(doc.body));
};

const validate = () => {
  $(component.documentEditorForm).validate({
    rules: {
      title: {
        required: false,
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
    submitHandler() {
      handleUpsert();
    },
  });
};

export default function documentEditor(options) {
  component = options.component;
  if (component.documentEditorForm != null) {
    validate();
  }
}
