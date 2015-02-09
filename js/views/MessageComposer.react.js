import { messageActions } from '../actions/messageActions';

var ENTER_KEY_CODE = 13;

export var MessageComposer = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  render: function() {
    return React.createElement("textarea", {
      className: "message-composer", 
      name: "message", 
      value: this.state.text, 
      onChange: this._onChange, 
      onKeyDown: this._onKeyDown
    });
  },
  _onChange: function(event, value) {
    this.setState({text: event.target.value});
  },
  _onKeyDown: function(event) {
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      var text = this.state.text.trim();
      if (text) {
        messageActions.createMessage(text);
      }
      this.setState({text: ''});
    }
  }
});