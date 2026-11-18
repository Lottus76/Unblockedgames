let allGames = [];

const gameGridView = document.getElementById('gameGridView');
const gamePlayView = document.getElementById('gamePlayView');
const gameGrid = document.getElementById('gameGrid');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');
const homeLogo = document.getElementById('homeLogo');
const gameIframe = document.getElementById('gameIframe');
const currentGameTitle = document.getElementById('currentGameTitle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const iframeWrapper = document.getElementById('iframeWrapper');
const exitMobileFsBtn = document.getElementById('exitMobileFsBtn');

async function fetchGames() {
    try {
        const response = await fetch('./games.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('HTTP-Fehler: ' + response.status);
        allGames = await response.json();
        displayGames(allGames);
    } catch (error) {
        console.error('Fehler beim Laden der Spiele:', error);
        gameGrid.innerHTML = '<p style="color: #ef4444;">Spiele konnten nicht geladen werden.</p>';
    }
}

function displayGames(games) {
    gameGrid.innerHTML = '';
    if (games.length === 0) {
        gameGrid.innerHTML = '<p>Keine Spiele gefunden.</p>';
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" class="game-thumbnail">
            <div class="game-info">
                <div class="game-title">${game.title}</div>
            </div>
        `;
        card.addEventListener('click', () => openGame(game));
        gameGrid.appendChild(card);
    });
}

function openGame(game) {
    currentGameTitle.textContent = game.title;
    gameIframe.src = game.embedUrl;
    gameGridView.classList.add('hidden');
    gamePlayView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function closeGame() {
    exitFullscreen();
    gameIframe.src = '';
    gamePlayView.classList.add('hidden');
    gameGridView.classList.remove('hidden');
}

function toggleFullscreen() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 820;

    if (isMobile) {
        enableMobileFullscreen();
        return;
    }

    if (!document.fullscreenElement) {
        if (iframeWrapper.requestFullscreen) {
            iframeWrapper.requestFullscreen().catch(() => enableMobileFullscreen());
        } else {
            enableMobileFullscreen();
        }
    } else {
        exitFullscreen();
    }
}

function enableMobileFullscreen() {
    iframeWrapper.classList.add('mobile-fullscreen');
    fullscreenBtn.classList.add('hidden');
    exitMobileFsBtn.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    iframeWrapper.classList.remove('mobile-fullscreen');
    exitMobileFsBtn.classList.add('hidden');
    fullscreenBtn.classList.remove('hidden');
    document.body.style.overflow = '';
}

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allGames.filter(game => game.title.toLowerCase().includes(term));
    displayGames(filtered);
});

backBtn.addEventListener('click', closeGame);
homeLogo.addEventListener('click', closeGame);
fullscreenBtn.addEventListener('click', toggleFullscreen);
exitMobileFsBtn.addEventListener('click', exitFullscreen);

fetchGames();
