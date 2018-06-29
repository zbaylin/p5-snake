var gridSize = 32;

var segmentSize;
var snake;

var GameState;
var apple;

var score = 0;
var scoreElement;


function setup() {
  if (windowHeight >= windowWidth) {
    createCanvas(windowWidth/2, windowWidth/2);
    segmentSize = windowWidth/gridSize/2;
  } else if (windowWidth > windowHeight) {
    createCanvas(windowHeight/2, windowHeight/2);
    segmentSize = windowHeight/gridSize/2;
  }

  GameState = "ACTIVE";

  apple = new Block(Math.round(random(0, gridSize-1)), Math.round(random(0, gridSize-1)), "rgb(255,0,0)");
  
  frameRate(10);
  snake = new Snake;
}

function draw() {
  background(0);
  apple.draw();
  snake.draw();
  drawScore();
}

function drawScore() {
  fill(255);
  switch (GameState) {
    case "ACTIVE":
      text("Score: " + score, segmentSize, 2*segmentSize);
      break;
    default:
      text("GAME OVER. Press ENTER to replay.", segmentSize, 2*segmentSize);
      break;
  }
}

function keyPressed() {
  this.snake.keyPressed();
  switch (keyCode) {
    case ENTER:
    case RETURN:
      replay();
      break;
    default:
      break;
  }
}

function replay() {
  snake = new Snake;
  apple = new Block(Math.round(random(0, gridSize-1)), Math.round(random(0, gridSize-1)), "rgb(255,0,0)");
  GameState = "ACTIVE";
  score = 0;
}

function windowResized() {
  setup();
}

class Snake {
  constructor() {
    this.xOnGrid = Math.round(random(0, gridSize-1));
    this.yOnGrid = Math.round(random(0, gridSize-1));
    this.blocks = [new Block(this.xOnGrid, this.yOnGrid, "rgb(255, 255, 255)")];
    
    var directions = [-1, 1];
    this.vector = createVector(this.xOnGrid < gridSize/2 ? 1 : -1, 0);
  }

  draw() {
    this.update();
    this.blocks.forEach(block => {
      block.draw();
    });
  }

  didCollide() {
    var didCollide = false;
    const [head, ...tail] = this.blocks;
    tail.forEach(block => {
      if (head.xOnGrid == block.xOnGrid && head.yOnGrid == block.yOnGrid) {
        didCollide = true;
      }
    });

    if (head.xOnGrid == apple.xOnGrid && head.yOnGrid == apple.yOnGrid) {
      apple = new Block(Math.round(random(0, gridSize-1)), Math.round(random(0, gridSize-1)), "rgb(255,0,0)")
      this.blocks.unshift(
        new Block(this.blocks[0].xOnGrid + this.vector.x,
                  this.blocks[0].yOnGrid + this.vector.y,
                  "rgb(255,255,255)")
      );
      score += 1;
    }

    if (head.xOnGrid > gridSize-1 || 
        head.yOnGrid > gridSize-1 ||
        head.xOnGrid < 0 ||
        head.yOnGrid < 0) {
      didCollide = true;
    }

    return didCollide;
  }

  update() {
    switch (GameState) {
      case "ACTIVE":
        this.blocks.unshift(
          new Block(this.blocks[0].xOnGrid + this.vector.x,
                    this.blocks[0].yOnGrid + this.vector.y,
                    "rgb(255,255,255)")
        );
        var didCollide = this.didCollide();
        this.blocks.pop();
        didCollide ? GameState = "OVER" : null;
        break;
      case "OVER":
        break;
      default:
        break;
    }
  }

  keyPressed() {
    switch (keyCode) {
      case LEFT_ARROW:
        this.vector.x = -1;
        this.vector.y = 0;
        break;
      case RIGHT_ARROW:
        this.vector.x = 1;
        this.vector.y = 0;
        break;
      case UP_ARROW:
        this.vector.x = 0;
        this.vector.y = -1;
        break;
      case DOWN_ARROW:
        this.vector.x = 0;
        this.vector.y = 1;
        break;
      default:
        break;
    }
  }
}

class Block {
  constructor(xOnGrid, yOnGrid, color) {
    this.xOnGrid = xOnGrid;
    this.yOnGrid = yOnGrid;
    this.color = color;
    this.size = segmentSize*.9;
    this.x = this.xOnGrid * segmentSize;
    this.y = this.yOnGrid * segmentSize;
  }

  draw() {
    fill(this.color);
    rect(this.x, this.y, this.size, this.size);
  }
}