var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ActionTypes = require('../ActionTypes');

module.exports = {

  receiveAll: function(rawMessages) {
    ChatAppDispatcher.serverAction({
      type: ActionTypes.RECEIVE_RAW_MESSAGES,
      rawMessages: rawMessages
    });
  },

  receiveCreatedMessage: function(createdMessage) {
    ChatAppDispatcher.serverAction({
      type: ActionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      rawMessage: createdMessage
    });
  }

};
