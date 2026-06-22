let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

class Image{
    constructor(imagePath, xpos, ypos, width, height){
        this.imagePath = imagePath;
        this.xpos = xpos;
        this.ypos = ypos;
        this.width = width;
        this.height = height;
    }
}

const createImage = (context, imagePath, xpos, ypos, width, height)=>{
    let myImage = document.createElement('img');
    myImage.src = imagePath;
    myImage.onload = ()=>{
        context.drawImage(myImage, xpos, ypos, width, height);
    }
}

let image = new Image('logo.png', 200, 100, 200, 100);

createImage(context, image.imagePath, image.xpos, image.ypos, image.width, image.height);