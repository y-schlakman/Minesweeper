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
        "x": 10,
        "y": 10,
        "m": 10
    },
    "i": {
        "x": 16,
        "y": 16,
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
    alert(e.target.id);
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
            tiles[i * x + j].addEventListener("touchstart", function(e) {
                e.target.style.backgroundColor = "blue";
            });
            tiles[i * x + j].addEventListener("touchend", function(e) {
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
    var mCount = gi[gm].m; //mines left to distribute
    var chance;
    do {
        for (var i = 0; i < gi[gm].y; ++i) {
            for (var j = 0; j < gi[gm].x; ++j) {}
        }
    } while (mCount != 0);
}

function assignNumbers() {

}