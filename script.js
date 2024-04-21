import * as THREE from './THREE/three.module.js';
import { OrbitControls } from './THREE/OrbitControls.js';
import * as objects from './PersonalLibrary.js';

//Scene
const scene = new THREE.Scene();

//Camera
//Main camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
camera.position.set(0, 0, 1500);

//Earth camera
const earthCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
earthCamera.position.clone(camera.position);
const earthOffset = new THREE.Vector3(0, 0, -60);
const earthInterpolationFactor = 0.1;

//Moon camera
const moonCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
moonCamera.position.clone(camera.position);
const moonOffset = new THREE.Vector3(0, 0, -60);
const moonInterpolationFactor = 0.1;

//Rendering
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Lights
const sunLight = new THREE.DirectionalLight('white', 1);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

//Controls
var controls = new OrbitControls(camera, renderer.domElement);
/*controls.minDistance = 120;
controls.maxDistance = 1050;*/
controls.screenSpaceSpanning = true;

//Textures
var textureLoader = new THREE.TextureLoader();
var earthTexture = textureLoader.load('./Textures/earth-texture.jpg');
var moonTexture = textureLoader.load('./Textures/moon-texture.jpg');
var sunTexture = textureLoader.load('./Textures/sun-texture.jpg');

//Objects
//Earth
const earth = new objects.createSphere(10, 100, 100, "Basic", earthTexture); //earth is made 10x times bigger for easier display (original should be 1)
earth.theta = 0;
scene.add(earth);

//Moon
const moon = new objects.createSphere(2.5, 25, 25, "Basic", moonTexture); //moon is 1/4x times the size of earth, we make it 10 times bigger for easier display (original should be 0.25)
moon.theta = 0;
scene.add(moon);

//Sun
const sun = new objects.createSphere(109, 100, 100, "Basic", sunTexture); //sun is 109x times bigger in diameter than earth. original size
scene.add(sun);


//Animation
var mainAnimation = function () {
    requestAnimationFrame(mainAnimation);

    //Earth animations based on sun's position and rotation (distance from earth to sun = 400*distance from earth to moon)
    earth.rotation.y += 0.005;
    earth.theta -= 0.005;
    const earthOrbitRadius = 234;  //11700x earth's diameter(radius*2), made 1/100x real distance (original 23400)
    earth.rotation.y += 0.05;
    earth.position.x = sun.position.x + earthOrbitRadius * Math.cos(earth.theta);
    earth.position.z = sun.position.z + earthOrbitRadius * Math.sin(earth.theta);

    //Moon animations based on earth's position and rotation
    moon.theta -= 0.02;
    const moonOrbitRadius = 30;  //30x earth's diameter(radius*2), it's original (30)
    moon.rotation.y += 0.005;
    moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(moon.theta);
    moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(moon.theta);

    renderer.render(scene, camera);
}

var earthPOV = function () {
    requestAnimationFrame(earthPOV);
    const earthCameraTargetPosition = earth.position.clone().add(earthOffset);
    earthCamera.position.lerp(earthCameraTargetPosition, earthInterpolationFactor);
    earthCamera.lookAt(earth.position);
    renderer.render(scene, earthCamera);
}

var moonPOV = function () {
    requestAnimationFrame(moonPOV);
    const moonCameraTargetPosition = moon.position.clone().add(moonOffset);
    moonCamera.position.lerp(moonCameraTargetPosition, moonInterpolationFactor);
    moonCamera.lookAt(moon.position);
    renderer.render(scene, moonCamera);
}

mainAnimation();
