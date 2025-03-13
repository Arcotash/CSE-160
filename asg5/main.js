import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';


// import * as THREE from './node_modules/three';
// import { OrbitControls } from './node_modules/three/addons/controls/OrbitControls.js';
// import {OBJLoader} from './node_modules/three/addons/loaders/OBJLoader.js';
// import {MTLLoader} from './node_modules/three/addons/loaders/MTLLoader.js';

const rtWidth = 512;
const rtHeight = 284;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

const rtFov = 75;
const rtAspect = rtWidth / rtHeight;
const rtNear = 0.1;
const rtFar = 5;
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
rtCamera.position.z = 2;
  
const rtScene = new THREE.Scene();
rtScene.background = new THREE.Color('red');

{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  rtScene.add(light);
}

// const boxWidth = 1;
// const boxHeight = 1;
// const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
 
function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});
 
  const cube = new THREE.Mesh(geometry, material);
  rtScene.add(cube);
 
  cube.position.x = x;
 
  return cube;
}
 
// const rtCubes = [
//   makeInstance(geometry, 0x44aa88,  0),
//   makeInstance(geometry, 0x8844aa, -2),
//   makeInstance(geometry, 0xaa8844,  2),
// ];


const clockFrameGeometry = new THREE.RingGeometry(1, 1.075, 64);
let clockFrame = makeInstance(clockFrameGeometry, 0x000000,  0);
//clockFrame.rotation.x = 90 * Math.PI/180;




const clockBaseGeometry = new THREE.CylinderGeometry(1, 1, 0.05);
let clockFace = makeInstance(clockBaseGeometry, 0xFFFFFF,  0);
clockFace.rotation.x = 90 * Math.PI/180;

const HOUR_HAND_LENGTH = 0.45;
const hourHandGeometry = new THREE.BoxGeometry(0.05, HOUR_HAND_LENGTH, 1);
hourHandGeometry.translate(0, -HOUR_HAND_LENGTH/2 * 0.94, 0);
let hourHand = makeInstance(hourHandGeometry, 0x000000,  0);

const MINUTE_HAND_LENGTH = HOUR_HAND_LENGTH * 1.25;
const minuteHandGeometry = new THREE.BoxGeometry(0.03, MINUTE_HAND_LENGTH, 1);
minuteHandGeometry.translate(0, -MINUTE_HAND_LENGTH/2 * 0.94, 0);
let minuteHand = makeInstance(minuteHandGeometry, 0x000000,  0);


const SECOND_HAND_LENGTH = HOUR_HAND_LENGTH * 1.50;
const secondHandGeometry = new THREE.BoxGeometry(0.02, SECOND_HAND_LENGTH, 1);
secondHandGeometry.translate(0, -SECOND_HAND_LENGTH/2 * 0.94, 0);
let secondHand = makeInstance(secondHandGeometry, 0xFF0000,  0);


/* ############################################################## */



const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true,});
renderer.shadowMap.enabled = true;

let camera = setupCamera();
const scene = new THREE.Scene();
{
  const color = 0xFF0000;  // white
  const near = 0;
  const far = 25;
  scene.fog = new THREE.Fog(color, near, far);
}
const loader = new THREE.TextureLoader();


// const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
// const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


// const rotatingcubes = [
//   makeInstance(geometry, 0x44aa88,  0),
//   makeInstance(geometry, 0x8844aa, -2),
//   makeInstance(geometry, 0xaa8844,  2),
// ];


// Create a light for our MeshPhongMaterial cubes.



const aLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(aLight);

// const dLight = new THREE.DirectionalLight(0xFFFFFF, 2);
// dLight.position.set(0, 10, 2);
// scene.add(dLight);

const pLight = new THREE.PointLight(0xFFFFFF, 150);
pLight.position.set(0, 10, 2);
scene.add(pLight);
pLight.castShadow = true;

const sLight = new THREE.SpotLight(0xFFFFFF, 300);
sLight.position.set(0, 10, 2);
sLight.target.position.set(0, 0, 2);
sLight.angle = 0.5; // Radians
scene.add(sLight);
scene.add(sLight.target);
sLight.castShadow = true;



createSkybox();

function createGround() {
  const planeSize = 4000;
  const texture = loader.load('resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
  mesh.receiveShadow = true;
}

createGround();




function createCouch() {
  const SEAT_WIDTH = 3; const SEAT_DEPTH = 1;
  const ARMREST_WIDTH = 0.5; 
  const BACKREST_WIDTH = SEAT_WIDTH + 2*ARMREST_WIDTH;

  const seatGeometry = new THREE.BoxGeometry(SEAT_WIDTH, 1, 1);
  let seat = createTexturedCube(seatGeometry, 'resources/images/couch_black_seat.jpg', 0);
  seat.position.set(0, 0.5, 5);

  console.log(seat.geometry.width);

  const armrestGeometry = new THREE.BoxGeometry(ARMREST_WIDTH, 1.5, 1);
  let leftArmrest = createColoredCube(armrestGeometry, 0x000000, 0);
  leftArmrest.position.set(-(SEAT_WIDTH + ARMREST_WIDTH)/2, 0.5, 5);

  let rightArmrest = createColoredCube(armrestGeometry, 0x000000, 0);
  rightArmrest.position.set((SEAT_WIDTH + ARMREST_WIDTH)/2, 0.5, 5);

  const backrestGeometry = new THREE.BoxGeometry(BACKREST_WIDTH, 3, 0.25);
  let backrest = createColoredCube(backrestGeometry, 0x000000, 0);
  backrest.position.set(0, 0.5, 5 + SEAT_DEPTH - (1 - backrestGeometry.parameters.depth)/2);

}
createCouch();


function createTV() {
  const LEG_RADIUS = 0.025; const LEG_HEIGHT = 0.2;

  const TABLE_TOP_WIDTH = 4; const TABLE_TOP_DEPTH = 1.25;
  const TABLE_TOP_HEIGHT = 0.075;

  const TABLE_SIDE_WIDTH = 0.05; const TABLE_SIDE_DEPTH = TABLE_TOP_DEPTH;
  const TABLE_SIDE_HEIGHT = 1;

  const TABLE_COLOR = 0x8B4513;

  const tableTopGeometry = new THREE.BoxGeometry(TABLE_TOP_WIDTH, TABLE_TOP_HEIGHT, TABLE_TOP_DEPTH);
    let tableBottom = createColoredCube(tableTopGeometry, TABLE_COLOR, 0);
      tableBottom.position.set(0, LEG_HEIGHT, 0);

    let tableTop = createColoredCube(tableTopGeometry, TABLE_COLOR, 0);
      tableTop.position.set(0, LEG_HEIGHT + TABLE_TOP_HEIGHT + TABLE_SIDE_HEIGHT, 0);

  const tableSideGeometry = new THREE.BoxGeometry(TABLE_SIDE_WIDTH,TABLE_SIDE_HEIGHT,TABLE_SIDE_DEPTH);
    let tableSideLeftmost = createColoredCube(tableSideGeometry, TABLE_COLOR, 0);
      tableSideLeftmost.position.set(-(TABLE_TOP_WIDTH/2 - TABLE_SIDE_WIDTH), LEG_HEIGHT + TABLE_TOP_HEIGHT/2 + TABLE_SIDE_HEIGHT/2, 0);

    let tableSideMiddle = createColoredCube(tableSideGeometry, TABLE_COLOR, 0);
      tableSideMiddle.position.set(-(TABLE_TOP_WIDTH/2 - TABLE_SIDE_WIDTH) * 0.4, LEG_HEIGHT + TABLE_TOP_HEIGHT/2 + TABLE_SIDE_HEIGHT/2, 0);

    let tableSideRightmost = createColoredCube(tableSideGeometry, TABLE_COLOR, 0);
      tableSideRightmost.position.set((TABLE_TOP_WIDTH/2 - TABLE_SIDE_WIDTH), LEG_HEIGHT + TABLE_TOP_HEIGHT/2 + TABLE_SIDE_HEIGHT/2, 0);

  const tableLegGeometry = new THREE.CylinderGeometry(LEG_RADIUS, LEG_RADIUS, LEG_HEIGHT);
    let tableLegCloseLeft = createColoredCube(tableLegGeometry, TABLE_COLOR, 0);
      tableLegCloseLeft.position.set(-(TABLE_TOP_WIDTH/2 - LEG_RADIUS - TABLE_SIDE_WIDTH/2), LEG_HEIGHT/2, TABLE_TOP_DEPTH/2 - LEG_RADIUS);

    let tableLegCloseRight = createColoredCube(tableLegGeometry, TABLE_COLOR, 0);
      tableLegCloseRight.position.set((TABLE_TOP_WIDTH/2 - LEG_RADIUS - TABLE_SIDE_WIDTH/2), LEG_HEIGHT/2, TABLE_TOP_DEPTH/2 - LEG_RADIUS);

    let tableLegFarLeft = createColoredCube(tableLegGeometry, TABLE_COLOR, 0);
     tableLegFarLeft.position.set(-(TABLE_TOP_WIDTH/2 - LEG_RADIUS - TABLE_SIDE_WIDTH/2), LEG_HEIGHT/2, -(TABLE_TOP_DEPTH/2 - LEG_RADIUS));

    let tableLegFarRight = createColoredCube(tableLegGeometry, TABLE_COLOR, 0);
     tableLegFarRight.position.set((TABLE_TOP_WIDTH/2 - LEG_RADIUS - TABLE_SIDE_WIDTH/2), LEG_HEIGHT/2, -(TABLE_TOP_DEPTH/2 - LEG_RADIUS));

  const TV_BASE_WIDTH = 0.5; const TV_BASE_HEIGHT = 0.05; const TV_BASE_DEPTH = 0.175;
  const TV_BASE_POSITION_HEIGHT = LEG_HEIGHT + TABLE_TOP_HEIGHT + TABLE_SIDE_HEIGHT + TV_BASE_HEIGHT;
  const TV_BASE_ANGLE = 40;

  const tvBaseMiddleGeometry = new THREE.BoxGeometry(TV_BASE_WIDTH, TV_BASE_HEIGHT, TV_BASE_DEPTH);
    let tvBaseMiddle = createColoredCube(tvBaseMiddleGeometry, 0xAAAAAA, 0);
      tvBaseMiddle.position.set(0, TV_BASE_POSITION_HEIGHT, 0);
    
    let tvBaseLeft = createColoredCube(tvBaseMiddleGeometry, 0xAAAAAA, 0);
    tvBaseLeft.position.set(Math.cos(TV_BASE_ANGLE) * TV_BASE_WIDTH + 0.05, TV_BASE_POSITION_HEIGHT, Math.sin(TV_BASE_ANGLE) * TV_BASE_WIDTH/2);
    tvBaseLeft.rotation.y = Math.sin(TV_BASE_ANGLE);

  const TV_COLUMN_RADIUS = 0.03;
  const TV_COLUMN_HEIGHT = 0.2;
  const tvColumnGeometry = new THREE.CylinderGeometry(TV_COLUMN_RADIUS, TV_COLUMN_RADIUS, TV_COLUMN_HEIGHT);
  let tvColumn = createColoredCube(tvColumnGeometry, 0xAAAAAA, 0);
  tvColumn.position.set(0, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT/2 + TV_BASE_HEIGHT/2, 0);

  const TV_FRAME_BOTTOM_WIDTH = 4.5;
  const TV_FRAME_BOTTOM_HEIGHT = 0.04;
  const TV_FRAME_BOTTOM_DEPTH = 0.1;

  const TV_FRAME_SIDE_WIDTH = TV_FRAME_BOTTOM_HEIGHT;
  const TV_FRAME_SIDE_HEIGHT = 2.5;
  const TV_FRAME_SIDE_DEPTH = 0.1;

  const tvFrameBottomGeometry = new THREE.BoxGeometry(TV_FRAME_BOTTOM_WIDTH, TV_FRAME_BOTTOM_HEIGHT, TV_FRAME_BOTTOM_DEPTH);
    let tvFrameBottom = createColoredCube(tvFrameBottomGeometry, 0x000000, 0);
      tvFrameBottom.position.set(0, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2, 0);

      let tvFrameTop = createColoredCube(tvFrameBottomGeometry, 0x000000, 0);
      tvFrameTop.position.set(0, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2 + TV_FRAME_BOTTOM_HEIGHT/2 + TV_FRAME_SIDE_HEIGHT, 0);

  const tvFrameSideGeometry = new THREE.BoxGeometry(TV_FRAME_SIDE_WIDTH, TV_FRAME_SIDE_HEIGHT, TV_FRAME_SIDE_DEPTH);
    let tvFrameSideLeft = createColoredCube(tvFrameSideGeometry, 0x000000, 0);
    tvFrameSideLeft.position.set(TV_FRAME_BOTTOM_WIDTH/2 - TV_FRAME_SIDE_WIDTH/2, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2 + TV_FRAME_BOTTOM_HEIGHT/2 + TV_FRAME_SIDE_HEIGHT/2, 0);

    let tvFrameSideRight = createColoredCube(tvFrameSideGeometry, 0x000000, 0);
    tvFrameSideRight.position.set(-(TV_FRAME_BOTTOM_WIDTH/2 - TV_FRAME_SIDE_WIDTH/2), TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2 + TV_FRAME_BOTTOM_HEIGHT/2 + TV_FRAME_SIDE_HEIGHT/2, 0);


    const material = new THREE.MeshPhongMaterial({
      map: renderTarget.texture,
    });
  const tvScreenGeometry = new THREE.BoxGeometry(TV_FRAME_BOTTOM_WIDTH - TV_FRAME_BOTTOM_HEIGHT, TV_FRAME_SIDE_HEIGHT, TV_FRAME_SIDE_DEPTH - 0.01);
    let tvScreen = new THREE.Mesh(tvScreenGeometry, material);
    scene.add(tvScreen);
    tvScreen.position.set(0, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2 + TV_FRAME_BOTTOM_HEIGHT/2 + TV_FRAME_SIDE_HEIGHT/2, 0);
    tvScreen.castShadow = true;

    let tvBack = createColoredCube(tvScreenGeometry, 0x000000, 0);
    tvBack.position.set(0, TV_BASE_POSITION_HEIGHT + TV_COLUMN_HEIGHT + TV_BASE_HEIGHT/2 + TV_FRAME_BOTTOM_HEIGHT/2 + TV_FRAME_SIDE_HEIGHT/2, -0.01);

}
createTV();

// {
//   const objLoader = new OBJLoader();
// const mtlLoader = new MTLLoader();
// mtlLoader.load('resources/models/indoor plant_02_obj/indoor plant_02.mtl', (mtl) => {
//   mtl.preload();
//   objLoader.setMaterials(mtl);
//   objLoader.load('resources/models/indoor plant_02_obj/indoor plant_02.obj', (root) => {
//     scene.add(root);
//   });
// });
// }



{

  const mtlLoader = new MTLLoader();
  mtlLoader.load( 'resources/models/indoor plant_02_obj/indoor_plant_02.mtl', ( mtl ) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials( mtl );
    objLoader.load( 'resources/models/indoor plant_02_obj/indoor_plant_02.obj', ( root ) => {
      root.translateX(-4);
      root.scale.set(.5,.5,.5);
      scene.add( root );

    } );

  } );

}

// {
//   const objLoader = new OBJLoader();
//   objLoader.load('resources/models/indoor plant_02_obj/indoor plant_02.obj', (root) => {
//     scene.add(root);
//   });
// }




//let texturedCube = createTexturedCube(geometry, 'resources/images/wall.jpg', 0);
//let texturedCube = createColoredCube(geometry, 0xFFFFFF, 0);



function render(time) {
  time *= 0.001;  // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // cubes.forEach((cube, ndx) => {
  //   const speed = 1 + ndx * .1;
  //   const rot = time * speed;
  //   cube.rotation.x = rot;
  //   cube.rotation.y = rot;
  // });

  


  // texturedCube.rotation.x += 0.01;
  // texturedCube.rotation.y += 0.01;

  // rtCubes.forEach((cube, ndx) => {
  //   const speed = 1 + ndx * .1;
  //   const rot = time * speed;
  //   cube.rotation.x = rot;
  //   cube.rotation.y = rot;
  // });

  const rot_speed = 0.000001;
  hourHand.rotation.z -= rot_speed;
  minuteHand.rotation.z -= rot_speed * 60;
  secondHand.rotation.z -= rot_speed * 360;
 
  // draw render target scene to render target
  renderer.setRenderTarget(renderTarget);
  renderer.render(rtScene, rtCamera);
  renderer.setRenderTarget(null);
        // rotate the cube in the scene
        // cube.rotation.x = time;
        // cube.rotation.y = time * 1.1;


  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

/* ############################################################################## */
/* ############################################################################## */
/* ############################################################################## */
/* ############################################################################## */

// const boxWidth = 1; const boxHeight = 1; const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function setupCamera() {
  const FOV = 80; const ASPECT_RATIO = 2; const NEAR_DIST = 0.1; const FAR_DIST = 100;
  const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR_DIST, FAR_DIST);

  camera.position.y = 3;
  camera.position.z = 7;

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 2, 1);
  controls.update();
  
  return camera;
}



export function loadColorTexture( path ) {
  const texture = loader.load( path );
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBox(geometry, material, x) {
  const box = new THREE.Mesh(geometry, material);
  box.castShadow = true;
  scene.add(box);
  box.position.x = x;

  return box;
}

export function createColoredCube(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({color});
 
  return createBox(geometry, material, x);
}

export function createTexturedCube(geometry, image_path, x) {
  const texture = loadColorTexture(image_path);
  const material = new THREE.MeshPhongMaterial({map : texture});
  
  return createBox(geometry, material, x);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }

  return needResize;
}


function createSkybox() {
  const texture = loader.load(
    'resources/images/industrial_sunset_02.jpg',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    }
  );
}