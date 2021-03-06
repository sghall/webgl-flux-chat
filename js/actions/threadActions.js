import { dispatcher } from '../dispatcher';
import { actionTypes } from '../utils';

export var threadActions = {
  clickThread: function(threadID) {
    dispatcher.viewAction({
      type: actionTypes.CLICK_THREAD,
      threadID: threadID
    });
  }
};
