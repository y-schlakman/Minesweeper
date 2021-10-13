//#region Global variables
var board = document.getElementById("board"); //the table containing all game tiles
var tiles = document.getElementsByClassName("tile"); //game tiles in DOM
var tileSizePX = "2.5vw";
boxFontSize = "1.5vw";
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
        "x": 30,
        "y": 16,
        "m": 99
    }
}; //game info
alert(window.innerWidth + ", " + window.innerHeight);
if (window.innerWidth / window.innerHeight < 1) {
    var tmp = gi.e.x;
    gi.e.x = gi.e.y;
    gi.e.y = tmp;
    tileSizePX = "3vh";
    boxFontSize = "2.5vh";
}
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
            td.style.height = tileSizePX; //"100px"; //tHeightPcnt + "%";
            td.style.width = tileSizePX; //"100px"; //tWidthPcnt + "%";
            td.style.margin = "0";
            td.style.padding = "0";
            td.style.outline = '1px solid black';
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

function updateBoard() {
    for (var i = 0; i < tileValues.length; ++i) {
        if (tileValues[i] == "mine")
            tiles[i].innerHTML = "<img style=\"margin:0; padding:0; height: 100%; width:100%;\" src=\"./flag.png\"/>"
        else if (tileValues[i] != 0)
            tiles[i].innerHTML = "<center><h3 style=\"margin: 0; padding: 0; font-size: " + boxFontSize + ";\">" + tileValues[i] + "</h3></center>";
        else
            tiles[i].innerHTML = "";
    }
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
    distributeMines(x, y);
    assignNumbers();
    updateBoard();
}

function distributeMines(x, y) {
    var tileCount = gi[gm].x * gi[gm].y; //number of tiles on the board
    tileValues = []; //array containing the values of all cells
    var randIndeces = []; //random indexes

    //initialize and populate arrays
    for (var i = 0; i < tileCount; ++i) {
        tileValues.push(0);
        if (i != y * gi[gm].x + x)
            randIndeces.push(i);
    }
    randIndeces = shuffle(randIndeces); //shuffle the random numbers

    //sprinkle mines on board
    for (var i = 0; i < gi[gm].m; ++i) {
        tileValues[randIndeces[i]] = "mine";
    }
}

function assignNumbers() {
    for (var i = 0; i < tileValues.length; ++i) {
        if (tileValues[i] == "mine")
            continue;
        else
            tileValues[i] = getTileMineCount(i);
    }
}

function getTileMineCount(index) {
    count = 0;
    var neighborIneces = getTileNeighbors(index);
    for (var i = 0; i < neighborIneces.length; ++i)
        if (tileValues[neighborIneces[i]] == "mine")
            ++count;
    return count;
}

function getTileNeighbors(index) {
    var tl = index - gi[gm].x - 1,
        tm = tl + 1,
        tr = tl + 2,
        ml = index - 1,
        mr = index + 1,
        bl = index + gi[gm].x - 1,
        bm = bl + 1,
        br = bl + 2;
    var neighborIndeces = [tl, tm, tr, ml, mr, bl, bm, br];

    if (index < gi[gm].x) //tile in top row
    {
        neighborIndeces = neighborIndeces.filter(function(neighbor) { return neighbor != tl && neighbor != tm && neighbor != tr; });
    } else if (index + 1 > gi[gm].x * (gi[gm].y - 1)) //tile in bottom row
    {
        neighborIndeces = neighborIndeces.filter(function(neighbor) { return neighbor != bl && neighbor != bm && neighbor != br; });
    }
    if ((index + 1) % gi[gm].x == 0) //tile in the right column
    {
        neighborIndeces = neighborIndeces.filter(function(neighbor) { return neighbor != tr && neighbor != mr && neighbor != br; });
    } else if (index % gi[gm].x == 0) //tile in the left column
    {
        neighborIndeces = neighborIndeces.filter(function(neighbor) { return neighbor != tl && neighbor != ml && neighbor != bl; });
    }
    return neighborIndeces;
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