import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --------------------------- A. CONFIGURACIÓN BÁSICA ---------------------------
//Escene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Color de fondo gris oscuro

//1. Camara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Movemos la cámara un poco atrás y arriba

//2. Rende
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialias para que se vea suave
renderer.setSize(window.innerWidth, window.innerHeight);
//añadimos este nuevo elemento al DOM
document.body.appendChild(renderer.domElement);

// --------------------------- B. LUCES  ---------------------------
// Luz ambiental (ilumina todo suavemente)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Luz direccional (como el sol)
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight); 

// --------------------------- C. OBJETOS ---------------------------
// Vamos a crear un cubo pero con material que reaccione a la luz

// ----- Sombrero -----
const sombrero = new THREE.CylinderGeometry(1,1,2);
const sombreroMaterial = new THREE.MeshStandardMaterial({
    color: 0x5F5F63,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
});
const Sombrero = new THREE.Mesh(sombrero, sombreroMaterial);
Sombrero.position.set(0,4,0);

const visera = new THREE.BoxGeometry( 1.5, 0.1, 1 );
const Visera = new THREE.Mesh( visera, sombreroMaterial );
Visera.position.set(0,3.05,1);

// ----- Cabeza -----
const esfera = new THREE.IcosahedronGeometry( 1, 5);
const cabezaMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7C788,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const IcosahedronGeometry = new THREE.Mesh(esfera, cabezaMaterial);
IcosahedronGeometry.position.set(0,2.5,0)

// ----- Ojos -----
const ojoGeom = new THREE.SphereGeometry(0.2,32,32);
const ojoMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const OjoD = new THREE.Mesh(ojoGeom, ojoMaterial);
OjoD.position.set(0.4,2.7,0.9)

const OjoI = new THREE.Mesh(ojoGeom, ojoMaterial);
OjoI.position.set(-0.4,2.7,0.9)

// ----- Boca -----
const bocaGeom = new THREE.BoxGeometry(0.5, 0.1, 0.2);
const bocaMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es

});
const Boca = new THREE.Mesh(bocaGeom, bocaMaterial);
Boca.position.set(0,2.3,1);

// ----- Tronco -----
const troncoSuperior = new THREE.CylinderGeometry(1,1,2.2);
const troncoSuperiorMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const TroncoS = new THREE.Mesh(troncoSuperior, troncoSuperiorMaterial);
TroncoS.position.set(0,0.35,0)

const troncoInferior = new THREE.CylinderGeometry(1,1,0.5);
const troncoInferiorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A3489,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const TroncoI = new THREE.Mesh(troncoInferior, troncoInferiorMaterial);
TroncoI.position.set(0,-1,0)

// ----- Brazos -----
const brazosGeom = new THREE.CylinderGeometry(0.3,0.3,3);
const brazoMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const BrazoD = new THREE.Mesh(brazosGeom, brazoMaterial);
BrazoD.position.set(1,1.4,0)

const BrazoI = new THREE.Mesh(brazosGeom, brazoMaterial);
BrazoI.position.set(-1,1.4,0)

brazosGeom.translate(0,-1.5,0);
BrazoD.rotation.z = Math.PI /10;
BrazoI.rotation.z = -Math.PI /10;

// ----- Manos -----
const manoGeom = new THREE.SphereGeometry(0.3,32,32);
const manoMaterial = new THREE.MeshStandardMaterial({
    color: 0xF7C788,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const ManoD = new THREE.Mesh(manoGeom, manoMaterial);
ManoD.position.set(-2.45,-0.2,0.5)

const ManoI = new THREE.Mesh(manoGeom, manoMaterial);
ManoI.position.set(2.45,-0.2,-0.5)

manoGeom.translate(0,-1.5,0);
ManoD.rotation.z = Math.PI /10;
ManoI.rotation.z = -Math.PI /10;


// ----- Piernas -----
const piernasGeom = new THREE.CylinderGeometry(0.3,0.2,4);
const piernaMaterial = new THREE.MeshStandardMaterial({
    color: 0x1A3489,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es
    
});
const PiernaD = new THREE.Mesh(piernasGeom, piernaMaterial);
PiernaD.position.set(0.5,-3,0)

const PiernaI = new THREE.Mesh(piernasGeom, piernaMaterial);
PiernaI.position.set(-0.5,-3,0)

// ----- Zapatos -----
const zapatosGeom = new THREE.BoxGeometry(0.5,0.5,1);
const zapatosMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0.2, // Qué tan áspero es
    metalness: 0.5  // Qué tan metálico es

});
const ZapatoD = new THREE.Mesh(zapatosGeom, zapatosMaterial);
ZapatoD.position.set(0.5,-5,0.2)

const ZapatoI = new THREE.Mesh(zapatosGeom, zapatosMaterial);
ZapatoI.position.set(-0.5,-5,0.2)

// ----- Crear -----
scene.add(TroncoS,TroncoI,IcosahedronGeometry,PiernaD,PiernaI,BrazoD,BrazoI,Sombrero,Visera,OjoD,OjoI,Boca,ManoD,ManoI,ZapatoD,ZapatoI);

// --------------------------- D. CONTROLES (La navegación) ---------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Añade inercia al movimiento (más suave)

// --------------------------- E. ANIMACIÓN (Game Loop) ---------------------------
function animate() {
    requestAnimationFrame(animate);

// ----- Animacion Brazos -----
    const time = Date.now() * 0.002;
    BrazoD.rotation.x = Math.PI /10 + Math.sin(time) * 0.2;
    BrazoI.rotation.x = -Math.PI /10 - Math.sin(time) * 0.2;
    
// ----- Animacion Manos -----
    ManoD.rotation.x = -Math.PI /10 - Math.sin(time) * 0.4;
    ManoI.rotation.x = +Math.PI /10 + Math.sin(time) * 0.4;

    // Pequeña rotación automática
    //---cube.rotation.y += 0.005;
    //---cube.rotation.x += 0.002;
        

    controls.update(); // Necesario por el damping
    renderer.render(scene, camera);
}

animate();

// Ajustar si cambian el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
