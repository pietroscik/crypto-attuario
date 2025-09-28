<h1 align="center">Crypto-Attuario</h1>

Applicazione informativa e di ricerca dedicata all'analisi attuariale nel mondo crypto e DeFi. Il progetto raccoglie strumenti interattivi (calcolatori di staking, rendita, VaR), dashboard dedicate ai protocolli più rilevanti e contenuti editoriali per professionisti di risk management, assicurazioni e investitori istituzionali.

## 🚀 Funzionalità principali

- **Homepage editoriale** con mission, statistiche sintetiche e call-to-action verso gli strumenti disponibili.
- **Blog tematico** con percorsi di lettura, anteprime di articoli e invito alla collaborazione della community attuariale.
- **Strumenti quantitativi**: calcolo staking, planner di rendita, Value at Risk e simulazioni pensionistiche basate su asset digitali.
- **Schede protocolli DeFi** con dati, risk assessment e confronto con alternative di mercato.
- **Integrazione AdSense** centralizzata tramite layout condiviso.

## 🧱 Struttura del progetto

```
.
├── components/         # Layout, banner pubblicitari, template protocolli
├── data/               # Dataset statici (protocolli, anteprime articoli)
├── pages/              # Pagine Next.js (home, blog, strumenti, protocolli)
├── public/             # Asset statici
└── styles/             # Stili globali
```

## 🛠️ Tecnologie

- [Next.js](https://nextjs.org/) con routing basato su file (`pages/`)
- React + Hooks per la logica dei calcolatori
- [Recharts](https://recharts.org/en-US/) per i grafici del calcolatore di staking

## ▶️ Avvio del progetto

1. Installare le dipendenze (una sola volta):

   ```bash
   npm install
   ```

2. Avviare il server di sviluppo:

   ```bash
   npm run dev
   ```

3. Aprire [http://localhost:3000](http://localhost:3000) per visualizzare il sito.

## 📬 Contributi

Le proposte di nuovi articoli, dataset o strumenti sono benvenute. Apri una issue o invia una pull request indicando il contesto attuariale/finanziario di riferimento.

## ⚠️ Disclaimer

Le informazioni presenti nel sito hanno finalità esclusivamente educative e divulgative. Non costituiscono consulenza finanziaria, fiscale o assicurativa.

