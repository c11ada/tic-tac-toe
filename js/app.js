$("#board").hide();
$("#finish").hide();
let $playerTurn = 1;
let $ai = false;

const $winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let $gameBoard = [];

$("#start #startButton").on('click', function(e){
    $("#board").show();
    $("#start").hide();

    let $player1Name = $("#player1Input").val();
    if(!$player1Name) {
        $player1Name = "Player 1"
    }

    let $player2Name = $("#player2Input").val();
    if($ai) {
        $player2Name = "AI"
    } else {
        if(!$player2Name) {
            $player2Name = "Player 2"
        }
    }

    // $changePlayer();
    $("#player1").addClass("active");
    // x always starts first
    const player1 = new Player($player1Name, 1)
    const player2 = new Player($player2Name, 2);
    $("#player1Name").text($player1Name);
    $("#player2Name").text($player2Name);
});

$("#start #aiButton").on('click', function(e){
    if($ai == false){
        $("#player2Input").attr("placeholder","AI");
        $("#player2Input").prop('disabled', true);
        $ai = true;
    } else {
        $("#player2Input").attr("placeholder","Player 2");
        $("#player2Input").prop('disabled', false);
        $ai = false;
    }
});

$("#newGameButton").on('click', function(e){
    $("#finish").hide();
    $("#board").hide();
    $("#start").show();
    $(".box").removeClass( "box-filled-1");
    $(".box").removeClass( "box-filled-2");
    $playerTurn = 1;
    $("#player1").removeClass("active");
    $("#player1").addClass("active");
    $("#player2").removeClass("active");
    $("#finish").removeClass("screen-win-two");
    $("#finish").removeClass("screen-win-one");
    $("#finish").removeClass("screen-win-tie");
    $ai = false;
    $gameBoard = [];
});

const $box = $(".box");

$box.hover(function(){
    let $isFilled ;
    if($(this).hasClass("box-filled-1") == true || 
        $(this).hasClass("box-filled-2") == true){
        $isFilled = true;
    };
    if(!$isFilled){
        $(this).toggleClass( "box-hover-" + $playerTurn );
    }
});

$box.on('click',function(){
    let $isFilled ;
    const $boxIndex = ($box.index($(this)));

    if($(this).hasClass("box-filled-1") == true || 
        $(this).hasClass("box-filled-2") == true){
        $isFilled = true;
    };
    if(!$isFilled){
        $(this).addClass( "box-filled-" + $playerTurn );
        $(this).removeClass( "box-hover-" + $playerTurn );
        $gameBoard[$boxIndex] = $playerTurn;
        const $status = $checkWinner($gameBoard,$playerTurn);
        if ($status == "win"){
            let $winnerPlayer
            if ($playerTurn == 1) {
                $winnerPlayer = "screen-win-one";
            } else {
                $winnerPlayer = "screen-win-two";
            }
            $("#board").hide();
            $("#finish").addClass($winnerPlayer);
            $("#finish").show();
        } else if ($status == "draw"){
            $("#board").hide();
            $("#finish").addClass("screen-win-tie");
            $("#finish").show();
        } else {
            $changePlayer();
            $minMax($gameBoard,$playerTurn);
        }
    }
});

const $changePlayer = () => {
    if($playerTurn == 1) {
        $playerTurn = 2;
        $("#player2").addClass("active");
        $("#player1").removeClass("active");
    } else {
        $playerTurn = 1;
        $("#player1").addClass("active");
        $("#player2").removeClass("active");
    }
}

const $checkWinner = (board, player) => {
    for (let index = 0; index < $winningLines.length; index++) {
        let element = $winningLines[index];
        let r1 = element[0];
        let r2 = element[1];
        let r3 = element[2];

        console.log(player);
        console.log(r1 + " " + " " + r2 + " " + r3);
        console.log(board[r1]);
        console.log(board[r2]);
        console.log(board[r3]);

        if (board[r1] === player && board[r2] === player && board[r3] === player) {
            console.log("winner");
            return "win";
        }
    }
    
    if($boardSize(board) == 9){
        return "draw";
    } else {
        return "continue";
    }
}

const $boardSize = (board) => {
    return board.filter(function(box){
        return box !== null;
    }).length;
};

const $score = (board,player,depth) => {
    const $otherPlayer = player === 1 ? 2 : 1; 
    if ($checkWinner(board,player) == "win") {
        return 10 - depth;
    } else if ($checkWinner(board,$otherPlayer) == "win") {
        return depth -10;
    } else
    {
        return 0;
    }
}

const $minMax = (board, player, depth) => {
    if($boardSize(board) == 9){
        return $score(board,player);
    }
    if (typeof depth === "undefined") {
        depth = 0;
    } else {
        depth += 1;
    }
    const $otherPlayer = player === 1 ? 2 : 1; 
   
    let $scores = [];
    let $moves = [];
    let $turn = player === 1 ? 1 : 2;

    for (let i = 0; i < 9; i++) {
        if (typeof board[i] === "undefined") {
            const $newBoard = board.slice();
            $newBoard[i] = $turn;
            
            $scores.push($score($newBoard,$turn,depth));
            $minMax($newBoard,$otherPlayer,depth);
            $moves.push(i);
        }
    }

    if (depth === 0) {
        console.log("here");
    }
}
