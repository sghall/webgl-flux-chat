import { scene } from '../scene';
import { messageStore } from '../stores/message';
import { threadStore } from '../stores/thread';

function getStateFromStores() {
  return {
    messages: messageStore.getAllForCurrentThread(),
    thread: threadStore.getCurrent()
  };
}

export var globeView = SubUnit.createView(scene, {
  getInitialState: function () {
    return getStateFromStores();
  },
  render: function () {
    this.root.node().position.set(0, 0, 500)

    this.root.append("mesh")
      .attr("material", new THREE.MeshPhongMaterial({color: '#483C58', shininess: 100}))
      .attr("geometry", new THREE.SphereGeometry(60, 30, 30))
      .each(function () {
        this.position.set(400, 100, 0);
      })

    this.root.append("mesh")
      .attr("material", new THREE.MeshPhongMaterial({color: '#2B1F3B', shininess: 100}))
      .attr("geometry", new THREE.SphereGeometry(60, 30, 30))
      .each(function () {
        this.position.set(-400, 100, 0);
      })
  }
});

function onStoreUpdate() {
  view.setState(getStateFromStores());
}