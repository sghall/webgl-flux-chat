import { messageStore } from '../stores/message';
import { ThreadListItem } from '../components/ThreadListItem.react';
import { threadStore } from '../stores/thread';
import { unreadStore } from '../stores/unread';

function getStateFromStores() {
  return {
    threads: threadStore.getAllChrono(),
    currentThreadID: threadStore.getCurrentID(),
    unreadCount: unreadStore.getCount()
  };
}

export var ThreadSection = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    threadStore.addChangeListener(this._onChange);
    unreadStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    threadStore.removeChangeListener(this._onChange);
    unreadStore.removeChangeListener(this._onChange);
  },
  render: function() {
    var ThreadListItems = this.state.threads.map(function (thread) {
      return React.createElement(ThreadListItem, {
        key: thread.id, 
        thread: thread, 
        currentThreadID: this.state.currentThreadID}
      );
    }, this);

    var unread = this.state.unreadCount === 0 ? null :
    React.createElement("span", null, "Unread threads: ", this.state.unreadCount);

    return React.createElement("div", {className: "thread-section"}, 
      React.createElement("div", {className: "thread-count"}, unread), 
      React.createElement("ul", {className: "thread-list"}, ThreadListItems)
    );
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});
