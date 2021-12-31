var fondo, fondoImg;
var gallina, gallinaImg, gallinaRunImg, gallina3;
var sueloImg, suelo, sueloInvisible;
var lobo, loboQuietoImg, loboCorriendoImg;
var obs1Img, obs2Img, obs3Img, obs4Img, obstaculos;

var premios = [];
var maizImg, groupMaiz, recolectar, maizImg2;

var PLAY = 1;
var END = 0;
var gameState;
var score = 0;

function preload(){
	fondoImg = loadImage("images/bg.jpg");
	gallinaImg = loadImage("images/g2.png");
	gallinaRunImg = loadAnimation("images/g2.png", "images/g1.png", "images/g1.png");
	gallina3 = loadAnimation("images/g3.png");
	sueloImg = loadImage("images/suelos.jpg");

	loboQuietoImg = loadImage("images/lobo4.png");
	loboCorriendoImg = loadAnimation("images/lobo1.png", "images/lobo2.png", "images/lobo2.png");

	obs1Img = loadImage("images/obj2.png");
	obs2Img = loadImage("images/obj4.png");
	obs3Img = loadImage("images/obj5.png");
	obs4Img = loadImage("images/serpiente.png");


	maizImg = loadImage("images/granos_maiz.png");
	maizImg2 = loadImage("images/maiz.png");


}

function setup(){
	suelo = createSprite(700, 672, 700, 50);
	suelo.addImage("suelo",sueloImg);

	gallina = createSprite(350, 605, 50, 50);
	gallina.addAnimation("esperando", gallinaImg);
	gallina.addAnimation("corriendo", gallinaRunImg);
	gallina.addAnimation("asustada", gallina3);
	gallina.setCollider("rectangle",-5,10,100,150);
	gallina.scale = 0.6;

	lobo = createSprite(100, 600, 50, 50);
	lobo.addAnimation("quieto", loboQuietoImg);
	lobo.addAnimation("corriendo", loboCorriendoImg);
	lobo.scale = 0.5;

	sueloInvisible = createSprite(250, 677, 500, 30);
	sueloInvisible.visible = false;

	obstaculos = new Group();
	groupMaiz = new Group();
	
}

function draw(){
	createCanvas(1300, 700);
	background(fondoImg);

	
	if(gameState !== PLAY){
		textSize(15);
		fill(0);
		text("Presiona la tecla derecha para iniciar", 50, 103);
		text("Salta con espacio", 110, 128);
	}

	if(keyDown("RIGHT_ARROW")){
		gameState = PLAY;
	}

	if(gameState === PLAY){

		textSize(25);
		fill("purple");
		text("Puntaje: " + score, 540, 65);
		
		if(suelo.x < 600){
			suelo.x = suelo.width/2;
		}

		if(keyDown("RIGHT_ARROW")){
			gallina.changeAnimation("corriendo", gallinaRunImg);
			lobo.changeAnimation("corriendo", loboCorriendoImg);
			lobo.scale = 0.85;
			lobo.y = 585;
			lobo.setCollider("rectangle",0,0,200,200);
			suelo.velocityX = -4;
		}

		premios.push(premiosGallina());
		obstacles();

		if(keyDown("SPACE")){
			gallina.velocityY = -17;
		}

		gallina.velocityY = gallina.velocityY +0.7;
		gallina.collide(sueloInvisible);

		if(groupMaiz.isTouching(gallina)){
			gallina.isTouching(groupMaiz, groupHit);
			score = score +3;
		}

		if(obstaculos.isTouching(gallina)){
			gameState = END;
		}

	}
	else if(gameState === END){
		gameOver();
		detener();
	}

	drawSprites();
}

function obstacles(){
	if(frameCount % 120 === 0){
		var obst = createSprite(1400, 640, 50, 50);
		obst.velocityX = -5;
		var rand = Math.round(random(1,4))
		switch(rand){
			case 1: obst.addImage(obs1Img);
			obst.y = 643;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 2: obst.addImage(obs2Img);
			obst.y = 630;
			obst.setCollider("rectangle",0,0,100,50);
			break;
			case 3: obst.addImage(obs3Img);
			obst.y = 610;
			obst.scale = 0.8;
			obst.setCollider("rectangle",-5,2,90,120);
			break;
			case 4: obst.addImage(obs4Img);
			obst.scale = 0.17;
			obst.y = 625;
			obst.setCollider("rectangle",-70,0,300,400);
			break;
			default: break;
		}
		obst.lifetime = 700;
		obstaculos.add(obst);
	}

}

function gameOver(){
	swal({
		title: "Perdiste",
		text: "Gracias por jugar",
		imageUrl: "images/g3.png",
		imageSize: "150x150",
		confirmButtonText: "Volver a jugar"
	},
	function(Confirm){
		if(Confirm){
			location.reload();
		}
	})
}

function detener(){
	suelo.velocityX = 0;
	lobo.changeAnimation("quieto", loboQuietoImg);
	lobo.scale = 0.6;
	gallina.changeAnimation("asustada", gallina3);
	gallina.velocityY = 0;
	obstaculos.setVelocityXEach(0);
	obstaculos.setLifetimeEach(-1);

	groupMaiz.setVelocityXEach(0);
	
}

function premiosGallina(){
	if(frameCount % 100 === 0){
		var maiz = createSprite(1700, random(400, 550), 10, 10);
		maiz.addImage(maizImg);
		maiz.scale = 0.2;
		maiz.velocityX = -5;

		groupMaiz.add(maiz);
	}
}

function groupHit(gallina, maiz){
	maiz.destroy();
}