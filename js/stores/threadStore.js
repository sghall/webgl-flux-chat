import { dispatcher } from '../dispatcher';
import { convertRawMessage, actionTypes } from '../utils';

var _currentID = null;
var _threads = {};

export var threadStore = SubUnit.createStore({
  init: function(rawMessages) {
    rawMessages.forEach(function (message) {
      var threadID = message.threadID;
      var thread = _threads[threadID];
      if (thread && thread.lastTimestamp > message.timestamp) {
        return;
      }
      _threads[threadID] = {
        id: threadID,
        name: message.threadName,
        lastMessage: convertRawMessage(message, _currentID)
      };
    }, this);

    if (!_currentID) {
      var allChrono = this.getAllChrono();
      _currentID = allChrono[allChrono.length - 1].id;
    }

    _threads[_currentID].lastMessage.isRead = true;
  },
  get: function(id) {
    return _threads[id];
  },
  getAll: function() {
    return _threads;
  },
  getAllChrono: function() {
    var orderedThreads = [];
    for (var id in _threads) {
      var thread = _threads[id];
      orderedThreads.push(thread);
    }
    orderedThreads.sort(function(a, b) {
      if (a.lastMessage.date < b.lastMessage.date) {
        return -1;
      } else if (a.lastMessage.date > b.lastMessage.date) {
        return 1;
      }
      return 0;
    });
    return orderedThreads;
  },
  getCurrentID: function() {
    return _currentID;
  },
  getCurrent: function() {
    return this.get(this.getCurrentID());
  }
});

threadStore.dispatchToken = dispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.type) {

    case actionTypes.CLICK_THREAD:
      _currentID = action.threadID;
      _threads[_currentID].lastMessage.isRead = true;
      threadStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      threadStore.init(action.rawMessages);
      threadStore.emitChange();
      break;

    default: // do nothing
  }
});
