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
var mercuryTexture = textureLoader.load('./Textures/mercury-texture.jpg');
var venusTexture = textureLoader.load('./Textures/venus-texture.jpg');
var marsTexture = textureLoader.load('./Textures/mars-texture.jpg');
var jupiterTexture = textureLoader.load('./Textures/jupiter-texture.jpg');

//Random theta generator
function randomTheta () {
    var randomThetaValue = Math.random()*360;
    return randomThetaValue;
}

//Objects
//Earth
const earth = new objects.createSphere(20, 100, 100, "Basic", earthTexture); //earth is made 20x times bigger for easier display (original should be 1)
earth.theta = 0;
scene.add(earth);

//Moon
const moon = new objects.createSphere(5, 25, 25, "Basic", moonTexture); //moon is 0.25x earth's size
moon.theta = 0;
scene.add(moon);

//Sun
const sun = new objects.createSphere(109, 100, 100, "Basic", sunTexture); //sun is 109x times bigger in diameter than earth. original size
scene.add(sun);

//Mercury
const mercury = new objects.createSphere(7.66, 38, 38, "Basic", mercuryTexture); //0.383x earth's size
mercury.theta = randomTheta();
scene.add(mercury);

//Venus
const venus = new objects.createSphere(18.98, 94, 94, "Basic", venusTexture); //0.949x earth's size
venus.theta = randomTheta();
scene.add(venus);

//Mars
const mars = new objects.createSphere(10.64, 53, 53, "Basic", marsTexture); //0.532x earth's size
mars.theta = randomTheta();
scene.add(mars);

//Jupiter
const jupiter = new objects.createSphere(56.045, 112, 112, "Basic", jupiterTexture); //11.209x earth's size. Made 0.25x original size
jupiter.theta = randomTheta();
scene.add(jupiter);

//Animation
var mainAnimation = function () {
    requestAnimationFrame(mainAnimation);

    //Earth animations based on sun's position (distance from earth to sun = 400*distance from earth to moon)
    earth.theta -= 0.005;
    const earthOrbitRadius = 468;  //11700x earth's diameter(radius*2), made 2/100x real distance (original 23400)
    earth.rotation.y += 0.05;
    earth.position.x = sun.position.x + earthOrbitRadius * Math.cos(earth.theta);
    earth.position.z = sun.position.z + earthOrbitRadius * Math.sin(earth.theta);

    //Moon animations based on earth's position and rotation
    moon.theta -= 0.02;
    const moonOrbitRadius = 30;  //30x earth's diameter(radius*2), it's original (30)
    moon.rotation.y += 0.005;
    moon.position.x = earth.position.x + moonOrbitRadius * Math.cos(moon.theta);
    moon.position.z = earth.position.z + moonOrbitRadius * Math.sin(moon.theta);

    //Mercury animations based on sun's position (0.39x earth-sun distance)
    mercury.theta -= 0.0012; //Orbitational velocity (0.24 earth's orbitational speed)
    const mercuryOrbitRadius = 182.52;  //0.39x earth-sun distance
    mercury.rotation.y += 0.05;
    mercury.position.x = sun.position.x + mercuryOrbitRadius * Math.cos(mercury.theta);
    mercury.position.z = sun.position.z + mercuryOrbitRadius * Math.sin(mercury.theta);

    //Venus animations based on sun's position (0.72x earth-sun distance)
    venus.theta -= 0.0031; //0.62x earth's orbitational speed
    const venusOrbitRadius = 336.96;  //0.72x earth-sun distance
    venus.rotation.y += 0.05;
    venus.position.x = sun.position.x + venusOrbitRadius * Math.cos(venus.theta);
    venus.position.z = sun.position.z + venusOrbitRadius * Math.sin(venus.theta);

    //Mars animations based on sun's position (1.52x earth-sun distance)
    mars.theta -= 0.004; //0.8x earth's orbitational speed
    const marsOrbitRadius = 711.36;  //1.52x earth-sun distance
    mars.rotation.y += 0.05;
    mars.position.x = sun.position.x + marsOrbitRadius * Math.cos(mars.theta);
    mars.position.z = sun.position.z + marsOrbitRadius * Math.sin(mars.theta);

    //Jupiter animations based on sun's position (5.20x earth-sun distance)
    jupiter.theta -= 0.0125; //0.8x earth's orbitational speed
    const jupiterOrbitRadius = 2433.6;  //5.20x earth-sun distance
    jupiter.rotation.y += 0.05;
    jupiter.position.x = sun.position.x + jupiterOrbitRadius * Math.cos(jupiter.theta);
    jupiter.position.z = sun.position.z + jupiterOrbitRadius * Math.sin(jupiter.theta);

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
