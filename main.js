

export default class Room {
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

