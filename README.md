This is a simple starter template for a three.js project. Here's what it does:

- Sets up a camera, scene, and renderer;
- Adjusts things automatically when window resizes;
- Optionally adds some lights;
- Optionally adds a grid helper;
- Lets you add orbit or drag controls;
- Lets you add dat.gui for dynamically adjusting values on your scene;
- Automatically exports THREE and scene for use with the [Three.js inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en) Chrome extension.

In other words, all the tedious stuff that you are bored of doing every time 
when starting with a new three.js scene.

## Install

```shell script
git clone git@github.com:neskodi/threejs-boilerplate
cd threejs-boilerplate
npm i
```

Navigate to your index.html in the browser and you should see stuff. 

You can also serve it via a local server:

```shell script
npm run serve
```

If you change something in the src folder, you should rebuild it:

```shell script
npm run build
```

If you are constantly playing with the src folder, you can have webpack watch for
the changes automatically with

```shell script
npm run watch
```

## Configure

At the top of index.html there's an object with configuration options. 
Tweak it to your needs. 
Example (and default) values for all supported options are listed below.  
 
```javascript
const threeJsOptions = {
        antialias: true,
        lights: true,
        cameraPosition: [0, 5, 5],
        cameraLookAt: [0, 0, 0],

        // scene background color
        backgroundColor: 0xECECEC,

        // whether to show the plane grid helper
        grid: true,

        // whether to enable camera orbiting controls
        orbit: true,
  
        // whether to enable object dragging controls
        drag: false,
  
        // whether to enable gui controls and what to put there
        gui: false
}
```

#### Lights

Lights can be specified as true (by default it's an ```AmbientLight(0xffffff, 1)```),
false (no lights by default), or a function that will return the needed lights.
You may return a single light object, or an array of light objects.
Example:

```javascript
const threeJsOptions = {
  // ...
  lights: THREE => {
    return [
      new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 8),
      new THREE.DirectionalLight(0xffffff, 1)
    ];
  }
  // ...
}
```

All lights created here will be accessible as World.lights in your scripts.js. 

#### Grid

Setting ```grid``` to true creates a 10x10 grid, but you can pass your own 
dimensions as well:

```javascript
const threeJsOptions = {
  // ...
  grid: [100, 100]
  // ...
}
```

#### Drag

Setting to true will enable dragging objects across the scene. In order for an
Object3D to be draggable it needs to be added to World.draggableObjects array:

- in index.html:
```javascript
const threeJsOptions = {
  // ...
  drag: true
  // ...
}
```

- then in scripts.js:

```javascript
World.draggableObjects.push(someMesh);
```

Note that you don't normally want to enable both orbit and drag at the same time,
because they both will react to your mouse movement, and the result will be messy.

#### Gui

Bundled dat.gui enables you to use visual controls to change values and react to
changes in your scene. A simple example adds a slider from 1 to 100:

- in index.html:
```javascript
const threeJsOptions = {
  // ...
  gui: {
   values: {
     rotate: 50
   },
   setup: (gui, controls) => {
     gui.add(controls, 'rotate').min(1).max(180);
   }
 }
  // ...
}
```

- then in scripts.js:

```javascript
const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0x22EF66, specular: 0xEFEFEF });
const cubeMesh = new THREE.Mesh(geometry, material);

scene.add(cubeMesh);

animate(World => {
  cubeMesh.rotation.y = THREE.MathUtils.degToRad(World.controls.rotate);
});
```

Read more about dat.gui [here](https://github.com/dataarts/dat.gui).

## Work

After the scene has been configured to your liking, you are welcome to go ahead
and do your own stuff in scripts.js.

There are objects that are exported globally for convenience. They are available
under the ```window``` namespace.

- ```THREE```: the entire three.js library.
- ```World```: the World object that stores the camera, renderer, scene, configured lights,
controls, etc.
- ```scene```: the scene

#### Animation

The ```animate``` helper function is available globally. Implicitly, it calls
World.animate(). Pass a callback if you want to execute something before each
animation frame is rendered. The callback will receive the entire World as its 
argument.  

#### Using three.js inspector Chrome extension

If installed, 
[Three.js inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en) 
will start automatically, because ```window.THREE``` and ```window.scene``` are exported 
when the World starts. 
