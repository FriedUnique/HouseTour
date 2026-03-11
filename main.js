import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { loadRoomData, Room, showRooms, hideRooms } from "/roomLoader.js"

const loader = new GLTFLoader();

const Mode = Object.freeze({
    MAP: 0,
    PANORAMA: 1,
    OUTSIDE: 2 
});

let viewMode = Mode.PANORAMA;

let currentActiveRoom = { value: 0 } // the id of the currently selected room;
let oldModel = null;

let fileName = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'index.html');
fileName = fileName.slice(0, fileName.length-5)




let mapContainer = document.getElementById("map-container")
mapContainer.classList.add("small")



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);



const canvas = document.querySelector('#pano-container');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.rotateSpeed = -0.2;


function moveCamera(positionVector){
    // fix for the look around movement gemini tha goat

    camera.position.set(positionVector.x, positionVector.y, positionVector.z); 

    controls.target.set(
        positionVector.x, 
        positionVector.y, 
        positionVector.z + 0.1
    );
}

function mapHandler(){
    switch (viewMode) {
            case Mode.MAP:
                mapContainer.classList.remove("big");
                mapContainer.classList.add("small");

                hideRooms(roomList);

                viewMode = Mode.PANORAMA;
                break;

            case Mode.PANORAMA:
                mapContainer.classList.remove("small");
                mapContainer.classList.add("big");


                showRooms(roomList, currentActiveRoom);

                viewMode = Mode.MAP;
                break;
        
            default:
                break;
        }
}



const roomList = await loadRoomData(fileName + ".json", currentActiveRoom, moveCamera, mapHandler);





function createModel(modelLocation){
    if(!modelLocation) return;

    if(oldModel !== null){
        scene.remove(oldModel);
        oldModel.geometry.dispose();
        oldModel.material.map.dispose(); // Disposes the loaded image
        oldModel.material.dispose();
    }

    loader.load( modelLocation, function ( gltf ) {

        oldModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(oldModel);
        const center = box.getCenter(new THREE.Vector3());
        oldModel.position.sub(center); 


        //rendering part, takes a couple of secs, after this step
        scene.add(oldModel);



        document.querySelector("#loading-screen").classList.replace("fadeShow", "fadeHide");

        
    }, (xhr) => { loadingCircle(xhr.loaded / xhr.total * 100); /*This loop only accounts for the actual loading of the prop into the memory, but not rendering. Thats why the fadeHide is in the other brackets*/},
    (error) => { console.error("An error happened:", error); });

}



const light = new THREE.AmbientLight(0xF8F8F8, 2);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyPressed(e){
    if(e.key === "p"){
        mapHandler();
    }else if(e.key === "q"){
        console.log(camera.position);
    }
    
}





function loadingCircle(loadingProgress){
    let loadingParagraph = document.querySelector('#loading-screen > p');
    loadingParagraph.textContent = "Loading: " + Math.round(loadingProgress) + " %";

}



function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

createModel(roomList[currentActiveRoom.value].modelPath)

window.addEventListener('resize', onWindowResize, false);
window.addEventListener("keypress", onKeyPressed)

moveCamera(roomList[currentActiveRoom.value].tpPosition); 

animate();
loadingCircle();