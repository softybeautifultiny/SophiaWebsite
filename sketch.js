let canvas;
let test;
let colors;

let objects = [];

let grid;
let blockM;

class Color {
    constructor() {
        this.RED = "#660C16";
        this.GREEN = "green";
        this.BLUE = "#07305e";
        this.GRAY = "#969DA7";
    }
}

class Grid {
    constructor(cols, rows) {
        this.size = createVector(cols, rows);
        this.cells = [];
        this.filled = [];
        this.w = document.documentElement.clientHeight / 25;
        this.pos = createVector(width / 2 - (cols * this.w) / 2, 0);

        for (let i = 0; i < cols; i++) {
            this.cells.push([]);
            this.filled.push([]);

            for (let j = 0; j < rows; j++) {
                let o = new Obj();

                o.w = this.w;
                o.h = this.w;
                o.pos.x = o.w * i;
                o.pos.y = o.h * j;
                o.pos.x += this.pos.x;
                o.pos.y += this.pos.y;
                o.color = colors.BLUE;
                o.strokeColor = 255;

                this.cells[i].push(o);
                this.filled[i].push(false);
            }
        }

        //console.log(this.filled);

        // board collider
        this.collider = new Obj();
        this.collider.w = this.size.x * this.w - this.w * 2;
        this.collider.h = this.size.y * this.w;
        this.collider.pos = this.pos;
        this.collider.pos.x += this.w;
        this.collider.color = colors.GREEN;
        this.collider.visible = false;
        console.log("FUCK");

        // edges
        this.edges = [];
        this.edges.push(new Obj());
        this.edges.push(new Obj());
        this.edges.push(new Obj());

        this.edges[0].pos.x = this.pos.x;
        this.edges[0].pos.x -= this.w;
        this.edges[0].w = this.w / 2;
        this.edges[0].h = this.size.y * this.w;
        this.edges[0].visible = true;
        this.edges[0].color = colors.GREEN;
        
        this.edges[1].pos.x = this.pos.x + this.w * this.size.x;
        this.edges[1].pos.x -= this.w * 2;
        this.edges[1].pos.x += this.w / 2;
        this.edges[1].w = this.w / 2;
        this.edges[1].h = this.size.y * this.w;

        this.edges[2].pos.x = this.pos.x - this.w;
        this.edges[2].w = this.size.x * this.w;
        this.edges[2].pos.y = this.size.y * this.w - this.w / 2;
        this.edges[2].h = this.w / 2;
    }

    resize() {
        this.w = document.documentElement.clientHeight / 25;
        this.pos = createVector(width / 2 - (this.size.x * this.w) / 2, 0);
        this.collider.w = this.size.x * this.w - this.w*2;
        this.collider.pos.x = this.pos.x + this.w;
        this.collider.pos.y = this.pos.y;
        this.collider.h = this.size.y * this.w;

        // edges
        this.edges[0].pos.x = this.pos.x;
        //this.edges[0].pos.x -= this.w;
        this.edges[0].w = this.w / 2;
        this.edges[0].h = this.size.y * this.w;
        this.edges[0].visible = true;

        this.edges[1].pos.x = this.pos.x + this.w * this.size.x;
        //this.edges[1].pos.x -= this.w * 2;
        this.edges[1].pos.x -= this.w / 2;

        this.edges[1].w = this.w / 2;
        this.edges[1].h = this.size.y * this.w;

        this.edges[2].pos.x = this.pos.x - this.w;
        this.edges[2].w = this.size.x * this.w;
        this.edges[2].pos.y = this.size.y * this.w - this.w / 2;
        this.edges[2].h = this.w / 2;

        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                let o = this.cells[i][j];
                o.w = this.w;
                o.h = this.w;
                o.pos.x = o.w * i;
                o.pos.y = o.h * j;
                o.pos.x += this.pos.x;
                o.pos.y += this.pos.y;
            }
        }
    }

    update() {
  
    }
}

function windowResized() {
    grid.resize();
    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;
    canvas = createCanvas(w - w / 6, h - h / 7);
    resizeCanvas(w - w / 6, h - h / 7);
}

class BlockManager {
    constructor() {
        this.blocks = [];
    }

    createBlock(type) {
        let b = new Block(type);
        this.blocks.push(b);
    }
}

var blockAmount = 0;
class Block {
    constructor(type) {
        this.state = "normal";
        this.blocks = [];
        this.blocksPos = [];
        this.pos = createVector(3, 0);
        this.type = type;
        this.id = blockAmount;
        blockAmount += 1;

        switch (type) {
            case 'l':
                for (let i = 0; i < 4; i++) {
                    var o = new Obj();
                    o.color = colors.RED;
                    o.visible = true;
                    this.blocks.push(o);
                }

                this.blocksPos = [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 1],
                ];
                break;
            case 'i':
                for (let i = 0; i < 5; i++) {
                    var o = new Obj();
                    o.color = colors.RED;
                    this.blocks.push(o);
                }

                this.blocksPos = [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                ];
                break;
        }
    }

    rotateLeft() {
         var np = [];

         np = reverse(np);
         np = transposeArray(this.blocksPos);
         reverse(np);

        this.blocksPos = np;
    }

    rotateRight() {
        for (let i = 0; i < 3; i++) {
            var np = [];

            np = reverse(np);
            np = transposeArray(this.blocksPos);
            reverse(np);

            this.blocksPos = np;
        }
    }

    bound() {
        var edge = false;
        var bottom = false;
        for (let i = 0; i < this.blocks.length; i++) {
            var b = this.blocks[i];
            if (colliding(b, grid.edges[0]) || colliding(b, grid.edges[1])) {
                edge = true;
            }

            if (colliding(b, grid.edges[2])) {
                bottom = true;
            }
        }

        if (edge && this.pos.x < grid.size.x / 2) {
            this.pos.x++;
        } else if (edge) {
            this.pos.x--;
        }

        if (bottom) {
            this.pos.y--;
        }
    }

    safe(xOff=0) {
        for (let i = 0; i < this.blocks.length; i++) {
            var b = this.blocks[i];

            if (colliding(b, grid.collider, xOff) == false) {
                grid.collider.color = colors.GRAY;
                return false;
            }
        }

        return true;
    }

    display() {
        var ind = 0;
        for (let i = 0; i < this.blocksPos.length; i++) {
            for (let j = 0; j < this.blocksPos[0].length; j++) {
                if (this.blocksPos[i][j] == 1) {
                    this.blocks[ind].pos.x = grid.cells[j + this.pos.x][i].pos.x;
                    this.blocks[ind].pos.y = grid.cells[j][i + this.pos.y].pos.y;
                    ind++;
                }
            }
        }
    }
}

function colliding(o, o1, xOff=0) {
    var left = o.pos.x + o.w + xOff > o1.pos.x;
    var right = o.pos.x + xOff < o1.pos.x + o1.w;
    var down = o.pos.y + o.h > o1.pos.y;
    var up = o.pos.y < o1.pos.y + o1.h;

    if (left && right && up && down) {
        return true;
    }

    return false;
}

function transposeArray(array) {
    let newFill = [];

    for (let i = 0; i < array[0].length; i++) {
        newFill.push([]);
    }

    for (var i = 0; i < array[0].length; i++) {
        for (var j = 0; j < array.length; j++) {
            newFill[j].push(array[i][j]);
        }
    }

    return newFill;
}

class Obj {
    constructor() {
        this.pos = createVector(0, 0);
        this.w = 50;
        this.h = 50;
        this.color = colors.BLUE;
        this.strokeColor = 0;
        this.visible = true;

        objects.push(this);
    }

    draw() {
        if (this.visible) {
            push();
            fill(this.color);
            stroke(this.strokeColor);
            rect(this.pos.x, this.pos.y, this.w, this.h);
            pop();
        }
    
    }
}

// =========================================================================================== //
function setup() {
    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;
    canvas = createCanvas(w - w / 6, h - h / 7);

    colors = new Color();
    test = new Obj();
    grid = new Grid(12, 21);
    blockM = new BlockManager();

    blockM.createBlock('l');
}

// =========================================================================================== //
function keyPressed() {
    var b = blockM.blocks[blockM.blocks.length - 1];
    
    if (keyCode == 32) {
        b.rotateRight();
    }

    if (keyCode == 39 && b.safe(grid.w+1)) {
        b.pos.x += 1;
    }
    if (keyCode == 37 && b.safe(-grid.w-2)) {
        b.pos.x -= 1;
    }
    // print(keyCode);
} 

// =========================================================================================== //
let mTime = 0.5;
let mTimer = mTime;
function draw() {
    background(colors.GRAY);

    // ========================================= //

    if (mTimer > 0) {
        mTimer -= deltaTime / 1000;

        if (mTimer <= 0) {
            let b = blockM.blocks[blockM.blocks.length - 1];
            b.pos.y += 1;
            mTimer = mTime;
        }
    }

    for (let i = 0; i < blockM.blocks.length; i++) {
        var b = blockM.blocks[i];
        b.bound();
        b.display();
    }

    // ========================================= //

    // ========================================= //

    for (let Obj of objects) {
        Obj.draw();
    }

    // ========================================= //

    grid.update();
}
