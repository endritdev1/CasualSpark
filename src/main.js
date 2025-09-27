// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    // Carica la prima idea
    if (state.history.length > 0) {
        const lastItem = state.history[0];
        state.currentIdea = lastItem.idea;
        state.currentCategory = lastItem.category;
        render();
    } else {
        generateIdea();
    }
});

// Service Worker per PWA (opzionale)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker non disponibile, ignora
        });
    });
}


// Event handlers
function toggleSettings() {
    state.showSettings = !state.showSettings;
    state.showHistory = false;
    state.showFavorites = false;
    render();
}

function toggleHistory() {
    state.showHistory = !state.showHistory;
    state.showSettings = false;
    state.showFavorites = false;
    render();
}

function toggleFavorites() {
    state.showFavorites = !state.showFavorites;
    state.showSettings = false;
    state.showHistory = false;
    render();
}

function toggleCategory(categoryKey) {
    if (state.selectedCategories.includes(categoryKey)) {
        state.selectedCategories = state.selectedCategories.filter(c => c !== categoryKey);
    } else {
        state.selectedCategories = [...state.selectedCategories, categoryKey];
    }

    // Assicurati che almeno una categoria sia selezionata
    if (state.selectedCategories.length === 0) {
        state.selectedCategories = ['creativo'];
    }

    saveToLocalStorage();
    render();
}

function updateWeirdness(value) {
    state.weirdnessLevel = parseInt(value);
    saveToLocalStorage();
    render();
}

function quickGenerate(categoryKey) {
    state.selectedCategories = [categoryKey];
    saveToLocalStorage();
    generateIdea();
}

function selectHistoryItem(index) {
    const item = state.history[index];
    state.currentIdea = item.idea;
    state.currentCategory = item.category;
    state.showHistory = false;
    render();
}

function selectFavoriteItem(index) {
    const item = state.favorites[index];
    state.currentIdea = item.idea;
    state.currentCategory = item.category;
    state.showFavorites = false;
    render();
}

function removeFavorite(index) {
    state.favorites = state.favorites.filter((_, i) => i !== index);
    saveToLocalStorage();
    render();
}

function generateImage() {
    if (!state.currentIdea) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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

    // Elementi decorativi
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 100 + 20;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Titolo
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💡 Generatore Idee', canvas.width / 2, 200);

    // Categoria
    ctx.font = '32px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const categoryDisplay = getCategoryDisplayName(state.currentCategory);
    ctx.fillText(categoryDisplay.toUpperCase(), canvas.width / 2, 280);

    // Testo principale
    ctx.fillStyle = 'white';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.textAlign = 'center';

    // Word wrap per testi lunghi
    const words = state.currentIdea.split(' ');
    const lines = [];
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

    // Footer
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const now = new Date().toLocaleDateString('it-IT');
    ctx.fillText(now, canvas.width / 2, canvas.height - 100);

    // Download immagine
    canvas.toBlob((blob) => {
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

// Definizione delle categorie e idee
const categories = {
    creativo: {
        name: 'Creativo',
        color: '#f093fb',
        gradient: 'card-gradient-creative',
        icon: '🎨',
        ideas: [
            'Dipingi con i colori che rappresentano il tuo umore oggi',
            'Scrivi una storia di 100 parole su un oggetto che hai appena toccato',
            'Crea un collage usando solo materiali naturali trovati all\'aperto',
            'Fotografa 15 texture diverse nella tua casa con macro dettagli',
            'Disegna il tuo cibo preferito nello stile artistico di Van Gogh',
            'Inventa una canzone rap autobiografica su cosa hai fatto ieri',
            'Crea sculture astratte usando solo oggetti dalla scrivania',
            'Scrivi una poesia che inizia con "Se fossi un colore sarei..."',
            'Ridisegna il logo di un brand famoso in stile art déco',
            'Crea un fumetto di 6 vignette sulla tua routine mattutina',
            'Costruisci architetture fantastiche con i Lego o blocchi',
            'Scatta foto artistiche solo di riflessi per 45 minuti',
            'Inventa un nuovo tipo di pasta e disegna la ricetta',
            'Crea pattern decorativi usando solo impronte delle dita',
            'Scrivi un dialogo surreale tra due elettrodomestici',
            'Dipingi un paesaggio usando solo le dita, mai pennelli',
            'Crea un autoritratto fatto interamente di emoji colorate',
            'Inventa una danza interpretativa che rappresenta il lunedì mattina',
            'Costruisci un castello architettonico con libri e oggetti',
            'Scrivi una recensione poetica e dettagliata del tuo ultimo sogno',
            'Crea arte digitale astratta usando solo forme geometriche',
            'Inventa 20 nomi creativi per colori che non esistono',
            'Fai un ritratto di qualcuno usando solo descrizioni scritte',
            'Crea un mandala colorato con piccoli oggetti di casa',
            'Scrivi la biografia immaginaria di un oggetto inanimato',
            'Inventa una nuova emoji espressiva e disegnala dettagliatamente',
            'Crea un video stop-motion di 2 minuti con il cibo',
            'Disegna la tua città ideale vista dall\'alto come un urbanista',
            'Inventa una ricetta metaforica per cucinare un\'emozione specifica',
            'Crea arte usando esclusivamente giochi di ombre e luci',
            'Scrivi una fiaba moderna ambientata nel tuo quartiere',
            'Disegna te stesso come personaggio di un videogioco',
            'Crea un album fotografico tematico "Un giorno nella vita di..."',
            'Inventa un font tipografico ispirato alla tua personalità',
            'Costruisci strumenti musicali con materiali di riciclo',
            'Scrivi haiku moderni sui social media e la tecnologia',
            'Crea un documentario di 5 minuti sulla vita nel tuo frigo',
            'Disegna mappe fantasy di luoghi che esistono solo nella tua mente',
            'Inventa un nuovo sport e illustra le regole',
            'Crea installazioni artistiche temporanee nel tuo giardino',
            'Scrivi lettere dal futuro a te stesso del presente',
            'Fotografa la stessa scena in 10 stili fotografici diversi',
            'Inventa creature fantastiche e descrivi il loro habitat',
            'Crea un gioco da tavolo basato sulla tua vita quotidiana',
            'Scrivi dialoghi immaginari tra personaggi storici famosi',
            'Disegna architetture impossibili che sfidano la gravità',
            'Crea una timeline visiva della tua vita usando solo simboli',
            'Inventa un linguaggio segreto e scrivi un messaggio',
            'Fotografa il mondo dal punto di vista di un animale domestico',
            'Crea costumi teatrali usando solo materiali casalinghi',
            'Scrivi recensioni artistiche di attività quotidiane banali',
            'Disegna ritratti di persone usando solo linee geometriche',
            'Inventa nuovi strumenti per attività creative inesistenti',
            'Crea un museo virtuale delle tue memorie d\'infanzia',
            'Scrivi sceneggiature per cortometraggi di 3 minuti',
            'Disegna cover immaginarie per album musicali inesistenti',
            'Crea collage digitali che raccontano storie senza parole',
            'Inventa personaggi per un universo fantastico complesso',
            'Fotografa macro-dettagli e inventa storie su cosa rappresentano',
            'Crea installazioni arte povera con oggetti della natura',
            'Scrivi monologhi drammatici per oggetti inanimati della casa',
            'Disegna progetti di case futuristiche ecosostenibili',
            'Inventa rituali artistici da ripetere ogni giorno',
            'Crea nature morte moderne con oggetti tecnologici',
            'Scrivi poesie concrete dove le parole formano disegni',
            'Disegna tatuaggi immaginari che raccontano storie personali',
            'Crea miniature dettagliate di mondi fantastici',
            'Inventa coreografie per attività quotidiane come lavarsi i denti',
            'Fotografa astrazioni trovando arte in cose comuni',
            'Scrivi guide turistiche per luoghi immaginari dettagliate',
            'Crea selfie artistici usando solo luci e ombre creative',
            'Disegna fumetti autobiografici sui tuoi sogni ricorrenti',
            'Inventa cocktail creativi e disegna le ricette',
            'Crea sculture cinetiche che si muovono con il vento',
            'Scrivi favole moderne con morale contemporanea',
            'Disegna fashion design per abiti del futuro',
            'Crea video-arte usando solo il tuo smartphone',
            'Inventa giochi creativi per sviluppare nuove abilità',
            'Fotografa la vita urbana come se fosse natura selvaggia',
            'Scrivi lettere d\'amore agli oggetti che usi di più',
            'Crea arte tessile usando tecniche di riciclo creative',
            'Disegna architetture oniriche ispirate ai tuoi sogni',
            'Inventa performance artistiche da fare in spazi pubblici',
            'Crea mappe emotive dei tuoi luoghi del cuore',
            'Scrivi manifesti artistici per movimenti creativi inesistenti'
        ],
        weirdIdeas: [
            'Dipingi usando solo condimenti colorati e spezie della cucina',
            'Scrivi una lettera d\'amore appassionata a un pianeta lontano',
            'Crea sculture d\'arte usando solo oggetti scaduti del frigo',
            'Fotografa conversazioni tra la tua ombra e quelle degli oggetti',
            'Inventa un linguaggio musicale fatto solo di rumori domestici',
            'Crea autoritratti usando esclusivamente cibo colorato come medium',
            'Scrivi un romanzo epico usando solo titoli di canzoni esistenti',
            'Dipingi camminando a piedi nudi su tele stese a terra',
            'Componi sinfonie suonando solo oggetti di plastica trovati',
            'Inventa una religione artistica dedicata ai calzini spaiati',
            'Crea installazioni usando solo capelli raccolti dalla spazzola',
            'Scrivi poesie usando solo parole che iniziano con la stessa lettera',
            'Fotografa solo oggetti che sembrano avere facce o espressioni',
            'Inventa danze che imitano perfettamente il movimento degli elettrodomestici',
            'Crea arte usando solo il vapore del caffè mattutino',
            'Scrivi dialoghi immaginari tra i tuoi vestiti nell\'armadio',
            'Dipingi usando solo il dentifricio come colore principale',
            'Crea sculture temporanee usando solo cubetti di ghiaccio colorati',
            'Fotografa il mondo usando solo riflessi nelle superfici metalliche',
            'Inventa coreografie per camminare che siano pure performance artistiche'
        ]
    },
    business: {
        name: 'Business',
        color: '#4facfe',
        gradient: 'card-gradient-business',
        icon: '💼',
        ideas: [
            'App per scambiare competenze culinarie specifiche tra vicini di casa',
            'Servizio di consegna personalizzata e compagnia per anziani soli',
            'Marketplace digitale per affittare spazi inutilizzati per eventi privati',
            'Platform per micro-investimenti collettivi in progetti artistici locali',
            'App che connette studenti universitari per sessioni di studio condiviso',
            'Servizio di personal shopping specializzato in prodotti sostenibili',
            'Subscription box mensile su hobby vintage dimenticati della nonna',
            'App per organizzare car pooling intelligente per concerti ed eventi',
            'Servizio premium di dog-walking con livestream HD per proprietari',
            'Platform gamificata per scambio di libri con sistema di rating',
            'App geo-localizzata per trovare compagni di viaggio last-minute',
            'Servizio di meal prep personalizzato basato sui tuoi esami medici',
            'Marketplace peer-to-peer per vendere tempo e competenze creative',
            'App che gamifica la raccolta differenziata intelligente nei condomini',
            'Servizio di life coaching digitale specializzato per procrastinatori cronici',
            'Platform di rental per attrezzature professionali tra creativi freelance',
            'App social per condividere orti urbani e knowledge di giardinaggio',
            'Servizio AI che trasforma vecchie foto di famiglia in podcast narrativi',
            'Marketplace innovativo per scambiare esperienze invece che oggetti fisici',
            'App per creare gruppi di acquisto collettivo per prodotti artigianali',
            'Servizio di pulizie ecologiche con prodotti 100% auto-prodotti',
            'Platform per organizzare cene multiculturali tra sconosciuti della città',
            'App che analizza il tuo umore quotidiano e suggerisce attività locali',
            'Servizio di tutoraggio peer-to-peer per competenze digitali avanzate',
            'Marketplace per rental di abbigliamento designer per occasioni speciali',
            'App per condividere parcheggi privati in tempo reale',
            'Servizio di consegna express per prodotti dimenticati durante la spesa',
            'Platform per organizzare eventi pop-up spontanei nei quartieri',
            'App di networking professionale basata su hobby e interessi comuni',
            'Servizio di subscription per piante da appartamento con care personalizzata',
            'Marketplace per scambiare servizi domestici tra famiglie vicine',
            'App per trovare mentori professionali in base a obiettivi specifici',
            'Servizio di organizing e decluttering con rivendita degli oggetti',
            'Platform per micro-prestiti tra privati con garanzie creative',
            'App per condividere abbonamenti digitali tra gruppi di amici',
            'Servizio di personal trainer virtuale con feedback in tempo reale',
            'Marketplace per affittare spazi di lavoro temporanei in case private',
            'App per organizzare gruppi di walking o running con guide locali',
            'Servizio di meal delivery con chef amateur della zona',
            'Platform per scambiare baby-sitting tra genitori del quartiere',
            'App di dating per trovare compagni di attività specifiche',
            'Servizio di consulenza per ottimizzare i consumi domestici',
            'Marketplace per vendere accesso a WiFi premium in zone remote',
            'App per condividere attrezzi da giardinaggio e bricolage tra vicini',
            'Servizio di pet-sitting con report fotografici quotidiani dettagliati',
            'Platform per organizzare gruppi di studio linguistici dal vivo',
            'App per trovare compagni per attività culturali come musei o teatri',
            'Servizio di delivery per ingredienti freschi con ricette personalizzate',
            'Marketplace per affittare costumi e accessori per feste tematiche',
            'App per condividere recensioni iper-locali di servizi di quartiere',
            'Servizio di assistenza tech per anziani con supporto domiciliare',
            'Platform per organizzare swap party di vestiti e accessori',
            'App per trovare compagni di palestra con obiettivi simili',
            'Servizio di consulenza per trasformare hobby in piccoli business',
            'Marketplace per vendere prodotti fatti in casa certificati',
            'App per condividere conoscenze pratiche attraverso video-tutorial',
            'Servizio di organizing per eventi familiari con planning completo',
            'Platform per micro-tasking locale con pagamenti immediati',
            'App per trovare roommate compatibili attraverso algoritmi psicologici',
            'Servizio di consulenza per ottimizzare spazi piccoli in case urbane',
            'Marketplace per scambiare servizi professionali tra freelance',
            'App per organizzare gruppi di acquisto per corsi online costosi',
            'Servizio di personal concierge digitale per commissioni quotidiane',
            'Platform per affittare giardini privati per eventi outdoor',
            'App per trovare workout buddy con scheduling automatico',
            'Servizio di meal prep condiviso tra famiglie del vicinato',
            'Marketplace per vendere slot di tempo in code o attese',
            'App per condividere trasporti verso aeroporti con altri viaggiatori',
            'Servizio di consulenza per trasformare passioni in carriere',
            'Platform per organizzare tornei amatoriali di sport poco conosciuti',
            'App per trovare compagni per viaggi culturali ed educativi',
            'Servizio di backup fisico per documenti importanti in cassette sicure',
            'Marketplace per affittare attrezzature sportive per weekend',
            'App per condividere conoscenze di riparazione e manutenzione',
            'Servizio di wedding planning collaborativo con vendor locali',
            'Platform per micro-investimenti in startup del quartiere',
            'App per organizzare gruppi di lettura con discussioni dal vivo',
            'Servizio di consulenza per ridurre l\'impatto ambientale domestico',
            'Marketplace per scambiare servizi creativi tra artisti locali',
            'App per trovare study-buddy per certificazioni professionali',
            'Servizio di personal shopper specializzato in regali personalizzati',
            'Platform per organizzare potluck dinner tematici nel vicinato'
        ],
        weirdIdeas: [
            'Rental di animali esotici virtuali in realtà aumentata per appartamenti',
            'Servizio premium di interpretazione professionale dei sogni notturni via chat',
            'Marketplace surreale per vendere e comprare ricordi d\'infanzia digitalizzati',
            'App di speed dating romantico tra piante d\'appartamento di vicini',
            'Servizio di delivery express per emozioni su misura in base all\'umore',
            'App per affittare temporaneamente la personalità di qualcun altro',
            'Marketplace esoterico per scambiare superstizioni personali tra culture',
            'Servizio investigativo per trovare il tuo sosia perfetto in altre città',
            'App per vendere i propri incubi ricorrenti a registi horror',
            'Servizio di rental per ricordi positivi durante periodi difficili',
            'Marketplace per scambiare accenti e dialetti tra persone diverse',
            'App di dating tra persone che hanno fatto lo stesso sogno',
            'Servizio per affittare la propria voce per audiolibri personalizzati',
            'Platform per vendere diritti di naming su oggetti personali',
            'App per scambiare temporary le proprie paure con altri utenti'
        ]
    },
    attivita: {
        name: 'Attività',
        color: '#43e97b',
        gradient: 'card-gradient-attivita',
        icon: '⚡',
        ideas: [
            'Organizza una caccia al tesoro fotografica dettagliata nel tuo quartiere storico',
            'Impara a cucinare un piatto autentico della tradizione di tua nonna',
            'Crea un giardino di erbe aromatiche mediterranee sul davanzale di casa',
            'Organizza una serata karaoke virtuale con amici sparsi in città diverse',
            'Visita un mercato locale etnico che non hai mai esplorato prima',
            'Impara 30 parole utili in linguaggio dei segni con tutorial online',
            'Costruisci un forte architettonico con cuscini e coperte in salotto',
            'Fai una camminata fotografica concentrandoti solo su dettagli architettonici',
            'Organizza un torneo di giochi da tavolo con premi creativi fatti in casa',
            'Impara a fare origami complessi seguendo tutorial avanzati su YouTube',
            'Crea una playlist musicale che racconti cronologicamente la storia della tua vita',
            'Organizza una degustazione professionale di tè o caffè con note dettagliate',
            'Fai volontariato per un pomeriggio in un\'associazione benefica locale',
            'Impara a suonare una canzone completa con uno strumento nuovo',
            'Organizza una serata cinema a tema con amici e costumi d\'epoca',
            'Crea un time-lapse artistico della tua giornata con foto ogni 30 minuti',
            'Visita tutti i parchi pubblici della tua città in bicicletta documentandoli',
            'Impara a fare il pane integrale partendo completamente da zero',
            'Organizza un picnic notturno romantico per osservare costellazioni specifiche',
            'Scrivi e spedisci lettere cartacee personalizzate a persone care lontane',
            'Impara una tecnica di meditazione avanzata e praticala quotidianamente',
            'Crea un mini-documentario di 10 minuti sulla storia della tua famiglia',
            'Organizza una sessione di disegno dal vero con modelli improvvisati',
            'Impara le basi conversazionali di una nuova lingua con app interattive',
            'Fai una maratona educativa di documentari su argomenti che ti incuriosiscono',
            'Organizza una serata di storytelling con storie personali inedite e coinvolgenti',
            'Impara a riparare professionalmente qualcosa che hai rotto da tempo',
            'Crea un album fotografico tematico del mese con editing artistico',
            'Organizza una sfida culinaria creativa con ingredienti completamente casuali',
            'Impara a riconoscere e nominare 15 costellazioni con le loro storie',
            'Pianifica e realizza un urban sketching tour della tua città',
            'Organizza una degustazione di formaggi locali con abbinamenti di vini',
            'Impara l\'arte del calligraphy moderna per scrivere inviti personalizzati',
            'Crea un orto verticale indoor con sistema di irrigazione automatico',
            'Organizza una serata di board game design inventando regole originali',
            'Impara tecniche di fotografia notturna per catturare paesaggi urbani',
            'Crea un podcast amateur di 20 minuti su un topic che ti appassiona',
            'Organizza un workshop di upcycling per trasformare oggetti in disuso',
            'Impara a fare cocktail professionali con tecniche di mixology avanzate',
            'Crea una mappa interattiva dei tuoi luoghi del cuore con storie associate',
            'Organizza un flash mob creativo con amici in uno spazio pubblico',
            'Impara l\'arte dell\'ikebana giapponese per composizioni floreali zen',
            'Crea un business plan dettagliato per un progetto dei tuoi sogni',
            'Organizza una serata di improvvisazione teatrale con giochi di ruolo',
            'Impara tecniche di digital detox per ritrovare equilibrio tecnologico',
            'Crea un giardino zen in miniatura per la scrivania con elementi naturali',
            'Organizza una sessione di sunrise yoga nel parco con routine personalizzata',
            'Impara l\'arte del paper cutting per creare decorazioni intricate',
            'Crea un sistema di reward personale per motivarti verso obiettivi specifici',
            'Organizza una serata di speed friending per conoscere nuove persone',
            'Impara tecniche di memory palace per migliorare la capacità mnemonica',
            'Crea un vision board fisico e digitale per i tuoi prossimi 5 anni',
            'Organizza una sessione di forest bathing consapevole in natura',
            'Impara l\'arte del sourdough baking con madre acida autoprodotta',
            'Crea un sistema di journaling creativo con tecniche artistiche integrate',
            'Organizza una serata di speed learning per apprendere skill in 2 ore',
            'Impara tecniche di public speaking attraverso video-presentazioni',
            'Crea un mini-ecosistema in bottiglia con piante e microorganismi',
            'Organizza una sessione di digital storytelling con editing video',
            'Impara l\'arte della fermentazione casalinga per cibi probiotici',
            'Crea un sistema di habit stacking per ottimizzare la routine quotidiana',
            'Organizza una serata di wine and paint con tecniche pittoriche sperimentali',
            'Impara tecniche di speed reading per triplicare la velocità di lettura',
            'Crea un indoor camping setup completo per avventure domestiche',
            'Organizza una sessione di mindful eating con degustazione consapevole',
            'Impara l\'arte del birdwatching con identificazione di specie locali',
            'Crea un sistema di gamification per rendere divertenti le attività noiose',
            'Organizza una serata di astronomy con telescopio e mappa stellare',
            'Impara tecniche di conflict resolution per migliorare le relazioni',
            'Crea un mini-studio fotografico casalingo con lighting setup professionale',
            'Organizza una sessione di creative writing con prompts stimolanti',
            'Impara l\'arte del feng shui per ottimizzare l\'energia degli spazi',
            'Crea un sistema di tracking per monitorare progressi in multiple aree',
            'Organizza una serata di improv comedy con esercizi di spontaneità',
            'Impara tecniche di lucid dreaming per controllare consapevolmente i sogni',
            'Crea un indoor herb spiral garden con design permacultura',
            'Organizza una sessione di color therapy con cromoterapia applicata',
            'Impara l\'arte del bookbinding per rilegare quaderni personalizzati',
            'Crea un sistema di micro-habits per cambiamenti sostenibili a lungo termine'
        ],
        weirdIdeas: [
            'Trascorri un\'intera giornata comunicando esclusivamente attraverso disegni e sketch',
            'Cammina per due ore indossando scarpe di misure completamente diverse',
            'Mangia ogni pasto della giornata usando solo utensili sbagliati e creativi',
            'Guarda film muti inventando tutti i dialoghi ad alta voce in tempo reale',
            'Indossa tutti i tuoi vestiti al contrario per un\'intera giornata lavorativa',
            'Costruisci una tenda elaborata in salotto e dormi lì per una settimana',
            'Parla per 4 ore consecutive usando esclusivamente domande retoriche filosofiche',
            'Cammina per casa come se fossi un astronauta su una navicella spaziale',
            'Trascorri una giornata fingendo di essere un documentarista che filma la propria vita',
            'Organizza conversazioni serie con oggetti inanimati come se fossero persone reali',
            'Crea un alter-ego completo e vivi una giornata nei suoi panni',
            'Mangia solo cibi di un colore specifico per una settimana intera',
            'Cammina ovunque come se stessi sempre scendendo scale invisibili',
            'Trascorri un giorno intero fingendo di essere in un musical spontaneo',
            'Organizza un matrimonio elaborato tra due oggetti della tua casa'
        ]
    },
    ricette: {
        name: 'Ricette',
        color: '#fa709a',
        gradient: 'card-gradient-ricette',
        icon: '🍳',
        ideas: [
            'Smoothie verde energizzante con spinaci e ananas',
            'Carbonara vegana con crema di anacardi, guanciale di tempeh affumicato',
            'Ceviche di branzino con lime, cipolla rossa, coriandolo e peperoncino',
            'Lasagne di melanzane grigliate con besciamella di cavolfiore e parmigiano',
            'Pancakes salati di ceci con verdure mediterranee e tzatziki greco',
            'Ratatouille provenzale con melanzane, zucchine, peperoni e pomodori freschi',
            'Sushi bowl con riso venere, salmone marinato, avocado e salsa ponzu',
            'Minestrone ligure con pesto, fagiolini, patate e pasta corta integrale',
            'Crema di castagne con pancetta croccante e crostini di pane integrale',
            'Bao buns fatti in casa con maiale brasato, verdure fermentate e salsa hoisin',
            'Gazpacho verde con cetrioli, basilico, yogurt greco e olio EVO',
            'Arancini siciliani al ragù con piselli, mozzarella e pangrattato tostato',
            'Pad Thai tradizionale con gamberi, tofu, germogli di soia e tamarindo',
            'Gnocchi di patate viola fatti a mano con salsa ai funghi porcini',
            'Cous cous alle verdure con harissa, ceci, uvetta e mandorle a lamelle',
            'Tartare di tonno con avocado, lime, soia e sesamo nero croccante',
            'Ribollita toscana con cavolo nero, fagioli cannellini e pane raffermo',
            'Curry verde thailandese con pollo, melanzane baby e riso jasmine',
            'Caprese di burrata pugliese con pomodori datterini e basilico genovese',
            'Fish and chips britannico con merluzzo, patate e salsa tartara homemade',
            'Riso nero venere con frutti di mare, prezzemolo e limone organic',
            'Vellutata di carote con zenzero, curcuma e latte di mandorla',
            'Empanadas argentine ripiene di carne, olive e uova sode speziate',
            'Salmone teriyaki con riso sushi, edamame e alghe nori tostate',
            'Tortilla española tradizionale con patate, cipolle e uova biologiche',
            'Shakshuka israeliana con pomodori, peperoni, feta e uova in camicia',
            'Risotto alle vongole veraci con prezzemolo, aglio e vino bianco secco',
            'Poké bowl hawaiano con tonno, riso, mango, cetrioli e salsa sriracha mayo',
            'Vitello tonnato piemontese con capperi di Pantelleria e maionese tradizionale',
            'Tom yum thailandese con gamberi, funghi, lemongrass e foglie di lime kaffir',
            'Carbonara romana originale con guanciale, pecorino e uova da galline ruspanti',
            'Moussaka greca con melanzane, agnello macinato e besciamella speziata',
            'Pho vietnamita con brodo di ossa, noodles di riso e erbe fresche',
            'Osso buco milanese con risotto giallo, gremolata e midollo di vitello',
            'Bouillabaisse marsigliese con frutti di mare misti e rouille piccante',
            'Kimchi jjigae coreano con tofu, maiale e pasta di peperoncino gochujang',
            'Cassoulet francese con anatra confit, salsicce e fagioli tarbais',
            'Mole poblano messicano con pollo, cioccolato e oltre 20 spezie diverse',
            'Beef Wellington britannico con pasta sfoglia, duxelles di funghi e prosciutto',
            'Laksa malese con noodles, latte di cocco, gamberi e pasta di peperoncino',
            'Coq au vin borgognone con pollo, vino rosso, funghi e cipolline',
            'Bibimbap coreano con riso, verdure fermentate, carne e uovo fritto',
            'Paella valenciana originale con pollo, coniglio, fagioli e zafferano',
            'Rendang indonesiano con manzo, latte di cocco e pasta di spezie',
            'Fish curry del Kerala con cocco fresco, curry leaves e tamarindo',
            'Goulash ungherese con manzo, paprika dolce e patate novelle',
            'Tagine marocchino di agnello con prugne, mandorle e ras el hanout',
            'Borscht ucraino con barbabietole rosse, cavolo e panna acida',
            'Chiles en nogada messicani con noci, melograno e poblanos ripieni',
            'Sauerbraten tedesco marinato con aceto, ginepro e pan di zenzero',
            'Dolmades greci con riso, pinoli, uvetta e foglie di vite',
            'Tamales messicani con masa, carnitas e salsa verde tomatillo',
            'Bobotie sudafricano con carne speziata, uova e foglie di curry',
            'Pierogi polacchi ripieni di patate, formaggio e cipolle caramellate',
            'Tandoori chicken indiano con yogurt marinato e spezie piccanti',
            'Feijoada brasiliana con fagioli neri, salsicce e carne di maiale',
            'Pastrami sandwich newyorkese con pane di segale e senape piccante',
            'Jambalaya della Louisiana con riso, gamberi, pollo e andouille',
            'Wiener schnitzel austriaco con vitello, panatura e patate prezzemolate',
            'Cacio e pepe romano con pecorino stagionato e pepe nero macinato fresco',
            'Baklava greco con pasta fillo, noci, miele e cannella aromatica',
            'Dim sum cinesi assortiti al vapore con salse tradizionali',
            'Bouillabaisse marsigliese con pesci di scoglio e crostacei freschi',
            'Khachapuri georgiano con formaggio filante e uovo al centro',
            'Stroganoff russo con manzo, funghi e panna acida densa',
            'Peking duck cinese con pancakes, cipollotti e salsa hoisin',
            'Miso ramen giapponese con chashu, uova marinate e nori',
            'Empanadas cilene ripiene di pino, olive nere e uova sode',
            'Schnitzel tedesco con patate salate e insalata di cavolo bianco',
            'Bouillabaisse provenzale con pesce fresco del Mediterraneo',
            'Bulgogi coreano marinato con pere, soia e sesamo tostato',
            'Falafel mediorientali con tahini, prezzemolo e pomodori freschi',
            'Enchiladas messicane con salsa verde piccante e formaggio fuso',
            'Borscht polacco con barbabietole fermentate e salsiccia bianca',
            'Tom kha thailandese con latte di cocco, galanga e lime',
            'Ceviche peruviano con pesce bianco, lime e patate dolci',
            'Shepherd\'s pie inglese con agnello macinato e purè di patate',
            'Gumbo della Louisiana con okra, gamberi e salsiccia piccante'
        ],
        weirdIdeas: [
            'Pizza dessert con nutella, fragole fresche, marshmallow grigliati e granella di pistacchi',
            'Gelato salato al parmigiano reggiano con miele di acacia e pepe nero',
            'Sushi dolce con mango, cocco, cioccolato bianco e riso al latte condensato',
            'Hamburger di gelato con biscotti al cioccolato come pane e frutti di bosco',
            'Pasta colorata naturalmente con barbabietola, spinaci, curcuma e carbone attivo',
            'Cocktail analcolico che cambia colore durante la degustazione con pH naturali',
            'Torta salata che visivamente sembra un dolce ma è ripiena di ingredienti piccanti',
            'Zuppa fredda di frutta esotica che ha il sapore di un minestrone classico',
            'Risotto al caffè espresso con mascarpone dolce e chicchi di caffè caramellati',
            'Tacos di frutta con tortillas dolci, gelato e salse speziate agrodolci',
            'Sandwich di macarons salati con ripieno di paté e verdure fermentate',
            'Ramen dolce con brodo di cioccolato bianco, frutta e noodles di riso colorati',
            'Spaghetti di verdure spiralizzate con sugo di frutta e noci tostate',
            'Pizza con base di cavolfiore dolce, crema di nocciole e frutti di bosco',
            'Tempura di fiori edibili con pastella colorata e salse dolci-salate'
        ]
    },
    viaggi: {
        name: 'Viaggi',
        color: '#a8edea',
        gradient: 'card-gradient-viaggi',
        icon: '✈️',
        ideas: [
            'Weekend romantico in una casa galleggiante ecosostenibile su un lago alpino',
            'Tour enogastronomico in e-bike attraverso colline di Prosecco e Chianti',
            'Notte magica in un osservatorio astronomico per contemplare la Via Lattea',
            'Viaggio lento in treno storico attraverso paesaggi dolomitici innevati',
            'Esperienza immersiva in una fattoria biodinamica con laboratori di trasformazione',
            'Road trip fotografico lungo antiche strade consolari romane',
            'Weekend creativo in un borgo medievale con master class di ceramica artistica',
            'Escursione speleologica guidata in grotte carsiche con illuminazione scenografica',
            'Viaggio culinario tra mercati storici e botteghe artigiane nelle città d\'arte',
            'Settimana di digital detox in un monastero buddista per ritiro spirituale',
            'Tour dei castelli abbandonati con guide storiche e rievocazioni medievali',
            'Glamping luxury in una riserva naturale con safari fotografico notturno',
            'Crociera fluviale eco-friendly con soste in borghi nascosti e sconosciuti',
            'Weekend avventuroso in una casa sull\'albero architettonica nel bosco secolare',
            'Tour delle cantine naturali con degustazioni di vini biodinamici rari',
            'Viaggio letterario seguendo le orme di scrittori e poeti famosi',
            'Esperienza autentica in un villaggio di pescatori con cucina del pescato',
            'Tour notturno delle città fantasma italiane con guide paranormali',
            'Weekend termale con trattamenti ayurvedici e acque minerali curative',
            'Viaggio in barca a vela tra isole mediterranee con skipper esperto',
            'Esperienza agricola hands-on con raccolta, trasformazione e degustazione',
            'Tour cinematografico dei set più suggestivi del cinema italiano',
            'Weekend nomade in una yurta mongola autentica sulle montagne',
            'Viaggio gastronomico nei luoghi della tradizione culinaria regionale',
            'Esperienza survival gentile in natura con guide wilderness certificate',
            'Tour archeologico con scavi partecipati e laboratori di restauro',
            'Weekend in un faro ristrutturato con vista oceanica panoramica',
            'Esperienza di volontariato internazionale in progetti di conservazione',
            'Viaggio musicale seguendo festival folk e concerti in location storiche',
            'Weekend in un palazzo storico con cene rinascimentali in costume',
            'Tour delle vie di pellegrinaggio con soste contemplative e meditazione',
            'Esperienza in un eco-villaggio autosufficiente con permacultura applicata',
            'Viaggio fotografico in parchi nazionali con workshop di nature photography',
            'Weekend in un castello trasformato in boutique hotel di charme',
            'Tour delle tradizioni artigianali con laboratori di maestri locali',
            'Esperienza glamping nel deserto con osservazione astronomica guidata',
            'Viaggio slow food tra presidi gastronomici e produttori biologici',
            'Weekend in una masseria pugliese con raccolta olive e produzione olio',
            'Tour delle città sotterranee con guide speleologiche specializzate',
            'Esperienza in un rifugio alpino con trekking guidato e yoga montano',
            'Viaggio culturale tra musei segreti e collezioni private esclusive',
            'Weekend in una dimora storica con degustazioni di vini d\'annata',
            'Tour delle riserve naturali con birdwatching e fotografia macro',
            'Esperienza nomade con camper vintage completamente attrezzato',
            'Viaggio benessere in centri termali naturali con trattamenti olistici',
            'Weekend in un borgo alpino con escursioni e foraging guidato',
            'Tour delle biblioteche storiche più affascinanti d\'Europa',
            'Esperienza in una fattoria didattica con animali da cortile e orti',
            'Viaggio motociclistico su strade panoramiche con soste gourmet',
            'Weekend in un convento ristrutturato con giardini pensili meditativi',
            'Tour delle miniere storiche con percorsi sotterranei illuminati',
            'Esperienza in un borgo fantasma con tour notturno e storytelling',
            'Viaggio fluviale in canoa con campeggio selvaggio e pesca sportiva',
            'Weekend in una villa liberty con giardini botanici centenari',
            'Tour delle chiese rupestri con guide archeologiche specializzate',
            'Esperienza in un agriturismo biodinamico con corso di cucina naturale',
            'Viaggio artistico tra atelier di pittori e scultori contemporanei',
            'Weekend in un palazzo veneziano con navigazione in gondola privata',
            'Tour delle grotte marine con snorkeling e biologia marina',
            'Esperienza in un eco-resort con attività di conservazione ambientale',
            'Viaggio enologico tra cantine storiche familiari e degustazioni esclusive',
            'Weekend in un trullo pugliese autentico con corso di panificazione',
            'Tour delle necropoli etrusche con archeologi e ricostruzioni 3D',
            'Esperienza in un borgo marinaro con pesca tradizionale e cucina del mare',
            'Viaggio fotografico urbano con workshop di street photography notturna',
            'Weekend in una casa-museo con collezioni d\'arte e oggetti d\'epoca',
            'Tour delle forge storiche con dimostrazioni di lavorazione del ferro',
            'Esperienza glamping in vigna con vendemmia e produzione vino',
            'Viaggio letterario nei luoghi descritti dai grandi autori italiani',
            'Weekend in un eremo con meditazione, silenzio e contatto con la natura',
            'Tour delle città medievali con rievocazioni storiche e mercati d\'epoca',
            'Esperienza in un resort eco-sostenibile con energie rinnovabili',
            'Viaggio culinario street food tra mercati e venditori ambulanti storici',
            'Weekend in una casa d\'artista con atelier e collezioni private',
            'Tour delle cascate nascoste con trekking e bagni in acque termali',
            'Esperienza in un borgo di montagna con produzione formaggi artigianali',
            'Viaggio botanico tra giardini storici e orti botanici centenari',
            'Weekend in un palazzo barocco con concerti di musica da camera',
            'Tour dei mulini storici con dimostrazione di macinazione tradizionale',
            'Esperienza in un villaggio vitivinicolo con harvest experience',
            'Viaggio speleologico avanzato con grotte inesplorate e guide esperte'
        ],
        weirdIdeas: [
            'Viaggio epico dove puoi spostarti solo con mezzi di trasporto gialli o dorati',
            'Tour surreale di luoghi il cui nome contiene esattamente sette lettere',
            'Esperienza di viaggio dove devi parlare solo in rima per tutto il tempo',
            'Vacanza tematica dove mangi solo cibi che iniziano con la prima lettera del tuo nome',
            'Viaggio nomade dove dormi ogni notte in un tipo completamente diverso di alloggio',
            'Tour spontaneo seguendo solo le indicazioni casuali di sconosciuti incontrati',
            'Esperienza onirica dove visiti solo posti che hai sognato la notte precedente',
            'Viaggio al contrario dove inizi dalla destinazione e torni al punto di partenza',
            'Tour musicale dove ogni destinazione deve essere raggiunta canticchiando',
            'Esperienza cromatica visitando solo luoghi dominati da un colore specifico',
            'Viaggio sensoriale dove ogni giorno devi usare un senso diverso come guida',
            'Tour matematico visitando solo luoghi con numeri civici che seguono sequenze',
            'Esperienza temporale dove ogni destinazione rappresenta un\'epoca storica diversa',
            'Viaggio alfabetico visitando città in ordine alfabetico rigoroso',
            'Tour elementare seguendo il percorso dei quattro elementi: terra, acqua, aria, fuoco'
        ]
    },
    fitness: {
        name: 'Fitness',
        color: '#d299c2',
        gradient: 'card-gradient-fitness',
        icon: '💪',
        ideas: [
            'Challenge di 30 giorni: 100 flessioni perfette distribuite strategicamente nella giornata',
            'Allenamento funzionale completo usando esclusivamente il peso corporeo e la gravità',
            'Yoga flow mattutino energizzante di 30 minuti per attivare corpo e mente',
            'Circuit training intensivo alternando cardio esplosivo e resistenza muscolare',
            'Camminata veloce intervallata da esercizi calisthenici nei parchi pubblici',
            'Sessione di stretching profondo e rilassante mentre ascolti audiolibri motivazionali',
            'Allenamento HIIT bruciagrassi di 20 minuti con musica energizzante ad alto BPM',
            'Pilates avanzato per core stability, flessibilità e correzione posturale',
            'Danza fitness coinvolgente seguendo coreografie online per un\'ora completa',
            'Corsa progressiva intervallata con sprint esplosivi di 45 secondi ogni 5 minuti',
            'Allenamento total body con elastici di resistenza e movimenti funzionali',
            'Tai chi meditativo nel giardino al tramonto per equilibrio e serenità',
            'Aqua fitness dinamico se hai accesso a piscina con resistenza idraulica',
            'Calisthenics progressivo: impara muscle-up, handstand e human flag gradualmente',
            'Allenamento pliometrico esplosivo per potenza, agilità e coordinazione avanzata',
            'Walking meditation consapevole in natura per 50 minuti di benessere mentale',
            'Triathlon casalingo combinando corsa, nuoto simulato e cycling indoor',
            'Workout funzionale creativo usando oggetti domestici come pesi improvvisati',
            'Allenamento di equilibrio e propriocezione su superfici instabili e dinamiche',
            'Kickboxing shadowboxing con combinazioni tecniche su musica ritmica potente',
            'Allenamento intervallato intensivo su scale pubbliche o gradini urbani',
            'Animal flow: movimenti naturali fluidi ispirati agli animali selvatici',
            'Sessione di forza progressiva usando bande elastiche, TRX e suspension training',
            'Dance workout fusion che unisce cardio divertente e tonificazione muscolare',
            'Pratica di respirazione profonda pranayama combinata a stretching rigenerante',
            'Bootcamp militare casalingo con esercizi a corpo libero ad alta intensità',
            'Yoga power dinamico con sequenze challenging per flessibilità e forza',
            'Crossfit WOD adattato per casa con movimenti funzionali compound',
            'Allenamento metabolico EMOM (every minute on the minute) per 20 minuti',
            'Sessione di mobilità articolare completa per prevenzione infortuni',
            'Cardio dance latino con salsa, bachata e reggaeton per 45 minuti',
            'Strongman training casalingo con oggetti pesanti e movimenti funzionali',
            'Barre workout ispirato alla danza classica per tonificazione e grazia',
            'Tabata protocol: 4 minuti di allenamento ad altissima intensità',
            'Functional movement screen per identificare e correggere squilibri muscolari',
            'Kettlebell training russo con swing, snatch e turkish get-up',
            'Isometric workout: esercizi statici per forza e resistenza muscolare',
            'Parkour urbano: superamento di ostacoli con movimenti fluidi e creativi',
            'Battle ropes training per potenza esplosiva e condizionamento cardiovascolare',
            'Suspension training avanzato con movimenti tridimensionali complessi',
            'Plyometric box training per salti, esplosività e potenza degli arti inferiori',
            'Martial arts conditioning con tecniche di karate, kung fu e taekwondo',
            'Gymnastic strength training per anelli, parallele e corpo libero',
            'Obstacle course training per agilità, coordinazione e problem solving fisico',
            'Endurance challenge: mantieni ritmo costante per distanze progressive',
            'Balance board training per propriocezione, stabilità e prevenzione infortuni',
            'Resistance band circuit per tutti i gruppi muscolari con progressive overload',
            'Functional fitness test: misura e migliora le tue capacità fisiche fondamentali',
            'Recovery workout attivo: movimenti gentle per recupero e rigenerazione',
            'Core intensive training con focus su addominali profondi e stabilizzatori',
            'Outdoor fitness adventure: allenamento nella natura con elementi ambientali',
            'Flexibility challenge: miglioramento progressivo della mobilità articolare',
            'Power training esplosivo per sviluppo della velocità e reattività muscolare',
            'Functional aging fitness: movimenti per mantenere autonomia e vitalità',
            'Sport-specific training: movimenti specifici per il tuo sport preferito',
            'Mind-body connection workout: consapevolezza corporea durante l\'esercizio',
            'Rehabilitation exercises per recupero post-infortunio e rinforzo preventivo',
            'Adventure racing simulation: combinazione di discipline outdoor multiple',
            'Metabolic finisher: esplosioni finali ad alta intensità per massimi risultati',
            'Functional movement integration: movimenti che migliorano le attività quotidiane',
            'Athletic performance testing: benchmark per monitorare progressi oggettivi',
            'Recovery and regeneration protocol: tecniche per ottimizzare il recupero',
            'Compound movement mastery: perfezionamento di squat, deadlift e overhead press',
            'Bodyweight progression: avanzamento sistematico negli esercizi a corpo libero',
            'Cardiovascular efficiency training: miglioramento della capacità cardiorespiratoria',
            'Neuromuscular training per coordinazione, equilibrio e controllo motorio',
            'Periodization planning: strutturazione di cicli di allenamento progressivi',
            'Injury prevention screening: identificazione e correzione di fattori di rischio',
            'Performance nutrition timing: alimentazione strategica per l\'allenamento',
            'Sleep optimization per massimizzare recupero e adattamenti all\'allenamento',
            'Hydration protocol specifico per tipo di allenamento e condizioni ambientali',
            'Active recovery strategies: tecniche per accelerare il recupero tra sessioni',
            'Goal setting e tracking: metodologie per raggiungere obiettivi fitness specifici',
            'Motivation psychology applicata: strategie mentali per consistenza nell\'allenamento',
            'Habit formation: creazione di routine sostenibili per il fitness a lungo termine',
            'Time-efficient training: massimi risultati con sessioni brevi e intensive',
            'Seasonal periodization: adattamento dell\'allenamento ai cicli naturali annuali'
        ],
        weirdIdeas: [
            'Allenati indossando esclusivamente vestiti del tuo colore preferito della giornata',
            'Fai esercizi solo quando senti sirene, clacson o rumori urbani specifici',
            'Workout dove ogni singolo esercizio deve essere eseguito ridendo a crepapelle',
            'Allenati esclusivamente in luoghi dove il pavimento ha pattern geometrici visibili',
            'Fai fitness ascoltando rigorosamente solo musica degli anni \'80 o \'90',
            'Esercitati parlando sempre in terza persona come se fossi un commentatore sportivo',
            'Workout dove devi toccare sempre tre oggetti diversi tra un esercizio e l\'altro',
            'Allenati solo durante le fasi lunari specifiche che ritieni più energetiche',
            'Fai esercizi indossando accessori assurdi come occhiali da sole o cappelli buffi',
            'Workout dove ogni movimento deve essere eseguito in perfetta sincronia con un metronomo',
            'Allenati solo in stanze con un numero dispari di oggetti decorativi',
            'Fai fitness comunicando solo attraverso versi di animali durante gli esercizi',
            'Workout dove devi cambiare completamente posizione nella stanza ogni 2 minuti',
            'Allenati seguendo solo tutorial di fitness in lingue che non comprendi',
            'Fai esercizi solo quando il meteo corrisponde esattamente al tuo umore del momento'
        ]
    }
};

// Stato dell'applicazione
let state = {
    currentIdea: '',
    currentCategory: '',
    favorites: JSON.parse(localStorage.getItem('generatore-idee-favorites') || '[]'),
    history: JSON.parse(localStorage.getItem('generatore-idee-history') || '[]'),
    weirdnessLevel: parseInt(localStorage.getItem('generatore-idee-weirdness') || '1'),
    selectedCategories: JSON.parse(localStorage.getItem('generatore-idee-categories') || '["creativo"]'),
    isGenerating: false,
    showSettings: false,
    showHistory: false,
    showFavorites: false
};

// Funzioni utility
function saveToLocalStorage() {
    localStorage.setItem('generatore-idee-favorites', JSON.stringify(state.favorites));
    localStorage.setItem('generatore-idee-history', JSON.stringify(state.history.slice(0, 50)));
    localStorage.setItem('generatore-idee-weirdness', state.weirdnessLevel.toString());
    localStorage.setItem('generatore-idee-categories', JSON.stringify(state.selectedCategories));
}

function getCategoryDisplayName(categoryKey) {
    if (categoryKey.includes('+')) {
        const cats = categoryKey.split('+');
        return cats.map(cat => categories[cat]?.name || cat).join(' + ');
    }
    return categories[categoryKey]?.name || categoryKey;
}

function getCardGradient(categoryKey) {
    if (categoryKey.includes('+')) {
        return 'card-gradient-mixed';
    }
    return categories[categoryKey]?.gradient || 'card-gradient-mixed';
}

function generateIdea() {
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
        state.history = [{ idea: finalIdea, category: primaryCategory, timestamp: new Date().toISOString() }, ...state.history.slice(0, 49)];
        state.isGenerating = false;

        saveToLocalStorage();
        render();
    }, 800);
}

function toggleFavorite() {
    if (!state.currentIdea) return;

    const exists = state.favorites.find(fav => fav.idea === state.currentIdea);
    if (exists) {
        state.favorites = state.favorites.filter(fav => fav.idea !== state.currentIdea);
    } else {
        state.favorites = [...state.favorites, {
            idea: state.currentIdea,
            category: state.currentCategory,
            timestamp: new Date().toISOString()
        }];
    }

    saveToLocalStorage();
    render();
}

function shareIdea() {
    if (navigator.share && state.currentIdea) {
        navigator.share({
            title: 'Idea Casuale!',
            text: `${state.currentIdea}\n\nGenerato da Generatore Idee 💡`,
            url: window.location.href
        });
    } else {
        // Fallback per browser che non supportano Web Share API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${state.currentIdea}\n\nGenerato da Generatore Idee 💡\n${window.location.href}`);
            alert('Idea copiata negli appunti!');
        }
    }
}
