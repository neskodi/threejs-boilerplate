/** ALL RIGHT AND THIS IS YOUR PLAYGROUND. HAVE FUN **/

const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
const cubeMesh = new THREE.Mesh(geometry, material);

cubeMesh.position.y = 1;
cubeMesh.name = 'Nice black box';

scene.add(cubeMesh);

// You must call either animate() or render() in the end, or the scene won't appear.
animate(() => {
  // this will be called before rendering each animation frame.
  // apply your per-frame animations here.

  cubeMesh.rotation.y += 0.01;
});


