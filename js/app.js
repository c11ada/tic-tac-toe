(function() {
    $("#board").hide();
    $("#finish").hide();

    // create a game object
    const game = new Game();
    let player1;
    let player2;

    // 
    // start button click event handler
    // 
    $("#start #startButton").on('click', function(e){
        $("#board").show();
        $("#start").hide();

        // set player names
        let player1Name = $("#player1Input").val();
        if(!player1Name) {
            player1Name = "Player 1"
        }

        let player2Name = $("#player2Input").val();
        // if game is in AI mode set player two name to AI
        if(game.ai) {
            player2Name = "AI"
        } else {
            if(!player2Name) {
                player2Name = "Player 2"
            }
        }

        $("#player1").addClass("active");
        // x always starts first
        // create player objects
        player1 = new Player(player1Name, 1)
        player2 = new Player(player2Name, 2);
        $("#player1Name").text(player1.name);
        $("#player2Name").text(player2.name);
        player1.isTurn = true;
        // set player turn to 1
        game.playerTurn = 1;
    });

    // 
    // AI button event handler
    // 
    $("#start #aiButton").on('click', function(e){
        game.setAi();
    });

    // 
    // new game button event handler 
    // 
    $("#newGameButton").on('click', function(e){
        // hide everything and show start screen
        $("#finish").hide();
        $("#board").show();
        $("#start").hide();
        // clear board by removing css classes
        $(".box").removeClass( "box-filled-1");
        $(".box").removeClass( "box-filled-2");
        // reset active player css
        $("#player1").removeClass("active");
        $("#player1").addClass("active");
        $("#player2").removeClass("active");
        // reset finish screen
        $("#finish").removeClass("screen-win-two");
        $("#finish").removeClass("screen-win-one");
        $("#finish").removeClass("screen-win-tie");
        
        game.reset();
        // game.setAi();
    });

    const $box = $(".box");

    $box.hover(function(){
        game.boxHover($(this));
    });

    $box.on('click',function(){
        let status = game.boxFill($box,$(this));

        // if status is win show win screen with correct player name
        // else if status if draw show tie screen
        // else game is still going and chnage player
        if (status == "win" || status == "draw")
        {
            evalStatus(status);
        } else {
            game.changePlayer();
            // if AI mode make move
            if (game.ai) {
                game.scores = [];
                game.moves = [];
                const botMove = game.minMax(game.board,game.playerTurn);
                $(".box").eq(botMove).addClass( "box-filled-" + game.playerTurn);
                game.board[botMove] = game.playerTurn;
                status = game.checkWinner(game.board, game.playerTurn);
                evalStatus(status)
                game.changePlayer();
            }
        }
    });

    const evalStatus = (status) => {
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
        }
    };
})();