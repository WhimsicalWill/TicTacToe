var game = new Phaser.Game(1000, 660, Phaser.AUTO, '', {preload: preload, create: create, update: update});

//var player = new Player("x");
var playerTurn;
var bestMove;
var MAX_DEPTH = 6;


var EMPTY_SPACE = " ";
var board = [[EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]];

var textBoard = [[], 
                 [],
                 []];

function preload() {
    game.load.image('o', 'assets/images/o.svg');
    game.load.image('x', 'assets/images/x.png');
}

function create() {
    var graphics = game.add.graphics(0, 0);
    
    //Global Variables
    style = {fill: 'black', font: '40pt Courier'};
    game.stage.backgroundColor = 0xFFFFFF;

    drawBoard(graphics);
    
    game.input.onDown.add(mouseClicked, this);
    
    var rand = Math.random();
    if (rand < 0.5) 
        playerTurn = false;
    else 
        playerTurn = true;
    console.log(playerTurn);
}

function whoGoesFirst() {
    rand = Math.random();
    
    if (rand < 0.5) 
        return true;
    else {
        return false;
    }
}

function drawBoard(graphics) {
    graphics.lineStyle(3, 0x000000);
    
    //Makes a tic tac toe board that is 600 pixels squared
    for (var i = 1; i < 3; i++) {
        graphics.moveTo(620 * (i / 3) + 10, 20);
        graphics.lineTo(620 * (i / 3) + 10, 620);
        
        graphics.moveTo(20, 620 * (i / 3) + 10);
        graphics.lineTo(620, 620 * (i / 3)+ 10);
    }   
}

function update() {
    if (!playerTurn)
        opponentTurn();
}

function opponentTurn() {
    console.log("opponent Turn");
    console.log("PT: " + playerTurn);
    buildTree(board, playerTurn);
}

function mouseClicked() {
    if (checkForWin(board, "x") || checkForWin(board, "o") || isFull(board)) {
        console.log("mouseclick");
        clearBoard();
        resetBoard();
    }
    else {
        if (playerTurn) {
        //A 3rd of the board size(600)
        var num = 1/3 * 600;
            //This code checks where you made your move
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) { 
                    if (game.input.x > num * x && game.input.x < num * x + num && game.input.y > num * y && game.input.y < num * y + num) {
                        if (board[y][x] != EMPTY_SPACE)
                            return;
                        console.log(x + " " + y);
                        makeMove(board, 'x', x, y);
                    }
                }
            }
        opponentTurn();
        }
        //opponentTurn();
    }
}


function clearBoard() {
    board = [[EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]];
}

function resetBoard() {
    graphics = game.add.graphics(0, 0);
    clearBoard();
    
    graphics.beginFill(0xFFFFFF);
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.drawRect(0, 0, 1000, 660);
    graphics.endFill();
    
    drawBoard(graphics);
    
}

function sleep(milliseconds) {
    console.log("sleep");
    var start = new Date().getTime();
    
    while ((new Date().getTime() - start) < milliseconds);
}

//Makes move on board and changes player turn
function makeMove(board, type, x, y) {
    console.log(board + " type: " + type + " x: " + x + " y: " + y);
    setMove(board, type, x, y);
    textBoard[y][x] = game.add.text(200 * x + 100, 200 * y + 100, type, style);
    playerTurn = !playerTurn;
    if (checkForWin(board, type)) 
        gameOver(type);
    //spaces after tie to push 'wins!' concat off screen
    if (isFull(board))
        gameOver("tie     ");
}   

function setMove(board, type, x, y) {
    //console.log("info: " + type + " " + x + " " + y);
    board[y][x] = type;
}

function checkForWin(board, type) {
    //Gets the x coordinate of the last move and
    //checks that column for a win
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            if (board[y][x] != type)
                break;
            if (x == 2) 
                return true;
        }
    }
    
    //Gets the y coordinate of the last move and
    //checks that row for a win
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (board[y][x] != type) 
                break;
            if (y == 2) 
                return true;
        }
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
    game.add.text(750, 300, type + " wins!", style);
}

function getMoves(board, depth) {
    var moves = [];
    for(var y = 0; y < 3; y++){
        for (var x = 0; x < 3; x++) {
            if(board[y][x] == " ")
                moves.push([y, x]);   
        }
    }
    if (depth == 0)
        console.log("moves " + moves);
    return moves;
}


function randomMove(posMoves) {
    var rand = Math.floor(Math.random() * posMoves.length);
    return posMoves[rand];
}

function buildTree(board, playerTurn) {
    var currPlayer = playerTurn == true ? "x" : "o";
    MAX_DEPTH = 6;
    bestMove = [];
    var alpha = buildTree_r(board, currPlayer, 0);
    //To make sure we don't crash
    if (bestMove[0] != null) 
        makeMove(board, currPlayer, bestMove[1], bestMove[0]);
}

function buildTree_r(board, currPlayer, depth) {
    if (depth > MAX_DEPTH) 
        return 0;

    var otherPlayer = currPlayer == "x" ? "o" : "x";

    if (checkForWin(board, currPlayer)) {
        //console.log("win for " + currPlayer + "  at depth = " + depth);
        return 1;
    }
    
    else if (checkForWin(board, otherPlayer)) {
        //console.log("win for " + otherPlayer + " at depth = " + depth);
        return -1;
    }
    else if (isFull(board)) {
        //console.log("tie found at depth = " + depth);
        return 0;
    }

    var moveList = getMoves(board, depth);
    var alpha = -1;
    var saList = [];

    for (var i = 0; i < moveList.length; i++) {
        var boardCopy = copyBoard(board);
        
        setMove(boardCopy, currPlayer, moveList[i][1], moveList[i][0]);
        
        
        var subalpha = -buildTree_r(boardCopy, otherPlayer, depth + 1);
        if (subalpha == NaN) 
            console.log("NaN");
        if (alpha < subalpha)
            alpha = subalpha;

        //push this subalpha to the subalpha list
        if (depth == 0)
            saList.push(subalpha);
    }

    if (depth == 0) {
        var posMoves = [];
        console.log(saList);
        for (var n = 0; n < saList.length; n++) {
            if (saList[n] == alpha)
                posMoves.push(moveList[n]);
        }
        console.log("posMoves " + posMoves);
        bestMove = randomMove(posMoves);
        console.log("alpha " + alpha);
        console.log("bestMove: (" + bestMove[1] + ", " + bestMove[0] + ")");
    }
    return alpha;   
}

function isFull(board) {
    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            if (board[y][x] == " ")
                return false;
        }
    }
    return true;
}

function copyBoard(board) {
    var boardCopy = [[EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE],
             [EMPTY_SPACE, EMPTY_SPACE, EMPTY_SPACE]];
    for (x = 0; x < 3; x++) {
        for (y = 0; y < 3; y++) {
            boardCopy[y][x] = board[y][x]
        }
    }
    return boardCopy
}