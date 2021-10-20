//#region Global variables
var mineImg = "<img class=\"cellImage\" src=\"./mine.png\"/>";
var flagImg = "<img class=\"cellImage\" src=\"./flag.png\"/>";
var numberImg = "<img class=\"cellImage\" src=\"./numberImages/Minesweeper_%NUMBER%.svg.png\"/>"
var board = document.getElementById("board"); //the table containing all game tiles
var tiles = document.getElementsByClassName("tile"); //game tiles in DOM
var tileSizePX = "2.5vw";
boxFontSize = "1.5vw";
var tileValues = []; //game tile's values - in the matching order;
var flagIndeces = []; //the indeces that contain a flag
var uncoveredIndeces = [];
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
if (window.innerWidth / window.innerHeight < 1) {
    var tmp = gi.e.x;
    gi.e.x = gi.e.y;
    gi.e.y = tmp;
    tileSizePX = "3vh";
    boxFontSize = "2.5vh";
}
var gm; //game mode
var cm; //tile selection mode.
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
//#region Controls
function showControls() {
    var ctrls = document.getElementById("controls"); //the game menu
    var ctrlButtons = document.getElementsByClassName("cb"); //the buttons in the menu

    ctrls.style.display = "block";
    for (var i = 0; i < ctrlButtons.length; ++i) {
        ctrlButtons[i].addEventListener("click", controlSelected);
    }
}

function hideControls() {
    var ctrls = document.getElementById("controls"); //the game menu
    var ctrlButtons = document.getElementsByClassName("cb"); //the buttons in the menu

    ctrls.style.display = "none";
    for (var i = 0; i < ctrlButtons.length; ++i) {
        ctrlButtons[i].removeEventListener("click", controlSelected);
    }
}

function controlSelected(e) {
    if (e.target.id == "mineModeBtn")
        cm = "mine";
    else if (e.target.id == "flagModeBtn")
        cm = "flag";
    alert(cm);
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
            /*tiles[i * x + j].addEventListener("mouseover", function(e) {
                e.target.style.backgroundColor = "blue";
            });
            tiles[i * x + j].addEventListener("mouseout", function(e) {
                e.target.style.backgroundColor = "";
            });*/
            tiles[i * x + j].addEventListener("click", tileClickPreGame);
        }
    }
    board.style.display = "table";
}

function revealWholeBoard() {
    indeces = new Array(gi[gm].x * gi[gm].y);
    for (var i = 0; i < indeces.length; ++i) {
        indeces[i] = i;
    }
    updateBoard(indeces);
}

function updateBoard(indeces = "DEBUG") {
    if (indeces == "DEBUG") {
        indeces = new Array(gi[gm].x * gi[gm].y);
        for (var i = 0; i < indeces.length; ++i) {
            indeces[i] = i;
        }
    }
    for (var i = 0; i < indeces.length; ++i) {
        if (tileValues[indeces[i]] == "mine") {
            tiles[indeces[i]].innerHTML = mineImg;
            tiles[indeces[i]].style.backgroundColor = "#b9b9b9";
        } else if (tileValues[indeces[i]] != 0) {
            tiles[indeces[i]].innerHTML = numberImg.replace("%NUMBER%", tileValues[indeces[i]]);
            tiles[indeces[i]].style.backgroundColor = "#b9b9b9";
            //tiles[indeces[i]].innerHTML = "<center><h3 style=\"margin: 0; padding: 0; font-size: " + boxFontSize + ";\">" + tileValues[indeces[i]] + "</h3></center>";
        } else {
            tiles[indeces[i]].innerHTML = "";
            tiles[indeces[i]].style.backgroundColor = "grey";
        }
        if (uncoveredIndeces.indexOf(indeces[i]) == -1) {
            uncoveredIndeces.push();
        }
        if (uncoveredIndeces.length == gi[gm].x * gi[gm].y)
            gameWon();
    }
}

function updateTileFlag(index, updateType) {
    if (updateType == "unFlag")
        tiles[index].innerHTML = "";
    else if (updateType == "flag")
        tiles[index].innerHTML = flagImg;
}
//#endregion
//#region Pregame functions
function initGame() {
    hideMenu();
    showControls();
    createBoard(gi[gm].x, gi[gm].y);
}

function tileClickPreGame(e) {
    for (var i = 0; i < tiles.length; ++i)
        if (tiles[i] == e.target) {
            startGame(i % gi[gm].x, Math.floor(i / gi[gm].x));
            return;
        }
}
//#endregion
//#region Game startup functions
function startGame(x, y) {
    distributeMines(x, y);
    assignNumbers();
    //updateBoard("DEBUG");
    for (var i = 0; i < tiles.length; ++i) {
        tiles[i].removeEventListener("click", tileClickPreGame);
        tiles[i].addEventListener("click", tileClickInGame);
    }
    tiles[y * gi[gm].x + x].click();
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

function getTileNeighbors(index, noDiagonals = false) {
    var tl = index - gi[gm].x - 1,
        tm = tl + 1,
        tr = tl + 2,
        ml = index - 1,
        mr = index + 1,
        bl = index + gi[gm].x - 1,
        bm = bl + 1,
        br = bl + 2;
    if (noDiagonals)
        var neighborIndeces = [tm, ml, mr, bm];
    else
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
//#region In game functions
function tileClickInGame(e) {
    for (var i = 0; i < tiles.length; ++i)
        if (tiles[i] == e.target) {
            var toUpdate, updateType;
            if (cm == "flag") {
                if (flagIndeces.indexOf(i) == -1) {
                    flagIndeces.push(i);
                    updateType = "flag";
                } else {
                    flagIndeces = flagIndeces.filter(function(flagIndex) { return flagIndex != i; });
                    updateType = "unFlag";
                }
                updateTileFlag(i, updateType);
            } else {
                if (tileValues[i] == "mine" && flagIndeces.indexOf(i) == -1) {
                    GameOver(i);
                } else {
                    toUpdate = tileClickInGameRecursive(i);
                    updateBoard(toUpdate);
                }
            }
        }
}

function tileClickInGameRecursive(index, clicked = []) {
    var neighborIndeces = getTileNeighbors(index).filter(
        function(neighborIndex) {
            return clicked.indexOf(neighborIndex) == -1;
        }
    );
    if (tileValues[index] == "mine") {
        return clicked;
    } else if (tileValues[index] > 0) {
        //alert(tileValues[index]);
        clicked.push(index);
        return clicked;
    } else {
        clicked.push(index);
    }
    for (var i = 0; i < neighborIndeces.length; ++i) {
        clicked = tileClickInGameRecursive(neighborIndeces[i], clicked);
    }
    return clicked;
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
//#region End game
function GameOver(i) {
    revealWholeBoard();
    tiles[i].style.backgroundColor = "red";
    setTimeout(function() {
        alert("Game Over!!!");
        location.reload();
    }, 1500);
}

function gameWon() {
    alert("win!!!");
    location.reload();
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