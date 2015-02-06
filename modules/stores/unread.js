var dispatcher   = require('../dispatcher');
var messageStore = require('../stores/message');
var threadStore  = require('../stores/thread');
var actionTypes  = require('../actionTypes');

var UnreadthreadStore = SubUnit.createStore({
  getCount: function() {
    var threads = threadStore.getAll();
    var unreadCount = 0;
    for (var id in threads) {
      if (!threads[id].lastMessage.isRead) {
        unreadCount++;
      }
    }
    return unreadCount;
  }
});

UnreadthreadStore.dispatchToken = dispatcher.register(function (payload) {
  dispatcher.waitFor([
    threadStore.dispatchToken,
    messageStore.dispatchToken
  ]);

  var action = payload.action;
  switch (action.type) {

    case actionTypes.CLICK_THREAD:
      UnreadthreadStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      UnreadthreadStore.emitChange();
      break;

    default: // do nothing
  }
});

module.exports = UnreadthreadStore;
