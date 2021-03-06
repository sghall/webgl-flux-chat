import { serverActions } from '../actions/serverActions';
import { dispatcher } from '../dispatcher';
import { messageStore } from '../stores/messageStore';
import { actionTypes } from '../utils';

export var messageActions = {
  createMessage: function(text) {
    dispatcher.viewAction({
      type: actionTypes.CREATE_MESSAGE,
      text: text
    });
    var message = messageStore.getCreatedMessageData(text);
    saveMessage(message);
  }
};

function saveMessage(message, threadName) {

  // simulate writing to a database
  var rawMessages = JSON.parse(localStorage.getItem('messages'));
  var timestamp = Date.now();
  var id = 'm_' + timestamp;
  var threadID = message.threadID || ('t_' + Date.now());
  var createdMessage = {
    id: id,
    threadID: threadID,
    threadName: threadName,
    authorName: message.authorName,
    text: message.text,
    timestamp: timestamp
  };
  rawMessages.push(createdMessage);
  localStorage.setItem('messages', JSON.stringify(rawMessages));

  // simulate success callback
  setTimeout(function() {
    serverActions.receiveCreatedMessage(createdMessage);
  }, 0);
}