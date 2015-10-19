var game = new Phaser.Game(1000, 660, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var moveCount = 0;
//var player = new Player("x");
var playerTurn;
var sprite, sprite2;

var EMPTY_SPACE = " ";
var board = [[EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]];
var currentBoard = null;

function preload() {
    game.load.image('o', 'assets/images/o.svg');
    game.load.image('x', 'assets/images/x.png');
}

function create() {
    var graphics = game.add.graphics(0, 0);
    
    //Global Variables
    style = {fill: 'black', font: '40pt Courier'};
    
    game.stage.backgroundColor = 0xffffff;
    graphics.lineStyle(8, 0x000000);

    
    //Makes a tic tac toe board that is 600 pixels squared
    for (var i = 1; i < 3; i++) {
        graphics.moveTo(620 * (i / 3) + 10, 20);
        graphics.lineTo(620 * (i / 3) + 10, 620);
        
        graphics.moveTo(20, 620 * (i / 3) + 10);
        graphics.lineTo(620, 620 * (i / 3)+ 10);
    }
    
    game.input.onDown.add(mouseClicked, this);
    
    playerTurn = true;
    clearBoard();
}

function whoGoesFirst() {
    rand = Math.random();
    
    if (rand < 0.5) 
        return true;
    else 
        return false;
}

function update() {
    
}

function opponentTurn() {
        console.log("opponent Turn");
        var moveMade = false;
        while (!moveMade) {
            randX = Math.floor(Math.random() * 3);
            randY = Math.floor(Math.random() * 3);
            
            console.log(board);
            console.log("randX: " + randX + " randY: " + randY);
            console.log("conditional " + (board[randY][randX] == EMPTY_SPACE) + " " + board[randY][randX]);
            if (board[randY][randX] == EMPTY_SPACE) {
                setMove("o", randX, randY);
                moveMade = true;
            }
            console.log(board[randY][randX]);
        }    
}

function mouseClicked() {
    if (playerTurn) {
        //A 3rd of the board size(600)
        var num = 1/3 * 600;
            //This code checks where you made your move
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) { 
                    if (game.input.x > num * x && game.input.x < num * x + num && game.input.y > num * y && game.input.y < num * y + num) {
                        if (board[y][x] != EMPTY_SPACE)
                            return;
                        setMove('x', x, y);
                    }
                }
            }
        opponentTurn();
    }
}


function clearBoard() {
    board = [[EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]];
    moveCount = 0;
}

function sleep(milliseconds) {
    console.log("sleep");
    var start = new Date().getTime();
    
    while ((new Date().getTime() - start) < milliseconds);
}

//Makes move on board and changes player turn
function setMove(type, x, y) {
    board[y][x] = type;
    moveCount++;
    game.add.text(200 * x + 100, 200 * y + 100, type, style);
    console.log("draw");
    playerTurn = !playerTurn;
    
    if (checkForWin(board, x, y, type)) 
        gameOver(type);
    
}

function checkForWin(board, x, y, type) {
    //Gets the x coordinate of the last move and
    //checks that column for a win
    for (var i = 0; i < 3; i++) {
        if (board[i][x] != type)
            break;
        if (i == 2) 
            return true;
    }
    
    //Gets the y coordinate of the last move and
    //checks that row for a win
    for (var i = 0; i < 3; i++) {
        if (board[y][i] != type) 
            break;
        if (i == 2) 
            return true;
    }
    
    //If we are on a diagonal
    for (var i = 0; i < 3; i++) {
        if (board[i][i] != type) 
            break;
        if (i == 2) 
            return true;
    }
    
    //Backwards Diagonal
    for (var i = 0; i < 3; i++) {
        if (board[i][2 - i] != type) 
            break;
        if (i == 2) 
            return true;
    }   
    
    return false;
}

function gameOver(type) {
    //set to false in order to solve bug of playing after end
    playerTurn = false;
    game.add.text(750, 300, type + " wins", style);
    shutdown();
}