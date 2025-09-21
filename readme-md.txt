# 💡 Generatore di Idee Casuali

Un'app web moderna per generare idee creative casuali e combinarle in modo intelligente.

## 🚀 Demo Live

👉 **[Prova l'app qui](https://tuonome.github.io/generatore-idee-casuali)** 👈

## ✨ Caratteristiche

### 🎯 **6 Categorie Principali**
- **🎨 Creativo** - Progetti artistici, scrittura, design
- **💼 Business** - Startup, servizi, innovazione
- **🎪 Attività** - Tempo libero, hobby, esperienze
- **🍳 Ricette** - Cucina creativa e fusion
- **✈️ Viaggi** - Destinazioni ed esperienze uniche
- **💪 Fitness** - Allenamenti e sfide fisiche

### 🎲 **Funzionalità Avanzate**
- **Combinazione Intelligente** - Mescola automaticamente più categorie per idee fusion
- **Livelli di Stranezza** - Da normale a completamente bizzarro
- **Sistema Preferiti** - Salva le idee che ami di più
- **Download Immagini** - Crea belle card condivisibili
- **Statistiche** - Traccia le tue idee generate
- **Database Aggiornabile** - Facile da espandere con nuove idee

## 📊 Database

**175+ Idee Totali:**
- 150+ idee "normali" per uso quotidiano
- 25+ idee "bizzarre" per massima creatività
- **Migliaia di combinazioni** possibili tra categorie

## 🛠️ Tecnologie

- **HTML5** - Struttura semantica
- **CSS3 + Tailwind** - Styling moderno e responsive
- **Vanilla JavaScript** - Logica pulita senza framework
- **Canvas API** - Generazione immagini
- **Local Storage** - Persistenza dati
- **PWA Ready** - Funziona offline

## 📱 Caratteristiche Mobile

- **Design Responsive** - Perfetto su tutti i dispositivi
- **Touch Friendly** - Ottimizzato per smartphone
- **Installabile** - Aggiungi alla home screen
- **Offline First** - Funziona senza internet

## 🗂️ Struttura Progetto

```
generatore-idee-casuali/
├── index.html              # App principale
├── ideas-database.js       # Database delle idee (separato)
├── manifest.json          # PWA manifest
├── service-worker.js       # Service worker per offline
├── package.json           # Configurazione npm
├── README.md              # Documentazione
└── assets/                # Immagini e risorse
    ├── icon-192.png
    ├── icon-512.png
    └── screenshot.png
```

## 🔧 Setup Locale

```bash
# Clona il repository
git clone https://github.com/tuonome/generatore-idee-casuali.git
cd generatore-idee-casuali

# Avvia server locale
python -m http.server 8000
# Oppure con Node.js
npx serve .

# Apri nel browser
open http://localhost:8000
```

## 🚀 Deploy su GitHub Pages

1. **Fork** questo repository
2. Vai su **Settings** > **Pages**
3. Seleziona **Deploy from branch** > **main**
4. L'app sarà disponibile su `https://tuonome.github.io/generatore-idee-casuali`

## 📈 Aggiornare il Database

Il database è separato nel file `ideas-database.js` per facilitare gli aggiornamenti:

```javascript
// Aggiungi nuove idee qui
export const categories = {
  nuovaCategoria: {
    name: 'Nuova Categoria',
    gradient: 'from-blue-400 to-purple-500',
    color: '#3B82F6',
    ideas: [
      'Prima idea normale...',
      'Seconda idea normale...'
    ],
    weirdIdeas: [
      'Prima idea bizzarra...',
      'Seconda idea bizzarra...'
    ]
  }
};
```

## 🤝 Contribuire

1. **Fork** il progetto
2. Crea il tuo **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. Apri una **Pull Request**

## 📝 Roadmap

- [ ] **Modalità Sfida** - Obiettivi temporizzati
- [ ] **Social Sharing** - Condivisioni dirette social
- [ ] **Temi Personalizzati** - Colori e stili custom  
- [ ] **AI Suggestions** - Idee generate con IA
- [ ] **Collaborazione** - Idee condivise tra utenti
- [ ] **Analytics** - Statistiche avanzate

## 📊 Analytics

![GitHub stars](https://img.shields.io/github/stars/tuonome/generatore-idee-casuali?style=social)
![GitHub forks](https://img.shields.io/github/forks/tuonome/generatore-idee-casuali?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/tuonome/generatore-idee-casuali?style=social)

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Riconoscimenti

- **Tailwind CSS** - Framework CSS
- **Lucide** - Icone bellissime
- **GitHub Pages** - Hosting gratuito
- **Claude AI** - Assistente per lo sviluppo

---

**Made with ❤️ for creativity and inspiration**

👉 **[Prova l'app ora!](https://tuonome.github.io/generatore-idee-casuali)** 👈