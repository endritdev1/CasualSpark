# 🚀 Deploy su GitHub Pages con Vite

Questa guida ti aiuta a pubblicare il tuo progetto Vite su GitHub Pages in pochi semplici passaggi.

---

## 1. Installa il pacchetto `gh-pages`

```bash
npm install --save-dev gh-pages
```

---

## 2. Aggiungi il campo `homepage` nel file `package.json`

Inserisci la seguente riga **all'inizio** del tuo `package.json` (fuori da scripts e dependencies):

```json
"homepage": "https://<tuo-username>.github.io/<nome-repo>"
```

Esempio:
```json
"homepage": "https://menkos.github.io/CasualSpark"
```

---

## 3. Configura la proprietà `base` in `vite.config.ts`

Aggiungi o modifica la proprietà `base`:

```js
export default {
  base: '/<nome-repo>/',
  // ...altre configurazioni
}
```

Esempio:
```js
base: '/CasualSpark/'
```

---

## 4. Aggiungi lo script di deploy nel `package.json`

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

---

## 5. Esegui la build e il deploy

```bash
npm run build
npm run deploy
```

---

## 6. Imposta la branch `gh-pages` come sorgente su GitHub Pages

Vai su **GitHub > Settings > Pages** e seleziona la branch `gh-pages` come sorgente.

---

## 7. Accedi al tuo sito

Il sito sarà disponibile all’indirizzo:
```
https://<tuo-username>.github.io/<nome-repo>/
```
Esempio:
```
https://menkos.github.io/CasualSpark/
```

---

## 📝 Note utili
- Se vedi una pagina bianca o errori 404, controlla che la proprietà `base` sia corretta e che la branch `gh-pages` contenga la cartella `dist` con tutti i file.
- Cancella la cache del browser se non vedi subito le modifiche.
- Puoi trovare maggiori info sulla documentazione ufficiale di Vite e gh-pages.
