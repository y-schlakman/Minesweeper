/*
begginer: 10*10 m: 10;
intermediate: 16*16 m: 40;
expert: 16*30 m: 99;
*/
var menu = document.getElementById("menu");
var menuButtons = document.getElementsByClassName("mb");
var board = document.getElementById("board");
var tiles = document.getElementsByClassName("tile"); //game tiles
var tileValues;
var gi = {
    "b": {
        "x": 8,
        "y": 8,
        "m": 10
    },
    "i": {
        "x": 13,
        "y": 15,
        "m": 40
    },
    "e": {
        "x": 16,
        "y": 30,
        "m": 99
    }
}; //game info
var gm; //game mode
var bx = 0; //board x
var by = 0; //board y

document.body.onload = function() {
    showMenu();
}

function showMenu() {
    menu.style.display = "block";
    for (var i = 0; i < menuButtons.length; ++i) {
        menuButtons[i].addEventListener("click", menuSelected);
    }
}

function hideMenu() {
    menu.style.display = "none";
    for (var i = 0; i < menuButtons.length; ++i) {
        menuButtons[i].removeEventListener("click", menuSelected);
    }
}

function menuSelected(e) {
    if (e.target.id == "beginner")
        gm = "b";
    else if (e.target.id == "intermediate")
        gm = "i";
    else if (e.target.id == "expert")
        gm = "e";
    initGame();
}

function initGame() {
    hideMenu();
    createBoard(gi[gm].x, gi[gm].y);
}

function createBoard(x, y) {
    tHeightPcnt = y / 100;
    tWidthPcnt = x / 100;
    for (var i = 0; i < y; i++) {
        var tr = board.insertRow();
        for (var j = 0; j < x; j++) {
            var td = tr.insertCell();
            td.style.height = tHeightPcnt + "%";
            td.style.width = tWidthPcnt + "%";
            td.style.border = '1px solid black';
            td.style.backgroundColor = "";
            td.setAttribute('class', "tile");
            tiles[i * x + j].addEventListener("mouseover", function(e) {
                e.target.style.backgroundColor = "blue";
            });
            tiles[i * x + j].addEventListener("mouseout", function(e) {
                e.target.style.backgroundColor = "";
            });
            tiles[i * x + j].addEventListener("click", tileClick);
        }
    }
    board.style.display = "table";
}

function tileClick(e) {
    var i = 0;
    for (; i < tiles.length; ++i)
        if (tiles[i] == e.target)
            break;
    startGame(i % gi[gm].x, Math.floor(i / gi[gm].x));
}

function startGame(x, y) {
    console.log("starting game at x:" + x + ", y:" + y);
    distributeMines();
    assignNumbers();
}

function distributeMines() {
    var tileCount = gi[gm].x * gi[gm].y; //number of tiles on the board
    var mCount = gi[gm].m; //mines left to distribute
    var chance = gi[gm].m / tileCount; //chance to be a mine
    tileValues = []; //array containing the values of all cells
    var randIndexes = []; //random indexes

    //initialize and populate arrays
    for (var i = 0; i < tileCount; ++i) {
        tileValues.push("empty");
        randIndexes.push(i);
    }
    randIndexes = shuffle(randIndexes); //shuffle the random numbers

    //sprinkle mines
    do {
        for (var i = 0; i < tileCount && mCount > 0; ++i) {
            if (tileValues[randIndexes[i]] == "empty") {
                if (Math.random() < chance) {
                    tileValues[randIndexes[i]] = "*";
                    --mCount;
                } else {
                    tileValues[randIndexes[i]] = "empty";
                }
            }
        }
    } while (mCount > 0);
}

function assignNumbers() {
    neighbors = [];
    //TODO:
}

//utils
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}