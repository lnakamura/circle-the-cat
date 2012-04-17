function getMouseButton(e) {
  return(e? e.which: window.event.button);
}

function Circle(x, y, r) {
  var self = this;
  this.radius = r;
  this.x = x;
  this.y = y;
  this.pos = {x:x, y:y};
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.debug = "";
  this.fill = false;
  this.hasCat = false;
  this.parent = null;
  
  this.updateColor = function() {
    self.fill = true;
  };
  this.isInPosition = function(position) {
    var isCorrectWidth = ((self.x - self.radius + 3) < position.x) && (position.x < (self.x + self.radius - 3));
    var isCorrectHeight = ((self.y - self.radius + 3) < position.y) && (position.y < (self.y + self.radius - 3));
    return isCorrectWidth && isCorrectHeight;
  };
  this.getPosition = function() {
    return self.pos;
  };
  this.addCat = function() {
    self.hasCat = true;
  };
  this.removeCat = function() {
    self.hasCat = false;
  };
}

function Cat(column, row) {
  var self = this;

  this.col = column;
  this.row = row;
  this.x = 0;
  this.y = 0;
  
  this.updateCatPosition = function(col, row) {
    self.col = col;
    self.row = row;
  };
  this.updateCatCoordinate = function(position) {
    self.x += position.x;
    self.y += position.y;
  };
  this.getCurrentCatPosition = function() {
    return {col: self.col, row: self.row};
  };
  this.getCurrentCatCoordinate = function() {
    return {x: self.x, y: self.y};
  };
}


function Game(ctx) {
  var self = this;
  this.ctx = ctx;
  
  this.board = new Board(ctx);
  
  this.run = function() {
    self.start();
  };
  this.start = function() {
    self.createBoard();
    self.registerMouse();
  };
  
  this.onMouseDown = function(event) {
    if (self.board.lock) {
      return;
    }
    if (getMouseButton(event) == 1) {
      self.onLeftClick(event);
    }
  };
  
  // When the left mouse button is clicked, find the position.
  this.onLeftClick = function(e) {
    var canvas = self.board.div;
    var scroll = document.body.scrollTop;
    var winLose = 0;
    for( var posX = 0, posY = 0; canvas; canvas = canvas.offsetParent ) {
      posX += canvas.offsetLeft;
      posY += canvas.offsetTop;
    }
    if(self.board.updateCircle({x: e.clientX - posX, y: e.clientY - (posY-scroll)})) {
      winLose = self.board.moveCat();
      if (winLose.winGame) {
        self.winGame();
      }
      else if (winLose.loseGame) {
        self.loseGame();
      }
    }
    
  };
  
  this.registerMouse = function() {
    self.board.div.onmousedown = self.onMouseDown;
    self.board.div.onclick = function(){return false;};
    self.board.div.ondblclick = function(){return false;};
    self.board.div.oncontextmenu = function(){return false;};
  };
  
  this.createBoard = function() {
     self.board.create();
  };
  
  this.winGame = function() {
    document.getElementById('panelTitle').innerHTML = 'You Win!';
    $('#panel').fadeIn(function() {});
    setTimeout(run, 2000);
  };
  this.loseGame = function() {
    document.getElementById('panelTitle').innerHTML = 'You Lose';
    $('#panel').fadeIn(function() {});
    setTimeout(run, 2000);
  };
}


function run() {
  $('#panel').fadeOut(function() {});
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var game = new Game(ctx);
  game.run();
}

function supports_canvas() {
  return !!document.createElement('canvas').getContext;
}


function checkCanvas() {
  if (!supports_canvas()) { 
    return false;
  }
  else {
    var dummy_canvas = document.createElement('canvas');
    var context = dummy_canvas.getContext('2d');
    return typeof context.fillText == 'function';
  }
}

function startUp() {
  if (checkCanvas()) { 
    run();
  }
  else {
    alert("Sorry, but your browser does not support the canvas tag.");
  }
}
