import { Vector3 } from 'three';



export class Room {
    constructor(centerX, centerY, height, width, tpPosition, texture, divId) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.divId = divId;
        this.tpPosition = tpPosition;
    }

    get picturePath(){
        return this.texture;
    }


}

export async function loadRoomData(currentActiveRoomObj) {
    try {
        const response = await fetch('roomData.json');
        const data = await response.json();
        
        // Pass the specific part of the data to your function
        return initRooms(data.rooms, currentActiveRoomObj);
        
    } catch (error) {
        console.error("Oops, map data failed to load:", error);
    }
}

function initRooms(roomData, currentActiveRoomObj){
    let i = 0
    let rooms = [];
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
        
        roomDiv.addEventListener("click", (e)=>{
            let roomId = e.srcElement.id;
            console.log("Teleport to room id " + roomId);
            currentActiveRoomObj.value = roomId;

            console.log(roomList[roomId])
            

            let tpPos = roomList[roomId].tpPosition;
            moveCamera(tpPos); 
            mapHandler();
        })


        console.log(room.model);

        document.getElementById("map-container").appendChild(roomDiv);
        // document.body.appendChild(roomDiv);

        rooms.push(new Room(room.centerX, room.centerY, room.height, room.width, new Vector3(room.tpPositionX, 0, room.tpPositionZ), room.model, i));
        i++;
    });

    hideRooms(rooms);

    return rooms;
}


export function showRooms(roomList){
    roomList.forEach(room => {
        let roomElement = document.getElementById(room.divId);
        roomElement.classList.remove("hide");
        roomElement.classList.add("show");

        roomElement.style.left = room.centerX + "px";
        roomElement.style.top = room.centerY + "px";
        roomElement.style.width = room.width + "px";
        roomElement.style.height = room.height + "px";


        if(room.divId == currentActiveRoom.value){
            roomElement.style.backgroundColor = "green";
        }else{
            roomElement.style.backgroundColor = "black";
        }
    });
}

export function hideRooms(roomList){
    roomList.forEach(room => {
        let roomElement = document.getElementById(room.divId);
        roomElement.classList.remove("show");
        roomElement.classList.add("hide");

        roomElement.style.left = room.centerX*0.3 + "px";
        roomElement.style.top = room.centerY*0.3 + "px";
        roomElement.style.width = room.width*0.3 + "px";
        roomElement.style.height = room.height*0.3 + "px";
        
    });
}