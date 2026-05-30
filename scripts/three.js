import * as THREE from "three";
import { GLTFLoader, Wireframe } from "three/examples/jsm/Addons.js";
import { lightPosition } from "three/src/nodes/TSL.js";
import { color, xor } from "three/tsl";
import { Color } from "three/webgpu";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// html DOM elements
const button = document.getElementById('returnToBottom');
const aboutContent = document.querySelector(".content-about");
const projectsContent = document.querySelector(".content-projects");
const contactContent = document.querySelector(".content-contact");
const msgFirstName = document.getElementById("fname");
const msgLastName = document.getElementById("lname");
const msgEmail = document.getElementById("email");
const msgBody = document.getElementById("msg");

// setup the THREEJS scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const perspectiveVector = new THREE.Vector3();
const loader = new GLTFLoader();
scene.background = new THREE.Color( 0x00000 ); // changes background color

const now = new Date();
const hour = now.getHours();

var light = new THREE.HemisphereLight(0xfffffb, 0x080820, 2);
scene.add(light);

// sun geometry
const geometryS = new THREE.SphereGeometry(0.5, 16, 16);
const materialS = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false});
const sun = new THREE.Mesh(geometryS, materialS);

// moon geometry
const geometryA = new THREE.SphereGeometry(0.5, 1, 3, 0, Math.PI / 4, 0, Math.PI);
const materialA = new THREE.MeshBasicMaterial({color: 0xF6F1D5, wireframe: false});
const moon = new THREE.Mesh(geometryA, materialA);



// need global flags for items being shown
const acceptableRadius = 0.5;
const triggerAbout = new THREE.Vector3(2.5, 4, -1.5);
const triggerProjects = new THREE.Vector3(2.5, 10, -1.5);
const triggerContact = new THREE.Vector3(2.5, 16, -1.5);
var aboutShown = false;
var projectsShown = false;
var contactShown = false;


// if (hour > 8 && hour < 20) {
//     scene.add(sun);
//     sun.position.set(0, 3, 0);
// }
// else {
//     scene.add(moon);
//     moon.position.set(0, 3, 0);
// }

scene.add(sun);
sun.position.set(0, 3, 0);



//custom 3d mountain model
loader.load('mountain_alpine_style_gltf/scene.gltf', (gltf) => {
    scene.add(gltf.scene);
})


//immaculate camera positioning right here
camera.position.set(2.5, 0.05, -1.5);
camera.lookAt(0, 1.5, 0);
camera.getWorldDirection( perspectiveVector );


// functions for showing About, Projects, Contact
function showAbout() {
    // aboutContent.style.display = "block"
    aboutContent.classList.toggle('fadeIn');
    projectsContent.classList.remove('fadeIn');
    contactContent.classList.remove('fadeIn');

    aboutShown = true;

}

function showProjects() {
    aboutContent.classList.remove('fadeIn');
    projectsContent.classList.toggle('fadeIn');
    contactContent.classList.remove('fadeIn');
    projectsShown = true;

    console.log("projects")

}

function showContact() {
    aboutContent.classList.remove('fadeIn');
    projectsContent.classList.remove('fadeIn');
    contactContent.classList.toggle('fadeIn');
    contactShown = true;
}

function hideAll() {
    aboutContent.classList.remove('fadeIn');
    projectsContent.classList.remove('fadeIn');
    contactContent.classList.remove('fadeIn');
}


//animation loop
//this is required, otherwise the scene wont render

function animate() {
    // if (hour > 8 && hour < 20){
    //     sun.rotation.y += 0.01;
    // } 
    // else{
    //     // you can have rotation or changing perspective...
    //     moon.rotation.y += 0.01;
    // }

    sun.rotation.y += 0.01;


    // in the animation loop, do checks for camera heights
    const dAbout = camera.position.distanceTo(triggerAbout);
    const dProject = camera.position.distanceTo(triggerProjects);
    const dContact = camera.position.distanceTo(triggerContact);



    if (dAbout < acceptableRadius && !aboutShown){
        showAbout();
    }
    else if (dProject < acceptableRadius && !projectsShown){
        showProjects();
    }
    else if (dContact < acceptableRadius && !contactShown) {
        showContact();
    }
    else if (camera.position.y == 0.05){
        aboutShown = false;
        projectsShown = false;
        contactShown = false;
        hideAll();

    }

    renderer.render(scene, camera);
}

window.addEventListener("wheel", function(e) {
    // console.log(camera.position.y); 
    e.preventDefault();

    const scrollingSpeed = 0.01
    camera.position.y += (-1 * e.deltaY) * scrollingSpeed;

    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.05, 25);

    if (camera.position.y  == 25){
        aboutShown = false;
        projectsShown = false;
        contactShown = false;
    }

}, {passive: false });

button.addEventListener('click', function() {
    
    while (camera.position.y > 0.05){
        camera.position.y -= 0.01
    }
    hideAll();
    aboutShown = false;
    projectsShown = false;
    contactShown = false;


});

document.getElementById("submitButton").addEventListener ('click', function() {
    alert("Sorry! Backend API isn't working right now!");

    const data = {"fname": "", "lname": "", "email": "", "text": ""};
    data.fname = msgFirstName.value;
    data.lname = msgLastName.value;
    data.email = msgEmail.value;
    data.text = msgBody.value;


    // ready for an API call here


})

document.getElementById("about").addEventListener('click', function() {
    camera.position.y = 5;
    showAbout();
    aboutShown = false;
});

document.getElementById("projects").addEventListener('click', function() {
    camera.position.y = 11;
    showProjects();
    projectsShown = false;
});

document.getElementById("contact").addEventListener('click', function() {
    camera.position.y = 17;
    showContact();
    contactShown = false;
});

renderer.setAnimationLoop(animate);

