import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';
import Immutable from 'immutable';

export const upsertDocument = new ValidatedMethod({
  name: 'documents.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    owner: { type: String, optional: true },
    title: { type: String, optional: true },
    body: { type: String, optional: false },
    published: { type: Boolean, optional: true },
  }).validator(),
  run(document) {
    return Documents.upsert({ _id: document._id }, { $set: document });
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'documents.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Documents.remove(_id);
  },
});

export const publishDocument = new ValidatedMethod({
  name: 'documents.published',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
  }).validator(),
  run({_id}) {
    const documentToUpdate = Documents.findOne(_id);
    documentToUpdate.published = true;
    return Documents.upsert({ _id: documentToUpdate._id }, { $set: documentToUpdate });
  },
});

export const unpublishDocument = new ValidatedMethod({
  name: 'documents.unpublished',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run(document) {
    return Documents.upsert({ _id: document._id }, { $set: {published: false }});
  },
});



rateLimit({
  methods: [
    upsertDocument,
    removeDocument,
    publishDocument,
    unpublishDocument,
  ],
  limit: 5,
  timeRange: 1000,
});