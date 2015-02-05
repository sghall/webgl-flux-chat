var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ActionTypes = require('../ActionTypes');

module.exports = {
  clickThread: function(threadID) {
    ChatAppDispatcher.viewAction({
      type: ActionTypes.CLICK_THREAD,
      threadID: threadID
    });
  }

};
