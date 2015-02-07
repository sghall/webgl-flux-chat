import { dispatcher } from '../dispatcher';
import { utils } from '../utils';
import { threadStore } from '../stores/thread';
import { actionTypes } from '../actionTypes';

var _messages = {};

function _addMessages(rawMessages) {
  rawMessages.forEach(function (message) {
    if (!_messages[message.id]) {
      _messages[message.id] = utils.convertRawMessage(
        message,
        threadStore.getCurrentID()
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

export var messageStore = SubUnit.createStore({
  get: function (id) {
    return _messages[id];
  },
  getAll: function () {
    return _messages;
  },
  getAllForThread: function (threadID) {
    var threadMessages = [];
    for (var id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort(function (a, b) {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },
  getAllForCurrentThread: function () {
    return this.getAllForThread(threadStore.getCurrentID());
  },
  getCreatedMessageData: function (text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: threadStore.getCurrentID(),
      authorName: 'Bill', // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }
});

messageStore.dispatchToken = dispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.type) {

    case actionTypes.CLICK_THREAD:
      dispatcher.waitFor([threadStore.dispatchToken]);
      _markAllInThreadRead(threadStore.getCurrentID());
      messageStore.emitChange();
      break;

    case actionTypes.CREATE_MESSAGE:
      var message = messageStore.getCreatedMessageData(action.text);
      _messages[message.id] = message;
      messageStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      _addMessages(action.rawMessages);
      dispatcher.waitFor([threadStore.dispatchToken]);
      _markAllInThreadRead(threadStore.getCurrentID());
      messageStore.emitChange();
      break;

    default: // do nothing
  }

});