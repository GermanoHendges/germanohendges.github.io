
 
        let count = 3;
        
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        console.log(localStorage.getItem("estadioSelecionadoIndex"));
        changeStadiumBackground(localStorage.getItem("estadioSelecionadoIndex"));
        console.log(localStorage.getItem("player1Index"));
        console.log(localStorage.getItem("player2Index"));

        function changeStadiumBackground(option) {
            console.log(option);
            let backgroundUrl;
        
            // Define o caminho para a imagem de fundo com base na opção
            switch (option) {
                case "0":
                    backgroundUrl = '../imagens/arenagremio.png'; // Arena do Grêmio
                    break;
                case "1":
                    backgroundUrl = '../imagens/beirario.png'; // Beira Rio
                    break;
                case "2":
                    backgroundUrl = '../imagens/maracana.png'; // Maracanã
                    break;
                case "3":
                    backgroundUrl = '../imagens/mineirao.png'; // Mineirão
                    break;
                default:
                    backgroundUrl = '../imagens/fundo1.jpg'; // Padrão
            }
        
            // Aplica a imagem como fundo do corpo do documento
            document.body.style.backgroundImage = `url(${backgroundUrl})`;
            document.body.style.backgroundSize = 'cover';  // Ajusta a imagem para cobrir todo o fundo
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat'; // Evita repetição da imagem
        }

        function changeUniform(playerIndex, direction) {
            const playerElement = document.getElementById(`player${playerIndex + 1}`);
            const colors = ["red", "blue", "green", "yellow", "purple"]; // Lista de cores disponíveis
            let currentColor = playerElement.style.backgroundColor || colors[0];
            let currentIndex = colors.indexOf(currentColor);
        
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = colors.length - 1;
            if (currentIndex >= colors.length) currentIndex = 0;
        
            playerElement.style.backgroundColor = colors[currentIndex];
        }
        // Configuração dos jogadores com aceleração
        const player1 = { x: 100, y: 305, radius: 20, dx: 0, dy: 0, accel: 0.13, maxSpeed: 4, color1 : null, color2:null, abrev:null};
        const player2 = { x: 900, y: 305, radius: 20, dx: 0, dy: 0, accel: 0.13, maxSpeed: 4, color1 : null, color2: null, abrev:null }; 
        const ball = { x: 500, y: 305, radius: 15, dx: 0, dy: 0 };
        const field = {width: 900, height: 525 }
        const goleira = {width: 7 ,height: 250}
        const goalWidth = 100;

        let player1Score = 0;
        let player2Score = 0;

        const keys = {
            w: false, a: false, s: false, d: false,       // Controles jogador 1
            ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false, // Controles jogador 2
            Space: false, ShiftLeft: false                // Controles de chute
        };

        function drawPlayer(player) {
            const outlineWidth = 2.5; //largura do contorno 
        
        
            // Desenhar o círculo interno (cor de fundo)
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
            ctx.fillStyle = player.color1 || 'gray'; // Cor de fundo padrão: cinza
            ctx.fill();
            ctx.closePath();
        
            // Desenhar a faixa vertical no meio (color2)
            ctx.beginPath();
            ctx.rect(
                player.x - player.radius / 3, // Posição inicial no eixo X
                player.y - player.radius,     // Começo no topo do círculo
                (player.radius / 3) * 2,      // Largura proporcional ao raio
                player.radius * 2             // Altura igual ao diâmetro do círculo
            );
            ctx.fillStyle = player.color2 || 'black'; // Cor da faixa padrão: preto
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
            ctx.lineWidth = outlineWidth * 2; // Ajustar a largura da linha
            ctx.strokeStyle = 'black'; // Cor do contorno
            ctx.stroke();
            ctx.closePath();
        }

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function drawField() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(50, 50, field.width, field.height);
            ctx.beginPath();// desenhar o circulo central
            ctx.moveTo(500, 50);
            ctx.lineTo(500, 575);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(500, 305, 50, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.fillRect(50, 250, 7, goalWidth);
            ctx.fillRect(943, 250, 7, goalWidth);
        }

        function iniciaContador() {
            let time = 5*60;
            const countdownElement = document.getElementById("contador");
            const interval = setInterval(() => {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;

                countdownElement.innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                time--;

                if (time < 0) {
                    clearInterval(interval);
                    countdownElement.innerHTML = "Tempo esgotado!";
                    localStorage.setItem("player1Score",player1Score);
                    localStorage.setItem("player1Score",player2Score);
                    window.location.href="../html/telaVitoria.html"
                }
            }, 1000);
        }

        function movePlayer(player, up, left, down, right) {
            // Movimentação com aceleração para cada jogador de acordo com as teclas
            if (keys[right]) player.dx = Math.min(player.dx + player.accel, player.maxSpeed);
            else if (keys[left]) player.dx = Math.max(player.dx - player.accel, -player.maxSpeed);
            else player.dx *= 0.9; // Desaceleração gradualdds

            if (keys[down]) player.dy = Math.min(player.dy + player.accel, player.maxSpeed);
            else if (keys[up]) player.dy = Math.max(player.dy - player.accel, -player.maxSpeed);
            else player.dy *= 0.9; // Desaceleração gradual

            

            player.x += player.dx;
            player.y += player.dy;

            // Limites do campo para os jogadores
            if (player.x - player.radius < 50) player.x = 50 + player.radius;
            if (player.x + player.radius > field.width+50) player.x = field.width+50 - player.radius;
            if (player.y - player.radius < 50) player.y = 50 + player.radius;
            if (player.y + player.radius > field.height+50) player.y = field.height+50 - player.radius;
        }

        function moveBall() {
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Verificação de colisões com as bordas
            if (ball.x - ball.radius < 50) {
                ball.x = 50 + ball.radius;
                ball.dx = -ball.dx;
            } 
            if (ball.x + ball.radius > field.width+50) {
                ball.x = field.width+50 - ball.radius;
                ball.dx = -ball.dx;
            }
            if (ball.y - ball.radius < 50) {
                ball.y = 50 + ball.radius;
                ball.dy = -ball.dy;
            }
            if (ball.y + ball.radius > field.height + 50) {
                ball.y = field.height+50 - ball.radius;
                ball.dy = -ball.dy;
            }

            // Redução gradual da velocidade da bola (simulação de fricção)
            ball.dx *= 0.98;
            ball.dy *= 0.98;

            checkGoal();
        }
        function checkPlayerCollision(player1, player2) {
            const distX = player1.x - player2.x;
            const distY = player1.y - player2.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
        //verifica se ha colisao
        
            if (distance < player1.radius + player2.radius) {
                const overlap = player1.radius + player2.radius - distance;
                const moveX = (distX / distance) * overlap / 2; // Divide por 2 para mover cada jogador
                const moveY = (distY / distance) * overlap / 2;
        
                player1.x += moveX;
                player1.y += moveY;
                player2.x -= moveX;
                player2.y -= moveY;
        
                const restitution = 0.8; 
                const vCollisionNorm = { x: distX / distance, y: distY / distance };

        
                // calcula a velocidade relativa
        
                const vRelativeVelocity = { x: player1.dx - player2.dx, y: player1.dy - player2.dy };
                const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
        
                if (speed < 0) {
        
                    return; // n faz nada se estiverem se afastando

                }
                const impulse = speed * (1 + restitution);
                player1.dx -= (impulse * vCollisionNorm.x);
                player1.dy -= (impulse * vCollisionNorm.y);
                player2.dx += (impulse * vCollisionNorm.x);
                player2.dy += (impulse * vCollisionNorm.y);
            }
        }
        
        

        
        function checkCollision(player, ball, isShooting) {
            const distX = player.x - ball.x;
            const distY = player.y - ball.y;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance  < player.radius + ball.radius ) {
                if (isShooting) {
                    const angle = Math.atan2(distY, distX);
                    ball.dx = -Math.cos(angle) * 8;
                    ball.dy = -Math.sin(angle) * 8;
                } else {
                    const overlap = player.radius + ball.radius - distance;
                    const moveX = (distX / distance) * overlap ;
                    const moveY = (distY / distance) * overlap ;

                    ball.dx -= moveX / 5;
                    ball.dy -= moveY / 5;

                    player.x += moveX / 2;
                    player.y += moveY / 2;
                    
                    
                }
            }
        }

        function checkGoal() {
            if (ball.x - ball.radius < 60 && ball.y > 250 && ball.y < 350) {
                player2Score++;
                afterGoal();
            } else if (ball.x + ball.radius > 940 && ball.y > 250 && ball.y < 350) {
                player1Score++;
                afterGoal();
            }

            document.getElementById('player1Score').textContent = player1.abrev + ' ' + player1Score + ' x';
            document.getElementById('player2Score').textContent = player2Score + ' ' + player2.abrev;
        }
        function resetPlayers(){
            player1.x = 100;
            player1.dx = 0;
            player1.dy = 0;
            player1.y = 305;
            player2.x = 900;
            player2.dx = 0;
            player2.dy = 0;
            player2.y = 305;
        }

        function resetBall() {
            ball.x = 500;
            ball.y = 305;
            ball.dx = 0;
            ball.dy = 0;
        }

        function update() {
            movePlayer(player1, 'w', 'a', 's', 'd');
            movePlayer(player2, 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight');
            moveBall();
            checkPlayerCollision(player1,player2)

            checkCollision(player1, ball, keys.Space);
            checkCollision(player2, ball, keys.ShiftLeft);

            drawField();
            drawPlayer(player1, 'blue');
            drawPlayer(player2, 'red');
            drawBall();
            requestAnimationFrame(update);
        }

        function handleKeyDown(e) {
            if (e.key === 'w') keys.w = true;
            if (e.key === 'a') keys.a = true;
            if (e.key === 's') keys.s = true;
            if (e.key === 'd') keys.d = true;

            if (e.key === 'ArrowUp') keys.ArrowUp = true;
            if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
            if (e.key === 'ArrowDown') keys.ArrowDown = true;
            if (e.key === 'ArrowRight') keys.ArrowRight = true;

            if (e.key === ' ') keys.Space = true;
            if (e.key === 'Shift') keys.ShiftLeft = true;
        }

        function handleKeyUp(e) {
            if (e.key === 'w') keys.w = false;
            if (e.key === 'a') keys.a = false;
            if (e.key === 's') keys.s = false;
            if (e.key === 'd') keys.d = false;

            if (e.key === 'ArrowUp') keys.ArrowUp = false;
            if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
            if (e.key === 'ArrowDown') keys.ArrowDown = false;
            if (e.key === 'ArrowRight') keys.ArrowRight = false;

            if (e.key === ' ') keys.Space = false;
            if (e.key === 'Shift') keys.ShiftLeft = false;
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        
    
        function startOff(){
            let tempo = 3;
            const countdownElement = document.getElementById("largada");
            const interval = setInterval(() => {
                countdownElement.innerHTML = time;
                time--;
            }, 1000);
        }
        setInterval(drawCount, 1000);
        setTimeout(function(){
            update();
            iniciaContador();
        },4000);
        function drawCount() {
            // Limpa o canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.font = "100px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

             ctx.fillText(count, ctx.canvas.width / 2, ctx.canvas.height / 2);
            count--;
        }
        function afterGoal(){
            resetBall();
            resetPlayers();
            drawCount();
            showTemporaryText();
            tocarSomGol();
            
        }
        function voltarAoMenu() {
    window.location.href = "../html/menu.html"; // Redireciona para o menu principal
}
function tocarSomGol() {
    const somGol = document.getElementById("somGol");
    somGol.play();
}
function showTemporaryText() {
    const textElement = document.getElementById("temporaryText");
    textElement.style.display = "block";
    textElement.style.opacity = 1; // Exibe o texto

    // Define o tempo em que o texto será exibido (em milissegundos)
    setTimeout(() => {
        textElement.style.display = "none"; // Oculta o texto
    }, 1000); // 3000ms = 3 segundos
}
function defineTimes(){
    let index = localStorage.getItem("player1Index");
    console.log(index)
    switch (index){
        case "0"://inter
             player1.color1 = '#FF0000';
             player1.color2 = '#FF0000';
             player1.abrev = "INT";

             break;
        case "1"://gremio
            player1.color1 = '#4ba9e3';
            player1.color2 = '#000000';
            player1.abrev = "GRE";
            break;
        case "2"://flamengo
            player1.color1 = '#FF0000';
            player1.color2 = '#000000';
            player1.abrev = "FLA";
            break;
        case "3"://cruzeiro
            player1.color1 = '#0000FF';
            player1.color2 = '#0000FF';
            player1.abrev = "CRU";
            break;
        case "4"://juventude
            player1.color1 = '#0c9050';
            player1.color2 = '#ffffff';
            player1.abrev = "JUV";
            break;
        case "5":
            player1.color1 = '#180963';
            player1.color2 = '#cc8304';
            player1.abrev = "GFC";
            break;
    }
    switch (localStorage.getItem("player2Index")){
        case "0"://inter
             player2.color1 = '#FF0000';
             player2.color2 = '#FF0000';
             player2.abrev = 'INT';
             break;
        case "1"://gremio
            player2.color1 = '#4ba9e3';
            player2.color2 = '#000000';
            player2.abrev = 'GRE';
            break;
        case "2"://flamengo
            player2.color1 = '#FF0000';
            player2.color2 = '#000000';
            player2.abrev = 'FLA';
            break;
        case "3"://cruzeiro
            player2.color1 = '#0000FF';
            player2.color2 = '#0000FF';
            player2.abrev = 'CRU';
            break;
        case "4"://juventude
            player2.color1 = '#0c9050';
            player2.color2 = '#ffffff';
            player2.abrev = 'JUV';
            break;
        case "5":
            player2.color1 = '#180963';
            player2.color2 = '#cc8304';
            player2.abrev = "GFC";
            break;
    }
    
}
defineTimes();
function voltarAoMenu() {
    window.location.href = "../html/menu.html";
}
