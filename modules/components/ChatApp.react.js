import { MessageSection } from './MessageSection.react';
import { ThreadSection } from './ThreadSection.react';

export var ChatApp = React.createClass({
  render: function() {
    return React.createElement("div", {className: "chatapp"}, 
      React.createElement(ThreadSection, null), 
      React.createElement(MessageSection, null)
    );
  }
});