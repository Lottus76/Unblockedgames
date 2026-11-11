let allGames = [];

const gameGridView = document.getElementById('gameGridView');
const gamePlayerView = document.getElementById('gamePlayerView');
const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');
const gameIframe = document.getElementById('gameIframe');
const currentGameTitle = document.getElementById('currentGameTitle');

async function fetchGames() {
    try {
        const response = await fetch('games.json');
        allGames = await response.json();
        displayGames(allGames);
    } catch (error) {
        console.error('Error loading games:', error);
        gameGrid.innerHTML = '<p style="color: #ef4444;">Failed to load games.</p>';
    }
}

function displayGames(games) {
    gameGrid.innerHTML = '';
    if (games.length === 0) {
        gameGrid.innerHTML = '<p>No games found.</p>';
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <h3>${game.title}</h3>
        `;
        card.addEventListener('click', () => launchGame(game));
        gameGrid.appendChild(card);
    });
}

function launchGame(game) {
    currentGameTitle.textContent = game.title;
    gameIframe.src = game.embedUrl;
    gameGridView.classList.add('hidden');
    gamePlayerView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

backBtn.addEventListener('click', () => {
    gameIframe.src = ''; 
    gamePlayerView.classList.add('hidden');
    gameGridView.classList.remove('hidden');
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allGames.filter(game => game.title.toLowerCase().includes(term));
    displayGames(filtered);
});

fetchGames();
function toggleFullscreen() {
    // Wir holen uns das Iframe, in dem das Spiel läuft
    var iframe = document.getElementById("game-frame");

    if (!document.fullscreenElement) {
        // Wenn noch kein Vollbild aktiv ist, schalte ins Vollbild
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) { /* Safari / iOS */
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { /* IE/Edge */
            iframe.msRequestFullscreen();
        }
    } else {
        // Wenn bereits im Vollbild, schalte es wieder aus
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};
