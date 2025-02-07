var c = document.getElementById("canvas");
const ctx = c.getContext("2d");
_ = c.style.width
var width_px = window.innerWidth * Number(_.slice(0, -1)) / 100 
c.style.width = `${width_px}px`
c.style.height = `${width_px}px`

const scale = window.devicePixelRatio
canvas.width = width_px * scale
canvas.height = width_px * scale
ctx.scale(scale, scale)

var height_gap_between_pegs
var width_gap_between_pegs


class Ball {
    constructor(x, y, r, color, layers) {
        width_gap_between_pegs = width_px / (layers + 1)
        height_gap_between_pegs = width_px / layers


        this.x = width_px / 2
        this.y = height_gap_between_pegs
        this.r = r
        this.color = color
        this.layers = layers
        this.position = [0, 0]
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color
        ctx.fill();
        ctx.closePath();
    }

    dropOneLayer() {
        var possible_x_change = [-1, 1]
        var x_change = possible_x_change[Math.floor(Math.random() * 2)]
        this.position[0] += 1
        this.position[1] += x_change
        console.log(this.position)
        // this.draw_new(x_change)
    }

    dropToBottom() {
        for (var i = 0; i < this.layers; i++) {
            this.dropOneLayer()
            console.log("dropped")
        }
    }

    draw_new(dir) {
        this.x += dir * width_gap_between_pegs
        this.y += height_gap_between_pegs
        this.draw()
    }
}


function drawBoard(layers) {
    height_gap_between_pegs = width_px / layers
    width_gap_between_pegs = width_px / (layers + 1)
    for (var i = 0; i < layers; i++) {
        // ctx.beginPath();
        // ctx.moveTo(0, i * height_gap_between_pegs)
        // ctx.lineTo(width_px, i * height_gap_between_pegs)
        // ctx.strokeStyle = "black"
        // ctx.stroke();
        // ctx.closePath();
        for (var j = 0; j < i; j++) {
            var peg_x = (j + 1) * width_gap_between_pegs + (c.width/2 - (i+1)/2 * width_gap_between_pegs)
            console.log(peg_x)
            var peg_y = i * height_gap_between_pegs
            ctx.beginPath();
            ctx.arc(peg_x, peg_y, width_px/130, 0, 2 * Math.PI);
            ctx.strokeStyle = "black"
            ctx.stroke();
            ctx.closePath();
        }
    }
}


ball = new Ball(15, "black", 10)
ball.dropToBottom()

drawBoard(10)

