//#region Global variables
var board = document.getElementById("board"); //the table containing all game tiles
var tiles = document.getElementsByClassName("tile"); //game tiles in DOM
var tileValues = []; //game tile's values - in the matching order;
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
//#endregion
//#region DOM event functions
document.body.onload = function() {
    showMenu();
};
//#endregion
//#region Menu
function showMenu() {
    var menu = document.getElementById("menu"); //the game menu
    var menuButtons = document.getElementsByClassName("mb"); //the buttons in the menu

    menu.style.display = "block";
    for (var i = 0; i < menuButtons.length; ++i) {
        menuButtons[i].addEventListener("click", menuSelected);
    }
}

function hideMenu() {
    var menu = document.getElementById("menu"); //the game menu
    var menuButtons = document.getElementsByClassName("mb"); //the buttons in the menu

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
//#endregion
//#region Board
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
            tiles[i * x + j].addEventListener("click", tileClickPreGame);
        }
    }
    board.style.display = "table";
}
//#endregion
//#region Pregame functions
function initGame() {
    hideMenu();
    createBoard(gi[gm].x, gi[gm].y);
}

function tileClickPreGame(e) {
    var i = 0;
    for (; i < tiles.length; ++i)
        if (tiles[i] == e.target)
            break;
    startGame(i % gi[gm].x, Math.floor(i / gi[gm].x));
}
//#endregion
//#region Game startup functions
function startGame(x, y) {
    distributeMines();
    assignNumbers();
}

function distributeMines() {
    var tileCount = gi[gm].x * gi[gm].y; //number of tiles on the board
    tileValues = []; //array containing the values of all cells
    var randIndeces = []; //random indexes

    //initialize and populate arrays
    for (var i = 0; i < tileCount; ++i) {
        tileValues.push("empty");
        randIndeces.push(i);
    }
    randIndeces = shuffle(randIndeces); //shuffle the random numbers

    //sprinkle mines on board
    for (var i = 0; i < gi[gm].m; ++i) {
        tileValues[randIndeces[i]] = "mine";
    }
}

function assignNumbers() {
    neighbors = [];
    //TODO:
}
//#endregion
//#region Utillities
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
//#endregion
//#region Debug
function printBoardToConsole() {
    var rowOfTilesDEBUG = "";
    for (var i = 0; i < gi[gm].y; ++i) {
        for (var j = 0; j < gi[gm].x; ++j) {
            rowOfTilesDEBUG += tileValues[i * gi[gm].x + j] + "\t";
        }
        console.log(rowOfTilesDEBUG);
        rowOfTilesDEBUG = "";
    }
}
//#endregion