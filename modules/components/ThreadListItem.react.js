import { threadActions } from '../actions/thread';

var ReactPropTypes = React.PropTypes;

export var ThreadListItem = React.createClass({
  propTypes: {
    thread: ReactPropTypes.object,
    currentThreadID: ReactPropTypes.string
  },
  render: function() {
    var thread = this.props.thread;
    var lastMessage = thread.lastMessage;
    return React.createElement("li", {
      className: cx({
        'thread-list-item': true,
        'active': thread.id === this.props.currentThreadID
      }), onClick: this._onClick}, 
      React.createElement("h5", {className: "thread-name"}, thread.name), 
      React.createElement("div", {className: "thread-time"},lastMessage.date.toLocaleTimeString()), 
      React.createElement("div", {className: "thread-last-message"}, lastMessage.text)
    );
  },
  _onClick: function() {
    threadActions.clickThread(this.props.thread.id);
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
