import { dispatcher } from '../dispatcher';
import { messageStore } from '../stores/message';
import { threadStore } from '../stores/thread';
import { actionTypes } from '../actionTypes';

export var unreadStore = SubUnit.createStore({
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

unreadStore.dispatchToken = dispatcher.register(function (payload) {
  dispatcher.waitFor([
    threadStore.dispatchToken,
    messageStore.dispatchToken
  ]);

  var action = payload.action;
  switch (action.type) {

    case actionTypes.CLICK_THREAD:
      unreadStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      unreadStore.emitChange();
      break;

    default: // do nothing
  }
});