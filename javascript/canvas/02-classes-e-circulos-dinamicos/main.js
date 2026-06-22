var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

class Circle
{
    constructor(xpos, ypos, radius, color, text)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.text = text;
    }

    draw(ctx)
    {
        ctx.beginPath();
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '28px Consolas';
        ctx.fillText(this.text, this.xpos, this.ypos);

        ctx.lineWidth=2;
        ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI*2, false);
        ctx.strokeStyle=this.color;
        ctx.stroke();
        ctx.closePath();
    }
}

const createCircle = (circle)=>{
    circle.draw(context);
}

for(let n=0; n < 10; n++)
{
    let rand_x = Math.floor(Math.random() * window_width);
    let rand_y = Math.floor(Math.random() * window_height);
    let rand_radius = Math.floor(Math.random()*100) + 50;
    let my_circle = new Circle(rand_x, rand_y, rand_radius, '#3e73e6', n+1);

    createCircle(my_circle);
}
