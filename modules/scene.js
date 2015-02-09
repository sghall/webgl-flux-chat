
var canvas = d3.select("body").append("canvas")
  .attr("width", window.innerWidth)
  .attr("height", window.innerHeight)
  .style("position", "absolute")
  .style("top", "0px")
  .style('z-index', -1);

canvas.node().getContext("webgl");

export var renderer = new THREE.WebGLRenderer({canvas: canvas.node(), antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 2000;

export var scene = new THREE.Scene();

var light = new THREE.HemisphereLight('#ffffff', '#666666', 1.5);
light.position.set(0, 3000, 0);
scene.add(light);
