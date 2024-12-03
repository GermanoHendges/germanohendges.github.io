function voltarAoMenu() {
    window.location.href = "../html/menu.html"; 
}

function toggleSom() {
    const somButton = document.getElementById('somButton');
    const audio = document.getElementById('backgroundAudio');

    if (audio.paused) {
        audio.play();
        somButton.textContent = 'Som: Ligado';
        localStorage.setItem('volume', 'ligado');
    } else {
        audio.pause();
        somButton.textContent = 'Som: Desligado';
        localStorage.setItem('volume', 'desligado');
    }
}

function ajustarVolume(valor) {
    const audio = document.getElementById('backgroundAudio');
    audio.volume = valor / 100;
    localStorage.setItem('volumeLevel', valor);
    console.log(`Volume ajustado para: ${valor}`);
}

window.onload = function() {
    const audio = document.getElementById('backgroundAudio');
    const volumeSlider = document.getElementById('volume');

    const volumeLevel = localStorage.getItem('volumeLevel') || 50;
    volumeSlider.value = volumeLevel;
    audio.volume = volumeLevel / 100;
}
