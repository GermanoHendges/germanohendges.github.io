function handleButtonClick(option) {
    if (option === 'JOGAR') {
        window.location.href = 'telapersonagem.html';
    } else if (option === 'OPÇÕES'){
        window.location.href = 'opcoes.html';
    }
    else if (option === 'COMO JOGAR'){
    window.location.href = 'comojogar.html';
    }
     else if (option === 'CRÉDITOS'){
        window.location.href = 'creditos.html';
}}

let selectedCharacter = '';

function selectCharacter(character) {
    selectedCharacter = character;
    alert('Você escolheu: ' + character);
}

function confirmCharacter() {
    if (selectedCharacter) {
        alert('Personagem confirmado: ' + selectedCharacter);
        document.getElementById('character-selection').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        startGame();
    } else {
        alert('Por favor, escolha um personagem antes de continuar.');
    }
}




//fisica botoes em andamento

function startGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fieldWidth = canvas.width;
    const fieldHeight = canvas.height;

    const playerSize = 30;
    const ballSize = 20;

    let player1 = { x: 100, y: fieldHeight / 2, dx: 0, dy: 0, ax: 0, ay: 0, maxSpeed: 5, friction: 0.9 };
    let player2 = { x: fieldWidth - 100, y: fieldHeight / 2, dx: 0, dy: 0, ax: 0, ay: 0, maxSpeed: 5, friction: 0.9 };
    let ball = { x: fieldWidth / 2, y: fieldHeight / 2, dx: 4, dy: 3 };

    let player1Score = 0;
    let player2Score = 0;
    let maxScore = parseInt(document.getElementById('maxScore').value, 10);

    function update() {
        // Movimentação do jogador 1
        document.addEventListener("keydown", function(e) {
            if (e.key === "w") player1.ay = -0.5;
            if (e.key === "s") player1.ay = 0.5;
            if (e.key === "a") player1.ax = -0.5;
            if (e.key === "d") player1.ax = 0.5;
            if (e.key === "t") kickBall(player1);
        });

        document.addEventListener("keyup", function(e) {
            if (e.key === "w" || e.key === "s") player1.ay = 0;
            if (e.key === "a" || e.key === "d") player1.ax = 0;
        });

        // Movimentação do jogador 2
        document.addEventListener("keydown", function(e) {
            if (e.key === "ArrowUp") player2.ay = -0.5;
            if (e.key === "ArrowDown") player2.ay = 0.5;
            if (e.key === "ArrowLeft") player2.ax = -0.5;
            if (e.key === "ArrowRight") player2.ax = 0.5;
            if (e.key === " ") kickBall(player2);
        });

        document.addEventListener("keyup", function(e) {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.ay = 0;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") player2.ax = 0;
        });

        // Atualizar a posição dos jogadores aplicando aceleração e fricção
        movePlayer(player1);
        movePlayer(player2);

        // Atualizar a posição da bola
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Verificar colisões
        checkCollisions();

        // Atualizar o placar
        document.getElementById('player1Score').textContent = player1Score;
        document.getElementById('player2Score').textContent = player2Score;

        // Desenhar o jogo
        draw();
        requestAnimationFrame(update);
    }

    function movePlayer(player) {
        // Atualizar velocidade com base na aceleração
        player.dx += player.ax;
        player.dy += player.ay;

        // Aplicar fricção para desacelerar gradualmente
        player.dx *= player.friction;
        player.dy *= player.friction;

        // Limitar a velocidade máxima
        if (Math.abs(player.dx) > player.maxSpeed) player.dx = player.maxSpeed * Math.sign(player.dx);
        if (Math.abs(player.dy) > player.maxSpeed) player.dy = player.maxSpeed * Math.sign(player.dy);

        // Atualizar posição do jogador
        player.x += player.dx;
        player.y += player.dy;

        // Limitar a posição dentro do campo
        player.x = Math.max(0, Math.min(fieldWidth - playerSize, player.x));
        player.y = Math.max(0, Math.min(fieldHeight - playerSize, player.y));
    }

    function checkCollisions() {
        if (ball.y - ballSize < 0 || ball.y + ballSize > fieldHeight) {
            ball.dy *= -1;
        }

        if (ball.x - ballSize < 0) {
            player2Score++;
            resetBall();
            if (player2Score >= maxScore) {
                alert('Jogador 2 venceu!');
                resetGame();
            }
        } else if (ball.x + ballSize > fieldWidth) {
            player1Score++;
            resetBall();
            if (player1Score >= maxScore) {
                alert('Jogador 1 venceu!');
                resetGame();
            }
        }

        if (collision(ball, player1)) {
            ball.dx *= -1;
        }
        if (collision(ball, player2)) {
            ball.dx *= -1;
        }
    }

    function collision(ball, player) {
        return (
            ball.x + ballSize > player.x &&
            ball.x - ballSize < player.x + playerSize &&
            ball.y + ballSize > player.y &&
            ball.y - ballSize < player.y + playerSize
        );
    }

    function resetBall() {
        ball.x = fieldWidth / 2;
        ball.y = fieldHeight / 2;
        ball.dx = 4 * (Math.random() < 0.5 ? 1 : -1);
        ball.dy = 3 * (Math.random() < 0.5 ? 1 : -1);
    }

    function draw() {
        ctx.clearRect(0, 0, fieldWidth, fieldHeight);

        // Desenhar campo
        ctx.fillStyle = "#608040";
        ctx.fillRect(0, 0, fieldWidth, fieldHeight);

        // Desenhar jogadores
        ctx.fillStyle = "blue";
        ctx.fillRect(player1.x, player1.y, playerSize, playerSize);
        ctx.fillStyle = "red";
        ctx.fillRect(player2.x, player2.y, playerSize, playerSize);

        // Desenhar bola
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update();
}


















