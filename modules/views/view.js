import { scene } from '../scene';
import { messageStore } from '../stores/message';
import { threadStore } from '../stores/thread';

function getStateFromStores() {
  return {
    messages: messageStore.getAllForCurrentThread(),
    thread: threadStore.getCurrent()
  };
}

export var view = SubUnit.createView(scene, {
  getInitialState: function() {
    return getStateFromStores();
  },
  viewDidMount: function() {
    messageStore.addChangeListener(onStoreUpdate);
    threadStore.addChangeListener(onStoreUpdate);
  },
  viewWillUnmount: function() {
    messageStore.removeChangeListener(onStoreUpdate);
    threadStore.removeChangeListener(onStoreUpdate);
  },
  render: function() {
    console.log("view.render root: ", this.root)
    console.log("view.render data: ", this.state)
  },
  viewDidUpdate: function() {
    this._scrollToBottom();
  }
});

function onStoreUpdate() {
  view.setState(getStateFromStores());
}