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

// Spiele aus games.json laden (mit Cache-Buster für Handys)
async function fetchGames() {
    try {
        const response = await fetch('./games.json?v=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('HTTP-Fehler: ' + response.status);
        }
        allGames = await response.json();
        displayGames(allGames);
    } catch (error) {
        console.error('Fehler beim Laden der Spiele:', error);
        gameGrid.innerHTML = '<p style="color: #ef4444;">Spiele konnten nicht geladen werden.</p>';
    }
}

// Spiele im Grid anzeigen
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

// Spiel starten
function openGame(game) {
    currentGameTitle.textContent = game.title;
    gameIframe.src = game.embedUrl;
    gameGridView.classList.add('hidden');
    gamePlayView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Zurück zur Übersicht
function closeGame() {
    exitFullscreen();
    gameIframe.src = '';
    gamePlayView.classList.add('hidden');
    gameGridView.classList.remove('hidden');
}

// Vollbild aktivieren (PC, Android & iPad/iPhone Support)
function toggleFullscreen() {
    if (iframeWrapper.requestFullscreen) {
        iframeWrapper.requestFullscreen().catch(() => enableMobileFullscreen());
    } else if (iframeWrapper.webkitRequestFullscreen) {
        iframeWrapper.webkitRequestFullscreen();
    } else {
        enableMobileFullscreen();
    }
}

// Fallback-Vollbild speziell für iPhones & iPads
function enableMobileFullscreen() {
    iframeWrapper.classList.add('mobile-fullscreen');
    exitMobileFsBtn.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Vollbild beenden
function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    iframeWrapper.classList.remove('mobile-fullscreen');
    exitMobileFsBtn.classList.add('hidden');
    document.body.style.overflow = '';
}

// Event Listener
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allGames.filter(game => game.title.toLowerCase().includes(term));
    displayGames(filtered);
});

backBtn.addEventListener('click', closeGame);
homeLogo.addEventListener('click', closeGame);
fullscreenBtn.addEventListener('click', toggleFullscreen);
exitMobileFsBtn.addEventListener('click', exitFullscreen);

// Skript starten
fetchGames();