function Game() {
  this.winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  this.ai = false;
  this.playerTurn = 1;
  this.board = [];
  this.scores = [];
  this.moves = [];
}

// 
// helper function to print board in a 3 X 3 box on console
// 
Game.prototype.printBoard = function(board) {
  let boardPrint;
  boardPrint += "\n";
  for (let i = 0; i < 9; i++) {
    if (typeof board[i] != "undefined") {
      boardPrint += board[i];
    } else {
      boardPrint += "-";
    }
    if (i % 3 == 2) {
      boardPrint += "\n";
    }
  }
  console.log(boardPrint);
};

// 
// funtion to set AI and handle UI 
// 
Game.prototype.setAi = function() {
  if (this.ai == false) {
    $("#player2Input").attr("placeholder", "AI");
    $("#player2Input").prop("disabled", true);
    this.ai = true;
  } else {
    $("#player2Input").attr("placeholder", "Player 2");
    $("#player2Input").prop("disabled", false);
    this.ai = false;
  }
};

// 
// funtion to hanlde box hover
// 
Game.prototype.boxHover = function(boxHovered) {
  let isFilled;
  // if the box has any of the css classes it is occupied -> dont do anything
  if (
    boxHovered.hasClass("box-filled-1") == true ||
    boxHovered.hasClass("box-filled-2") == true
  ) {
    isFilled = true;
  }
  // if its not filled show the hover for the correct player
  if (!isFilled) {
    boxHovered.toggleClass("box-hover-" + this.playerTurn);
  }
};

// 
// reset game variables
// 
Game.prototype.reset = function() {
  this.playerTurn = 1;
  this.ai = false;
  this.setAi();
  this.board = [];
};

// 
// function to handle box click -> fills box with correct player 
// 
Game.prototype.boxFill = function(boxArray, boxClicked) {
  let isFilled;
  // find out the box index
  const boxIndex = boxArray.index(boxClicked);

  // check to see if box is occupied
  if (
    boxClicked.hasClass("box-filled-1") == true ||
    boxClicked.hasClass("box-filled-2") == true
  ) {
    isFilled = true;
  }
  // if not occupied
  if (!isFilled) {
    // add correct class
    boxClicked.addClass("box-filled-" + this.playerTurn);
    // remove hover class
    boxClicked.removeClass("box-hover-" + this.playerTurn);
    // make sure to add the index in the board 
    this.board[boxIndex] = this.playerTurn;
    // check to see if the game is won 
    return (status = this.checkWinner(this.board, this.playerTurn));
  }
};

// 
// handle change player
// 
Game.prototype.changePlayer = function() {
  if (this.playerTurn == 1) {
    this.playerTurn = 2;
    $("#player2").addClass("active");
    $("#player1").removeClass("active");
  } else {
    this.playerTurn = 1;
    $("#player1").addClass("active");
    $("#player2").removeClass("active");
  }
};

// 
// helper function to check if a player has won the game
// 
Game.prototype.checkWinner = function(board, player) {
  for (let index = 0; index < this.winningLines.length; index++) {
    let element = this.winningLines[index];
    let r1 = element[0];
    let r2 = element[1];
    let r3 = element[2];

    if (board[r1] === player && board[r2] === player && board[r3] === player) {
      // console.log("winner");
      return "win";
    }
  }

  if (this.boardSize(board) == 9) {
    return "draw";
  } else {
    return "continue";
  }
};

// 
// helper function to display finish screen
// 
Game.prototype.showFinalScreen = function(finishClass, player) {
  $("#board").hide();
  $("#finish").addClass(finishClass);

  if (player) {
    $(".message").text(player.name + " wins !");
  } else {
    $(".message").text("its a tie !");
  }

  $("#finish").show();
};

// 
// helper funtion to check if the board is full or not
// 
Game.prototype.boardSize = function(board) {
  return board.filter(function(box) {
    return box !== null;
  }).length;
};

// 
// min max scor calculator
// if player wins 10 points
// if other player wins -10 points
// else 0 points
// 
Game.prototype.score = function(board, player, depth) {
  const otherPlayer = player === 1 ? 2 : 1;
  if (this.checkWinner(board, player) == "win") {
    return 10;
  } else if (this.checkWinner(board, otherPlayer) == "win") {
    return -10;
  } else {
    return 0;
  }
};

// 
// minmax function to emulate AI moves
// recursivly tries every move from a given point 
// to figure out which move will give it best score
// 
Game.prototype.minMax = function(board, player, depth) {
  // work around as the first few goes take to long to compute
  // just put at a random square
  if(this.boardSize(board) < 3)
  {
      let randMove = Math.floor((Math.random() * 8));
      if (typeof board[randMove] === "undefined") {
          return randMove;
      }
      else {
          this.minMax(board,player);
      }
  }

  const otherPlayer = player === 1 ? 2 : 1;

  if (this.checkWinner(board, otherPlayer) === "win") {
    return -10;
  }
  if (this.boardSize(board) == 9) {
    return 0;
  }
  if (typeof depth === "undefined") {
    depth = 0;
  } else {
    depth += 1;
  }

  // console.log(otherPlayer);
  let turn = player === 1 ? 1 : 2;
  // console.log(turn);
  let maxScore = -Infinity;
  let index = 0;

  // go through each item on the board
  for (let i = 0; i < 9; i++) {
    // check to see if the box is not used
    if (typeof board[i] === "undefined") {
      // create a test board
      const newBoard = board.slice();
      newBoard[i] = turn;
      this.printBoard(newBoard);
      let moveScore = this.score(newBoard, turn, depth);

      if (moveScore > maxScore) {
        maxScore = moveScore;
        index = i;
      }
      // call the min max function again with a new test board
      this.minMax(newBoard, otherPlayer, depth);
    }
  }

  if (depth === 0) {
    return index;
  }

  return maxScore;
};
