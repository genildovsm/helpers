let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
var window_height = window.innerHeight;
var window_width = window.innerWidth;
let count_colisions = 0;

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
        context.clearRect(0, 0, window_width, window_height);

        this.text = count_colisions;
        this.draw(context);

        if ((this.xpos + this.radius) > window_width)
        {
            this.dx = -this.dx;
            count_colisions ++;
        }

        if ((this.xpos - this.radius) < 0)
        {
            this.dx = -this.dx;
            count_colisions ++;
        }

        if ((this.ypos - this.radius) < 0)
        {
            this.dy = -this.dy;
            count_colisions ++;
        }

        if ((this.ypos + this.radius) > window_height)
        {
            this.dy = -this.dy;
            count_colisions ++;
        }

        this.xpos += this.dx;
        this.ypos += this.dy;
    }
}

let my_circle = new Circle(300, 300, 200, '#3e73e6', count_colisions, 5);

my_circle.draw(context);

let updateCircle = ()=>{
    requestAnimationFrame(updateCircle);
    my_circle.update();
}

updateCircle();