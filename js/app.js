var ChatApp = require('./components/ChatApp.react');
var ChatExampleData = require('./ChatExampleData');
var ChatWebAPIUtils = require('./utils/ChatWebAPIUtils');
var ChatServerActionCreators = require('./actions/server');

var React = require('react');
window.React = React; // export for http://fb.me/react-devtools

ChatExampleData.init(); // load example data into localstorage

var rawMessages = JSON.parse(localStorage.getItem('messages'));
ChatServerActionCreators.receiveAll(rawMessages);

React.render(
    <ChatApp />,
    document.getElementById('react')
);
