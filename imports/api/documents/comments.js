/**
 * Created by estri on 26/10/2017.
 */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

import Immutable from 'immutable';

const Comments = new Mongo.Collection('Comments');
export default Comments;

Comments.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Comments.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Comments.schema = new SimpleSchema({
  text: {
    type: String
  },
  createdAt: {
    type: Date,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  postId: {
    type: String,
    optional: true,
  }
});

Comments.attachSchema(Comments.schema);

Factory.define('document', Documents, {
  text: () => 'value',
  createdAt: () => 'CreatedId',
  userId: () =>  'userId',
  postId: () => 'postId'
});
