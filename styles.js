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
