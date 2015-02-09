import { scene } from '../scene';
import { unreadStore } from '../stores/unreadStore';
import { renderThreads } from './renderThreads';
import { makeSprite } from '../utils';

function getStateFromStores() {
  return {
    unreadCount: unreadStore.getCount()
  };
}

export var unreadView = SubUnit.createView(scene, {
  getInitialState: function() {
    return getStateFromStores();
  },
  viewDidMount: function() {
    unreadStore.addChangeListener(onStoreChange);
  },
  viewWillUnmount: function() {
    unreadStore.removeChangeListener(onStoreChange);
  },
  render: function () {

    var data = this.state.unreadCount;
    data = data <= 0 ? []: [data];

    var counter = this.root.selectAll("unread.count")
      .data(data, function (d) { return d; });

    counter.each(function (d) {  // UPDATE
      var image = makeSprite("unread: " + d, "#000", 30);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(image.width, image.height);
    });

    counter.enter().append("mesh") // ENTER
      .attr("tags", "unread count")
      .each(function (d) {
        var image = makeSprite("unread: " + d, "#000", 30);
        this.material = new THREE.MeshBasicMaterial({
          map: image.map, 
          transparent: true
        });
        this.geometry = new THREE.PlaneBufferGeometry(image.width, image.height);
        this.scale.set(0.7, 0.7, 0.7);
        this.position.set(-250, 370, 504);
      });

    counter.exit().remove();      // EXIT
  }
});

function onStoreChange() {
  unreadView.setState(getStateFromStores());
}
