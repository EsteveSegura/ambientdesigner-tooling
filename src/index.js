import {Sound} from './domain/sound';
import {Space} from './domain/space';
import {ScreenDebugger} from './domain/ScreenDebugger.js';

const space = new Space();

window.screenLogger = {
  loggers: [],
  position: {x: 30, y: 40}
}

const currentSounds = []
let selected = null;
const soundOptions = {
  options: ['PickOne'],
  addSound: () => {
    const selectedSound = sounds.filter(sound => sound.name === selected)[0]
    currentSounds.push(new Sound(selectedSound))
  },
}
const sounds = [
  {
    src: './sounds/wind.ogg',
    name: 'Wind',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/catpurring.ogg',
    name: 'CatPurring',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/waves.ogg',
    name: 'Waves',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/underwater.ogg',
    name: 'UnderWater',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/train.ogg',
    name: 'Train',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/slowheartbeat.ogg',
    name: 'SlowHeartBeat',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/sea.ogg',
    name: 'Sea',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/rain.ogg',
    name: 'Rain',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/peoplebackground.ogg',
    name: 'PeopleBackground',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/owls.ogg',
    name: 'Owls',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/keyboard.ogg',
    name: 'Keyboard',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/industrialfan.ogg',
    name: 'IndustrialFan',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/footstepssnow.ogg',
    name: 'FootStepSnow',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/firecraking.ogg',
    name: 'FireCracking',
    autoplay: true,
    position: {x: 0, y: 5, z: -2},
    startAt: 0,
    space,
  },
  {
    src: './sounds/rainforestumbrella.ogg',
    name: 'RainForesUmbrella',
    autoplay: true,
    position: {x: 14, y: 0, z: -5},
    startAt: 20,
    space,
  },
  {
    src: './sounds/thunder.ogg',
    name: 'Thunder',
    autoplay: true,
    position: {x: 0, y: 14, z: -20},
    space,
  },
  {
    src: './sounds/rainOutside.ogg',
    name: 'RainOutside',
    autoplay: true,
    position: {x: 0, y: 4, z: 0},
    volume: 0.8,
    space,
  }
]
space.datgui.add(soundOptions, 'options', [
  'RainForesUmbrella',
  'Thunder',
  'RainOutside',
  'Wind',
  'Waves',
  'UnderWater',
  'Train',
  'SlowHeartBeat',
  'Sea',
  'CatPurring',
  'Rain',
  'PeopleBackground',
  'Owls',
  'Keyboard',
  'IndustrialFan',
  'FootStepSnow',
  'FireCracking',

]).onChange((s) => selected = s);
space.datgui.add(soundOptions, 'addSound');


/*
const rainOne = new Sound({
  src: './public/sounds/rainforestumbrella.ogg',
  name: 'RainForesUmbrella',
  autoplay: true,
  position: {x: 14, y: 0, z: -5},
  startAt: 20,
  space,
});
const rainTwo = new Sound({
  src: './public/sounds/rainforestumbrella.ogg',
  name: 'RainForesUmbrella',
  autoplay: true,
  position: {x: -8, y: 0, z: 7},
  space,
});
const thunder = new Sound({
  src: './public/sounds/thunder.ogg',
  name: 'Thunder',
  autoplay: true,
  position: {x: 0, y: 14, z: -20},
  space,
});
const rainCar = new Sound({
  src: './public/sounds/rainOutside.ogg',
  name: 'RainOutside',
  autoplay: true,
  position: {x: 0, y: 4, z: 0},
  volume: 0.8,
  space,
});
*/

