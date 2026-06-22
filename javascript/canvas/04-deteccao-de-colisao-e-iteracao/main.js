let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

class Circle
{
    constructor(xpos, ypos, radius, color, text, speed)
    {
        this.xpos = xpos;
        this.ypos = ypos;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(ctx)
    {
        ctx.beginPath();
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '50px Consolas';
        ctx.fillText(this.text, this.xpos, this.ypos);

        ctx.lineWidth=2;
        ctx.arc(this.xpos, this.ypos, this.radius, 0, Math.PI*2, false);
        ctx.strokeStyle=this.color;
        ctx.stroke();
        ctx.closePath();
    }

    update()
    {
        this.draw(context);

        if ((this.xpos + this.radius) > window_width)
        {
            this.dx = -this.dx;
        }

        if ((this.xpos - this.radius) < 0)
        {
            this.dx = -this.dx;
        }

        if ((this.ypos - this.radius) < 0)
        {
            this.dy = -this.dy;
        }

        if ((this.ypos + this.radius) > window_height)
        {
            this.dy = -this.dy;
        }

        this.xpos += this.dx;
        this.ypos += this.dy;
    }
}

let getDistance = (xpos1, ypos1, xpos2, ypos2)=>{
    var result = Math.sqrt(Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2));
    return result; 
}

let my_circle1 = new Circle(500, 800, 50, 'black', 'A', 4);
let my_circle2 = new Circle(300, 300, 200, 'black', 'B', 0);

my_circle1.draw(context);
my_circle2.draw(context);

let updateCircle = ()=>{
    requestAnimationFrame(updateCircle);
    context.clearRect(0, 0, window_width, window_height);
    my_circle1.update();
    my_circle2.update();

    if (getDistance(my_circle1.xpos, my_circle1.ypos, my_circle2.xpos, my_circle2.ypos) < my_circle2.radius + my_circle1.radius)
    {
        my_circle2.color = 'red';
    }

    if (getDistance(my_circle1.xpos, my_circle1.ypos, my_circle2.xpos, my_circle2.ypos) >= my_circle2.radius + my_circle1.radius)
    {
        my_circle2.color = 'black';
    }
}

updateCircle();