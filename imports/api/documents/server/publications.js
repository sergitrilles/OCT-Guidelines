import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents';
import  Future  from 'fibers/future';

Meteor.publish('documents.list', () => Documents.find());

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});

Meteor.methods({
  getFile : function(){
      this.unblock();
      var future = new Future();
      var file = Assets.getText('sampleNotebook.md');
      console.log(file)
      future.return(file);
      return future.wait();
  }
});
