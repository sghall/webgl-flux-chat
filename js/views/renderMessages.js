import { wrapText } from '../utils';

var messageGeometry = new THREE.BoxGeometry(100, 30, 5);

var color = SubUnit.cache(10, function (color) {
  return new THREE.MeshPhongMaterial({color: color});
});

var text = SubUnit.cache(100, wrapText);

export function renderMessages() {
  var msgWidth = 1800;

  var data = this.state;
  var list = data.messages.reverse().slice(0, 6).sort(function (a, b) {
    return a.date > b.date;
  });

  var messages = this.root.selectAll("message.node")
    .data(list, function (d) { return d.id; })

  messages.selectAll("backing.inner")
    .attr("material", color('#fff'));

  messages.each(function (d, i) {
    new TWEEN.Tween(this.position)
      .easing(TWEEN.Easing.Cubic.InOut)
      .to({y: 375 - (i * 120)}, 400)
      .start();
  });

  var nodes = messages.enter()
    .append("object")
    .attr("tags", "message node")
    .each(function (d, i) {
      this.rotation.set(0, 0, Math.PI);
      this.position.set(200, 375 - (i * 120), 0);
      this.scale.set(0.75, 0.01, 0.75);

      new TWEEN.Tween(this.rotation)
        .easing(TWEEN.Easing.Cubic.InOut)
        .to({z: 0}, 500)
        .start();

      new TWEEN.Tween(this.scale)
        .easing(TWEEN.Easing.Cubic.InOut)
        .delay(400)
        .to({y: 0.75}, 200)
        .start();
    });

  nodes.append("mesh")
    .attr("tags", "message text")
    .each(function (d) {
      var image = text(d.text, "#333", 50, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.scale.set(0.6, 0.6, 1);
      this.position.set(10, -25, 500);
    });

  nodes.append("mesh")
    .attr("tags", "message author")
    .each(function (d) {
      var image = text(d.authorName, "#66c", 31, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.position.set(370, 28, 500);
    });

  nodes.append("mesh")
    .attr("tags", "message time")
    .each(function (d) {
      var image = text(d3.time.format("%X %p")(d.date), "#241F2B", 30, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.scale.set(0.75, 0.75, 0.75);
      this.position.set(1000, 30, 500);
    });

  nodes.append("mesh")
    .attr("tags", "message backing outer")
    .attr("geometry", messageGeometry)
    .attr("material", color('#483C58'))
    .each(function (d, i) {
      this.position.set(0, 0, 490);
      this.scale.set(11, 5, 1);
    });

  nodes.append("mesh")
    .attr("tags", "message backing inner")
    .attr("geometry", messageGeometry)
    .attr("material", color('#FFF'))
    .each(function (d, i) {
      this.position.set(0, 0, 495);
      this.scale.set(10.9, 4.8, 1);
    });

  messages.exit().remove();

}