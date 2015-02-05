var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var MessageStore = require('../stores/message');
var ThreadStore = require('../stores/thread');

var ActionTypes = require('../ActionTypes');

var UnreadThreadStore = SubUnit.createStore({
  getCount: function() {
    var threads = ThreadStore.getAll();
    var unreadCount = 0;
    for (var id in threads) {
      if (!threads[id].lastMessage.isRead) {
        unreadCount++;
      }
    }
    return unreadCount;
  }
});

UnreadThreadStore.dispatchToken = ChatAppDispatcher.register(function (payload) {
  ChatAppDispatcher.waitFor([
    ThreadStore.dispatchToken,
    MessageStore.dispatchToken
  ]);

  var action = payload.action;
  switch (action.type) {

    case ActionTypes.CLICK_THREAD:
      UnreadThreadStore.emitChange();
      break;

    case ActionTypes.RECEIVE_RAW_MESSAGES:
      UnreadThreadStore.emitChange();
      break;

    default: // do nothing
  }
});

module.exports = UnreadThreadStore;
