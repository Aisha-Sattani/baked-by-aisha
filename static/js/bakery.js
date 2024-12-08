import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F5); // Subtle light pink

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('threejs-container').appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 5);
spotLight.position.set(20, 10, -5);
spotLight.target.position.set(0, 1, -5);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.decay = 1.5;
spotLight.distance = 50;
scene.add(spotLight);
scene.add(spotLight.target);

// Floor
const floorTexture = new THREE.TextureLoader().load('static/img/floor_tiles_06_diff_4k.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(6, 6);

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorGeometry = new THREE.PlaneGeometry(40, 40);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Walls
const textureLoader = new THREE.TextureLoader();

const wallBaseColor = textureLoader.load('static/img/textures/Tiles008_4K-JPG_Color.jpg');
const wallNormalMap = textureLoader.load('static/img/textures/Tiles008_4K-JPG_NormalGL.jpg');
const wallRoughnessMap = textureLoader.load('static/img/textures/Tiles008_4K-JPG_Roughness.jpg');
const wallAoMap = textureLoader.load('static/img/textures/Tiles008_4K-JPG_AmbientOcclusion.jpg');
const wallDisplacementMap = textureLoader.load('static/img/textures/Tiles008_4K-JPG_Displacement.jpg');

[wallBaseColor, wallNormalMap, wallRoughnessMap, wallAoMap, wallDisplacementMap].forEach((map) => {
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 6);
  map.minFilter = THREE.LinearMipMapLinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.anisotropy = 16;
});

const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallBaseColor,
  normalMap: wallNormalMap,
  roughnessMap: wallRoughnessMap,
  aoMap: wallAoMap,
  displacementMap: wallDisplacementMap,
  displacementScale: 0.1,
});

const wallGeometry = new THREE.BoxGeometry(40, 10, 0.5, 100, 100);
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, 5, -20);
scene.add(backWall);

const sideWall1 = new THREE.Mesh(wallGeometry, wallMaterial);
sideWall1.rotation.y = Math.PI / 2;
sideWall1.position.set(-20, 5, 0);
scene.add(sideWall1);

const sideWall2 = new THREE.Mesh(wallGeometry, wallMaterial);
sideWall2.rotation.y = Math.PI / 2;
sideWall2.position.set(20, 5, 0);
scene.add(sideWall2);

// Ceiling
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xF0E4E4 });
const ceilingGeometry = new THREE.PlaneGeometry(40, 40);
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, 10, 0);
scene.add(ceiling);

// Counter
const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xB57EDC });
const counterGeometry = new THREE.BoxGeometry(30, 2, 10);
const counter = new THREE.Mesh(counterGeometry, counterMaterial);
counter.position.set(0, 1, -5);
scene.add(counter);

// Clickable Objects Array
const clickableObjects = [];

// Helper Function to Setup GLTF Models
// Helper Function to Setup GLTF Models
function setupModel(model, position, scale, type) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
  
    model.position.sub(center); // Center the model
    model.position.y += size.y / 2; // Place the base at y = 0
    model.scale.set(scale, scale, scale);
    model.position.add(position);
    model.userData.type = type; // Assign type to the root model
  
    model.traverse((child) => {
      if (child.isMesh) {
        child.userData.type = type; // Propagate type to child meshes
        clickableObjects.push(child); // Add child meshes to clickable objects
      }
    });
  
    return model;
  }
  

// Load Bakery Models
const loader = new GLTFLoader();

loader.load('static/img/candy-covered_cake_draft.glb', (gltf) => {
  const cake = setupModel(gltf.scene, new THREE.Vector3(-8, 6.5, -5), 2, 'Cake');
  scene.add(cake);
});

loader.load('static/img/cupcake.glb', (gltf) => {
  const cupcake = setupModel(gltf.scene, new THREE.Vector3(0, 1.5, -5), 1.5, 'Cupcake');
  scene.add(cupcake);
});

loader.load('static/img/cookies_in_the_jar.glb', (gltf) => {
  const cookie = setupModel(gltf.scene, new THREE.Vector3(8, 1.5, -5), 20, 'Cookie');
  scene.add(cookie);
});

// Raycasting for Clicks and Pointer
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Update pointer coordinates on mouse move
function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update raycaster for hover detection
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  // Change cursor to pointer if hovering over a clickable object
  if (intersects.length > 0) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

// Handle click events
function onClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const type = clickedObject.userData.type || clickedObject.parent?.userData.type;

    if (type === 'Cake') {
      window.location.href = '/products#:~:text=Our%20Bakery%20Products-,Cakes,-%2465%20%2D%2085';
    } else if (type === 'Cupcake') {
      window.location.href = '/products#:~:text=in/8%20in-,Cupcakes,-%2448';
    } else if (type === 'Cookie') {
      window.location.href = '/products#:~:text=Size%3A%2018%20Cupcakes-,Cookies,-Location';
    }

    console.log('Clicked Object Type:', type);
  }
}

// Add event listeners
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('click', onClick);

// Animation Loop
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
