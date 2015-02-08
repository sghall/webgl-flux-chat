import { makeSprite, wrapText } from '../text';

var messageGeometry = new THREE.BoxGeometry(1, 1, 1);

var color = SubUnit.memoize(function (color) {
  return new THREE.MeshPhongMaterial({color: color});
});

var text = SubUnit.cache(100, wrapText);

export function renderMessages() {
  var msgWidth = 1050;

  var messages = this.root.selectAll("message.node")
    .data(this.state.messages, function (d) { return d.id; })

  messages.selectAll("backing.inner")
    .attr("material", color('#fff'));

  messages.each(function (d, i) {
    this.position.set(275, 500 - (i * 150), 0);
  });

  var nodes = messages.enter()
    .append("object")
    .attr("tags", "message node")
    .each(function (d, i) {
      this.position.set(275, 500 - (i * 150), 0);
    });

  nodes.append("mesh")
    .attr("tags", "message text")
    .each(function (d) {
      var image = text(d.text, "#222", 18, msgWidth);
      this.material = new THREE.MeshBasicMaterial({
        map: image.map, 
        transparent: true
      });
      this.geometry = new THREE.PlaneBufferGeometry(msgWidth, image.height);
      this.scale.set(0.9, 0.75, 1)
      this.position.set(-50, -25, 0);
    });

  nodes.append("mesh")
    .attr("tags", "message backing outer")
    .attr("geometry", messageGeometry)
    .attr("material", color('#ccf'))
    .each(function (d, i) {
      this.scale.set(1100, 145, -2)
    });

  nodes.append("mesh")
    .attr("tags", "message backing inner")
    .attr("geometry", messageGeometry)
    .attr("material", color('#efefff'))
    .each(function (d, i) {
      this.scale.set(1100 - 6, 145 - 6, -1)
    });

  messages
    .exit().remove();
}