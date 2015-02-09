import { messageStore } from '../stores/messageStore';
import { threadStore } from '../stores/threadStore';
import { unreadStore } from '../stores/unreadStore';

function getStateFromStores() {
  return {
    threads: threadStore.getAllChrono(),
    currentThreadID: threadStore.getCurrentID(),
    unreadCount: unreadStore.getCount()
  };
}

export var threadsView = SubUnit.createView({
  getInitialState: function() {
    return getStateFromStores();
  },
  componentDidMount: function() {
    threadStore.addChangeListener(onStoreChange);
    unreadStore.addChangeListener(onStoreChange);
  },
  componentWillUnmount: function() {
    threadStore.removeChangeListener(onStoreChange);
    unreadStore.removeChangeListener(onStoreChange);
  },
  render: renderThreads
});


function onStoreChange() {
  ThreadView.setState(getStateFromStores());
}
