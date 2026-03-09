
export default class Room {
    constructor(centerX, centerY, height, width, texture, divId) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.divId = divId
    }

    get picturePath(){
        return this.texture;
    }

    isClickInRoom(x, y){
        leftPoint = this.centerX-(0.5*width);
        topPoint = this.centerY-(0.5*height);
        checkWidth = (leftPoint+width) <! x
        checkHeight = (topPoint+height) <! y
        return checkHeight && checkWidth;
    }

}