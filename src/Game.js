
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
};

BasicGame.Game.prototype = {

	create: function () {

    this.game.stage.backgroundColor = '#2d2d2d';
		this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0.9;
		//game.physics.p2.setImpactEvents(true);
    //  Set the world (global) gravity
    this.game.physics.p2.gravity.y = 4000;
		this.spritebg=this.game.add.sprite(0,0,'bg-game');
		console.log("size:"+this.spritebg.width+" - "+this.spritebg.height);
    //  Sprite 1 will use the World (global) gravity
    this.createWinnerBoxes();
    this.createBall();
    this.createBorder();
    this.createPipes();
    this.createStones();
    this.createBarTop();

	},
  createBorder: function (){
    var rectW=10;
    var width = this.game.world.width;
    var height = this.game.world.height;
    var borderBottom = this.game.add.bitmapData(width, rectW);
    borderBottom.ctx.beginPath();
    borderBottom.ctx.rect(0, 0, width, rectW);
    //bmd.ctx.fillStyle = '#ffffff';
    //bmd.ctx.fill();
    var spriteBorderBottom = this.game.add.sprite(this.game.world.centerX, height-(rectW/2), borderBottom);
    spriteBorderBottom.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderBottom,false);
    spriteBorderBottom.body.static=true;
    var borderLR = this.game.add.bitmapData(rectW, height);
    borderLR.ctx.beginPath();
    borderLR.ctx.rect(0, 0, rectW, this.game.world.height);
    var spriteBorderLeft = this.game.add.sprite(0, this.game.world.centerY, borderLR);
    spriteBorderLeft.isLeftB=true;
    spriteBorderLeft.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderLeft,false);
    spriteBorderLeft.body.static=true;
    var spriteBorderRight = this.game.add.sprite(width-(rectW/2), this.game.world.centerY, borderLR);
    spriteBorderRight.isRightB=true;
    spriteBorderRight.anchor.setTo(0.5, 0.5);
    this.game.physics.p2.enable(spriteBorderRight,false);
    spriteBorderRight.body.static=true;
    var spriteBgScore=this.game.add.sprite(0,0,'bgScore');
    spriteBgScore.scale.setTo(0.5,0.4);

  },
  createStones:function(){
    var spriteStone1=this.game.add.sprite(0,400,'stones');
    this.game.physics.p2.enable(spriteStone1,false);
    spriteStone1.body.angle=45;
    spriteStone1.body.static=true;
    var spriteStone2=this.game.add.sprite(0,700,'stones');
    this.game.physics.p2.enable(spriteStone2,false);
    spriteStone2.body.angle=45;
    spriteStone2.body.static=true;
    var spriteStone3=this.game.add.sprite(this.game.world.width,400,'stones');
    this.game.physics.p2.enable(spriteStone3,false);
    spriteStone3.body.angle=45;
    spriteStone3.body.static=true;
    var spriteStone4=this.game.add.sprite(this.game.world.width,700,'stones');
    this.game.physics.p2.enable(spriteStone4,false);
    spriteStone4.body.angle=45;
    spriteStone4.body.static=true;
    var spriteStone5=this.game.add.sprite(this.game.world.centerX,this.game.world.centerY,'stones');
    this.game.physics.p2.enable(spriteStone5,false);
    spriteStone5.body.angle=45;
    spriteStone5.body.static=true;
  },
  createBarTop:function(){
    var style = { font: "30px Arial Black", fill: "#ffffff" ,align: "center"};
    label_score = this.game.add.text(0, 0,"Puntaje 0", style);
    sb = this.game.add.sprite(120, 50);
    sb.addChild(label_score);
    var style = { font: "30px Arial Black", fill: "#ffffff" ,align: "center"};
    label_lives = this.game.add.text(0, 0,"Intentos 10", style);
    sb = this.game.add.sprite(500, 50);
    sb.addChild(label_lives);
    var graphics = this.add.graphics(0, 0);
    graphics.lineStyle(4, 0xFFFFFF);
    graphics.beginFill(0xFFFFFF,1);
    graphics.drawRoundedRect(this.game.world.centerX-52, 0, 125, 125,15);
    graphics.endFill();
    this.gameBorderAdds = this.add.sprite();
    this.gameBorderAdds.addChild(graphics);
    adsLogo=this.game.add.sprite(this.game.world.centerX-50,2,'adsLogo');
    adsLogo.scale.setTo(0.2,0.2);
  },
  createBall: function(){
    this.ball = this.game.add.sprite(0, 50, 'ilkke');
		this.ball.scale.setTo(0.10,0.10);
		this.game.physics.p2.enable(this.ball, false);
    this.ball.body.velocity.x=400;
    this.ball.body.velocity.y=0;
    this.ball.body.data.gravityScale=0;
    this.ball.body.onBeginContact.add(this.ballCollision, this.ball);
    this.ballDown=false;
  },
  createPipes: function(){
    this.pipes=[];
    var pipePoints=this.getPipePoints();
    for(var i=0;i<pipePoints.length; i++){
      point=pipePoints[i];
      var pipe=this.game.add.sprite(point.x,point.y,'pipe');
      pipe.isPipe=true;
      pipe.scale.setTo(1.2,1.2);
      this.game.physics.p2.enable(pipe);
      pipe.body.setZeroVelocity();
      pipe.body.data.gravityScale=0;
      pipe.body.static=point.static;
      pipe.body.angle=point.angle;
      pipe.body.setZeroVelocity();
      this.pipes.push(pipe);
    }
  },
  getPipePoints: function(){
    var points=[
      new BasicGame.Point(160,250,-30,true),
      new BasicGame.Point(450,250,15,false),
      new BasicGame.Point(670,280,-20,true),
      new BasicGame.Point(190,450,10,false),
      new BasicGame.Point(495,450,-60,false),
      new BasicGame.Point(650,450,40,false),
      new BasicGame.Point(120,750,-10,false),
      new BasicGame.Point(250,660,15,true),
      new BasicGame.Point(520,790,10,false)
    ];
    return points;
  },
  getWinnerPoints: function(){

    var height=this.game.world.height;
    var points=[
      new BasicGame.Point(140,height,90,true),
      new BasicGame.Point(300,height,90,true),
      new BasicGame.Point(460,height,90,true),
      new BasicGame.Point(620,height,90,true)
    ];
    return points;
  },
  ballCollision: function(objectHit, shapeA, shapeB, equation) {
    if(!objectHit){
      return;
    }
		if (objectHit.sprite.isLeftB) {
			this.body.velocity.y=0;
      this.body.velocity.x=400;
		} else if (objectHit.sprite.isRightB) {
      this.body.velocity.y=0;
      this.body.velocity.x=-400;
		} else if (objectHit.sprite.isPipe) {
      objectHit.sprite.body.velocity.y=0;
      objectHit.sprite.body.velocity.x=0;
		} else if (objectHit.sprite.isBoxWin) {
      console.log("score:"+objectHit.sprite.valueWin);
			this.body.setZeroVelocity();
      objectHit.sprite.visible=false;
      objectHit.sprite.body.destroy();
		}
	},
  createWinnerBoxes:function(){
    var difx=60;
    var style = { font: "50px Arial Black", fill: "#ffa500" ,align: "center"};
    this.winnerBoxes=[];
    var pipePoints=this.getWinnerPoints();
    var values=this.getValuesWinner();
    label_score = this.game.add.text(0, 0,values[0], style);
    sb = this.game.add.sprite(difx, pipePoints[0].y - 70);
    sb.addChild(label_score);
    var blockYellow=this.game.add.sprite(65,pipePoints[0].y-40,'blockYellow');
    blockYellow.isBoxWin=true;
    blockYellow.valueWin=values[0];
    blockYellow.scale.setTo(0.1,0.09);
    this.game.physics.p2.enable(blockYellow);
    blockYellow.body.static=true;
    this.winnerBoxes.push(blockYellow);
    for(var i=0;i<pipePoints.length; i++){
      point=pipePoints[i];
      value=values[i+1];
      var pipe=this.game.add.sprite(point.x,point.y,'pipe');
      pipe.isPipe=true;
      pipe.scale.setTo(1.2,1.2);
      this.game.physics.p2.enable(pipe);
      pipe.body.setZeroVelocity();
      pipe.body.static=point.static;
      pipe.body.angle=point.angle;
      pipe.body.setZeroVelocity();
      label_score = this.game.add.text(0, 0,value, style);
      sb = this.game.add.sprite(point.x + difx, point.y - 70);
      sb.addChild(label_score);

      blockYellow=this.game.add.sprite(point.x+80,point.y-40,'blockYellow');
      blockYellow.isBoxWin=true;
      blockYellow.valueWin=value;
      blockYellow.scale.setTo(0.1,0.09);
      this.game.physics.p2.enable(blockYellow);
      blockYellow.body.static=true;
      this.winnerBoxes.push(blockYellow);
    }
  },
  getValuesWinner:function(){
    return [3,2,5,4,1];
  },

  processPointerInput: function() {
    if (this.game.input.activePointer.isDown) {
      this.ball.body.data.gravityScale=1;
      this.ballDown=true;
      this.ballWin=false;
    }
  },

	update: function () {
    this.pipes.forEach(function(pipe){
      pipe.body.setZeroVelocity();
    });
    this.processPointerInput();
    if(!this.ballDown){
      this.ball.body.velocity.y=0;
    }
    this.validateBallWin();
	},
  validateBallWin: function(){
    if(!this.ballWin&&this.ball.position.y>=this.game.world.height-40){
      this.ballWin=true;
      this.ball.body.setZeroVelocity();
      this.winnerBoxes.forEach(function(box){
        box.visible=false;
      });
    }else{
      if(Math.round(this.ball.body.velocity.x)==0&&Math.round(this.ball.body.velocity.y)==0){
        this.game.time.events.add(5000,this.quitGame,this);

      }
    }

  },

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.this.game.time.events.add(3000,function(){
      this.state.start('MainMenu');



	}

};
