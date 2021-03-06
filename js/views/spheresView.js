import { scene } from '../scene';

export var spheresView = SubUnit.createView(scene, {
  render: function () {
    this.root.node().position.set(0, 0, 500)

    this.root.append("mesh")
      .attr("material", new THREE.MeshPhongMaterial({color: '#343838', shininess: 100}))
      .attr("geometry", new THREE.SphereGeometry(60, 30, 30))
      .each(function () {
        this.position.set(400, 100, 0);
      })

    this.root.append("mesh")
      .attr("material", new THREE.MeshPhongMaterial({color: '#005F6B', shininess: 100}))
      .attr("geometry", new THREE.SphereGeometry(60, 30, 30))
      .each(function () {
        this.position.set(-400, 100, 0);
      })
  }
});