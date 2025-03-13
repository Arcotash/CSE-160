import * as THREE from 'three';
const loader = new THREE.TextureLoader();
export function loadColorTexture( path ) {
  const texture = loader.load( path );
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createBox(geometry, material, x) {
  const box = new THREE.Mesh(geometry, material);
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
