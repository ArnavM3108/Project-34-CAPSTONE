const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;


var engine, world;
var canvas;
var fighter, fighterPlatform, fighterShot;
var fighterEnergys = [];
var board1, board2;
var numberOfEnergy = 10;

var score = 0;

function preload() {
  backgroundImg = loadImage("./assets/background.webp");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  fighterPlatform = new FighterPlatform(300, 500, 180, 150);
  fighter = new fighter(285, fighterPlatform.body.position.y - 153, 50, 180);
  fighterShot = new fighterShot(
    340,
    fighterPlatform.body.position.y - 180,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  fighterPlatform.display();
  fighter.display();
  fighterShot.display();

  board1.display();
  board2.display();

  for (var i = 0; i < fighterEnergys.length; i++) {
    if (fighterEnergys[i] !== undefined) {
      fighterEnergys[i].display();

      var board1Collision = Matter.SAT.collides(
        board1.body,
        fighterEnergys[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        fighterEnergys[i].body
      );


      if (board1Collision.collided || board2Collision.collided) {
        score += 5;
      }

      var posX = fighterEnergys[i].body.position.x;
      var posY = fighterEnergys[i].body.position.y;

      if (posX > width || posY > height) {
        if (!fighterEnergys[i].isRemoved) {
          fighterEnergys[i].remove(i);
        } else {
          fighterEnergys[i].trajectory = [];
        }
      }
    }
  }

  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("BEAM THE TARGETS!", width / 2, 100);

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score " + score, width - 200, 100);

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Energys : " + numberOfEnergy, 200, 100);


  if (numberOfEnergy == 0) {
    gameOver();
  }


}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfEnergy > 0) {
      var posX = fighterShot.body.position.x;
      var posY = fighterShot.body.position.y;
      var angle = fighterShot.body.angle;

      var energy = new fighterEnergy(posX, posY, 100, 10, angle);

      energy.trajectory = [];
      Matter.Body.setAngle(energy.body, angle);
      fighterEnergys.push(energy);
      numberOfEnergy -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (fighterEnergys.length) {
      var angle = fighterShot.body.angle;
      fighterEnergys[fighterEnergys.length - 1].shoot(angle);
    }
  }
}



