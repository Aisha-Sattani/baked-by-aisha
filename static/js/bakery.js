import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFF5F5); // Subtle light pink

const container = document.getElementById('threejs-container');
const width = container.offsetWidth;
const height = container.offsetHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(1, 8, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Slightly brighter
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

// Add bakery logo to the back wall
const logoTexture = new THREE.TextureLoader().load('static/img/BakedbyAisha_logo.png');
logoTexture.minFilter = THREE.LinearFilter; // Preserve resolution
logoTexture.magFilter = THREE.LinearFilter;
const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true });
const logoGeometry = new THREE.PlaneGeometry(12, 6); // Adjusted for proper aspect ratio
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(0, 7, -19.3); // Slightly forward to avoid z-fighting
scene.add(logo);

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

function createLabel(text, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // Draw bubble background
    const paddingX = 150; // Adjust horizontal padding to make the bubble narrower
    context.fillStyle = '#FFFFFF'; // White background
    context.beginPath();
    context.roundRect(paddingX / 2, 20, canvas.width - paddingX, canvas.height - 40, 30); // Rounded rectangle
    context.fill();

    // Draw border around bubble
    context.lineWidth = 5;
    context.strokeStyle = '#FFF5F5'; // Light pink border
    context.stroke();

    // Draw text
    context.fillStyle = '#000000'; // Black text
    context.font = 'Bold 50px Belleza';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // Adjust size and position
    sprite.scale.set(8, 2, 1); // Larger and more readable
    sprite.position.set(position.x, position.y - 1.5, position.z); // Positioned just above the container

    return sprite;
}

  
  // Load Bakery Models with Labels
  loader.load('static/img/candy-covered_cake_draft.glb', (gltf) => {
    const cake = setupModel(gltf.scene, new THREE.Vector3(-8, 6.5, -5), 2, 'Cake');
    scene.add(cake);
  
    const cakeLabel = createLabel('Cakes', new THREE.Vector3(-8, 2.5, 1));
    scene.add(cakeLabel);
  });
  
  loader.load('static/img/cupcake.glb', (gltf) => {
    const cupcake = setupModel(gltf.scene, new THREE.Vector3(0, 2, -5), 0.225, 'Cupcake');
    scene.add(cupcake);
  
    const cupcakeLabel = createLabel('Cupcakes', new THREE.Vector3(0, 2.5, 1));
    scene.add(cupcakeLabel);
  });
  
  loader.load('static/img/cookies_in_the_jar.glb', (gltf) => {
    const cookie = setupModel(gltf.scene, new THREE.Vector3(8, 1.5, -5), 20, 'Cookie');
    scene.add(cookie);
  
    const cookieLabel = createLabel('Cookies', new THREE.Vector3(8, 2.5, 1));
    scene.add(cookieLabel);
  });
  

// Add WASD/Arrow Key + Q/E Controls
const movement = { forward: 0, right: 0, up: 0 };

function onKeyDown(event) {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      movement.forward = 1;
      break;
    case 's':
    case 'ArrowDown':
      movement.forward = -1;
      break;
    case 'a':
    case 'ArrowLeft':
      movement.right = -1;
      break;
    case 'd':
    case 'ArrowRight':
      movement.right = 1;
      break;
    case 'e': // Move up
      movement.up = 1;
      break;
    case 'q': // Move down
      movement.up = -1;
      break;
  }
}

function onKeyUp(event) {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
    case 's':
    case 'ArrowDown':
      movement.forward = 0;
      break;
    case 'a':
    case 'ArrowLeft':
    case 'd':
    case 'ArrowRight':
      movement.right = 0;
      break;
    case 'e': // Stop moving up
    case 'q': // Stop moving down
      movement.up = 0;
      break;
  }
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Raycasting for Clicks and Pointer
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const rect = container.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
}

function onClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    const type = clickedObject.userData.type;

    if (type === 'Cake') {
      window.location.href = '/products#:~:text=Our%20Bakery%20Products-,Cakes,-%2465%20%2D%2085';
    } else if (type === 'Cupcake') {
      window.location.href = '/products#:~:text=in/8%20in-,Cupcakes,-%2448';
    } else if (type === 'Cookie') {
      window.location.href = '/products#:~:text=Size%3A%2018%20Cupcakes-,Cookies,-Location';
    }
  }
}

container.addEventListener('mousemove', onPointerMove);
container.addEventListener('click', onClick);

// Animation Loop
function animate() {
    controls.update();
  
    // Update camera position for movement
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
  
    const moveForward = direction.clone().multiplyScalar(movement.forward * 0.2);
    const moveRight = new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(movement.right * 0.2);
    const moveUp = new THREE.Vector3(0, movement.up * 0.2, 0); // Vertical movement
  
    camera.position.add(moveForward);
    camera.position.add(moveRight);
    camera.position.add(moveUp);
  
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
  
animate();
  

// Handle resizing
window.addEventListener('resize', () => {
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
