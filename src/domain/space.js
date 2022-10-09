import * as THREE from 'three';
import {GUI} from 'dat.gui'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

export class Space {
  constructor() {
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.datgui = null;
    this.init();
  }

  _createScene() {
    this.scene = new THREE.Scene();
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor("#e5e5e5");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 15;
    this.camera.position.y = 4;
    this.camera.lookAt(0, 0, 0);
  }

  _createListener() {
    const loader = new OBJLoader();

    loader.load('./models/head.obj', (object) => {
      object.scale.set(0.1, 0.1, 0.1)
      object.rotation.set(0, 3.1, 0);
      this.scene.add(object);
    });

    const listenerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const listenerMaterial = new THREE.MeshLambertMaterial({color: 0xfcba03});
    const listenerMesh = new THREE.Mesh(listenerGeometry, listenerMaterial);

    this.scene.add(listenerMesh);
  }

  _createLigths() {
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(ambientLight);

    const hemiSphere = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.8);
    hemiSphere.position.y = -2
    this.scene.add(hemiSphere);

    const hemiSphereHelper = new THREE.HemisphereLightHelper(hemiSphere, 5);
    this.scene.add(hemiSphereHelper);
  }

  _createGridHelper() {
    const size = 20;
    const divisions = 50;

    const gridHelper = new THREE.GridHelper(size, divisions, 0x0000ff, 0x808080);
    gridHelper.position.y = -0.5;
    this.scene.add(gridHelper);
  }

  _createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(25);
    this.scene.add(axesHelper)
  }

  _createDebugGui() {
    this.datgui = new GUI()
    this.datgui.addFolder('Camera')
    this.datgui.add(this.camera.position, 'x', -100, 100, 0.01).onChange(() => this.camera.lookAt(0, 0, 0)).listen();
    this.datgui.add(this.camera.position, 'y', -100, 100, 0.01).onChange(() => this.camera.lookAt(0, 0, 0)).listen();
    this.datgui.add(this.camera.position, 'z', -100, 100, 0.01).onChange(() => this.camera.lookAt(0, 0, 0)).listen();
    this.datgui.open()
  }

  init() {
    this._createScene();
    this._createRenderer();
    this._createCamera();
    this._createDebugGui();
    this._createListener();
    this._createGridHelper();
    this._createAxesHelper();
    this._createLigths();

    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;

      this.camera.updateProjectionMatrix();
    })

    this.render();
  }

  toScreenPosition(obj) {
    const vector = new THREE.Vector3();

    const widthHalf = 0.5 * this.renderer.domElement.width;
    const heightHalf = 0.5 * this.renderer.domElement.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
      x: vector.x,
      y: vector.y
    };
  }

  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }
}
