import { scene } from '../scene';
import { messageStore } from '../stores/messageStore';
import { threadStore } from '../stores/threadStore';
import { renderMessages } from './renderMessages';

function getStateFromStores() {
  return {
    messages: messageStore.getAllForCurrentThread(),
    thread: threadStore.getCurrent()
  };
}

export var messagesView = SubUnit.createView(scene, {
  getInitialState: function () {
    return getStateFromStores();
  },
  viewDidMount: function () {
    messageStore.addChangeListener(onStoreUpdate);
    threadStore.addChangeListener(onStoreUpdate);
  },
  viewWillUnmount: function () {
    messageStore.removeChangeListener(onStoreUpdate);
    threadStore.removeChangeListener(onStoreUpdate);
  },
  render: renderMessages
});

function onStoreUpdate() {
  messagesView.setState(getStateFromStores());
}