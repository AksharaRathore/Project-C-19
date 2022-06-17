var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running;
var bird, bird_fly;
var ground, invisibleGround, groundImage;


var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("frog1.png","frog2.png");
  bird_fly = loadAnimation("bird1.png","bird2.png","bird3.png");
  
  groundImage = loadImage("forest.png");
  
  
  
  obstacle1 = loadImage("rock.png");
  obstacle2 = loadImage("lake.png");
  obstacle3 = loadImage("snake.png");
  obstacle4 = loadImage("lake.png");
  obstacle5 = loadImage("rock.png");
  obstacle6 = loadImage("snake.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);


  var message = "This is a message";
 console.log(message)
  

  
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,90);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,170);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.4;
  restart.scale = 0.2;

  trex = createSprite(80,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.7;

  bird = createSprite(25,155,20,50);
  bird.addAnimation("fly",bird_fly);
  bird.scale = 0.4;

  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();


  
  trex.setCollider("rectangle",0,0,40,50);
  trex.debug = true;
  
  score = 0;
  
}

function draw() {
  
  background(180);

  
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }

    
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
  
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      
     //change the trex animation
     
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
  
     
     obstaclesGroup.setVelocityXEach(0);
       
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
    reset(); 
  }


  drawSprites();
}

function reset(){
  gameState = PLAY;
gameOver.visible = false;
restart.visible = false;
trex.changeAnimation("running",trex_running);

obstaclesGroup.destroyEach();

score = 0;


}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;

    
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}
