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

Game.prototype.boxHover = function(boxHovered) {
  let isFilled;
  if (
    boxHovered.hasClass("box-filled-1") == true ||
    boxHovered.hasClass("box-filled-2") == true
  ) {
    isFilled = true;
  }
  if (!isFilled) {
    boxHovered.toggleClass("box-hover-" + this.playerTurn);
  }
};

Game.prototype.reset = function() {
  this.playerTurn = 1;
  this.ai = false;
  this.setAi();
  this.board = [];
};

Game.prototype.boxFill = function(boxArray, boxClicked) {
  let isFilled;
  const boxIndex = boxArray.index(boxClicked);

  if (
    boxClicked.hasClass("box-filled-1") == true ||
    boxClicked.hasClass("box-filled-2") == true
  ) {
    isFilled = true;
  }
  if (!isFilled) {
    boxClicked.addClass("box-filled-" + this.playerTurn);
    boxClicked.removeClass("box-hover-" + this.playerTurn);
    this.board[boxIndex] = this.playerTurn;
    return (status = this.checkWinner(this.board, this.playerTurn));
  }
};

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

Game.prototype.boardSize = function(board) {
  return board.filter(function(box) {
    return box !== null;
  }).length;
};

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

Game.prototype.minMax = function(board, player, depth) {
  // if(this.boardSize(board) < 3)
  // {
  //     let randMove = Math.floor((Math.random() * 8));
  //     if (typeof board[randMove] === "undefined") {
  //         return randMove;
  //     }
  //     else {
  //         this.minMax(board,player);
  //     }
  // }
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

  console.log(otherPlayer);
  let turn = player === 1 ? 1 : 2;
  console.log(turn);
  let maxScore = -Infinity;
  let index = 0;

  for (let i = 0; i < 9; i++) {
    if (typeof board[i] === "undefined") {
      const newBoard = board.slice();
      newBoard[i] = turn;
      this.printBoard(newBoard);
      let moveScore = this.score(newBoard, turn, depth);

      if (moveScore > maxScore) {
        maxScore = moveScore;
        index = i;
      }
      this.minMax(newBoard, otherPlayer, depth);
    }
  }

  if (depth === 0) {
    return index;
  }

  return maxScore;
};
