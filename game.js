"use strict";

function existy(x) {
    return x != null
}

this.LibraryEvac = {}

// tiles
var SPACE      = 0
    , DESK     = 1
    , WALL     = 2
    , DOOR     = 3
    , STAIRS   = 4
    , BOOKCASE = 5

var MAP_DATA_KEY = {
    ' ' : SPACE,
    'D' : DESK,
    '|' : WALL,
    '=' : DOOR,
    '#' : STAIRS,
    '*' : BOOKCASE,
}

var IMAGES = {}

var tileWidth  = 36
var tileHeight = 36

function lines(string) {
    return string.split("\n")
}

function loadFloorFromData(textData) {
    var floor = makeFloor()
    lines(textData).forEach(addLineToFloor(floor))
    return floor
}

function makeFloor() {
    return { type: 'floor', data: [] }
}

function addLineToFloor(floor) {
    return function(line) {
        floor.data.push(parseLine(line))
    }
}

function parseLine(line) {
    return line.split('').map(fromMapData)
}

function fromMapData(char) {
    var x = MAP_DATA_KEY[char]
    if (!existy(x)) {
        throw new Error("unknown map data character " + char)
    }
    return x
}

// Load the floor at the given path. Uses AJAX; pass a callback, which will be
// passed one argument (the floor) when loaded.
function loadFloor(floorPath, callback) {
    var req = new XMLHttpRequest()

    req.overrideMimeType('text/plain')
    req.onload = function() { callback(loadFloorFromData(this.responseText)) }
    req.open('GET', floorPath)
    req.send()
}

function iterateFloor(floor, callback) {
    var d = floor.data
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            callback(i, j)
        }
    }
}

function drawFloor(context, floor) {
    iterateFloor(floor, function(i, j) {
        var x = i * tileWidth
        var y = j * tileHeight
        drawTile(context, tileAt(floor, i, j), x, y)
    })
}

function tileAt(floor, i, j) {
    return floor.data[i][j]
}

function drawTile(context, tile, x, y) {
    context.drawImage(imageForTile(tile), x, y)
}

function imageForTile(tile) {
    switch (tile) {
        case SPACE : return IMAGES.carpet
        case WALL  : return IMAGES.wall
        default    : return null
    }
}

function loadImages(callback) {
    var imgs = {
        carpet: 'carpet.png',
        wall: 'wall.png',
    }

    for (var i in imgs) {
        IMAGES[i] = createImg(imgs[i])
    }

    // hack
    setTimeout(1000, function() { callback() })

    function createImg(src) {
        var img = document.createElement('img')
        img.src = src
        return img
    }
}

LibraryEvac.start = function start() {
    var canvas  = document.getElementById("canvas")
    var context = canvas.getContext("2d")
    var imgs    = loadImages(function() {
        console.log("here")
        loadFloor('ground-floor.txt', function(floor) {
            drawFloor(context, floor)
        })
    })
}
