// window.World contains the World object that can be used to access stuff:
// World.camera
// World.scene
// World.renderer
// World.orbit
// World.camera
// World.lights
// World.gui
// World.controls <= use this to access current values set via gui

// window.THREE is where your THREE.js library is.
// window.scene is your shortcut to the scene object.

/** ALL RIGHT AND THIS IS YOUR PLAYGROUND. HAVE FUN **/

const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0x22EF66, specular: 0xEFEFEF });
const cubeMesh = new THREE.Mesh(geometry, material);

cubeMesh.position.y = 1;

scene.add(cubeMesh);

animate(World => {
  // this will be called before rendering each animation frame.
  // apply your per-frame animations here.

  cubeMesh.rotation.y += 0.01;
});
