// Database delle Idee - Generatore di Idee Casuali
// Versione: 1.0
// Ultimo aggiornamento: Settembre 2024

export const categories = {
  creativo: {
    name: 'Creativo',
    gradient: 'from-red-400 to-pink-500',
    color: '#FF6B6B',
    ideas: [
      'Dipingi con i colori che rappresentano il tuo umore oggi',
      'Scrivi una storia di 100 parole su un oggetto casuale',
      'Crea un collage usando materiali naturali',
      'Fotografa 15 texture diverse nella tua casa',
      'Disegna il tuo cibo preferito nello stile di Van Gogh',
      'Inventa una canzone rap su ieri',
      'Crea sculture con oggetti dalla scrivania',
      'Scrivi una poesia che inizia con "Se fossi un colore..."',
      'Ridisegna un logo famoso in stile medievale',
      'Crea un fumetto di 6 vignette sulla tua mattina',
      'Costruisci architetture fantastiche con i Lego',
      'Scatta foto solo di riflessi per 30 minuti',
      'Inventa un nuovo tipo di pasta e disegnala',
      'Crea pattern con le tue impronte digitali',
      'Scrivi un dialogo tra due elettrodomestici',
      'Dipingi usando solo le dita, mai pennelli',
      'Crea un autoritratto fatto di emoji',
      'Inventa una danza per il lunedì mattina',
      'Costruisci un castello con libri e oggetti',
      'Scrivi la recensione poetica del tuo ultimo sogno',
      'Crea arte digitale con forme geometriche',
      'Inventa 10 nomi per colori inesistenti',
      'Fai un ritratto usando solo parole',
      'Crea un mandala con oggetti colorati',
      'Scrivi la biografia di un oggetto inanimato',
      'Disegna mappe di luoghi immaginari',
      'Inventa creature fantastiche e il loro habitat',
      'Crea un museo delle tue memorie d\'infanzia',
      'Fotografa la stessa scena in 5 stili diversi',
      'Scrivi lettere dal futuro a te stesso'
    ],
    weirdIdeas: [
      'Dipingi usando solo condimenti da cucina',
      'Scrivi una lettera d\'amore a Marte',
      'Crea arte con oggetti scaduti del frigo',
      'Fotografa conversazioni tra ombre',
      'Inventa un linguaggio di rumori domestici',
      'Dipingi camminando a piedi nudi su tela',
      'Crea autoritratti solo con cibo colorato',
      'Componi musica con oggetti di plastica'
    ]
  },
  business: {
    name: 'Business',
    gradient: 'from-teal-400 to-cyan-500',
    color: '#4ECDC4',
    ideas: [
      'App per scambiare competenze tra vicini',
      'Servizio di consegna per anziani soli',
      'Marketplace per affittare spazi per eventi',
      'Platform per micro-investimenti artistici',
      'App per sessioni di studio condivise',
      'Personal shopper per prodotti sostenibili',
      'Subscription box di hobby vintage',
      'App per car pooling a concerti',
      'Dog-walking con livestream',
      'Platform gamificata per scambio libri',
      'App per compagni di viaggio last-minute',
      'Meal prep basato su esami medici',
      'Marketplace per vendere tempo e competenze',
      'App per raccolta differenziata gamificata',
      'Coaching per procrastinatori cronici',
      'Rental attrezzature tra creativi',
      'App per condividere orti urbani',
      'Servizio foto-famiglia in podcast',
      'Marketplace per scambiare esperienze',
      'Gruppi di acquisto artigianale',
      'Pulizie ecologiche auto-prodotte',
      'Cene multiculturali tra sconosciuti',
      'App che analizza umore e suggerisce attività',
      'Tutoraggio peer-to-peer digitale',
      'Rental abbigliamento per eventi speciali',
      'App per condividere parcheggi privati',
      'Consegna express prodotti dimenticati',
      'Eventi pop-up spontanei nei quartieri',
      'Networking basato su hobby comuni',
      'Subscription piante con care personalizzata'
    ],
    weirdIdeas: [
      'Rental animali virtuali in AR',
      'Interpretazione professionale dei sogni',
      'Marketplace per ricordi d\'infanzia',
      'Speed dating tra piante',
      'Delivery di emozioni su misura',
      'Rental temporaneo di personalità',
      'Scambio di superstizioni personali'
    ]
  },
  attivita: {
    name: 'Attività',
    gradient: 'from-blue-400 to-indigo-500',
    color: '#45B7D1',
    ideas: [
      'Caccia al tesoro fotografica nel quartiere',
      'Impara un piatto della nonna',
      'Crea un giardino di erbe sul davanzale',
      'Karaoke virtuale con amici lontani',
      'Visita un mercato etnico mai esplorato',
      'Impara 20 parole in linguaggio dei segni',
      'Costruisci un forte di cuscini',
      'Camminata fotografica architettonica',
      'Torneo di giochi da tavolo con premi fatti in casa',
      'Origami avanzati con YouTube',
      'Playlist che racconta la tua vita',
      'Degustazione professionale di tè/caffè',
      'Volontariato per un pomeriggio',
      'Impara una canzone con strumento nuovo',
      'Cinema a tema con costumi d\'epoca',
      'Time-lapse della giornata ogni 30 minuti',
      'Tour in bici di tutti i parchi cittadini',
      'Pane integrale da zero',
      'Picnic notturno per le stelle',
      'Lettere cartacee a persone care',
      'Meditazione avanzata quotidiana',
      'Mini-documentario famiglia 10 minuti',
      'Disegno dal vero con modelli',
      'Basi conversazionali lingua nuova',
      'Maratona documentari tematici',
      'Storytelling con storie personali',
      'Ripara qualcosa di rotto da tempo',
      'Album fotografico tematico del mese',
      'Sfida culinaria ingredienti casuali',
      'Impara 10 costellazioni e le loro storie'
    ],
    weirdIdeas: [
      'Comunica solo con disegni tutto il giorno',
      'Cammina con scarpe di misure diverse',
      'Mangia con utensili sbagliati',
      'Film muti inventando dialoghi',
      'Vestiti al contrario per una giornata',
      'Dormi in una tenda in salotto',
      'Parla solo con domande retoriche'
    ]
  },
  ricette: {
    name: 'Ricette',
    gradient: 'from-orange-400 to-red-500',
    color: '#FFA726',
    ideas: [
      'Ramen con brodo vegetale 12h e uova miso',
      'Smoothie bowl tropicale con granola homemade',
      'Tacos pesce con salsa mango piccante',
      'Risotto Barolo con gorgonzola e noci',
      'Buddha bowl con falafel e hummus barbabietola',
      'Curry thailandese ceci con latte cocco',
      'Pancakes proteici frutti bosco yogurt greco',
      'Zuppa asiatica tofu e funghi shiitake',
      'Quinoa rossa con melograno e feta',
      'Pesto genovese nel mortaio',
      'Burger vegetale barbabietola e lenticchie',
      'Wok verdure con teriyaki homemade',
      'Focaccia integrale rosmarino e olive',
      'Cheesecake frutti bosco senza cottura',
      'Gazpacho con pomodori San Marzano',
      'Polpette lenticchie rosse in sugo',
      'Salmone grigliato quinoa tricolore',
      'Tiramisù vegano mascarpone anacardi',
      'Vellutata zucca con zenzero',
      'Wrap integrale hummus e germogli',
      'Muffins salati zucchine e feta',
      'Paella vegetariana carciofi',
      'Brownies cioccolato fondente 70%',
      'Farro con verdure grigliate e mozzarella',
      'Smoothie detox verde spinaci ananas',
      'Carbonara vegana crema anacardi',
      'Ceviche branzino lime e coriandolo',
      'Lasagne melanzane besciamella cavolfiore',
      'Pancakes salati ceci e verdure',
      'Ratatouille provenzale tradizionale'
    ],
    weirdIdeas: [
      'Pizza dessert nutella e marshmallow',
      'Gelato salato parmigiano e miele',
      'Sushi dolce mango e cioccolato bianco',
      'Hamburger di gelato con biscotti',
      'Pasta colorata con ingredienti naturali',
      'Cocktail che cambia colore bevendo',
      'Torta salata che sembra dolce'
    ]
  },
  viaggi: {
    name: 'Viaggi',
    gradient: 'from-purple-400 to-pink-500',
    color: '#AB47BC',
    ideas: [
      'Weekend casa galleggiante lago alpino',
      'Tour enogastronomico e-bike colline',
      'Notte osservatorio astronomico Via Lattea',
      'Treno storico paesaggi dolomitici',
      'Fattoria biodinamica con laboratori',
      'Road trip fotografico strade romane',
      'Borgo medievale master class ceramica',
      'Speleologia grotte illuminazione scenografica',
      'Tour culinario mercati storici',
      'Digital detox monastero buddista',
      'Castelli abbandonati rievocazioni medievali',
      'Glamping riserva safari notturno',
      'Crociera fluviale borghi nascosti',
      'Casa albero bosco secolare',
      'Cantine naturali vini biodinamici',
      'Viaggio letterario scrittori famosi',
      'Villaggio pescatori cucina pescato',
      'Tour notturno città fantasma',
      'Weekend termale trattamenti ayurvedici',
      'Barca vela isole mediterranee',
      'Agricoltura hands-on raccolta trasformazione',
      'Tour cinematografico set italiani',
      'Yurta mongola autentica montagne',
      'Gastronomia tradizione culinaria regionale',
      'Survival gentile guide wilderness',
      'Scavi archeologici partecipati',
      'Faro ristrutturato vista oceanica',
      'Volontariato progetti conservazione',
      'Festival musicali location storiche',
      'Palazzo storico cene rinascimentali'
    ],
    weirdIdeas: [
      'Solo mezzi trasporto gialli',
      'Luoghi con nome 7 lettere esatte',
      'Parla solo in rima tutto il viaggio',
      'Cibi con tua iniziale nome',
      'Dormi ogni notte in alloggio diverso',
      'Segui solo indicazioni di sconosciuti',
      'Visita solo posti sognati la notte prima'
    ]
  },
  fitness: {
    name: 'Fitness',
    gradient: 'from-green-400 to-teal-500',
    color: '#66BB6A',
    ideas: [
      '100 flessioni distribuite nella giornata 30gg',
      'Funzionale solo peso corporeo',
      'Yoga flow mattutino 30min',
      'Circuit training cardio/resistenza',
      'Camminata veloce + calisthenics parchi',
      'Stretching profondo con audiolibri',
      'HIIT 20min musica alta energia',
      'Pilates core stability posturale',
      'Danza fitness coreografie online 1h',
      'Corsa + sprint 45sec ogni 5min',
      'Total body elastici resistenza',
      'Tai chi giardino tramonto',
      'Aqua fitness piscina resistenza',
      'Calisthenics muscle-up handstand progressivo',
      'Pliometrico potenza agilità',
      'Walking meditation natura 50min',
      'Triathlon casalingo corsa/nuoto/cycling',
      'Funzionale oggetti domestici pesi',
      'Equilibrio superfici instabili',
      'Kickboxing shadowboxing musica',
      'Intervalli scale pubbliche',
      'Animal flow movimenti naturali',
      'Forza bande elastiche TRX',
      'Dance workout cardio tonificazione',
      'Pranayama + stretching rigenerante',
      'Bootcamp militare casalingo',
      'Crossfit WOD adattato casa',
      'Metabolico EMOM 20 minuti',
      'Mobilità articolare prevenzione',
      'Cardio dance latino salsa bachata'
    ],
    weirdIdeas: [
      'Solo vestiti colore preferito giornata',
      'Esercizi quando senti sirene/clacson',
      'Ogni esercizio ridendo a crepapelle',
      'Solo pavimenti pattern geometrici',
      'Fitness solo con musica anni 80/90',
      'Parla in terza persona come commentatore',
      'Tocca 3 oggetti diversi tra esercizi'
    ]
  }
};

// Statistiche database
export const getDatabaseStats = () => {
  const stats = {};
  let totalIdeas = 0;
  
  Object.entries(categories).forEach(([key, category]) => {
    const normalIdeas = category.ideas.length;
    const weirdIdeas = category.weirdIdeas.length;
    const total = normalIdeas + weirdIdeas;
    
    stats[key] = {
      normal: normalIdeas,
      weird: weirdIdeas,
      total: total
    };
    
    totalIdeas += total;
  });
  
  stats.totalIdeas = totalIdeas;
  stats.totalCategories = Object.keys(categories).length;
  
  return stats;
};