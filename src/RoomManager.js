import { Vector3 } from 'three';
import { SceneManager } from './SceneManager.js';


export class RoomManager{
    constructor(sceneManagerInstance){
        this.activeRoomId = 0
        this.sceneManager = sceneManagerInstance
        this.roomList = []

    }

    get activeRoom(){
        return this.roomList[this.activeRoomId]
    }

    async fetchRoomData(roomDataPath){

        try {
            const response = await fetch(roomDataPath);
            const data = await response.json();
            
            return this.initRooms(data.rooms);
            
        } catch (error) {
            console.error("Oops, map data failed to load:", error);
        }
    }

    initRooms(roomData){
        let i = 0
        roomData.forEach(room => {
            let roomDiv = document.createElement("div");
            
            roomDiv.classList.add("hide");
            roomDiv.classList.add("map-room");
            roomDiv.id = `${i}`;
    
            roomDiv.style.left = room.centerX + "px";
            roomDiv.style.top = room.centerY + "px";
            roomDiv.style.width = room.width + "px";
            roomDiv.style.height = room.height + "px";
    
            roomDiv.innerHTML += "<p>"+ room.name +"</p>";
    
            if(i == this.activeRoomId){
                roomDiv.classList.add("selected")
            }
            
            roomDiv.addEventListener("click", (e)=>{
                document.getElementById(this.activeRoomId).classList.remove("selected")
                
                let roomId = e.srcElement.id;
                
                this.activeRoomId = roomId;
                
                document.getElementById(roomId).classList.add("selected")

                let tpPos = this.roomList[roomId].tpPosition;
                this.sceneManager.moveCamera(tpPos); 
                this.toggleMap();
            })
    
            document.getElementById("map-container").appendChild(roomDiv);
    
            this.roomList.push(new Room(room.centerX, room.centerY, room.height, room.width, new Vector3(room.tpPositionX, 0, room.tpPositionZ), room.model, i));
            i++;
        });
    
    
        this.hideRooms();
    
        return [];
    }

    showRooms(){
        this.roomList.forEach(room => {
            let roomElement = document.getElementById(room.divId);
            roomElement.classList.remove("hide");
            roomElement.classList.add("show");
            
            roomElement.style.left = room.centerX + "px";
            roomElement.style.top = room.centerY + "px";
            roomElement.style.width = room.width + "px";
            roomElement.style.height = room.height + "px";

            roomElement.querySelector("p").style.fontSize = 35 + "px";
        });
    }

    hideRooms(){
        this.roomList.forEach(room => {
            let roomElement = document.getElementById(room.divId);
            roomElement.classList.remove("show");
            roomElement.classList.add("hide");

            roomElement.style.left = room.centerX*0.3 + "px";
            roomElement.style.top = room.centerY*0.3 + "px";
            roomElement.style.width = room.width*0.3 + "px";
            roomElement.style.height = room.height*0.3 + "px";

            roomElement.querySelector("p").style.fontSize = 35*0.3 + "px";
            
        });
    }

    toggleMap(){
        let mapContainer = document.getElementById("map-container")
        switch (this.sceneManager.viewMode) {
            case SceneManager.VIEW_MODE.MAP:
                mapContainer.classList.remove("big");
                mapContainer.classList.add("small");
    
                this.hideRooms();
    
                this.sceneManager.viewMode = SceneManager.VIEW_MODE.PANORAMA;
                break;
    
            case SceneManager.VIEW_MODE.PANORAMA:
                mapContainer.classList.remove("small");
                mapContainer.classList.add("big");
    
    
                this.showRooms();
    
                this.sceneManager.viewMode = SceneManager.VIEW_MODE.MAP;
                break;
        
            default:
                break;
        }
    }
}

function roomStyle(roomDiv, scale){

}


export class Room {
    constructor(centerX, centerY, height, width, tpPosition, texture, divId) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.height = height;
        this.width = width;
        this.model = texture;
        this.divId = divId;
        this.tpPosition = tpPosition;
    }

    get modelPath(){
        return this.model;
    }


}