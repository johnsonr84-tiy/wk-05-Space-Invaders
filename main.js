//Space Invaders game with some questions and notes//
;(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d'); // does '2d' mean 2 dimensional?
    var gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = createInvaders(this).concat(new Player(this, gameSize));

    var self = this;
    loadSound("shoot.wav", function(shootSound) {
      self.shootSound = shootSound;
    })
    var tick = function() {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(tick); //The browser runs this 60x/ sec.
    };

    tick(); //tick runs game logic. however, what is game logic? lol
  };

  Game.prototype = {
    update: function() {
      var bodies = this.bodies;
      var notCollidingWithAnything = function(b1) {
        return bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
      };

      this.bodies = this.bodies.filter(notCollidingWithAnything);

      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      }
    },

    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y)//This clears player drawing
      for (var i = 0; i < this.bodies.length; i++) {
        drawRect(screen, this.bodies[i])
      }
    },
    addBody: function(body) {
      this.bodies.push(body);
    },

    invadersBelow: function(invader) {
      return this.bodies.filter(function(b) {
        return b instanceof Invader && b.center.y > invader.center.y && b.center.x - invader.center.x < invader.size.x;
      }).length > 0
    }
  };
  //This sizes and positions the player on the canvas screen at the bottom
  //Also I want to make the player style set to the rocket image in this project folder... damn it!
  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y -this.size.x};
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    update: function() {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.center.x -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.center.x += 2;
      }

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
        var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x * 2}, { x: 0, y: -6 });
        this.game.addBody(bullet);
        this.game.shootSound.load();
        this.game.shootSound.play();
      }
    }
  };

//I am not understanding how to style the color of my bullet to limegreen. I need lime green bullets!!!
var Bullet = function(center, velocity) {
  this.size = { x: 3, y: 3};
  this.center = center;
  this.velocity = velocity;
};

Bullet.prototype = {
  update: function() {
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
  }
};

var Invader = function(game, center) {
  this.game = game;
  this.size = { x: 15, y: 15 };
  this.center = center;
  this.patrolX = 0;
  this.speedX = 0.3;
};
//I made the patrolX range set to 330 to fill my screen canvas better
Invader.prototype = {
  update: function() {
    if (this.patrolX < 0 || this.patrolX > 330) {
      this.speedX = -this.speedX;
    }

    this.center.x += this.speedX;
    this.patrolX += this.speedX;

    if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
      var bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.x * 2},
      { x: Math.random() - 0.5, y: 2 });
      this.game.addBody(bullet);
    }
  }
};

//I want to style my invaders with the saucer png is my project folder
var createInvaders = function(game) {
  var invaders = [];
  for (var i =0; i <24; i++) {
    var x = 30 + (i % 8) * 30;
    var y = 30 + (i % 3) * 30;
    invaders.push(new Invader(game, { x: x, y: y}));
  }
  return invaders;
};

//The functions below define the keyboard state of up and down
  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
  };

  var Keyboarder = function() {
    var keyState = {};

    window.onkeydown = function(e) {
      keyState[e.keyCode] =true;
    };

    window.onkeyup = function(e) {
      keyState[e.keyCode] =false;
    };

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32} //Where/ why did she select numbers 37,39,32... Do keyboard keys have numerical value assignments?
  }

  var colliding = function(b1, b2) {
    return !(b1 === b2 ||
    b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x /2 ||

    b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y /2 ||

    b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x /2 ||

    b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y /2) ;
  }

// Before inserting my sound file shoot.wav the space key didn't function to shoot bullets, instead it just froze the game. Wonder why.
  var loadSound = function(url, callback) {
    var loaded = function() {

    callback(sound);
    sound.removeEventListener('cancanplaythrough', loaded);
  };

    var sound = new Audio(url);
    sound.addEventListener('canplaythrough', loaded);
    sound.load();
  };
//Set up window.load function early on in constructing game frameworks
  window.onload = function() {
    new Game("screen");
  };
})();

//Final thoughts on programing the game. I really like how she codes and selects here word choices based off what she is 'actually wanting to do' and then writes the code for the actual code.
