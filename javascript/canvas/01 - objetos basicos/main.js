/** @type {HTMLCanvasElement} */ 
const canvas = document.getElementById('canvas');

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height;

canvas.style.backgroundColor = '#ff8'

ctx.fillStyle = 'green'
ctx.fillRect(10, 10, 100, 100);

ctx.fillStyle = 'red'
ctx.fillRect(10, 120, 100, 100);

ctx.beginPath();
ctx.strokeStyle = 'blue'
ctx.lineWidth = '4'
ctx.arc(180, 60, 50, 0, Math.PI*2, false)
ctx.stroke();
ctx.closePath