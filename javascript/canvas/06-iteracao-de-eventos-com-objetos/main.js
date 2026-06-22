let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

class Circle {
    constructor(xpoint, ypoint, radius, color)
    {
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.arc(this.xpoint, this.ypoint, this.radius, 0, Math.PI*2, false);
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 4;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    changeColor(newColor)
    {
        this.color = newColor;
        this.draw(context);
    }

    clickCircle(xmouse, ymouse)
    {
        const distance = Math.floor(Math.sqrt(Math.pow(xmouse - this.xpoint, 2) + Math.pow(ymouse - this.ypoint, 2), 2));

        if (distance < this.radius)
        {
            this.changeColor('red');
            return true;
        }
        else
        {
            this.changeColor('darkgreen');
            return false;
        }        
    }
}

let circle = new Circle(200, 200, 100, 'darkgreen');
circle.draw(context);

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    circle.clickCircle(x, y);
})