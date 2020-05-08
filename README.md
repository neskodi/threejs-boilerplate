This is a simple starter template for a three.js project. Here's what it does:

- Pulls in the latest version of three.js;
- Sets up a camera, scene, and renderer;
- Adjusts things automatically when window resizes;
- Optionally adds some lights;
- Optionally adds a grid helper;
- Lets you add orbit or drag controls;
- Lets you add dat.gui for dynamically adjusting values on your scene;
- Automatically exports THREE and scene for use with the [Three.js inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en) Chrome extension;
- Starts the render loop.

In other words, it does the boring stuff so you can do the cool stuff right away.

## Install

```shell script
git clone git@github.com:neskodi/threejs-boilerplate
cd threejs-boilerplate
npm i
```

Navigate to your index.html in the browser, and you should see a scene with a rotating cube.

That's all you need, you can start working with scripts.js from here, 
while the rest of this document describes advanced configurations and options.

## Use a local server

You can also serve it via a local server (starts an 
[http-server](https://www.npmjs.com/package/http-server) on localhost:8080):

```shell script
npm run serve
```

This might come in handy if you load external files like models or textures via URLs 
and your browser goes naughty. 

## Modify the boilerplate itself

If you change something in the src folder (although it's unlikely that you'll need to), 
rebuild it:

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
        cameraPosition: [0, 5, 5],
        cameraLookAt: [0, 0, 0],
        
        lights: true,
        lightPosition: [-200, 200, 200],

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

By default, the light is on, and it's a white directional light shining from -200, 200, 200.

If you need to adjust its position:

```javascript
const threeJsOptions = {
    // ...
    lightPosition: [100, 100, 100],
    // ...
}
```

Another option is to create a function that will return the needed lights.
You may return either a single light object, or an array of light objects.
Example:

```javascript
const threeJsOptions = {
  // ...
  lights: THREE => {
    return [
      new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 8),
      new THREE.DirectionalLight(0xffffff, 1)
    ];
  },
  // ...
}
```

In this case it is your responsibility to name your lights and adjust their positions.

All lights created here will be accessible as ```World.lights``` in your scripts.js.

You can also turn off all lighting by setting `lights` to false and then work with
your own lights as you see fit directly in scripts.js. 

#### Grid

Setting ```grid``` to true creates a 10x10 grid, but you can pass your own 
dimensions as well:

```javascript
const threeJsOptions = {
  // ...
  grid: [50, 50],
  // ...
}
```

#### Drag

Setting to true will enable dragging objects across the scene. In order for an
Object3D to be draggable it needs to be added to ```World.draggableObjects``` array:

-- in index.html:
```javascript
const threeJsOptions = {
  // ...
  drag: true,
  // ...
}
```

-- then in scripts.js:

```javascript
World.draggableObjects.push(someMesh);
```

Note that you don't normally want to enable both orbit and drag at the same time,
because they both will react to your mouse movement, and the result will be messy.
To disable orbit controls (they are enabled by default), set ```orbit``` to false.

#### Gui

Bundled dat.gui enables you to use visual controls to change values and react to
changes in your scene. A simple example adds a slider called "rotate" with a range
from 1 to 180:

-- in index.html:
```javascript
const threeJsOptions = {
  // ...
  gui: {
   controls: {
     rotate: 50
   },
   setup: (gui, controls) => {
     gui.add(controls, 'rotate').min(1).max(180);
   }
 },
  // ...
}
```

-- then in scripts.js you can access it as ```World.controls.rotate```. For example:

```javascript
const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0x22EF66, specular: 0xEFEFEF });
const cubeMesh = new THREE.Mesh(geometry, material);

scene.add(cubeMesh);

animate(() => {
  cubeMesh.rotation.y = THREE.MathUtils.degToRad(World.controls.rotate);
});
```

Read more about dat.gui [here](https://github.com/dataarts/dat.gui).

## Use

After the scene has been configured to your liking, just go ahead
and do your own stuff in scripts.js.

There are objects that are exported globally for convenience. They are available
under the ```window``` namespace.

- ```THREE```: the entire three.js library.
- ```World```: the World object that stores the camera, renderer, scene, configured lights,
controls, etc.
- ```scene```: the scene (same as ```World.scene```)

For example here's how you add a cube and start spinning it slowly:

-- scripts.js
```javascript
const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const material = new THREE.MeshPhongMaterial({ color: 0x333333 });
const cubeMesh = new THREE.Mesh(geometry, material);

cubeMesh.position.y = 1;

scene.add(cubeMesh);

animate(() => {
  cubeMesh.rotation.y += 0.01;
});
```

Note that you have to call either ```animate()``` or ```render()``` in the end 
for the scene to appear.

#### Render loop and animation

The ```animate``` helper function is available globally. Implicitly, it calls
```World.animate()```. Pass a callback if you want to execute something inside the render loop. 
The callback will be executed before each frame is rendered 
(remember that in most cases, it happens 60 times per second).

In order to render a static scene just once, without starting the render loop, call ```render()```
instead of ```animate()```. Note that in this case, no orbit, no drag, no gui, and no animation
will be possible. You are in fact just taking a photo. Like with ```animate()```, you may pass a
callback that will be executed once the render is done.

Either ```animate()``` or ```render()``` MUST be called for the scene to become visible.

#### Adding examples from the three library

Many features of three.js are not part of the core and have to be loaded separately. 
For instance, texture and object loaders, etc. More often than not, those are located 
in the "examples" folder of three.js source. 

Occasionally, you might want to add such a feature to your project. In this case,
all you need to do is just insert the respective script after the main.js is loaded,
pointing its ```src``` to its location inside the ```node_modules/three``` folder. 
After that, you can use the addon normally, via the THREE namespace.

The example below illustrates loading the GLTFLoader:

-- in index.html    
```html
<script src="dist/main.js"></script>
<script src="node_modules/three/examples/js/loaders/GLTFLoader.js"></script>
```

-- in scripts.js, after that:
```javascript
const gltfloader = new THREE.GLTFLoader();
```

#### Using the three.js inspector Chrome extension

If installed, 
[Three.js inspector](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi?hl=en) 
will pick things up automatically, because ```window.THREE``` and ```window.scene``` 
are exported when the World starts. 
