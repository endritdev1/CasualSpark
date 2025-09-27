# 🚀 Guida all'Installazione di CasualSpark

Questa guida ti aiuta a installare e avviare il progetto **CasualSpark**.

---

## 1. Prerequisiti

- **Node.js** (consigliato v18+): [Scarica Node.js](https://nodejs.org/it/)
- **npm** (incluso in Node.js)

---

## 2. Installazione delle dipendenze

Apri il terminale nella cartella del progetto e lancia:

```bash
npm install
```

Questo comando installerà tutte le librerie elencate in `package.json`:
- Vite (rolldown-vite)
- TypeScript
- Tailwind CSS
- @tailwindcss/vite

---

## 3. Avvio del server di sviluppo

Per avviare il progetto in locale:

```bash
npm run dev
```

---

## 4. Build produzione

Per generare la build ottimizzata:

```bash
npm run build
```

---

## 5. Anteprima della build

Per testare la build prodotta:

```bash
npm run preview
```

---

## 6. Aggiunta di nuove librerie

Per aggiungere una nuova libreria:

```bash
npm install nome-libreria
```

---

## 7. Risoluzione problemi

- Se hai errori di permessi, esegui il terminale come amministratore.
- Se hai problemi con le versioni, aggiorna Node.js e npm.
- Se hai errori con Tailwind, verifica che sia presente in `dependencies` e che il file `tailwind.config.js` sia configurato.

---

**Buon lavoro da Menkos!** ✨
