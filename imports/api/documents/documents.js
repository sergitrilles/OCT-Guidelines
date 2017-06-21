import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

import Immutable from 'immutable';

const Documents = new Mongo.Collection('Documents');
export default Documents;

Documents.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Documents.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Documents.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'Guideline user.',
  },
  title: {
    type: String,
    label: 'The title of the document.',
  },
  body: {
    type: Immutable,
    label: 'The body of the document.',
  },
  published: {
    type: Boolean,
    label: 'Guideline state.',
  },
});

Documents.attachSchema(Documents.schema);

Factory.define('document', Documents, {
  owner: () => 'id',
  title: () => 'Factory Title',
  body: () =>  'Factory Body',
  published: () => false,
});
