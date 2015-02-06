(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js":[function(require,module,exports){
module.exports = {
  CLICK_THREAD: 'CLICK_THREAD',
  CREATE_MESSAGE: 'CREATE_MESSAGE',
  RECEIVE_RAW_CREATED_MESSAGE: 'RECEIVE_RAW_CREATED_MESSAGE',
  RECEIVE_RAW_MESSAGES: 'RECEIVE_RAW_MESSAGES'
};
},{}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/message.js":[function(require,module,exports){
var serverActions = require('../actions/server');
var dispatcher    = require('../dispatcher');
var messageStore  = require('../stores/message');
var actionTypes   = require('../actionTypes');

module.exports = {
  createMessage: function(text) {
    dispatcher.viewAction({
      type: actionTypes.CREATE_MESSAGE,
      text: text
    });
    var message = messageStore.getCreatedMessageData(text);
    saveMessage(message);
  }
};

function saveMessage(message, threadName) {
  // simulate writing to a database
  var rawMessages = JSON.parse(localStorage.getItem('messages'));
  var timestamp = Date.now();
  var id = 'm_' + timestamp;
  var threadID = message.threadID || ('t_' + Date.now());
  var createdMessage = {
    id: id,
    threadID: threadID,
    threadName: threadName,
    authorName: message.authorName,
    text: message.text,
    timestamp: timestamp
  };
  rawMessages.push(createdMessage);
  localStorage.setItem('messages', JSON.stringify(rawMessages));

  // simulate success callback
  setTimeout(function() {
    serverActions.receiveCreatedMessage(createdMessage);
  }, 0);
}
},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../actions/server":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/server.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js","../stores/message":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/message.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/server.js":[function(require,module,exports){
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

},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/thread.js":[function(require,module,exports){
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

},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ChatApp.react.js":[function(require,module,exports){
var MessageSection = require('./MessageSection.react');
var ThreadSection = require('./ThreadSection.react');

var ChatApp = React.createClass({displayName: "ChatApp",
  render: function() {
    return (
      React.createElement("div", {className: "chatapp"}, 
        React.createElement(ThreadSection, null), 
        React.createElement(MessageSection, null)
      )
    );
  }

});

module.exports = ChatApp;

},{"./MessageSection.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageSection.react.js","./ThreadSection.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ThreadSection.react.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageComposer.react.js":[function(require,module,exports){
var ChatMessageActionCreators = require('../actions/message');
var ENTER_KEY_CODE = 13;

var MessageComposer = React.createClass({displayName: "MessageComposer",

  getInitialState: function() {
    return {text: ''};
  },

  render: function() {
    return (
      React.createElement("textarea", {
        className: "message-composer", 
        name: "message", 
        value: this.state.text, 
        onChange: this._onChange, 
        onKeyDown: this._onKeyDown}
      )
    );
  },

  _onChange: function(event, value) {
    this.setState({text: event.target.value});
  },

  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        ChatMessageActionCreators.createMessage(text);
      }
      this.setState({text: ''});
    }
  }

});

module.exports = MessageComposer;

},{"../actions/message":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/message.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageListItem.react.js":[function(require,module,exports){
var ReactPropTypes = React.PropTypes;
var MessageListItem = React.createClass({displayName: "MessageListItem",

  propTypes: {
    message: ReactPropTypes.object
  },

  render: function() {
    var message = this.props.message;
    return (
      React.createElement("li", {className: "message-list-item"}, 
        React.createElement("h5", {className: "message-author-name"}, message.authorName), 
        React.createElement("div", {className: "message-time"}, 
          message.date.toLocaleTimeString()
        ), 
        React.createElement("div", {className: "message-text"}, message.text)
      )
    );
  }

});

module.exports = MessageListItem;

},{}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageSection.react.js":[function(require,module,exports){
var MessageComposer = require('./MessageComposer.react');
var MessageListItem = require('./MessageListItem.react');
var MessageStore = require('../stores/message');
var ThreadStore = require('../stores/thread');

function getStateFromStores() {
  return {
    messages: MessageStore.getAllForCurrentThread(),
    thread: ThreadStore.getCurrent()
  };
}

function getMessageListItem(message) {
  return (
    React.createElement(MessageListItem, {
      key: message.id, 
      message: message}
    )
  );
}

var MessageSection = React.createClass({displayName: "MessageSection",

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this._scrollToBottom();
    MessageStore.addChangeListener(this._onChange);
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
    ThreadStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var messageListItems = this.state.messages.map(getMessageListItem);
    return (
      React.createElement("div", {className: "message-section"}, 
        React.createElement("h3", {className: "message-thread-heading"}, this.state.thread.name), 
        React.createElement("ul", {className: "message-list", ref: "messageList"}, 
          messageListItems
        ), 
        React.createElement(MessageComposer, null)
      )
    );
  },

  componentDidUpdate: function() {
    this._scrollToBottom();
  },

  _scrollToBottom: function() {
    var ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  },

  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = MessageSection;

},{"../stores/message":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/message.js","../stores/thread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/thread.js","./MessageComposer.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageComposer.react.js","./MessageListItem.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/MessageListItem.react.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ThreadListItem.react.js":[function(require,module,exports){
var ChatThreadActionCreators = require('../actions/thread');
var ReactPropTypes = React.PropTypes;

var ThreadListItem = React.createClass({displayName: "ThreadListItem",

  propTypes: {
    thread: ReactPropTypes.object,
    currentThreadID: ReactPropTypes.string
  },

  render: function() {
    var thread = this.props.thread;
    var lastMessage = thread.lastMessage;
    return (
      React.createElement("li", {
        className: cx({
          'thread-list-item': true,
          'active': thread.id === this.props.currentThreadID
        }), 
        onClick: this._onClick}, 
        React.createElement("h5", {className: "thread-name"}, thread.name), 
        React.createElement("div", {className: "thread-time"}, 
          lastMessage.date.toLocaleTimeString()
        ), 
        React.createElement("div", {className: "thread-last-message"}, 
          lastMessage.text
        )
      )
    );
  },

  _onClick: function() {
    ChatThreadActionCreators.clickThread(this.props.thread.id);
  }

});

function cx(classNames) {
  if (typeof classNames == 'object') {
    return Object.keys(classNames).filter(function(className) {
      return classNames[className];
    }).join(' ');
  } else {
    return Array.prototype.join.call(arguments, ' ');
  }
}

module.exports = ThreadListItem;

},{"../actions/thread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/thread.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ThreadSection.react.js":[function(require,module,exports){
var MessageStore = require('../stores/message');
var ThreadListItem = require('../components/ThreadListItem.react');
var ThreadStore = require('../stores/thread');
var UnreadThreadStore = require('../stores/unread');

function getStateFromStores() {
  return {
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID(),
    unreadCount: UnreadThreadStore.getCount()
  };
}

var ThreadSection = React.createClass({displayName: "ThreadSection",

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    ThreadStore.addChangeListener(this._onChange);
    UnreadThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ThreadStore.removeChangeListener(this._onChange);
    UnreadThreadStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var threadListItems = this.state.threads.map(function(thread) {
      return (
        React.createElement(ThreadListItem, {
          key: thread.id, 
          thread: thread, 
          currentThreadID: this.state.currentThreadID}
        )
      );
    }, this);
    var unread =
      this.state.unreadCount === 0 ?
      null :
      React.createElement("span", null, "Unread threads: ", this.state.unreadCount);
    return (
      React.createElement("div", {className: "thread-section"}, 
        React.createElement("div", {className: "thread-count"}, 
          unread
        ), 
        React.createElement("ul", {className: "thread-list"}, 
          threadListItems
          )
      )
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = ThreadSection;

},{"../components/ThreadListItem.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ThreadListItem.react.js","../stores/message":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/message.js","../stores/thread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/thread.js","../stores/unread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/unread.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js":[function(require,module,exports){
var ChatAppDispatcher = SubUnit.createDispatcher();
module.exports = ChatAppDispatcher;

},{}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/exampleData.js":[function(require,module,exports){
module.exports = {
  init: function() {
    localStorage.clear();
    localStorage.setItem('messages', JSON.stringify([
      {
        id: 'm_1',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Bill',
        text: 'Hey Jing, want to give a Flux talk at ForwardJS?',
        timestamp: Date.now() - 99999
      },
      {
        id: 'm_2',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Bill',
        text: 'Seems like a pretty cool conference.',
        timestamp: Date.now() - 89999
      },
      {
        id: 'm_3',
        threadID: 't_1',
        threadName: 'Jing and Bill',
        authorName: 'Jing',
        text: 'Sounds good.  Will they be serving dessert?',
        timestamp: Date.now() - 79999
      },
      {
        id: 'm_4',
        threadID: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Bill',
        text: 'Hey Dave, want to get a beer after the conference?',
        timestamp: Date.now() - 69999
      },
      {
        id: 'm_5',
        threadID: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Dave',
        text: 'Totally!  Meet you at the hotel bar.',
        timestamp: Date.now() - 59999
      },
      {
        id: 'm_6',
        threadID: 't_3',
        threadName: 'Functional Heads',
        authorName: 'Bill',
        text: 'Hey Brian, are you going to be talking about functional stuff?',
        timestamp: Date.now() - 49999
      },
      {
        id: 'm_7',
        threadID: 't_3',
        threadName: 'Bill and Brian',
        authorName: 'Brian',
        text: 'At ForwardJS?  Yeah, of course.  See you there!',
        timestamp: Date.now() - 39999
      }
    ]));
  }
};

},{}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/message.js":[function(require,module,exports){
var dispatcher  = require('../dispatcher');
var utils       = require('../utils');
var threadStore = require('../stores/thread');
var actionTypes = require('../actionTypes');

var _messages = {};

function _addMessages(rawMessages) {
  rawMessages.forEach(function (message) {
    if (!_messages[message.id]) {
      _messages[message.id] = utils.convertRawMessage(
        message,
        threadStore.getCurrentID()
      );
    }
  });
}

function _markAllInThreadRead(threadID) {
  for (var id in _messages) {
    if (_messages[id].threadID === threadID) {
      _messages[id].isRead = true;
    }
  }
}

var MessageStore = SubUnit.createStore({
  get: function(id) {
    return _messages[id];
  },
  getAll: function() {
    return _messages;
  },
  getAllForThread: function(threadID) {
    var threadMessages = [];
    for (var id in _messages) {
      if (_messages[id].threadID === threadID) {
        threadMessages.push(_messages[id]);
      }
    }
    threadMessages.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return threadMessages;
  },
  getAllForCurrentThread: function() {
    return this.getAllForThread(threadStore.getCurrentID());
  },
  getCreatedMessageData: function(text) {
    var timestamp = Date.now();
    return {
      id: 'm_' + timestamp,
      threadID: threadStore.getCurrentID(),
      authorName: 'Steve', // hard coded for the example
      date: new Date(timestamp),
      text: text,
      isRead: true
    };
  }
});

MessageStore.dispatchToken = dispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.type) {

    case actionTypes.CLICK_THREAD:
      dispatcher.waitFor([threadStore.dispatchToken]);
      _markAllInThreadRead(threadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    case actionTypes.CREATE_MESSAGE:
      var message = MessageStore.getCreatedMessageData(action.text);
      _messages[message.id] = message;
      MessageStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      _addMessages(action.rawMessages);
      dispatcher.waitFor([threadStore.dispatchToken]);
      _markAllInThreadRead(threadStore.getCurrentID());
      MessageStore.emitChange();
      break;

    default: // do nothing
  }

});

module.exports = MessageStore;

},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js","../stores/thread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/thread.js","../utils":"/Users/shall/git-repos/public/webgl-flux-chat/modules/utils.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/thread.js":[function(require,module,exports){
var dispatcher  = require('../dispatcher');
var utils       = require('../utils');
var actionTypes = require('../actionTypes');

var _currentID = null;
var _threads = {};

var ThreadStore = SubUnit.createStore({
  init: function(rawMessages) {
    rawMessages.forEach(function (message) {
      var threadID = message.threadID;
      var thread = _threads[threadID];
      if (thread && thread.lastTimestamp > message.timestamp) {
        return;
      }
      _threads[threadID] = {
        id: threadID,
        name: message.threadName,
        lastMessage: utils.convertRawMessage(message, _currentID)
      };
    }, this);

    if (!_currentID) {
      var allChrono = this.getAllChrono();
      _currentID = allChrono[allChrono.length - 1].id;
    }

    _threads[_currentID].lastMessage.isRead = true;
  },
  get: function(id) {
    return _threads[id];
  },
  getAll: function() {
    return _threads;
  },
  getAllChrono: function() {
    var orderedThreads = [];
    for (var id in _threads) {
      var thread = _threads[id];
      orderedThreads.push(thread);
    }
    orderedThreads.sort(function(a, b) {
      if (a.lastMessage.date < b.lastMessage.date) {
        return -1;
      } else if (a.lastMessage.date > b.lastMessage.date) {
        return 1;
      }
      return 0;
    });
    return orderedThreads;
  },
  getCurrentID: function() {
    return _currentID;
  },
  getCurrent: function() {
    return this.get(this.getCurrentID());
  }
});

ThreadStore.dispatchToken = dispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.type) {

    case actionTypes.CLICK_THREAD:
      _currentID = action.threadID;
      _threads[_currentID].lastMessage.isRead = true;
      ThreadStore.emitChange();
      break;

    case actionTypes.RECEIVE_RAW_MESSAGES:
      ThreadStore.init(action.rawMessages);
      ThreadStore.emitChange();
      break;

    default: // do nothing
  }

});

module.exports = ThreadStore;

},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js","../utils":"/Users/shall/git-repos/public/webgl-flux-chat/modules/utils.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/unread.js":[function(require,module,exports){
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

},{"../actionTypes":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actionTypes.js","../dispatcher":"/Users/shall/git-repos/public/webgl-flux-chat/modules/dispatcher.js","../stores/message":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/message.js","../stores/thread":"/Users/shall/git-repos/public/webgl-flux-chat/modules/stores/thread.js"}],"/Users/shall/git-repos/public/webgl-flux-chat/modules/utils.js":[function(require,module,exports){
module.exports = {
  convertRawMessage: function(rawMessage, currentThreadID) {
    return {
      id: rawMessage.id,
      threadID: rawMessage.threadID,
      authorName: rawMessage.authorName,
      date: new Date(rawMessage.timestamp),
      text: rawMessage.text,
      isRead: rawMessage.threadID === currentThreadID
    };
  }

};

},{}],"/Users/shall/git-repos/public/webgl-flux-chat":[function(require,module,exports){
var ChatApp = require('./modules/components/ChatApp.react');
var ChatExampleData = require('./modules/exampleData');
var ChatServerActionCreators = require('./modules/actions/server');

ChatExampleData.init(); // load example data into localstorage

var rawMessages = JSON.parse(localStorage.getItem('messages'));
ChatServerActionCreators.receiveAll(rawMessages);

React.render(
    React.createElement(ChatApp, null),
    document.getElementById('react')
);

},{"./modules/actions/server":"/Users/shall/git-repos/public/webgl-flux-chat/modules/actions/server.js","./modules/components/ChatApp.react":"/Users/shall/git-repos/public/webgl-flux-chat/modules/components/ChatApp.react.js","./modules/exampleData":"/Users/shall/git-repos/public/webgl-flux-chat/modules/exampleData.js"}]},{},["/Users/shall/git-repos/public/webgl-flux-chat"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwibW9kdWxlcy9hY3Rpb25UeXBlcy5qcyIsIm1vZHVsZXMvYWN0aW9ucy9tZXNzYWdlLmpzIiwibW9kdWxlcy9hY3Rpb25zL3NlcnZlci5qcyIsIm1vZHVsZXMvYWN0aW9ucy90aHJlYWQuanMiLCJtb2R1bGVzL2NvbXBvbmVudHMvQ2hhdEFwcC5yZWFjdC5qcyIsIm1vZHVsZXMvY29tcG9uZW50cy9NZXNzYWdlQ29tcG9zZXIucmVhY3QuanMiLCJtb2R1bGVzL2NvbXBvbmVudHMvTWVzc2FnZUxpc3RJdGVtLnJlYWN0LmpzIiwibW9kdWxlcy9jb21wb25lbnRzL01lc3NhZ2VTZWN0aW9uLnJlYWN0LmpzIiwibW9kdWxlcy9jb21wb25lbnRzL1RocmVhZExpc3RJdGVtLnJlYWN0LmpzIiwibW9kdWxlcy9jb21wb25lbnRzL1RocmVhZFNlY3Rpb24ucmVhY3QuanMiLCJtb2R1bGVzL2Rpc3BhdGNoZXIuanMiLCJtb2R1bGVzL2V4YW1wbGVEYXRhLmpzIiwibW9kdWxlcy9zdG9yZXMvbWVzc2FnZS5qcyIsIm1vZHVsZXMvc3RvcmVzL3RocmVhZC5qcyIsIm1vZHVsZXMvc3RvcmVzL3VucmVhZC5qcyIsIm1vZHVsZXMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ0xJQ0tfVEhSRUFEOiAnQ0xJQ0tfVEhSRUFEJyxcbiAgQ1JFQVRFX01FU1NBR0U6ICdDUkVBVEVfTUVTU0FHRScsXG4gIFJFQ0VJVkVfUkFXX0NSRUFURURfTUVTU0FHRTogJ1JFQ0VJVkVfUkFXX0NSRUFURURfTUVTU0FHRScsXG4gIFJFQ0VJVkVfUkFXX01FU1NBR0VTOiAnUkVDRUlWRV9SQVdfTUVTU0FHRVMnXG59OyIsInZhciBzZXJ2ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9zZXJ2ZXInKTtcbnZhciBkaXNwYXRjaGVyICAgID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlcicpO1xudmFyIG1lc3NhZ2VTdG9yZSAgPSByZXF1aXJlKCcuLi9zdG9yZXMvbWVzc2FnZScpO1xudmFyIGFjdGlvblR5cGVzICAgPSByZXF1aXJlKCcuLi9hY3Rpb25UeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTWVzc2FnZTogZnVuY3Rpb24odGV4dCkge1xuICAgIGRpc3BhdGNoZXIudmlld0FjdGlvbih7XG4gICAgICB0eXBlOiBhY3Rpb25UeXBlcy5DUkVBVEVfTUVTU0FHRSxcbiAgICAgIHRleHQ6IHRleHRcbiAgICB9KTtcbiAgICB2YXIgbWVzc2FnZSA9IG1lc3NhZ2VTdG9yZS5nZXRDcmVhdGVkTWVzc2FnZURhdGEodGV4dCk7XG4gICAgc2F2ZU1lc3NhZ2UobWVzc2FnZSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNhdmVNZXNzYWdlKG1lc3NhZ2UsIHRocmVhZE5hbWUpIHtcbiAgLy8gc2ltdWxhdGUgd3JpdGluZyB0byBhIGRhdGFiYXNlXG4gIHZhciByYXdNZXNzYWdlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ21lc3NhZ2VzJykpO1xuICB2YXIgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgdmFyIGlkID0gJ21fJyArIHRpbWVzdGFtcDtcbiAgdmFyIHRocmVhZElEID0gbWVzc2FnZS50aHJlYWRJRCB8fCAoJ3RfJyArIERhdGUubm93KCkpO1xuICB2YXIgY3JlYXRlZE1lc3NhZ2UgPSB7XG4gICAgaWQ6IGlkLFxuICAgIHRocmVhZElEOiB0aHJlYWRJRCxcbiAgICB0aHJlYWROYW1lOiB0aHJlYWROYW1lLFxuICAgIGF1dGhvck5hbWU6IG1lc3NhZ2UuYXV0aG9yTmFtZSxcbiAgICB0ZXh0OiBtZXNzYWdlLnRleHQsXG4gICAgdGltZXN0YW1wOiB0aW1lc3RhbXBcbiAgfTtcbiAgcmF3TWVzc2FnZXMucHVzaChjcmVhdGVkTWVzc2FnZSk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtZXNzYWdlcycsIEpTT04uc3RyaW5naWZ5KHJhd01lc3NhZ2VzKSk7XG5cbiAgLy8gc2ltdWxhdGUgc3VjY2VzcyBjYWxsYmFja1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgIHNlcnZlckFjdGlvbnMucmVjZWl2ZUNyZWF0ZWRNZXNzYWdlKGNyZWF0ZWRNZXNzYWdlKTtcbiAgfSwgMCk7XG59IiwidmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlcicpO1xudmFyIGFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vYWN0aW9uVHlwZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlY2VpdmVBbGw6IGZ1bmN0aW9uKHJhd01lc3NhZ2VzKSB7XG4gICAgZGlzcGF0Y2hlci5zZXJ2ZXJBY3Rpb24oe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVDRUlWRV9SQVdfTUVTU0FHRVMsXG4gICAgICByYXdNZXNzYWdlczogcmF3TWVzc2FnZXNcbiAgICB9KTtcbiAgfSxcblxuICByZWNlaXZlQ3JlYXRlZE1lc3NhZ2U6IGZ1bmN0aW9uKGNyZWF0ZWRNZXNzYWdlKSB7XG4gICAgZGlzcGF0Y2hlci5zZXJ2ZXJBY3Rpb24oe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuUkVDRUlWRV9SQVdfQ1JFQVRFRF9NRVNTQUdFLFxuICAgICAgcmF3TWVzc2FnZTogY3JlYXRlZE1lc3NhZ2VcbiAgICB9KTtcbiAgfVxufTtcbiIsInZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXInKTtcbnZhciBhY3Rpb25UeXBlcyA9IHJlcXVpcmUoJy4uL2FjdGlvblR5cGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjbGlja1RocmVhZDogZnVuY3Rpb24odGhyZWFkSUQpIHtcbiAgICBkaXNwYXRjaGVyLnZpZXdBY3Rpb24oe1xuICAgICAgdHlwZTogYWN0aW9uVHlwZXMuQ0xJQ0tfVEhSRUFELFxuICAgICAgdGhyZWFkSUQ6IHRocmVhZElEXG4gICAgfSk7XG4gIH1cbn07XG4iLCJ2YXIgTWVzc2FnZVNlY3Rpb24gPSByZXF1aXJlKCcuL01lc3NhZ2VTZWN0aW9uLnJlYWN0Jyk7XG52YXIgVGhyZWFkU2VjdGlvbiA9IHJlcXVpcmUoJy4vVGhyZWFkU2VjdGlvbi5yZWFjdCcpO1xuXG52YXIgQ2hhdEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJDaGF0QXBwXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjaGF0YXBwXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaHJlYWRTZWN0aW9uLCBudWxsKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVzc2FnZVNlY3Rpb24sIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0QXBwO1xuIiwidmFyIENoYXRNZXNzYWdlQWN0aW9uQ3JlYXRvcnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL21lc3NhZ2UnKTtcbnZhciBFTlRFUl9LRVlfQ09ERSA9IDEzO1xuXG52YXIgTWVzc2FnZUNvbXBvc2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk1lc3NhZ2VDb21wb3NlclwiLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHt0ZXh0OiAnJ307XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHtcbiAgICAgICAgY2xhc3NOYW1lOiBcIm1lc3NhZ2UtY29tcG9zZXJcIiwgXG4gICAgICAgIG5hbWU6IFwibWVzc2FnZVwiLCBcbiAgICAgICAgdmFsdWU6IHRoaXMuc3RhdGUudGV4dCwgXG4gICAgICAgIG9uQ2hhbmdlOiB0aGlzLl9vbkNoYW5nZSwgXG4gICAgICAgIG9uS2V5RG93bjogdGhpcy5fb25LZXlEb3dufVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbihldmVudCwgdmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt0ZXh0OiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgfSxcblxuICBfb25LZXlEb3duOiBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSBFTlRFUl9LRVlfQ09ERSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB0ZXh0ID0gdGhpcy5zdGF0ZS50ZXh0LnRyaW0oKTtcbiAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgIENoYXRNZXNzYWdlQWN0aW9uQ3JlYXRvcnMuY3JlYXRlTWVzc2FnZSh0ZXh0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3RleHQ6ICcnfSk7XG4gICAgfVxuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VDb21wb3NlcjtcbiIsInZhciBSZWFjdFByb3BUeXBlcyA9IFJlYWN0LlByb3BUeXBlcztcbnZhciBNZXNzYWdlTGlzdEl0ZW0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTWVzc2FnZUxpc3RJdGVtXCIsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbWVzc2FnZTogUmVhY3RQcm9wVHlwZXMub2JqZWN0XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMucHJvcHMubWVzc2FnZTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IFwibWVzc2FnZS1saXN0LWl0ZW1cIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDVcIiwge2NsYXNzTmFtZTogXCJtZXNzYWdlLWF1dGhvci1uYW1lXCJ9LCBtZXNzYWdlLmF1dGhvck5hbWUpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2UtdGltZVwifSwgXG4gICAgICAgICAgbWVzc2FnZS5kYXRlLnRvTG9jYWxlVGltZVN0cmluZygpXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWVzc2FnZS10ZXh0XCJ9LCBtZXNzYWdlLnRleHQpXG4gICAgICApXG4gICAgKTtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlTGlzdEl0ZW07XG4iLCJ2YXIgTWVzc2FnZUNvbXBvc2VyID0gcmVxdWlyZSgnLi9NZXNzYWdlQ29tcG9zZXIucmVhY3QnKTtcbnZhciBNZXNzYWdlTGlzdEl0ZW0gPSByZXF1aXJlKCcuL01lc3NhZ2VMaXN0SXRlbS5yZWFjdCcpO1xudmFyIE1lc3NhZ2VTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9tZXNzYWdlJyk7XG52YXIgVGhyZWFkU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvdGhyZWFkJyk7XG5cbmZ1bmN0aW9uIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgcmV0dXJuIHtcbiAgICBtZXNzYWdlczogTWVzc2FnZVN0b3JlLmdldEFsbEZvckN1cnJlbnRUaHJlYWQoKSxcbiAgICB0aHJlYWQ6IFRocmVhZFN0b3JlLmdldEN1cnJlbnQoKVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlTGlzdEl0ZW0obWVzc2FnZSkge1xuICByZXR1cm4gKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVzc2FnZUxpc3RJdGVtLCB7XG4gICAgICBrZXk6IG1lc3NhZ2UuaWQsIFxuICAgICAgbWVzc2FnZTogbWVzc2FnZX1cbiAgICApXG4gICk7XG59XG5cbnZhciBNZXNzYWdlU2VjdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNZXNzYWdlU2VjdGlvblwiLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGdldFN0YXRlRnJvbVN0b3JlcygpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9zY3JvbGxUb0JvdHRvbSgpO1xuICAgIE1lc3NhZ2VTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gICAgVGhyZWFkU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBNZXNzYWdlU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICAgIFRocmVhZFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtZXNzYWdlTGlzdEl0ZW1zID0gdGhpcy5zdGF0ZS5tZXNzYWdlcy5tYXAoZ2V0TWVzc2FnZUxpc3RJdGVtKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2Utc2VjdGlvblwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCB7Y2xhc3NOYW1lOiBcIm1lc3NhZ2UtdGhyZWFkLWhlYWRpbmdcIn0sIHRoaXMuc3RhdGUudGhyZWFkLm5hbWUpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwibWVzc2FnZS1saXN0XCIsIHJlZjogXCJtZXNzYWdlTGlzdFwifSwgXG4gICAgICAgICAgbWVzc2FnZUxpc3RJdGVtc1xuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQ29tcG9zZXIsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Njcm9sbFRvQm90dG9tKCk7XG4gIH0sXG5cbiAgX3Njcm9sbFRvQm90dG9tOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdWwgPSB0aGlzLnJlZnMubWVzc2FnZUxpc3QuZ2V0RE9NTm9kZSgpO1xuICAgIHVsLnNjcm9sbFRvcCA9IHVsLnNjcm9sbEhlaWdodDtcbiAgfSxcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3IgJ2NoYW5nZScgZXZlbnRzIGNvbWluZyBmcm9tIHRoZSBNZXNzYWdlU3RvcmVcbiAgICovXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShnZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVNlY3Rpb247XG4iLCJ2YXIgQ2hhdFRocmVhZEFjdGlvbkNyZWF0b3JzID0gcmVxdWlyZSgnLi4vYWN0aW9ucy90aHJlYWQnKTtcbnZhciBSZWFjdFByb3BUeXBlcyA9IFJlYWN0LlByb3BUeXBlcztcblxudmFyIFRocmVhZExpc3RJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRocmVhZExpc3RJdGVtXCIsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgdGhyZWFkOiBSZWFjdFByb3BUeXBlcy5vYmplY3QsXG4gICAgY3VycmVudFRocmVhZElEOiBSZWFjdFByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aHJlYWQgPSB0aGlzLnByb3BzLnRocmVhZDtcbiAgICB2YXIgbGFzdE1lc3NhZ2UgPSB0aHJlYWQubGFzdE1lc3NhZ2U7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7XG4gICAgICAgIGNsYXNzTmFtZTogY3goe1xuICAgICAgICAgICd0aHJlYWQtbGlzdC1pdGVtJzogdHJ1ZSxcbiAgICAgICAgICAnYWN0aXZlJzogdGhyZWFkLmlkID09PSB0aGlzLnByb3BzLmN1cnJlbnRUaHJlYWRJRFxuICAgICAgICB9KSwgXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuX29uQ2xpY2t9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg1XCIsIHtjbGFzc05hbWU6IFwidGhyZWFkLW5hbWVcIn0sIHRocmVhZC5uYW1lKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aHJlYWQtdGltZVwifSwgXG4gICAgICAgICAgbGFzdE1lc3NhZ2UuZGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRocmVhZC1sYXN0LW1lc3NhZ2VcIn0sIFxuICAgICAgICAgIGxhc3RNZXNzYWdlLnRleHRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG5cbiAgX29uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIENoYXRUaHJlYWRBY3Rpb25DcmVhdG9ycy5jbGlja1RocmVhZCh0aGlzLnByb3BzLnRocmVhZC5pZCk7XG4gIH1cblxufSk7XG5cbmZ1bmN0aW9uIGN4KGNsYXNzTmFtZXMpIHtcbiAgaWYgKHR5cGVvZiBjbGFzc05hbWVzID09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGNsYXNzTmFtZXMpLmZpbHRlcihmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICAgIHJldHVybiBjbGFzc05hbWVzW2NsYXNzTmFtZV07XG4gICAgfSkuam9pbignICcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuam9pbi5jYWxsKGFyZ3VtZW50cywgJyAnKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRocmVhZExpc3RJdGVtO1xuIiwidmFyIE1lc3NhZ2VTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9tZXNzYWdlJyk7XG52YXIgVGhyZWFkTGlzdEl0ZW0gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1RocmVhZExpc3RJdGVtLnJlYWN0Jyk7XG52YXIgVGhyZWFkU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvdGhyZWFkJyk7XG52YXIgVW5yZWFkVGhyZWFkU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvdW5yZWFkJyk7XG5cbmZ1bmN0aW9uIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgcmV0dXJuIHtcbiAgICB0aHJlYWRzOiBUaHJlYWRTdG9yZS5nZXRBbGxDaHJvbm8oKSxcbiAgICBjdXJyZW50VGhyZWFkSUQ6IFRocmVhZFN0b3JlLmdldEN1cnJlbnRJRCgpLFxuICAgIHVucmVhZENvdW50OiBVbnJlYWRUaHJlYWRTdG9yZS5nZXRDb3VudCgpXG4gIH07XG59XG5cbnZhciBUaHJlYWRTZWN0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRocmVhZFNlY3Rpb25cIixcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBnZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgVGhyZWFkU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICAgIFVucmVhZFRocmVhZFN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgVGhyZWFkU3RvcmUucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICAgIFVucmVhZFRocmVhZFN0b3JlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aHJlYWRMaXN0SXRlbXMgPSB0aGlzLnN0YXRlLnRocmVhZHMubWFwKGZ1bmN0aW9uKHRocmVhZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaHJlYWRMaXN0SXRlbSwge1xuICAgICAgICAgIGtleTogdGhyZWFkLmlkLCBcbiAgICAgICAgICB0aHJlYWQ6IHRocmVhZCwgXG4gICAgICAgICAgY3VycmVudFRocmVhZElEOiB0aGlzLnN0YXRlLmN1cnJlbnRUaHJlYWRJRH1cbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcbiAgICB2YXIgdW5yZWFkID1cbiAgICAgIHRoaXMuc3RhdGUudW5yZWFkQ291bnQgPT09IDAgP1xuICAgICAgbnVsbCA6XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlVucmVhZCB0aHJlYWRzOiBcIiwgdGhpcy5zdGF0ZS51bnJlYWRDb3VudCk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aHJlYWQtc2VjdGlvblwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aHJlYWQtY291bnRcIn0sIFxuICAgICAgICAgIHVucmVhZFxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHtjbGFzc05hbWU6IFwidGhyZWFkLWxpc3RcIn0sIFxuICAgICAgICAgIHRocmVhZExpc3RJdGVtc1xuICAgICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciAnY2hhbmdlJyBldmVudHMgY29taW5nIGZyb20gdGhlIHN0b3Jlc1xuICAgKi9cbiAgX29uQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKGdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaHJlYWRTZWN0aW9uO1xuIiwidmFyIENoYXRBcHBEaXNwYXRjaGVyID0gU3ViVW5pdC5jcmVhdGVEaXNwYXRjaGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IENoYXRBcHBEaXNwYXRjaGVyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdtZXNzYWdlcycsIEpTT04uc3RyaW5naWZ5KFtcbiAgICAgIHtcbiAgICAgICAgaWQ6ICdtXzEnLFxuICAgICAgICB0aHJlYWRJRDogJ3RfMScsXG4gICAgICAgIHRocmVhZE5hbWU6ICdKaW5nIGFuZCBCaWxsJyxcbiAgICAgICAgYXV0aG9yTmFtZTogJ0JpbGwnLFxuICAgICAgICB0ZXh0OiAnSGV5IEppbmcsIHdhbnQgdG8gZ2l2ZSBhIEZsdXggdGFsayBhdCBGb3J3YXJkSlM/JyxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gOTk5OTlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnbV8yJyxcbiAgICAgICAgdGhyZWFkSUQ6ICd0XzEnLFxuICAgICAgICB0aHJlYWROYW1lOiAnSmluZyBhbmQgQmlsbCcsXG4gICAgICAgIGF1dGhvck5hbWU6ICdCaWxsJyxcbiAgICAgICAgdGV4dDogJ1NlZW1zIGxpa2UgYSBwcmV0dHkgY29vbCBjb25mZXJlbmNlLicsXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDg5OTk5XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ21fMycsXG4gICAgICAgIHRocmVhZElEOiAndF8xJyxcbiAgICAgICAgdGhyZWFkTmFtZTogJ0ppbmcgYW5kIEJpbGwnLFxuICAgICAgICBhdXRob3JOYW1lOiAnSmluZycsXG4gICAgICAgIHRleHQ6ICdTb3VuZHMgZ29vZC4gIFdpbGwgdGhleSBiZSBzZXJ2aW5nIGRlc3NlcnQ/JyxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNzk5OTlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnbV80JyxcbiAgICAgICAgdGhyZWFkSUQ6ICd0XzInLFxuICAgICAgICB0aHJlYWROYW1lOiAnRGF2ZSBhbmQgQmlsbCcsXG4gICAgICAgIGF1dGhvck5hbWU6ICdCaWxsJyxcbiAgICAgICAgdGV4dDogJ0hleSBEYXZlLCB3YW50IHRvIGdldCBhIGJlZXIgYWZ0ZXIgdGhlIGNvbmZlcmVuY2U/JyxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gNjk5OTlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAnbV81JyxcbiAgICAgICAgdGhyZWFkSUQ6ICd0XzInLFxuICAgICAgICB0aHJlYWROYW1lOiAnRGF2ZSBhbmQgQmlsbCcsXG4gICAgICAgIGF1dGhvck5hbWU6ICdEYXZlJyxcbiAgICAgICAgdGV4dDogJ1RvdGFsbHkhICBNZWV0IHlvdSBhdCB0aGUgaG90ZWwgYmFyLicsXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDU5OTk5XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ21fNicsXG4gICAgICAgIHRocmVhZElEOiAndF8zJyxcbiAgICAgICAgdGhyZWFkTmFtZTogJ0Z1bmN0aW9uYWwgSGVhZHMnLFxuICAgICAgICBhdXRob3JOYW1lOiAnQmlsbCcsXG4gICAgICAgIHRleHQ6ICdIZXkgQnJpYW4sIGFyZSB5b3UgZ29pbmcgdG8gYmUgdGFsa2luZyBhYm91dCBmdW5jdGlvbmFsIHN0dWZmPycsXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDQ5OTk5XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogJ21fNycsXG4gICAgICAgIHRocmVhZElEOiAndF8zJyxcbiAgICAgICAgdGhyZWFkTmFtZTogJ0JpbGwgYW5kIEJyaWFuJyxcbiAgICAgICAgYXV0aG9yTmFtZTogJ0JyaWFuJyxcbiAgICAgICAgdGV4dDogJ0F0IEZvcndhcmRKUz8gIFllYWgsIG9mIGNvdXJzZS4gIFNlZSB5b3UgdGhlcmUhJyxcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpIC0gMzk5OTlcbiAgICAgIH1cbiAgICBdKSk7XG4gIH1cbn07XG4iLCJ2YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyJyk7XG52YXIgdXRpbHMgICAgICAgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIHRocmVhZFN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL3RocmVhZCcpO1xudmFyIGFjdGlvblR5cGVzID0gcmVxdWlyZSgnLi4vYWN0aW9uVHlwZXMnKTtcblxudmFyIF9tZXNzYWdlcyA9IHt9O1xuXG5mdW5jdGlvbiBfYWRkTWVzc2FnZXMocmF3TWVzc2FnZXMpIHtcbiAgcmF3TWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgIGlmICghX21lc3NhZ2VzW21lc3NhZ2UuaWRdKSB7XG4gICAgICBfbWVzc2FnZXNbbWVzc2FnZS5pZF0gPSB1dGlscy5jb252ZXJ0UmF3TWVzc2FnZShcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgdGhyZWFkU3RvcmUuZ2V0Q3VycmVudElEKClcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gX21hcmtBbGxJblRocmVhZFJlYWQodGhyZWFkSUQpIHtcbiAgZm9yICh2YXIgaWQgaW4gX21lc3NhZ2VzKSB7XG4gICAgaWYgKF9tZXNzYWdlc1tpZF0udGhyZWFkSUQgPT09IHRocmVhZElEKSB7XG4gICAgICBfbWVzc2FnZXNbaWRdLmlzUmVhZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbnZhciBNZXNzYWdlU3RvcmUgPSBTdWJVbml0LmNyZWF0ZVN0b3JlKHtcbiAgZ2V0OiBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiBfbWVzc2FnZXNbaWRdO1xuICB9LFxuICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfbWVzc2FnZXM7XG4gIH0sXG4gIGdldEFsbEZvclRocmVhZDogZnVuY3Rpb24odGhyZWFkSUQpIHtcbiAgICB2YXIgdGhyZWFkTWVzc2FnZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpZCBpbiBfbWVzc2FnZXMpIHtcbiAgICAgIGlmIChfbWVzc2FnZXNbaWRdLnRocmVhZElEID09PSB0aHJlYWRJRCkge1xuICAgICAgICB0aHJlYWRNZXNzYWdlcy5wdXNoKF9tZXNzYWdlc1tpZF0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJlYWRNZXNzYWdlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLmRhdGUgPCBiLmRhdGUpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfSBlbHNlIGlmIChhLmRhdGUgPiBiLmRhdGUpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhyZWFkTWVzc2FnZXM7XG4gIH0sXG4gIGdldEFsbEZvckN1cnJlbnRUaHJlYWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFsbEZvclRocmVhZCh0aHJlYWRTdG9yZS5nZXRDdXJyZW50SUQoKSk7XG4gIH0sXG4gIGdldENyZWF0ZWRNZXNzYWdlRGF0YTogZnVuY3Rpb24odGV4dCkge1xuICAgIHZhciB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ21fJyArIHRpbWVzdGFtcCxcbiAgICAgIHRocmVhZElEOiB0aHJlYWRTdG9yZS5nZXRDdXJyZW50SUQoKSxcbiAgICAgIGF1dGhvck5hbWU6ICdTdGV2ZScsIC8vIGhhcmQgY29kZWQgZm9yIHRoZSBleGFtcGxlXG4gICAgICBkYXRlOiBuZXcgRGF0ZSh0aW1lc3RhbXApLFxuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIGlzUmVhZDogdHJ1ZVxuICAgIH07XG4gIH1cbn0pO1xuXG5NZXNzYWdlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9IGRpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgdmFyIGFjdGlvbiA9IHBheWxvYWQuYWN0aW9uO1xuXG4gIHN3aXRjaChhY3Rpb24udHlwZSkge1xuXG4gICAgY2FzZSBhY3Rpb25UeXBlcy5DTElDS19USFJFQUQ6XG4gICAgICBkaXNwYXRjaGVyLndhaXRGb3IoW3RocmVhZFN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAgICAgIF9tYXJrQWxsSW5UaHJlYWRSZWFkKHRocmVhZFN0b3JlLmdldEN1cnJlbnRJRCgpKTtcbiAgICAgIE1lc3NhZ2VTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ1JFQVRFX01FU1NBR0U6XG4gICAgICB2YXIgbWVzc2FnZSA9IE1lc3NhZ2VTdG9yZS5nZXRDcmVhdGVkTWVzc2FnZURhdGEoYWN0aW9uLnRleHQpO1xuICAgICAgX21lc3NhZ2VzW21lc3NhZ2UuaWRdID0gbWVzc2FnZTtcbiAgICAgIE1lc3NhZ2VTdG9yZS5lbWl0Q2hhbmdlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuUkVDRUlWRV9SQVdfTUVTU0FHRVM6XG4gICAgICBfYWRkTWVzc2FnZXMoYWN0aW9uLnJhd01lc3NhZ2VzKTtcbiAgICAgIGRpc3BhdGNoZXIud2FpdEZvcihbdGhyZWFkU3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICAgICAgX21hcmtBbGxJblRocmVhZFJlYWQodGhyZWFkU3RvcmUuZ2V0Q3VycmVudElEKCkpO1xuICAgICAgTWVzc2FnZVN0b3JlLmVtaXRDaGFuZ2UoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDogLy8gZG8gbm90aGluZ1xuICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VTdG9yZTtcbiIsInZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXInKTtcbnZhciB1dGlscyAgICAgICA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG52YXIgYWN0aW9uVHlwZXMgPSByZXF1aXJlKCcuLi9hY3Rpb25UeXBlcycpO1xuXG52YXIgX2N1cnJlbnRJRCA9IG51bGw7XG52YXIgX3RocmVhZHMgPSB7fTtcblxudmFyIFRocmVhZFN0b3JlID0gU3ViVW5pdC5jcmVhdGVTdG9yZSh7XG4gIGluaXQ6IGZ1bmN0aW9uKHJhd01lc3NhZ2VzKSB7XG4gICAgcmF3TWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgdmFyIHRocmVhZElEID0gbWVzc2FnZS50aHJlYWRJRDtcbiAgICAgIHZhciB0aHJlYWQgPSBfdGhyZWFkc1t0aHJlYWRJRF07XG4gICAgICBpZiAodGhyZWFkICYmIHRocmVhZC5sYXN0VGltZXN0YW1wID4gbWVzc2FnZS50aW1lc3RhbXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgX3RocmVhZHNbdGhyZWFkSURdID0ge1xuICAgICAgICBpZDogdGhyZWFkSUQsXG4gICAgICAgIG5hbWU6IG1lc3NhZ2UudGhyZWFkTmFtZSxcbiAgICAgICAgbGFzdE1lc3NhZ2U6IHV0aWxzLmNvbnZlcnRSYXdNZXNzYWdlKG1lc3NhZ2UsIF9jdXJyZW50SUQpXG4gICAgICB9O1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKCFfY3VycmVudElEKSB7XG4gICAgICB2YXIgYWxsQ2hyb25vID0gdGhpcy5nZXRBbGxDaHJvbm8oKTtcbiAgICAgIF9jdXJyZW50SUQgPSBhbGxDaHJvbm9bYWxsQ2hyb25vLmxlbmd0aCAtIDFdLmlkO1xuICAgIH1cblxuICAgIF90aHJlYWRzW19jdXJyZW50SURdLmxhc3RNZXNzYWdlLmlzUmVhZCA9IHRydWU7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gX3RocmVhZHNbaWRdO1xuICB9LFxuICBnZXRBbGw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfdGhyZWFkcztcbiAgfSxcbiAgZ2V0QWxsQ2hyb25vOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3JkZXJlZFRocmVhZHMgPSBbXTtcbiAgICBmb3IgKHZhciBpZCBpbiBfdGhyZWFkcykge1xuICAgICAgdmFyIHRocmVhZCA9IF90aHJlYWRzW2lkXTtcbiAgICAgIG9yZGVyZWRUaHJlYWRzLnB1c2godGhyZWFkKTtcbiAgICB9XG4gICAgb3JkZXJlZFRocmVhZHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAoYS5sYXN0TWVzc2FnZS5kYXRlIDwgYi5sYXN0TWVzc2FnZS5kYXRlKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0gZWxzZSBpZiAoYS5sYXN0TWVzc2FnZS5kYXRlID4gYi5sYXN0TWVzc2FnZS5kYXRlKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9yZGVyZWRUaHJlYWRzO1xuICB9LFxuICBnZXRDdXJyZW50SUQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfY3VycmVudElEO1xuICB9LFxuICBnZXRDdXJyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQodGhpcy5nZXRDdXJyZW50SUQoKSk7XG4gIH1cbn0pO1xuXG5UaHJlYWRTdG9yZS5kaXNwYXRjaFRva2VuID0gZGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAocGF5bG9hZCkge1xuICB2YXIgYWN0aW9uID0gcGF5bG9hZC5hY3Rpb247XG5cbiAgc3dpdGNoKGFjdGlvbi50eXBlKSB7XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLkNMSUNLX1RIUkVBRDpcbiAgICAgIF9jdXJyZW50SUQgPSBhY3Rpb24udGhyZWFkSUQ7XG4gICAgICBfdGhyZWFkc1tfY3VycmVudElEXS5sYXN0TWVzc2FnZS5pc1JlYWQgPSB0cnVlO1xuICAgICAgVGhyZWFkU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ0VJVkVfUkFXX01FU1NBR0VTOlxuICAgICAgVGhyZWFkU3RvcmUuaW5pdChhY3Rpb24ucmF3TWVzc2FnZXMpO1xuICAgICAgVGhyZWFkU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OiAvLyBkbyBub3RoaW5nXG4gIH1cblxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGhyZWFkU3RvcmU7XG4iLCJ2YXIgZGlzcGF0Y2hlciAgID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlcicpO1xudmFyIG1lc3NhZ2VTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9tZXNzYWdlJyk7XG52YXIgdGhyZWFkU3RvcmUgID0gcmVxdWlyZSgnLi4vc3RvcmVzL3RocmVhZCcpO1xudmFyIGFjdGlvblR5cGVzICA9IHJlcXVpcmUoJy4uL2FjdGlvblR5cGVzJyk7XG5cbnZhciBVbnJlYWR0aHJlYWRTdG9yZSA9IFN1YlVuaXQuY3JlYXRlU3RvcmUoe1xuICBnZXRDb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRocmVhZHMgPSB0aHJlYWRTdG9yZS5nZXRBbGwoKTtcbiAgICB2YXIgdW5yZWFkQ291bnQgPSAwO1xuICAgIGZvciAodmFyIGlkIGluIHRocmVhZHMpIHtcbiAgICAgIGlmICghdGhyZWFkc1tpZF0ubGFzdE1lc3NhZ2UuaXNSZWFkKSB7XG4gICAgICAgIHVucmVhZENvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bnJlYWRDb3VudDtcbiAgfVxufSk7XG5cblVucmVhZHRocmVhZFN0b3JlLmRpc3BhdGNoVG9rZW4gPSBkaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gIGRpc3BhdGNoZXIud2FpdEZvcihbXG4gICAgdGhyZWFkU3RvcmUuZGlzcGF0Y2hUb2tlbixcbiAgICBtZXNzYWdlU3RvcmUuZGlzcGF0Y2hUb2tlblxuICBdKTtcblxuICB2YXIgYWN0aW9uID0gcGF5bG9hZC5hY3Rpb247XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcblxuICAgIGNhc2UgYWN0aW9uVHlwZXMuQ0xJQ0tfVEhSRUFEOlxuICAgICAgVW5yZWFkdGhyZWFkU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIGFjdGlvblR5cGVzLlJFQ0VJVkVfUkFXX01FU1NBR0VTOlxuICAgICAgVW5yZWFkdGhyZWFkU3RvcmUuZW1pdENoYW5nZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OiAvLyBkbyBub3RoaW5nXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVucmVhZHRocmVhZFN0b3JlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbnZlcnRSYXdNZXNzYWdlOiBmdW5jdGlvbihyYXdNZXNzYWdlLCBjdXJyZW50VGhyZWFkSUQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHJhd01lc3NhZ2UuaWQsXG4gICAgICB0aHJlYWRJRDogcmF3TWVzc2FnZS50aHJlYWRJRCxcbiAgICAgIGF1dGhvck5hbWU6IHJhd01lc3NhZ2UuYXV0aG9yTmFtZSxcbiAgICAgIGRhdGU6IG5ldyBEYXRlKHJhd01lc3NhZ2UudGltZXN0YW1wKSxcbiAgICAgIHRleHQ6IHJhd01lc3NhZ2UudGV4dCxcbiAgICAgIGlzUmVhZDogcmF3TWVzc2FnZS50aHJlYWRJRCA9PT0gY3VycmVudFRocmVhZElEXG4gICAgfTtcbiAgfVxuXG59O1xuIl19
