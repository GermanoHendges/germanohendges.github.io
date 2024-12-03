document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const intro = document.getElementById("intro");
    const menuContainer = document.getElementById("menu-container");
  
    // Quando o vídeo termina, esconde a tela de carregamento e mostra a introdução
    const loadingVideo = document.getElementById("loading-video");
    loadingVideo.onended = () => {
      loadingScreen.classList.add("fade-out"); // Efeito de desvanecimento
      setTimeout(() => {
        loadingScreen.style.display = "none"; // Esconde a tela de carregamento
        intro.classList.remove("hidden"); // Mostra a introdução para apertar "Enter"
      }, 1000); // Tempo de transição para o fade-out
    };
  
    // Detecta a tecla Enter para exibir o menu
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        window.location.href = "../html/menu.html";
      }
    });
  });
  
  // Função para redirecionamento com os botões do menu
  function handleButtonClick(button) {
    switch(button) {
      case 'JOGAR':
        window.location.href = "../html/customizar.html";
        break;
      case 'OPÇÕES':
        window.location.href = "../html/opcoes.html";
        break;
      case 'COMO JOGAR':
        window.location.href = "../html/comojogar.html";
        break;
      case 'CRÉDITOS':
        window.location.href = "../html/creditos.html";
        break;
      default:
        console.log("Opção inválida!");
    }
  }
  