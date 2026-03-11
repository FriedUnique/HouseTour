import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SceneManager } from './SceneManager.js';
import { RoomManager } from './RoomManager.js';

const sceneManagerInstance = new SceneManager();
const roomManagerInstance = new RoomManager(sceneManagerInstance);

let modelDataPath = "/data/models/"
let roomDataPath = "/data/roomData/"
let fileName = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) || 'index.html');
fileName = fileName.slice(0, fileName.length-5) + ".json"


await roomManagerInstance.fetchRoomData(roomDataPath + fileName);

const loader = new GLTFLoader();

let oldModel = null;


let mapContainer = document.getElementById("map-container")
mapContainer.classList.add("small")


function createModel(modelName){
    if(!modelName) return;

    if(oldModel !== null){
        sceneManagerInstance.scene.remove(oldModel);
        oldModel.geometry.dispose();
        oldModel.material.map.dispose(); // Disposes the loaded image
        oldModel.material.dispose();
    }

    loader.load( modelDataPath + modelName, function ( gltf ) {

        oldModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(oldModel);
        const center = box.getCenter(new THREE.Vector3());
        oldModel.position.sub(center); 


        //rendering part, takes a couple of secs, after this step
        sceneManagerInstance.scene.add(oldModel);

        // fading out the loading screen
        document.querySelector("#loading-screen").classList.replace("fadeShow", "fadeHide");
        
    }, (xhr) => { document.querySelector('#loading-screen > p').textContent = "Loading: " + Math.round(xhr.loaded / xhr.total * 100) + " %"; },
    (error) => { console.error("An error happened:", error); });

}


function onKeyPressed(e){
    if(e.key === "p"){
        roomManagerInstance.toggleMap();
    }
    
}

window.addEventListener('resize', sceneManagerInstance.resize, false);
window.addEventListener("keypress", onKeyPressed)



function animate() {
    requestAnimationFrame(animate);
    sceneManagerInstance.render();
}

createModel(roomManagerInstance.activeRoom.modelPath)
sceneManagerInstance.moveCamera(roomManagerInstance.activeRoom.tpPosition); 
animate();