var canvas = document.getElementById("myCanvas"); //Here we're storing a reference to the <canvas> element to the canvas variable

var ctx = canvas.getContext("2d"); //we're creating the ctx variable to store the 2D rendering context — the actual tool we can use to paint on the Canvas.

//starting point at the bottom center part of the Canvas in variables called x and y, then use those to define the position the circle is drawn at.
var x = canvas.width/2;
var y = canvas.height-30;
//we want to add a small value to x and y after every frame has been drawn to make it appear that the ball is moving.
var dx = 2;
var dy = -2;

var ballRadius = 10; //variable called ballRadius that will hold the radius of the drawn circle

//Defining a paddle to hit the ball
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//Pressed buttons can be defined and initialized with boolean variables
var rightPressed = false;
var leftPressed = false;
//the number of rows and columns of bricks , their width and height, the padding between the bricks so they won't touch each other and a top and left offset so they won't start being drawn right from the edge of the Canvas.
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = []; //hold all our bricks in a two-dimensional array.
//loop through the rows and columns and create the new bricks.
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = []; //It will contain the brick columns (c),
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };//which in turn will contain the brick rows (r), which in turn will each contain an object containing the x and y position to paint each brick on the screen
    }
}


function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) { //Again, we're looping through the rows and columns to set the x and y position of each brick, and we're also painting a brick on the Canvas — size brickWidth x brickHeight — with each loop iteration.
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight); //and we're also painting a brick on the Canvas — size brickWidth x brickHeight — with each loop iteration.
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Every 10 milliseconds the canvas is cleared, the blue circle (our ball) will be drawn on a given position and the x and y values will be updated for the next frame.
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();

    //When the distance between the center of the ball and the edge of the wall is exactly the same as the radius of the ball, it will change the movement direction. Subtracting the radius
    //from one edge's width and adding it onto the other gives us the impression of the proper collision detection — the ball bounces off the walls as it should do.
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //check, on every frame, whether the ball is touching the top edge of the Canvas
    if(y + dy < ballRadius) {//If the y value of the ball position is lower than zero,
        dy = -dy;// change the direction of the movement on the y axis by setting it equal to itself, reversed.
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) { //check whether the center of the ball is between the left and right edges of the paddle
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) { //The paddleX position we're using will move between 0 on the left side of the Canvas and canvas.width-paddleWidth on the right hand side
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) { //If the left cursor is pressed, the paddle will move 7 pixels to the left
        paddleX -= 7;
    }


    //update x and y with our dx and dy variable on every frame, so the ball will be painted in the new position on every update.
    x += dx;
    y += dy;
}

document.addEventListener("keydown", keyDownHandler, false);//When the keydown event is fired on any of the keys on your keyboard, the keyDownHandler() function will be executed.
document.addEventListener("keyup", keyUpHandler, false); // keyup events will fire the keyUpHandler() function

function keyDownHandler(e) {
    if(e.keyCode == 39) { // 39 is the right cursor
        rightPressed = true;
    }
    else if(e.keyCode == 37) { // key code 37 is the left cursor key
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false; //When the key is released, the variable is set back to false.
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

setInterval(draw, 10);

//creates a red square. All the instructions are between the beginPath() and closePath() methods.
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50); We are defining a rectangle using rect() //first two values specify the coordinates of the top left corner of the rectangle on the canvas, while the second two specify the width and height of the rectangle.
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();
