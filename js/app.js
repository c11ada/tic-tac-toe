(function() {
    $("#board").hide();
    $("#finish").hide();

    const game = new Game();
    let player1;
    let player2;

    $("#start #startButton").on('click', function(e){
        $("#board").show();
        $("#start").hide();

        let player1Name = $("#player1Input").val();
        if(!player1Name) {
            player1Name = "Player 1"
        }

        let player2Name = $("#player2Input").val();
        if(game.ai) {
            player2Name = "AI"
        } else {
            if(!player2Name) {
                player2Name = "Player 2"
            }
        }

        $("#player1").addClass("active");
        // x always starts first
        player1 = new Player(player1Name, 1)
        player2 = new Player(player2Name, 2);
        $("#player1Name").text(player1.name);
        $("#player2Name").text(player2.name);
        player1.isTurn = true;
        game.playerTurn = 1;
    });

    $("#start #aiButton").on('click', function(e){
        game.setAi();
    });

    $("#newGameButton").on('click', function(e){
        $("#finish").hide();
        $("#board").hide();
        $("#start").show();
        $(".box").removeClass( "box-filled-1");
        $(".box").removeClass( "box-filled-2");
        $("#player1").removeClass("active");
        $("#player1").addClass("active");
        $("#player2").removeClass("active");
        $("#finish").removeClass("screen-win-two");
        $("#finish").removeClass("screen-win-one");
        $("#finish").removeClass("screen-win-tie");
        game.reset();
        game.setAi();
    });

    const $box = $(".box");

    $box.hover(function(){
        game.boxHover($(this));
    });

    $box.on('click',function(){
        let status = game.boxFill($box,$(this));

        if (status == "win"){
            let winnerPlayerClass;
            let winnerPlayer;
            if (game.playerTurn == 1) {
                winnerPlayerClass = "screen-win-one";
                winnerPlayer = player1;
            } else {
                winnerPlayer = player2;
                winnerPlayerClass = "screen-win-two";
            }
            game.showFinalScreen(winnerPlayerClass,winnerPlayer);
        } else if (status == "draw"){
            game.showFinalScreen("screen-win-tie");
        } else {
            game.changePlayer();
            if (game.ai) {
                game.scores = [];
                game.moves = [];
                const botMove = game.minMax(game.board,game.playerTurn);
                $(".box").eq(botMove).addClass( "box-filled-" + game.playerTurn);
                game.board[botMove] = game.playerTurn;
                game.changePlayer();
            }
        }
    });
})();