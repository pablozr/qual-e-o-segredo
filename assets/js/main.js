function startGame() {
    document.getElementById('intro').classList.remove('active');
    document.getElementById('intro').classList.add('hidden');
    document.getElementById('story').classList.add('active');
    document.getElementById('story').classList.remove('hidden');
}

function goToGame() {
    window.location.href = 'game.html';
}