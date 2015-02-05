var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatWebAPIUtils = require('../utils/ChatWebAPIUtils');
var MessageStore = require('../stores/MessageStore');

var ActionTypes = require('../ActionTypes');

module.exports = {
  createMessage: function(text) {
    ChatAppDispatcher.viewAction({
      type: ActionTypes.CREATE_MESSAGE,
      text: text
    });
    var message = MessageStore.getCreatedMessageData(text);
    ChatWebAPIUtils.createMessage(message);
  }

};
