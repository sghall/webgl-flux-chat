import { scene } from '../scene';
import { messageStore } from '../stores/message';
import { threadStore } from '../stores/thread';

import { renderMessages } from './render'

function getStateFromStores() {
  return {
    messages: messageStore.getAllForCurrentThread(),
    thread: threadStore.getCurrent()
  };
}

export var view = SubUnit.createView(scene, {
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
  view.setState(getStateFromStores());
}