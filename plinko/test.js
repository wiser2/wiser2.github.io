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

const ball_category = 0x0001
const peg_category = 0x0002
const ground_category = 0x0004

var ceiling = Bodies.rectangle(0, -100, 800, 100, { isStatic: true });
var ground = Bodies.rectangle(400, 610, 810, 60, { 
    isStatic: true,
    collisionFilter: {
        category: ground_category,
        mask: ball_category
    }
 });
var peg = Bodies.circle(400, 300, 5, { isStatic: true });
var ball = Bodies.circle(370 + (Math.random() - 0.5) * 1.5, 75 + (Math.random() - 0.5) * 1.5, 10, { isStatic: false });
Matter.Body.setInertia(ball, 7)


var bet_input = document.getElementById('bet')

bet_input.value = 1

var score = 100.0;
var bet = parseFloat(bet_input.value)

var runs = 0;

var balls = []



class Ball {
    constructor() {
        this.finished = false
        this.frames = 0
        this.bet = bet_input.value
        this.score_calculated = false

        this.body = Bodies.circle(366.9 + (Math.random() - 0.5), 75 + Math.random(), 10, {
            collisionFilter: {
                category: ball_category,
                mask: peg_category | ground_category
            }
        });
        Matter.Body.setInertia(this.body, 8)
        Composite.add(engine.world, this.body);

        score = score - this.bet
        document.getElementById('score').innerHTML = score

        console.log('making ball')
        balls.push(this)
    }


}




// make a pyramid of pegs
for (var i = 0; i < 10; i++) {
    for (var j = 0; j < i; j++) {
        const peg = Bodies.circle(400 + j * 66 - (i * 33), i * 50 + 75, 7, {
            collisionFilter: {
                category: peg_category,
                mask: ball_category
            }, isStatic: true
        });
        Composite.add(engine.world, peg);
        if (i == 9) {
            var wall = Bodies.rectangle(400 + j * 66 - (i * 33), 580, 10, 50, {
                isStatic: true,
                collisionFilter: {
                    category: ground_category,
                    mask: ball_category
                }
            });
            Composite.add(engine.world, wall);
        }
    }
}

var left_wall = Bodies.rectangle(37, 580, 10, 50, {
    isStatic: true,
    collisionFilter: {
        category: ground_category,
        mask: ball_category
    }
});
var right_wall = Bodies.rectangle(703, 580, 10, 50, {
    isStatic: true,
    collisionFilter: {
        category: ground_category,
        mask: ball_category
    }
});
Composite.add(engine.world, [left_wall, right_wall]);


function reset_ball() {
    ball = new Ball()
}

function check_for_finish(ball_obj) {
    if (ball_obj.body.position.y > 566) {
        console.log('at bottom')
        ball_obj.finished = true
    }
}

function check_multiplier(ball_obj) {
    var multiplier = 1
    var x = ball_obj.body.position.x
    if (ball_obj.body.position.y > 566) {
        if (287 < x && x < 435) {
            multiplier = 0.1
        } else if (227 < x && x < 287 || 440 < x && x < 498) {
            multiplier = 0.3
        } else if (167 < x && x < 227 || 498 < x && x < 551) {
            multiplier = 1
        } else if (107 < x && x < 167 || 579 < x && x < 630) {
            multiplier = 20
        } else if (47 < x && x < 107 || 630 < x && x < 700) {
            multiplier = 50
        }
    }
    console.log(multiplier)
    score = parseFloat(score) + bet * multiplier
    score = parseFloat(score).toFixed(2)
    console.log(bet * multiplier)
    document.getElementById('score').innerHTML = score
    ball_obj.score_calculated = true
}


function deleteAllBalls() {
    for (var i = 0; i < balls.length; i++) {
        Composite.remove(engine.world, balls[i].body)
    }
    balls = []
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
    // frames += 1

    for (var i = 0; i < balls.length; i++) {
        balls[i].frames += 1
    }
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);

    for (var i = 0; i < balls.length; i++) {
        if (balls[i].frames > 100 && !balls[i].finished) {
            check_for_finish(balls[i])
        } else if (balls[i].finished && !balls[i].score_calculated) {
            check_multiplier(balls[i])
        }
    }
    // if (frames > 100 && !finished) {
    //     check_for_finish()
    // } else if (finished && !score_calculated) {
    //     check_multiplier()
    // }
    

})();