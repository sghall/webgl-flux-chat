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
  render: function () {
    // var root = SubUnit.object(this.root);

    var boxes = this.root.selectAll("box.mesh")
      .data(this.state.messages, function (d) { return d.id; })

    boxes
      .attr("material", new THREE.MeshPhongMaterial({color: 'blue'}))
      .each(function (d, i) {
        this.position.set(25, i * 110, 0);
      });

    boxes.enter().append("mesh")
      .attr("tags", "box mesh")
      .attr("geometry", new THREE.BoxGeometry(1, 1, 1))
      .attr("material", new THREE.MeshPhongMaterial({color: 'red'}))
      .each(function (d, i) {
        this.scale.set(600, 100, 2)
        this.position.set(25, i * 110, 0);
      });

    boxes.exit().remove()

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