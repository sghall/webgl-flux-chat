import { wrapText, color, text } from '../utils';

var threadGeometry = new THREE.BoxGeometry(100, 30, 5);

export function renderThreads() {

  console.log("threads!!", this.state);
  var msgWidth = 800;

  var data = this.state;

  var threads = this.root.selectAll("thread.node")
    .data(data.threads, function (d) { return d.id; })

  threads.selectAll("backing.inner")
    .attr("material", function (d) {
      if (d.id === data.currentThreadID) {
        return color('#ccf');
      }
      return color("#fff");
    });

  threads.each(function (d, i) {
    new TWEEN.Tween(this.position)
      .easing(TWEEN.Easing.Cubic.InOut)
      .to({y: 375 - (i * 120)}, 400)
      .start();
  });

  var nodes = threads.enter()
    .append("object")
    .attr("tags", "thread node")
    .each(function (d, i) {
      this.rotation.set(0, 0, Math.PI);
      this.position.set(-400, 375 - (i * 120), 0);
      this.scale.set(0.75, 0.01, 0.75);

      new TWEEN.Tween(this.rotation)
        .easing(TWEEN.Easing.Cubic.InOut)
        .to({z: 0}, 500)
        .start();

      new TWEEN.Tween(this.scale)
        .easing(TWEEN.Easing.Cubic.InOut)
        .delay(400)
        .to({y: 0.75}, 300)
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
      var image = text(d.name, "#66c", 31, msgWidth);
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
      var image = text(time, "#241F2B", 30, msgWidth);
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
    .attr("material", color('#483C58'))
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
      this.scale.set(4.9, 4.8, 1);
    });

  threads.exit().remove();

}