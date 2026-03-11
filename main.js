import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --------------------------- ESCENA ---------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x636768);

// --------------------------- CÁMARA ---------------------------
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 6);
const initialCameraPosition = camera.position.clone();
const initialCameraTarget = new THREE.Vector3(0, 0, 0);

// --------------------------- RENDERER ---------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --------------------------- LUCES ---------------------------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
dirLight2.position.set(-5, -5, -5);
dirLight2.castShadow = true;
scene.add(dirLight2);

// --------------------------- CONTROLES ---------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.copy(initialCameraTarget);

// --------------------------- OBJETOS ---------------------------
const cameraObjects = ["Radio","Porfolio","Muñeco_de_nieve","Revolver", "Pokemon", "Namek", "Sanitario"];
const clickableObjects = ["Radio", "Play", "Pause","Porfolio","Muñeco_de_nieve","Revolver","Pokemon","Namek","Sanitario"];
const spotLights = {};

// 🔥 INFORMACIÓN PERSONALIZADA CON HTML
const objectInfo = {

  "Radio": {
    html: `
      <h1>Radio Retro</h1>
      <p>Una radio clásica que reproduce música ambiental.</p>
    `
  },

  "Porfolio": {
    html: `
      <h1>Mi Portfolio</h1>
      <p>Este es mi curriculum personal.</p>
      <p>Si quieres ver más información, puedes contactarme a través de mis redes sociales.</p>
    `
  },

  "Muñeco_de_nieve": {
    html: `
      <h1>Muñeco de Nieve</h1>
      <p>Una figura decorativa situada en el museo.</p>
      <p>¿Por qué está aquí dentro?</p>
    `
  },

  "Revolver": {
    html: `
      <h1>Revolver</h1>
      <p>Un objeto histórico expuesto en el museo.</p>
      <p>Representa la evolución de la tecnología mecánica.</p>
    `
  },

  "Pokemon": {
    html: `
      <h1>Figura Pokémon</h1>
      <p>Una figura coleccionable inspirada en el universo Pokémon.</p>
      <p>Un pequeño guiño a la cultura pop dentro del museo.</p>
    `
  },

  "Namek": {
    html: `
      <h1>Planeta Namek</h1>
      <p>Una referencia al famoso planeta del universo Dragon Ball.</p>
      <p>Un elemento decorativo para fans del anime.</p>
    `
  },

  "Sanitario": {
    html: `
      <h1>Sanitario</h1>
      <p>Personaje que se usa para el proyecto EspVRna.</p>
      <p>Uno de los muchos modelos que he estado haciendo para el proyecto.</p>
    `
  }

};

// --------------------------- CARGAR MODELO ---------------------------
const loader = new GLTFLoader();

loader.load('models/Museo.glb', (gltf) => {

  scene.add(gltf.scene);

  gltf.scene.traverse((child) => {
    if (child.isMesh && clickableObjects.includes(child.name)) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  cameraObjects.forEach(name => {

    const object = gltf.scene.getObjectByName(name);
    if (!object) return;

    const spot = new THREE.SpotLight(0xffffff, 15);
    spot.angle = Math.PI / 10;
    spot.penumbra = 0.2;
    spot.decay = 2;
    spot.distance = 10;
    spot.castShadow = true;
    spot.visible = false;

    scene.add(spot);
    scene.add(spot.target);

    spotLights[name] = { light: spot, object: object };

  });

});

// --------------------------- RAYCASTER ---------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --------------------------- INFO DIV ---------------------------
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.top = '20px';
infoDiv.style.right = '20px';
infoDiv.style.padding = '20px';
infoDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
infoDiv.style.color = 'white';
infoDiv.style.fontFamily = 'Arial';
infoDiv.style.maxWidth = '320px';
infoDiv.style.display = 'none';
infoDiv.style.borderRadius = '10px';
infoDiv.style.zIndex = '10';
document.body.appendChild(infoDiv);

// --------------------------- BOTÓN X ---------------------------
const exitButton = document.createElement('button');
exitButton.innerText = 'X';
exitButton.style.position = 'absolute';
exitButton.style.top = '20px';
exitButton.style.left = '20px';
exitButton.style.padding = '8px 12px';
exitButton.style.fontSize = '18px';
exitButton.style.display = 'none';
document.body.appendChild(exitButton);

// --------------------------- OVERLAY PORTFOLIO ---------------------------
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = 0;
overlay.style.left = 0;
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
overlay.style.display = 'none';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.zIndex = 100;
document.body.appendChild(overlay);

const portfolioImage = document.createElement('img');
portfolioImage.src = 'models/Manel Rueda.jpg';
portfolioImage.style.maxWidth = '50%';
portfolioImage.style.maxHeight = '50%';
portfolioImage.style.border = '2px solid white';
overlay.appendChild(portfolioImage);

overlay.addEventListener('click', () => { overlay.style.display = 'none'; });

// --------------------------- VARIABLES ---------------------------
let currentAudio = null;
const audioMap = { "Play": "models/Portal Radio Tune.mp3" };

let targetPosition = null;
let targetLookAt = null;
let activeSpot = null;
let showPortfolioOnFocus = false;

// --------------------------- CLICK ---------------------------
renderer.domElement.addEventListener('click', (event) => {

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length === 0) return;

  let obj = intersects[0].object;
  while (obj && !clickableObjects.includes(obj.name)) obj = obj.parent;
  if (!obj) return;

  // ---------------- INFO HTML PERSONALIZADA ----------------
  const customData = objectInfo[obj.name];

  if (customData) {
    infoDiv.innerHTML = customData.html + `
      <p style="font-size:12px;opacity:0.6;">Haz clic en X para salir</p>
    `;
    infoDiv.style.display = 'block';
  }

  // ---------------- AUDIO ----------------
  if (obj.name === "Play") {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    currentAudio = new Audio(audioMap["Play"]);
    currentAudio.play();
  }

  if (obj.name === "Pause") {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; currentAudio = null; }
  }

  // ---------------- ENFOQUE CÁMARA ----------------
  if (cameraObjects.includes(obj.name)) {

    const data = spotLights[obj.name];
    if (!data) return;

    const object = data.object;
    const spot = data.light;

    const objPos = new THREE.Vector3();
    object.getWorldPosition(objPos);

    spot.position.set(objPos.x, objPos.y + 4, objPos.z);
    spot.target.position.copy(objPos);

    if (activeSpot) activeSpot.visible = false;
    spot.visible = true;
    activeSpot = spot;

    ambientLight.intensity = 0;

    const forward = new THREE.Vector3(0, 0, 1);
    const worldQuaternion = object.getWorldQuaternion(new THREE.Quaternion());
    forward.applyQuaternion(worldQuaternion);

    targetPosition = objPos.clone().add(forward.multiplyScalar(0.5));
    targetPosition.y += 0.3;
    targetLookAt = objPos.clone();

    controls.enabled = false;
    exitButton.style.display = 'block';

    showPortfolioOnFocus = (obj.name === "Porfolio");
  }

});

// --------------------------- SALIR ---------------------------
exitButton.addEventListener('click', () => {

  camera.position.copy(initialCameraPosition);
  controls.target.copy(initialCameraTarget);

  targetPosition = null;
  targetLookAt = null;

  exitButton.style.display = 'none';
  infoDiv.style.display = 'none';

  controls.enabled = true;
  ambientLight.intensity = 0.6;

  if (activeSpot) {
    activeSpot.visible = false;
    activeSpot = null;
  }

  overlay.style.display = 'none';
});

// --------------------------- LOOP ---------------------------
function animate() {

  requestAnimationFrame(animate);

  if (targetPosition && targetLookAt) {

    camera.position.lerp(targetPosition, 0.08);
    controls.target.lerp(targetLookAt, 0.08);

    if (camera.position.distanceTo(targetPosition) < 0.01) {
      targetPosition = null;
      targetLookAt = null;

      if (showPortfolioOnFocus) {
        overlay.style.display = "flex";
        showPortfolioOnFocus = false;
      }
    }
  }

  controls.update();
  renderer.render(scene, camera);

}

animate();

// --------------------------- RESIZE ---------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});