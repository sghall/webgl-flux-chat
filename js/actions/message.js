var ChatServerActionCreators = require('../actions/server');
var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var MessageStore = require('../stores/message');

var ActionTypes = require('../ActionTypes');

module.exports = {
  createMessage: function(text) {
    ChatAppDispatcher.viewAction({
      type: ActionTypes.CREATE_MESSAGE,
      text: text
    });
    var message = MessageStore.getCreatedMessageData(text);
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
    ChatServerActionCreators.receiveCreatedMessage(createdMessage);
  }, 0);
}