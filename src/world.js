import * as THREE from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {GUI} from "dat.gui";

export default class World {
  constructor(options) {
    this.options = {
      ...this.defaultOptions(),
      ...(('object' === typeof options) ? options : {})
    }

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initGridHelper();
    this.initOrbitControls();
    this.initDragControls();
    this.initGui();
    this.exportToWindow();
  }

  defaultOptions() {
    return {
      antialias: true,
      lights: true,
      cameraPosition: [0, 5, 5],
      cameraLookAt: [0, 0, 0],
      backgroundColor: 0xECECEC,
      grid: true,
      orbit: true,

      // you don't want to enable both drag and orbit at the same time
      drag: false,

      gui: false
    }
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.options.backgroundColor);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(...this.options.cameraPosition);
    this.camera.lookAt(new THREE.Vector3(...this.options.cameraLookAt));
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: !!this.options.antialias });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.adjustOnResize();
  }

  adjustOnResize() {
    // adjust the renderer and the camera on window resize event
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  initLights() {
    this.lights = [];

    if (true === this.options.lights) {
      this.lights.push(new THREE.AmbientLight(0xffffff, 1));
    } else if ('function' === typeof this.options.lights) {
      let l = this.options.lights(THREE);
      this.lights = (Array.isArray(l)) ? l : [l];
    }

    for (let l of this.lights) {
      this.scene.add(l);
    }
  }

  initGridHelper() {
    if (true === this.options.grid) {
      this.scene.add(new THREE.GridHelper(10, 10));
    } else if (Array.isArray(this.options.grid)) {
      this.scene.add(new THREE.GridHelper(...this.options.grid));
    }
  }

  initOrbitControls() {
    if (this.options.orbit) {
      this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }

  initDragControls() {
    this.draggableObjects = [];

    if (this.options.drag) {
      // don't forget to push your objects to World.draggableObjects
      new DragControls(this.draggableObjects, this.camera, this.renderer.domElement);
    }
  }

  initGui() {
    if ('object' === typeof this.options.gui) {
      this.gui = new GUI();
      this.controls = ('object' === typeof this.options.gui.values)
        ? this.options.gui.values
        : {};

      this.gui.remember(this.controls);

      if ('function' === typeof this.options.gui.setup) {
        this.options.gui.setup(this.gui, this.controls);
      }
    }
  }

  animate(callback) {
    requestAnimationFrame(() => {
      this.animate(callback)
    });

    if ('function' === typeof callback) {
      callback(this);
    }

    if (this.orbit) {
      this.orbit.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  exportToWindow() {
    window.THREE = THREE;
    window.scene = this.scene;
    window.World = this;
  }
};
