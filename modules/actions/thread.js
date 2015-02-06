var dispatcher  = require('../dispatcher');
var actionTypes = require('../actionTypes');

module.exports = {
  clickThread: function(threadID) {
    dispatcher.viewAction({
      type: actionTypes.CLICK_THREAD,
      threadID: threadID
    });
  }
};
