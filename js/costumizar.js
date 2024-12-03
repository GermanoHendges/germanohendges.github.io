// Função para redirecionar ao menu principal
function voltarAoMenu() {
    window.location.href = "../html/menu.html";
}
// Função para salvar configurações no localStorage
function salvarConfiguracoes() {
    const estadioSelecionado = document.body.style.backgroundImage || ""; // Armazenar a imagem do fundo

    localStorage.setItem("estadioSelecionado", estadioSelecionado); // Salvar estádio
    alert("Configurações salvas com sucesso!");
    IniciarJogo();
}

// Função para redirecionar ao jogo
function IniciarJogo() {
    console.log("LéoPicao");
    window.location.href = "../html/jogo.html";
}

// Função para alterar o fundo do estádio
function changeStadiumBackground(index) {

    const stadiums = [

        { name: "Arena do Grêmio", image: "url('../imagens/arenagremio.png')" },

        { name: "Beira Rio", image: "url('../imagens/beirario.png')" },

        { name: "Maracanã", image: "url('../imagens/maracana.png')" },

        { name: "Mineirão", image: "url('../imagens/mineirao.png')" }

    ];
    

    

    document.body.style.backgroundImage = stadiums[index].image; // Muda o fundo

    alert("Estádio escolhido: " + stadiums[index].name);

    

    // Armazenar o índice do estádio no localStorage

    localStorage.setItem("estadioSelecionadoIndex", index);
    console.log(localStorage.getItem("estadioSelecionadoIndex"));   

}
const playerColors = [
    { color1: '#FF0000', color2: '#FF0000' }, // Inter, nanico
    { color1: '#4ba9e3', color2: '#000000' }, // Gremio, time de raça
    { color1: '#FF0000', color2: '#000000' }, // Flamengo, time do vinicius cabcinha
    { color1: '#0000FF', color2: '#0000FF' }, // Cruzeiro, time do sor filipi
    { color1: '#0c9050', color2: '#FFFFFF' },  // juventude, time de caxias
    { color1: '#180963', color2: '#cc8304'} //galo FC, time de craques
];

// Índices atuais dos jogadores
let playerIndices = [0, 0];

// Função para desenhar o jogador no canvas
function drawPlayer(player, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const outlineWidth = 2.5;

    // Certifique-se de que o contexto do canvas foi obtido
    if (!ctx) {
        console.error(`Canvas com ID '${canvasId}' não encontrado ou não é válido.`);
        return;
    }

    // Limpa o canvas antes de desenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurações básicas do jogador
    const centerX = canvas.width / 2; // Centraliza no eixo X
    const centerY = canvas.height / 2; // Centraliza no eixo Y
    const radius = Math.min(canvas.width, canvas.height) / 2.5; // Ajusta o tamanho do círculo

    // Desenhar o círculo interno (cor de fundo)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = player.color1 || 'gray';
    ctx.fill();
    ctx.closePath();

    // Desenhar a faixa vertical no meio (color2)
    ctx.beginPath();
    ctx.rect(
        centerX - radius / 3,       // Posição inicial no eixo X
        centerY - radius,          // Começo no topo do círculo
        (radius / 3) * 2,          // Largura proporcional ao raio
        radius * 2                 // Altura igual ao diâmetro do círculo
    );
    ctx.fillStyle = player.color2 || 'black';
    ctx.fill();
    ctx.closePath();

    // Contorno do círculo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = outlineWidth * 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

// Função para mudar o uniforme do jogador
function changeUniform(playerIndex, direction) {
    // Atualiza o índice do jogador com base na direção
    playerIndices[playerIndex] = (playerIndices[playerIndex] + direction + playerColors.length) % playerColors.length;

    // Atualiza a cor do jogador e desenha o jogador com as novas cores
    const colors = playerColors[playerIndices[playerIndex]];
    const player = {
        color1: colors.color1,
        color2: colors.color2,
    };

    drawPlayer(player, `canvasPlayer${playerIndex + 1}`);

    // Armazena o índice do time no localStorage (0 a 4)
    localStorage.setItem(`player${playerIndex + 1}Index`, playerIndices[playerIndex]);
}

// Inicializar a customização com as cores padrão ou salvas
function initializeCustomization() {
    console.log("Inicializando customização...");
    for (let i = 0; i < 2; i++) {
        const savedIndex = parseInt(localStorage.getItem(`player${i + 1}Index`)) || 0;
        playerIndices[i] = savedIndex;

        const colors = playerColors[savedIndex];
        const player = {
            color1: colors.color1,
            color2: colors.color2,
        };

        drawPlayer(player, `canvasPlayer${i + 1}`);
        console.log(`Jogador ${i + 1} inicializado com cores:`, colors);
    }
}

// Chama a inicialização ao carregar a página
initializeCustomization();