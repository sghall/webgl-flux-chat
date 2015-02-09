import { wrapText, color, text } from '../utils';
import { threadActions } from '../actions/threadActions';

var threadGeometry = new THREE.BoxGeometry(100, 30, 5);

export function renderThreads() {

  var msgWidth = 800;

  var data = this.state;

  var threads = this.root.selectAll("thread.node")
    .data(data.threads, function (d) { return d.id; })

  threads.selectAll("backing.inner")
    .attr("material", function (d) {
      if (d.id === data.currentThreadID) {
        return color('#93A0A2');
      }
      return color("#fff");
    });

  threads.each(function (d, i) {
    new TWEEN.Tween(this.position)
      .easing(TWEEN.Easing.Cubic.InOut)
      .to({y: 325 - (i * 120)}, 400)
      .start();
  });

  var nodes = threads.enter()
    .append("object")
    .attr("tags", "thread node")
    .each(function (d, i) {
      this.rotation.set(0, 0, Math.PI);
      this.position.set(-400, 325 - (i * 120), 0);
      this.scale.set(0.75, 0.01, 0.75);

      new TWEEN.Tween(this.rotation)
        .easing(TWEEN.Easing.Cubic.InOut)
        .to({z: 0}, 350)
        .start();

      new TWEEN.Tween(this.scale)
        .easing(TWEEN.Easing.Cubic.InOut)
        .delay(350)
        .to({y: 0.75}, 350)
        .start();
    });

  nodes.append("mesh")
    .attr("tags", "thread text")
    .each(function (d) {
      var image = text(d.lastMessage.text, "#333", 50, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.scale.set(0.6, 0.6, 1);
      this.position.set(10, -25, 500);
    });

  nodes.append("mesh")
    .attr("tags", "thread name")
    .each(function (d) {
      var image = text(d.name, "#005F6B", 31, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.position.set(170, 28, 500);
    });

  nodes.append("mesh")
    .attr("tags", "thread time")
    .each(function (d) {
      var time = d3.time.format("%X %p")(d.lastMessage.date);
      var image = text(time, "#008C9E", 30, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.scale.set(0.75, 0.75, 0.75);
      this.position.set(380, 30, 500);
    });

  nodes.append("mesh")
    .attr("tags", "thread backing outer")
    .attr("geometry", threadGeometry)
    .attr("material", color('#FFF7E6'))
    .each(function (d, i) {
      this.position.set(0, 0, 490);
      this.scale.set(5, 5, 1);
    });

  nodes.append("mesh")
    .attr("tags", "thread backing inner")
    .attr("geometry", threadGeometry)
    .attr("material", color('#FFF'))
    .each(function (d, i) {
      this.position.set(0, 0, 495);
      this.scale.set(4.95, 4.8, 1);
    })
    .on('click', function (event, d, i) {
       threadActions.clickThread(d.id);
    });

  this.events['click'] = this.root.selectAll("backing.inner")[0];

  threads.exit().remove();
}