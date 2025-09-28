import categories from './data/categories';

interface IdeaHistory {
    idea: string;
    category: string;
    timestamp: string;
}

interface State {
    currentIdea: string;
    currentCategory: string;
    favorites: IdeaHistory[];
    history: IdeaHistory[];
    weirdnessLevel: number;
    selectedCategories: string[];
    isGenerating: boolean;
    showSettings: boolean;
    showHistory: boolean;
    showFavorites: boolean;
}

interface Category {
    name: string;
    color: string;
    gradient: string;
    icon: string;
    ideas: string[];
    weirdIdeas: string[];
}

export interface Categories {
    [key: string]: Category;
}

// Import delle categorie da un altro modulo

// Stato globale
const state: State = {
    currentIdea: '',
    currentCategory: '',
    favorites: [],
    history: [],
    weirdnessLevel: 1,
    selectedCategories: ['creativo'],
    isGenerating: false,
    showSettings: false,
    showHistory: false,
    showFavorites: false
};

// Funzioni convertite
function toggleSettings(): void {
    state.showSettings = !state.showSettings;
    state.showHistory = false;
    state.showFavorites = false;
    render();
}

function toggleHistory(): void {
    state.showHistory = !state.showHistory;
    state.showSettings = false;
    state.showFavorites = false;
    render();
}

function toggleFavorites(): void {
    state.showFavorites = !state.showFavorites;
    state.showSettings = false;
    state.showHistory = false;
    render();
}

function toggleCategory(categoryKey: string): void {
    if (state.selectedCategories.includes(categoryKey)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== categoryKey);
    } else {
        state.selectedCategories = [...state.selectedCategories, categoryKey];
    }
    if (state.selectedCategories.length === 0) {
        state.selectedCategories = ['creativo'];
    }
    saveToLocalStorage();
    // render();
}

function updateWeirdness(value: string): void {
    state.weirdnessLevel = parseInt(value);
    saveToLocalStorage();
    // render();
}

function quickGenerate(categoryKey: string): void {
    state.selectedCategories = [categoryKey];
    saveToLocalStorage();
    generateIdea();
}

function selectHistoryItem(index: number): void {
    const item = state.history[index];
    state.currentIdea = item.idea;
    state.currentCategory = item.category;
    state.showHistory = false;
    render();
}

function selectFavoriteItem(index: number): void {
    const item = state.favorites[index];
    state.currentIdea = item.idea;
    state.currentCategory = item.category;
    state.showFavorites = false;
    render();
}

function removeFavorite(index: number): void {
    state.favorites = state.favorites.filter((_, i) => i !== index);
    saveToLocalStorage();
    render();
}

function shareIdea(): void {
    if (navigator.share && state.currentIdea) {
        navigator.share({
            title: 'Idea Casuale!',
            text: `${state.currentIdea}\n\nGenerato da Generatore Idee 💡`,
            url: window.location.href
        });
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${state.currentIdea}\n\nGenerato da Generatore Idee 💡\n${window.location.href}`);
            alert('Idea copiata negli appunti!');
        }
    }
}

function generateImage(): void {
    if (!state.currentIdea) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 1080;
    canvas.height = 1920;
    let displayColor = '#667eea';
    if (state.currentCategory.includes('+')) {
        displayColor = '#764ba2';
    } else if (categories[state.currentCategory]) {
        displayColor = categories[state.currentCategory].color;
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, displayColor + '88');
    gradient.addColorStop(1, displayColor + 'CC');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 100 + 20;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💡 Generatore Idee', canvas.width / 2, 200);
    ctx.font = '32px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const categoryDisplay = getCategoryDisplayName(state.currentCategory);
    ctx.fillText(categoryDisplay.toUpperCase(), canvas.width / 2, 280);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.textAlign = 'center';
    const words = state.currentIdea.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = canvas.width - 160;
    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine);
    const startY = (canvas.height / 2) - ((lines.length - 1) * 60 / 2);
    lines.forEach((line, index) => {
        ctx.fillText(line.trim(), canvas.width / 2, startY + (index * 60));
    });
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const now = new Date().toLocaleDateString('it-IT');
    ctx.fillText(now, canvas.width / 2, canvas.height - 100);
    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idea-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

function saveToLocalStorage(): void {
    localStorage.setItem('generatore-idee-favorites', JSON.stringify(state.favorites));
    localStorage.setItem('generatore-idee-history', JSON.stringify(state.history.slice(0, 50)));
    localStorage.setItem('generatore-idee-weirdness', state.weirdnessLevel.toString());
    localStorage.setItem('generatore-idee-categories', JSON.stringify(state.selectedCategories));
}

function getCategoryDisplayName(categoryKey: string): string {
    if (categoryKey.includes('+')) {
        const cats = categoryKey.split('+');
        return cats.map(cat => categories[cat]?.name || cat).join(' + ');
    }
    return categories[categoryKey]?.name || categoryKey;
}

function getCardGradient(categoryKey: string): string {
    if (categoryKey.includes('+')) {
        return 'card-gradient-mixed';
    }
    return categories[categoryKey]?.gradient || 'card-gradient-mixed';
}

function generateIdea(): void {
    state.isGenerating = true;
    render();
    setTimeout(() => {
        const selectedCats = state.selectedCategories.length > 0 ? state.selectedCategories : ['creativo'];
        let finalIdea = '';
        let primaryCategory = '';
        if (selectedCats.length === 1) {
            const category = categories[selectedCats[0]];
            let ideaPool = category.ideas;
            if (state.weirdnessLevel >= 3) {
                ideaPool = [...category.ideas, ...category.weirdIdeas];
            }
            finalIdea = ideaPool[Math.floor(Math.random() * ideaPool.length)];
            primaryCategory = selectedCats[0];
        } else {
            const shouldCombine = Math.random() > 0.3;
            if (shouldCombine && selectedCats.length >= 2) {
                const shuffled = [...selectedCats].sort(() => 0.5 - Math.random());
                const cat1Key = shuffled[0];
                const cat2Key = shuffled[1];
                const cat1 = categories[cat1Key];
                const cat2 = categories[cat2Key];
                let pool1 = cat1.ideas;
                let pool2 = cat2.ideas;
                if (state.weirdnessLevel >= 3) {
                    pool1 = [...cat1.ideas, ...cat1.weirdIdeas];
                    pool2 = [...cat2.ideas, ...cat2.weirdIdeas];
                }
                const idea1 = pool1[Math.floor(Math.random() * pool1.length)];
                const idea2 = pool2[Math.floor(Math.random() * pool2.length)];
                const combinationTemplates = [
                    `Combina ${cat1.name.toLowerCase()} e ${cat2.name.toLowerCase()}: ${idea1.split(':')[0]} + ${idea2.split(':')[0]}`,
                    `Sfida mista: ${idea1} MA in stile ${cat2.name.toLowerCase()}`,
                    `Fusion idea: ${idea2} incorporando elementi di ${idea1.toLowerCase()}`,
                    `Cross-training: ${idea1} + ${idea2.replace(/^[A-Z][a-z]+ /, '').toLowerCase()}`,
                    `Esperimento: ${idea2.split(' ').slice(0, 4).join(' ')} + ${idea1.split(' ').slice(-4).join(' ')}`
                ];
                finalIdea = combinationTemplates[Math.floor(Math.random() * combinationTemplates.length)];
                primaryCategory = `${cat1Key}+${cat2Key}`;
            } else {
                const randomCat = selectedCats[Math.floor(Math.random() * selectedCats.length)];
                const category = categories[randomCat];
                let ideaPool = category.ideas;
                if (state.weirdnessLevel >= 3) {
                    ideaPool = [...category.ideas, ...category.weirdIdeas];
                }
                finalIdea = ideaPool[Math.floor(Math.random() * ideaPool.length)];
                primaryCategory = randomCat;
            }
        }
        if (finalIdea === state.currentIdea) {
            return generateIdea();
        }
        state.currentIdea = finalIdea;
        state.currentCategory = primaryCategory;
        state.history = [{
            idea: finalIdea,
            category: primaryCategory,
            timestamp: new Date().toISOString()
        }, ...state.history.slice(0, 49)];
        state.isGenerating = false;
        saveToLocalStorage();
        render();
    }, 800);
}

function toggleFavorite(): void {
    const idx = state.favorites.findIndex(fav => fav.idea === state.currentIdea);
    if (idx === -1 && state.currentIdea) {
        // Aggiungi ai preferiti
        state.favorites = [{
            idea: state.currentIdea,
            category: state.currentCategory,
            timestamp: new Date().toISOString()
        }, ...state.favorites];
    } else if (idx !== -1) {
        // Rimuovi dai preferiti
        state.favorites = state.favorites.filter((_, i) => i !== idx);
    }
    saveToLocalStorage();
    render();
}

function render(): void {
    const app = document.getElementById('app');
    if (!app) return;
    const isFavorite = state.favorites.some(fav => fav.idea === state.currentIdea);
    app.innerHTML = `
        <div class="gradient-bg min-h-screen">
            <div class="flex justify-between items-center p-4 pt-8">
                <h1 class="text-2xl font-bold text-white flex items-center gap-2">💡 Idee Casuali</h1>
                <div class="flex gap-2">
                    <!-- Pulsanti principali -->
                    <div class="relative group">
                        <button onclick="toggleHistory()" class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all text-2xl cursor-pointer">📚</button>
                        <div class="tooltip-card">
                            Cronologia
                        </div>
                    </div>
                    <div class="relative group">
                        <button onclick="toggleFavorites()" class="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all text-2xl cursor-pointer">❤️</button>
                        <div class="tooltip-card">
                            Preferiti
                        </div>
                    </div>
                </div>
            </div>
            
            
            ${state.showHistory ? `
            <div class="mx-4 mb-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white max-h-96 overflow-y-auto">
                <h3 class="font-bold mb-3">📚 Cronologia</h3>${state.history.length === 0 ? '<p class="text-white/70">Nessuna idea generata ancora...</p>' : state.history.slice(0, 20).map((item, index) => `<div class="mb-3 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-all" onclick="selectHistoryItem(${index})"><div class="text-sm text-white/70 mb-1">${getCategoryDisplayName(item.category)} • ${new Date(item.timestamp).toLocaleDateString('it-IT')}</div><div class="text-sm">${item.idea}</div></div>`).join('')}</div>` : ''}
            
            ${state.showFavorites ? `<div class="mx-4 mb-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white max-h-96 overflow-y-auto"><h3 class="font-bold mb-3">❤️ Preferiti</h3>${state.favorites.length === 0 ? '<p class="text-white/70">Nessun preferito ancora...</p>' : state.favorites.map((item, index) => `<div class="mb-3 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-all" onclick="selectFavoriteItem(${index})"><div class="text-sm text-white/70 mb-1">${getCategoryDisplayName(item.category)} • ${new Date(item.timestamp).toLocaleDateString('it-IT')}</div><div class="text-sm">${item.idea}</div><button onclick="event.stopPropagation(); removeFavorite(${index})" class="mt-2 text-red-300 hover:text-red-100 text-xs">🗑️ Rimuovi</button></div>`).join('')}</div>` : ''}
            
            <div class="px-4 mb-6">
                <div class="${getCardGradient(state.currentCategory)} p-8 rounded-3xl shadow-2xl transform transition-all duration-500 ${state.isGenerating ? 'scale-95 opacity-50' : 'scale-100 opacity-100 bounce-in'} relative overflow-hidden">
                         ${state.currentCategory ? `<div class="absolute right-4 top-3 w-32 text-center mb-3 px-3 py-1 rounded-full bg-black/20 text-white text-sm font-medium">${categories[state.currentCategory.split('+')[0]]?.icon || '💡'} ${getCategoryDisplayName(state.currentCategory)}</div>` : ''}               
                    <div class="text-center">${state.isGenerating ? `<div class="flex flex-col items-center gap-4"><div class="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full"></div>
                        <p class="text-white/80">🎲 Mescolando idee creative...</p>
                        </div>` : `
                            <div><p class="text-white text-xl font-medium leading-relaxed my-8 text-responsive">${state.currentIdea}</p>
                                <div class="flex justify-center gap-3 mt-6">
                                 <!-- Pulsanti azione card -->
                                 <div class="relative group">
                                    <button onclick="toggleFavorite()" class="p-3 rounded-full transition-all transform hover:scale-110 ${isFavorite ? 'bg-red-500 text-white scale-110 animate-pulse-slow' : 'bg-white/20 text-white hover:bg-white/30'} text-3xl" title="${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}">${isFavorite ? '❤️' : '🤍'}</button>
                                    <div class="tooltip-card">
                                        ${isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                                    </div>
                                </div>
                                
                                <div class="relative group">
                                    <button onclick="generateImage()" class="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all transform hover:scale-110 text-3xl" title="Scarica come immagine">📥</button>
                                    <div class="tooltip-card">
                                        Scarica come immagine
                                    </div>
                                </div>
                                
                                <div class="relative group">
                                    <button onclick="shareIdea()" class="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all transform hover:scale-110 text-3xl" title="Condividi idea">📤</button>
                                    <div class="tooltip-card">
                                        Condividi idea
                                    </div>
                                </div>
                                
                                </div>
                            </div>
`}
                    </div>
                </div>
            </div>
                    
            <div class="px-4 mb-6"><button onclick="generateIdea()" ${state.isGenerating ? 'disabled' : ''} class="w-full py-4 bg-white text-gray-800 rounded-2xl font-bold lg:text-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-101 cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">${state.isGenerating ? `<div class="animate-spin w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full"></div> Generando...` : `🎲 Genera Nuova Idea`}</button></div>
            
            <div class="px-4 pb-8">
                <div class="grid grid-cols-3 gap-5">${Object.entries(categories).slice(0, 3).map(([key, cat]: [string, any]) => `
                    <button onclick="quickGenerate('${key}')" class="${cat.gradient} cursor-pointer p-3 rounded-xl text-white text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-102 transition-all"><span class="lg:text-2xl text-xl">${cat.icon} ${cat.name}</span> </button>`).join('')}
                </div>
            </div>

            <div class="mx-4 mb-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm text-white">
                <div class="mb-4">
                    <label class="block text-md italic font-bold mb-2">Seleziona Categorie:</label>
                    <div class="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-3 gap-2">${Object.entries(categories).map(([key, cat]) => `
                            <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-white/10 p-2 rounded">
                            <input type="checkbox" ${state.selectedCategories.includes(key) ? 'checked' : ''} onchange="toggleCategory('${key}')" class="rounded scale-100 lg:scale-200" /><span class="lg:text-xl text:sm">${cat.icon} ${cat.name}</span></label>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <label class="block text-md font-bold mb-2"><span class="italic">Livello Stranezza:</span> ${state.weirdnessLevel === 1 ? '😊 Normale' : state.weirdnessLevel === 2 ? '🤪 Strano' : '🦄 Bizzarro'}</label>
                    <input type="range" min="1" max="3" value="${state.weirdnessLevel}" onchange="updateWeirdness(this.value)" class="w-full" list="weirdness-levels" />
                    <datalist id="weirdness-levels">
                        <option value="1" label="Normale"></option>
                        <option value="2" label="Strano"></option>
                        <option value="3" label="Bizzarro"></option>
                    </datalist>
                    <div class="flex justify-between text-xs mt-1 text-white/80">
                        <span>😊 Normale</span>
                        <span>🤪 Strano</span>
                        <span>🦄 Bizzarro</span>
                    </div>
                </div>
            </div>
            
            
            <div class="px-4 mb-4"><div class="grid grid-cols-2 gap-4">
                <div class="button-semi-transparent " onclick="toggleFavorites()">
                    <div class="text-2xl font-bold text-white">${state.favorites.length}</div>
                    <div class="text-white/80 text-md font-bold">❤️ Preferiti</div>
                </div>
                
                <div class="button-semi-transparent " onclick="toggleHistory()" style="animation-delay: 0.5s">
                    <div class="text-2xl font-bold text-white">${state.history.length}</div>
                        <div class="text-white/80 text-md font-bold">📚 Idee Generate</div>
                    </div>
                </div>
            </div>
            
            <div class="text-center text-white/60 text-xs pb-4">Made with ❤️ for creativity</div>
            <div class="flex justify-center pb-10 animate-pulse-slow "><a href="https://ko-fi.com/G2G7JQ441"  target="_blank">
            <img alt="Buy Me a Coffee at ko-fi.com" border="0" height="36" src="https://storage.ko-fi.com/cdn/kofi6.png?v=6" class="w-48" /></a></div>
        </div>
    `;
}


// Espongo le funzioni su window
(window as any).toggleSettings = toggleSettings;
(window as any).toggleHistory = toggleHistory;
(window as any).toggleFavorites = toggleFavorites;
(window as any).toggleCategory = toggleCategory;
(window as any).updateWeirdness = updateWeirdness;
(window as any).quickGenerate = quickGenerate;
(window as any).selectHistoryItem = selectHistoryItem;
(window as any).selectFavoriteItem = selectFavoriteItem;
(window as any).removeFavorite = removeFavorite;
(window as any).generateImage = generateImage;
(window as any).render = render;
(window as any).generateIdea = generateIdea;
(window as any).shareIdea = shareIdea;
(window as any).saveToLocalStorage = saveToLocalStorage;
(window as any).getCategoryDisplayName = getCategoryDisplayName;
(window as any).getCardGradient = getCardGradient;
(window as any).toggleFavorite = toggleFavorite;
// Inizializzazione automatica all'avvio
window.addEventListener('DOMContentLoaded', () => {
    const favs = localStorage.getItem('generatore-idee-favorites');
    const hist = localStorage.getItem('generatore-idee-history');
    const weird = localStorage.getItem('generatore-idee-weirdness');
    const cats = localStorage.getItem('generatore-idee-categories');
    if (favs) state.favorites = JSON.parse(favs);
    if (hist) state.history = JSON.parse(hist);
    if (weird) state.weirdnessLevel = parseInt(weird);
    if (cats) state.selectedCategories = JSON.parse(cats);
    if (state.history.length > 0) {
        const lastItem = state.history[0];
        state.currentIdea = lastItem.idea;
        state.currentCategory = lastItem.category;
        render();
    } else {
        generateIdea();
    }
});
