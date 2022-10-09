import {Howl} from 'howler';
import * as THREE from 'three';
import {OBJLoader} from "three/addons/loaders/OBJLoader.js";
import {Line} from './Line.js';
import {ScreenDebugger} from './ScreenDebugger';

export class Sound {
  constructor({src, startAt = null, autoplay = false, name = '', position = null, orientation = null, volume = 1, space = null}) {
    // Object
    this.id = Math.floor(Math.random() * 500000);
    this.name = name;

    //Sound
    this.sound = null;
    this.src = src;
    this.startAt = startAt;
    this.autoplay = autoplay;
    this.volume = volume;
    this.space = space;

    //Common
    this.position = {
      x: position?.x || 0,
      y: position?.y || 0,
      z: position?.z || 4,
    }

    this.orientation = {
      x: orientation?.x || 0,
      y: orientation?.y || 0,
      z: orientation?.z || 0
    }

    this.orbit = {
      angle: 0,
      radius: 4,
      inOrbit: false,
      speed: 1,
    }

    //3D
    this.speaker = null;
    this.isLoaded = false;
    this.axesHelper = new THREE.AxesHelper(2);


    //Loop
    this._refreshRatio = 50;

    //Debug
    this.gizmoLabel = null;
    this.gizmoDirection = null;
    this._debugStatus = true;
    this._debugUi = this.space.datgui.addFolder(`${this.src.split('/')[3]} #${this.id}`);
    this.screenLoggerInstance = null;


    this.init();
    this.loop();
    this._debugGui();
  }

  init() {
    //Audio
    this.sound = new Howl({src: [this.src], autoplay: this.autoplay, loop: true});

    setTimeout(() => {
/*      const node = this.sound._sounds[0]._node.bufferSource
      let context =  node.context;
      const lowpassNode = context.createBiquadFilter();
      lowpassNode.frequency.value = 5000;
      this.sound._sounds[0]._node.bufferSource.connect(lowpassNode);
      lowpassNode.connect(this.sound._sounds[0]._panner)
      this.sound._sounds[0]._panner.connect(context.destination)

      //lowpassNode.connect(context.destination)
      console.log('apply')*/

    }, 4000)

    if (this.startAt) {
      this.sound.seek(this.startAt);
    }

    this.sound.volume(this.volume);

    //Mesh
    const loader = new OBJLoader();
    loader.load('./models/speaker.obj', (object) => {
      this.speaker = object;
      this.speaker.scale.set(0.02, 0.02, 0.02)
      this.speaker.position.set(this.position.x, this.position.y, this.position.z)

      this.space.scene.add(object);
      this.space.scene.add(this.axesHelper)
      this.isLoaded = true

      this.gizmoLabel = new ScreenDebugger({
        position: this.space.toScreenPosition(this.speaker),
        payload: `${this.name}#${this.id}\r\n${JSON.stringify(this.position)}`,
      })
    });

    this.gizmoDirection = new Line({
      initialPos: new THREE.Vector3(0, 0, 0),
      targetPos: new THREE.Vector3(this.position.x, this.position.y, this.position.z),
      scene: this.space.scene
    })

    this.screenLoggerInstance = new ScreenDebugger({payload: `[INFO] Entity: Sound_${this.name} - id: ${this.id}`})
    window.screenLogger.loggers.push(this.screenLoggerInstance)

    // GUI POJOS
    this._DEBUG_UI_POJO = {orbit: false}
  }

  loop() {
    setInterval(() => {
      if (this.isLoaded) {
        //Set Position
        if (this.orbit.inOrbit) {
          this.setCircularMovement({increment: 1})
        }
        this.setPosition({});
        this.setOrientation({});
        this.sound.volume(this.volume)
        this.axesHelper.position.set(this.position.x, this.position.y, this.position.z);

        //GUI Direction
        this.gizmoDirection.update(
          new THREE.Vector3(this.orientation.x, this.orientation.y, this.orientation.z),
          new THREE.Vector3(this.position.x, this.position.y, this.position.z)
        );

        //GUI Label
        this.gizmoLabel.update({
          position: this.space.toScreenPosition(this.speaker),
          payload: `${this.name}#${this.id}\r\n${JSON.stringify(this.position)}`,
        })

        this._forceDebugUIRefresh()
        this._debug()
      }
    }, this._refreshRatio);
  }

  _debugGui() {
    this._debugUi.add(this.position, 'x', -25, 25, 0.000001).onChange((value) => this.position.x = value).name('position x').listen()
    this._debugUi.add(this.position, 'y', -25, 25, 0.000001).onChange((value) => this.position.y = value).name('position y').listen()
    this._debugUi.add(this.position, 'z', -25, 25, 0.000001).onChange((value) => this.position.z = value).name('position z').listen()
    this._debugUi.add(this, 'volume', 0, 1, 0.01).onChange((value) => this.volume = value).name('volume').listen()
    // this._debugUi.add(this.orientation, 'x', -360, 360, 0.000001).onChange((value) => this.orientation.x = value).listen()
    // this._debugUi.add(this.orientation, 'y', -360, 360, 0.000001).onChange((value) => this.orientation.y = value).listen()
    // this._debugUi.add(this.orientation, 'z', -360, 360, 0.000001).onChange((value) => this.orientation.z = value).listen()
    this._debugUi.add(this.orbit, 'inOrbit', false).onChange((value) => this.orbit.inOrbit = value).listen()
    this._debugUi.add(this.orbit, 'speed', -4, 4, 0.001).onChange((value) => this.orbit.speed = value).listen()
    this._debugUi.add(this.orbit, 'radius', 0, 25, 0.001).onChange((value) => this.orbit.radius = value).listen()

    this._debugUi.open()
  }

  setOrientation({x = this.orientation.x, y = this.orientation.y, z = this.orientation.z}) {
    this.orientation = {x, y, z};
    this.sound.orientation(this.orientation.x, this.orientation.y, this.orientation.z);

    this.speaker.lookAt(this.orientation.x, this.orientation.y, this.orientation.z);
  }

  setPosition({x = this.position.x, y = this.position.y, z = this.position.z, lookAt = null}) {
    this.position = {x, y, z};
    this.sound.pos(this.position.x, this.position.y, this.position.z);

    this.speaker.position.x = this.position.x
    this.speaker.position.y = this.position.y
    this.speaker.position.z = this.position.z

  }

  setCircularMovement() {
    this.orbit.angle = this.orbit.angle + this.orbit.speed;
    const x = this.orbit.radius * Math.sin(Math.PI * 2 * this.orbit.angle / 360);
    const z = this.orbit.radius * Math.cos(Math.PI * 2 * this.orbit.angle / 360);

    this.setPosition({x, z})
  }

  playSound() {
    this.sound.play();
  }

  _forceDebugUIRefresh() {
    //FORCE Update debug position
    for (let controller of this._debugUi.__controllers) {
      const isPosition = controller.__onChange.toString().includes('position');
      if (['x', 'y', 'z'].includes(controller.property) && isPosition) {
        controller.setValue(this.position[controller.property])
      }
    }
  }

  _debug() {
    if (this._debugStatus) {
      this.screenLoggerInstance.update({payload: `[INFO] Entity: Sound_${this.name} - id: ${this.id} # position: ${JSON.stringify(this.position)} # orbit: ${JSON.stringify(this.orbit)} `})
    }
  }
}
