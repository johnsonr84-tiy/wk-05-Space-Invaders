;(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = createInvaders(this).concat(new Player(this, gameSize));

    var self = this;
    loadSound("shoot.wav", function(shootSound) {
      self.shootSound = shootSound;
    })
    var tick = function() {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(tick);
    };

    tick();
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
      screen.clearRect(0, 0, gameSize.x, gameSize.y)
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
  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y -this.size.x};
    this.keyboarder = new Keyboarder();
  };






  window.onload = function() {
  new Game("screen");
};
})();
