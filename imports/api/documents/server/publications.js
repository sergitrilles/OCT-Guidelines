import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents';

Meteor.publish('documents.list', () => Documents.find());

Meteor.publish('documents.view', (_id) => {
  check(_id, String);
  return Documents.find(_id);
});

Meteor.methods({
  getFile : function(){

    var file = Assets.getText('sampleNotebook.md');

    return file;
  }
});
/*
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
*/

Meteor.methods({
  'file-upload': function (fileInfo, fileData) {
    console.log("received file " + fileInfo.name + " data: " + fileData);
    fs.writeFile(fileInfo.name, fileData);
  }
});
