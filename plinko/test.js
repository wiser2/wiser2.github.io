// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

var ceiling = Bodies.rectangle(0, -100, 800, 100, { isStatic: true });
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var peg = Bodies.circle(400, 300, 5, { isStatic: true });
var ball = Bodies.circle(370 + (Math.random() - 0.5) * 1.5, 75 + (Math.random() - 0.5) * 1.5, 10, { isStatic: false });
Matter.Body.setInertia(ball, 7)


var bet_input = document.getElementById('bet')

bet_input.value = 1

var score = 100.0;
var bet = parseFloat(bet_input.value)

var runs = 0;


// make a pyramid of pegs
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < i; j++) {
        var peg = Bodies.circle(400 + j * 60 - (i * 30), i * 50 + 75, 7, { isStatic: true });
        Composite.add(engine.world, peg);
        if (i == 9) {
            var wall = Bodies.rectangle(400 + j * 60 - (i * 30), 580, 10, 50, { isStatic: true });
            Composite.add(engine.world, wall);
        }
    }
}

var left_wall = Bodies.rectangle(70, 580, 10, 50, { isStatic: true });
var right_wall = Bodies.rectangle(670, 580, 10, 50, { isStatic: true });
Composite.add(engine.world, [left_wall, right_wall]);

function reset_ball() {
    if (runs == 0) {
        Composite.add(engine.world, ball);
    }

    runs = runs + 1
    finished = false
    score_calculated = false
    frames = 0

    bet = parseFloat(bet_input.value)
    score = parseFloat(score) - bet
    score = parseFloat(score).toFixed(2)
    document.getElementById('score').innerHTML = score

    var new_x = 370 + (Math.random() - 0.5) * 1.5
    var new_y = 75 + (Math.random() - 0.5) * 1.5
    Matter.Body.translate(ball, { x: new_x - ball.position.x, y: new_y - ball.position.y })
    Matter.Body.setVelocity(ball, { x: 0, y: 0 })

}

function check_for_finish() {
    if (ball.position.y > 568) {
        console.log('at bottom')
        finished = true
    }
}

function check_multiplier() {
    var multiplier = 1
    var x = ball.position.x
    if (ball.position.y > 568) {
        if (320 < x && x < 415) {
            // console.log('0.1x')s
            multiplier = 0.1
        } else if (260 < x && x < 320 || 425 < x && x < 480) {
            // console.log('0.6x')
            multiplier = 0.6
        } else if (200 < x && x < 260 || 480 < x && x < 535) {
            // console.log('3x')
            multiplier = 3
        } else if (140 < x && x < 200 || 545 < x && x < 595) {
            // console.log('50x')
            multiplier = 50
        } else if (80 < x && x < 140 || 605 < x && x < 655) {
            // console.log('1000x')
            multiplier = 1000
        }
    }
    score = parseFloat(score) + bet * multiplier
    score = parseFloat(score).toFixed(2)
    console.log(bet * multiplier)
    document.getElementById('score').innerHTML = score
    score_calculated = true
}

// add all of the bodies to the world
Composite.add(engine.world, [ground, ceiling]);

// run the renderer
Render.run(render);

var frames = 0.0;
var finished = false;
var score_calculated = false;
// create runner
(function run() {
    frames += 1
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);

    if (frames > 100 && !finished) {
        check_for_finish()
    } else if (finished && !score_calculated) {
        check_multiplier()
    }
    

})();