import { scene } from '../scene';
import { messageStore } from '../stores/messageStore';
import { threadStore } from '../stores/threadStore';
import { renderThreads } from './renderThreads';

function getStateFromStores() {
  return {
    threads: threadStore.getAllChrono(),
    currentThreadID: threadStore.getCurrentID(),
  };
}

export var threadsView = SubUnit.createView(scene, {
  getInitialState: function() {
    return getStateFromStores();
  },
  viewDidMount: function() {
    threadStore.addChangeListener(onStoreChange);
  },
  viewWillUnmount: function() {
    threadStore.removeChangeListener(onStoreChange);
  },
  render: renderThreads
});

function onStoreChange() {
  threadsView.setState(getStateFromStores());
}
