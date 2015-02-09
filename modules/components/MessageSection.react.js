import { MessageComposer } from './MessageComposer.react';
import { MessageListItem } from './MessageListItem.react';
import { messageStore } from '../stores/message';
import { threadStore } from '../stores/thread';

function getStateFromStores() {
  return {
    messages: messageStore.getAllForCurrentThread(),
    thread: threadStore.getCurrent()
  };
}

function getMessageListItem(message) {
  return React.createElement(MessageListItem, {
    key: message.id, 
    message: message
  });
}

export var MessageSection = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    this._scrollToBottom();
    messageStore.addChangeListener(this._onChange);
    threadStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    messageStore.removeChangeListener(this._onChange);
    threadStore.removeChangeListener(this._onChange);
  },
  render: function() {
    var messageListItems = this.state.messages.map(getMessageListItem);
    // return React.createElement("div", {className: "message-section"}, 
    //   React.createElement("h3", {className: "message-thread-heading"}, this.state.thread.name), 
    //   React.createElement("ul", {className: "message-list", ref: "messageList"}, messageListItems), 
      return React.createElement(MessageComposer, null)
    // );
  },
  componentDidUpdate: function() {
    this._scrollToBottom();
  },
  _scrollToBottom: function() {
    // var ul = this.refs.messageList.getDOMNode();
    // ul.scrollTop = ul.scrollHeight;
  },
  _onChange: function() {
    this.setState(getStateFromStores());
  }
});
