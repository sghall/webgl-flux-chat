var ReactPropTypes = React.PropTypes;

export var MessageListItem = React.createClass({
  propTypes: {
    message: ReactPropTypes.object
  },
  render: function() {
    var message = this.props.message;
    return React.createElement("li", {className: "message-list-item"}, 
      React.createElement("h5", {className: "message-author-name"}, message.authorName), 
      React.createElement("div", {className: "message-time"}, message.date.toLocaleTimeString()), 
      React.createElement("div", {className: "message-text"}, message.text)
    );
  }
});