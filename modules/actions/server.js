var dispatcher  = require('../dispatcher');
var actionTypes = require('../actionTypes');

module.exports = {
  receiveAll: function(rawMessages) {
    dispatcher.serverAction({
      type: actionTypes.RECEIVE_RAW_MESSAGES,
      rawMessages: rawMessages
    });
  },

  receiveCreatedMessage: function(createdMessage) {
    dispatcher.serverAction({
      type: actionTypes.RECEIVE_RAW_CREATED_MESSAGE,
      rawMessage: createdMessage
    });
  }
};
