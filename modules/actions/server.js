import { dispatcher } from '../dispatcher';
import { actionTypes } from '../actionTypes';

export var serverActions = {
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
