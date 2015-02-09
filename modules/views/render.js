import { makeSprite, wrapText } from '../text';

var messageGeometry = new THREE.BoxGeometry(100, 30, 1);

var color = SubUnit.cache(10, function (color) {
  return new THREE.MeshPhongMaterial({color: color});
});

var text = SubUnit.cache(100, wrapText);

export function renderMessages() {
  var msgWidth = 1800;

  var data = this.state;

  var messages = this.root.selectAll("message.node")
    .data(data.messages, function (d) { return d.id; })

  messages.selectAll("backing.inner")
    .attr("material", color('#fff'));

  messages.each(function (d, i) {
    this.position.set(200, 375 - (i * 120), 0);
  });

  var nodes = messages.enter()
    .append("object")
    .attr("tags", "message node")
    .each(function (d, i) {
      this.position.set(200, 375 - (i * 120), 0);
      this.scale.set(0.75, 0.75, 0.75);
    });

  nodes.append("mesh")
    .attr("tags", "message text")
    .each(function (d) {
      var image = text(d.text, "#000", 50, msgWidth);
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
      var image = text(d3.time.format("%X %p")(d.date), "grey", 30, msgWidth);
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
    .attr("material", color('#ccf'))
    .each(function (d, i) {
      this.position.set(0, 0, 498);
      this.scale.set(11, 5, 1);
    });

  nodes.append("mesh")
    .attr("tags", "message backing inner")
    .attr("geometry", messageGeometry)
    .attr("material", color('#efefff'))
    .each(function (d, i) {
      this.position.set(0, 0, 499);
      this.scale.set(10.9, 4.8, 1);
    });

  messages
    .exit().remove();

}