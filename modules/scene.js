
export var canvas = d3.select("body").append("canvas")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  .style("position", "absolute")
  .style("top", "0px")
  .style('z-index', -1);

canvas.node().getContext("webgl");

var renderer = new THREE.WebGLRenderer({canvas: canvas.node(), antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.z = 1000;

export var scene = new THREE.Scene();

var light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
light.position.set(0, 3000, 0);
scene.add(light);

// var stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.bottom = '45px';
// document.body.appendChild(stats.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  // stats.update();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();