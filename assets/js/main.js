// Garantir que a tela inicial seja exibida corretamente quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar a tela inicial
    setTimeout(function() {
        document.getElementById('intro').classList.add('active');
    }, 100);

    // Adicionar efeito de hover aos elementos da missão
    const missionItems = document.querySelectorAll('.mission-item');
    missionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('animate__animated', 'animate__pulse');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('animate__animated', 'animate__pulse');
        });
    });
});

// Transição para a tela de história
function startGame() {
    // Esconder a tela inicial com animação
    const introScreen = document.getElementById('intro');
    introScreen.classList.remove('active');
    introScreen.style.opacity = '0';
    introScreen.style.transform = 'translateY(-20px)';

    // Mostrar a tela de história após um pequeno delay
    setTimeout(function() {
        introScreen.classList.add('hidden');
        const storyScreen = document.getElementById('story');
        storyScreen.classList.remove('hidden');

        // Pequeno delay para garantir que a animação funcione
        setTimeout(function() {
            storyScreen.classList.add('active');
        }, 50);
    }, 500);
}

// Transição para a tela de jogo
function goToGame() {
    // Adicionar animação de saída
    const storyScreen = document.getElementById('story');
    storyScreen.classList.add('animate__animated', 'animate__fadeOut');

    // Redirecionar para a página do jogo após a animação terminar
    setTimeout(function() {
        window.location.href = 'game.html';
    }, 500);
}