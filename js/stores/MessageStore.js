var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ThreadStore = require('../stores/ThreadStore');
var ActionTypes = require('../ActionTypes');

var _messages = {};

function _addMessages(rawMessages) {
  rawMessages.forEach(function (message) {
    if (!_messages[message.id]) {
      _messages[message.id] = ChatMessageUtils.convertRawMessage(
        message,
        ThreadStore.getCurrentID()
      );
    }
  });
}

function _markAllInThreadRead(threadID) {
  for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
}

var MessageStore = SubUnit.createStore({
  get: function(id) {
    return _messages[id];
  },
  getAll: function() {
    return _messages;
  },
  getAllForThread: function(threadID) {
    var threadMessages = [];
    for (var id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },
  getAllForCurrentThread: function() {
    return this.getAllForThread(ThreadStore.getCurrentID());
  },
  getCreatedMessageData: function(text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: ThreadStore.getCurrentID(),
      authorName: 'Steve', // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }
});

MessageStore.dispatchToken = ChatAppDispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    case ActionTypes.CREATE_MESSAGE:
      var message = MessageStore.getCreatedMessageData(action.text);
      _messages[message.id] = message;
      MessageStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      _addMessages(action.rawMessages);
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    default: // do nothing
  }

});

module.exports = MessageStore;
