Questo progetto [Next.js](https://nextjs.org) è stato creato con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Funzionalità

### 📊 Ranking Attuariale (integrazione DefiLlama)

Classifica giornaliera dei pool DeFi con indicatore risk-adjusted basato sui dati di [DefiLlama](https://defillama.com).

**Caratteristiche principali:**
- Snapshot aggiornato ogni 24 ore con APY e TVL dei principali pool DeFi
- Calcolo dell'indice risk-adjusted: `(APY - rf) / Volatility Proxy`
- Volatility proxy calcolata come `|APY - APY_7d|` con fallback a 0,05
- Tabella ordinabile per Protocollo, Chain, APY, TVL, Volatilità e Indice risk-adjusted
- Filtri client-side per tasso risk-free, TVL minimo e limite risultati

**Accesso:** visita `/attuario` per consultare la dashboard.

**Endpoint API:** `GET /api/attuario`

Per richieste personalizzate in tempo reale è disponibile `/api/attuario/dynamic?rf=4.5&minTVL=1000000&limit=50`.

**Resilienza:**
- Timeout delle richieste: 10 secondi (evita richieste bloccate)
- ISR caching: revalidazione ogni 24 ore per lo snapshot
- Endpoint di health check: `/api/health`
- Cache warming automatico con Vercel Cron (ogni 5 minuti)

Consulta la [documentazione sul riscaldamento della cache ISR](./docs/ISR_CACHE_WARMING.md) per maggiori dettagli.

### 🛠️ Utilities Hub

Suite di strumenti quantitativi per analisi di portafoglio, ottimizzazione e scanning di arbitraggio.

**Accesso:** visita `/utilities` per esplorare gli strumenti.

#### Portfolio Analytics (`/utilities/portfolio`)

Analisi di portafoglio complete con strategie di ottimizzazione multiple:

**Caratteristiche:**
- **3 strategie di ottimizzazione:** Equal Weight, Risk Parity, Max Sharpe Ratio
- **Web Worker Optimization:** calcoli intensivi eseguiti in background per un'interfaccia reattiva
- **Covariance Shrinkage:** riduzione stile Ledoit-Wolf (α 0-0,30, default 0,10) per maggiore stabilità
- **Annualizzazione configurabile:** 252 giorni (tradizionale) o 365 (crypto 24/7)
- **Metriche di rischio:** Sharpe, Sortino, Calmar, Volatilità, Max Drawdown, VaR, Expected Shortfall
- **Backtesting:** walk-forward con ribilanciamento mensile
- **Selezione asset:** scegli 2-10 asset crypto tra le principali opzioni
- **Orizzonte personalizzabile:** analizza portafogli su 30-730 giorni
- **Persistenza:** configurazioni salvate in localStorage
- **Condivisione URL:** link condivisibili con tutti i parametri
- **Pronto all'export:** pesi e metriche calcolati lato client

**Dettagli tecnici:**
- Implementazioni in JavaScript puro (senza dipendenze pesanti)
- Grid/random search sul simplesso per il Max Sharpe (2000 campioni)
- Coordinate descent iterativo per Risk Parity
- Calcolo dei rendimenti: aritmetici e logaritmici
- Stima della matrice di covarianza con shrinkage opzionale
- Web Worker per evitare blocchi dell'interfaccia

#### Efficient Frontier (`/utilities/frontier`)

Visualizzazione del trade-off rischio/rendimento nello spazio dei portafogli:

**Caratteristiche:**
- **Frontiera sintetica:** 1000-2000 portafogli campionati sul simplesso
- **Grafico a dispersione interattivo:** realizzato con Recharts
- **Portafogli chiave:** Equal Weight, Risk Parity, Max Sharpe evidenziati con marker dedicati
- **Export CSV:** scarica l'intero dataset della frontiera con i pesi
- **Controllo shrinkage:** regola in tempo reale la shrinkage della covarianza
- **Seeding deterministico:** risultati riproducibili per i test

**Dettagli tecnici:**
- Campionamento casuale sul simplesso con vincoli di peso [0,1]
- Rischio di portafoglio: sqrt(w' Σ w)
- Rendimento di portafoglio: w' μ
- Sharpe ratio: (return - rf) / risk

#### Yield Screener (`/utilities/yields`)

Esplora opportunità di rendimento DeFi da DeFiLlama:

**Caratteristiche:**
- **Yields multi-chain:** visualizza l'APY sulle principali chain
- **Filtri:** chain, TVL minimo, età minima
- **Indicatori di rischio:** avvisi su impermanent loss
- **Caching:** TTL di 60 secondi per un recupero efficiente dei dati
- **Top 100:** rendering ottimizzato per le prime 100 opportunità
- **Disclaimer educativo:** avvisi chiari sui rischi

**Fonte dati:** DeFiLlama Yields API

**Disclaimer:** i valori di APY sono indicativi e altamente volatili. La DeFi comporta rischi da smart contract, impermanent loss e altri fattori. Contenuti esclusivamente educativi.

#### Arbitrage Scanner (`/utilities/arbitrage`)

**⚠️ SOLO A SCOPO EDUCATIVO – simulazione paper trading**

Scannerizza opportunità di arbitraggio tra venue di scambio simulate.

**Caratteristiche:**
- Scansione di differenziali di prezzo su più venue
- Modelli di fee configurabili (conservativo vs ottimistico)
- Calcolo dello spread netto dopo commissioni e costi di prelievo
- P&L stimato per le operazioni simulate
- Prezzi in tempo reale dalla CoinGecko API
- Soglia minima di spread personalizzabile

**Disclaimer:** questo strumento è completamente simulato e **non** esegue operazioni reali. È fornito solo a scopo educativo per illustrare i concetti di arbitraggio. Non costituisce consulenza finanziaria.

**Fonti dati:**
- Prezzi: CoinGecko Public API
- Venue simulate: Binance, Coinbase, Kraken, Bybit (con variazioni casuali dimostrative)

**Modelli di fee:**
- Conservativo: 0,4% taker, 0,1% prelievo
- Ottimistico: 0,2% taker, 0,05% prelievo

#### Methodology (`/utilities/methodology`)

Documentazione completa di formule, assunzioni e limitazioni:

**Sezioni:**
- Rendimento e annualizzazione (aritmetico, logaritmico, compounding)
- Metriche di rischio (volatilità, MDD, VaR, ES)
- Performance risk-adjusted (Sharpe, Sortino, Calmar)
- Ottimizzazione di portafoglio (EW, RP, MaxSharpe, shrinkage)
- Metodologia di backtesting
- Principali limitazioni e buone pratiche
- Riferimenti accademici

### 🌐 Monitoraggio della rete

**Network HUD:** indicatore in tempo reale che mostra:
- Richieste servite da cache
- Richieste live (API fresche)
- Tentativi di retry (con backoff esponenziale)
- Stati di errore

**Rate Limiting:**
- Minimo 500 ms tra richieste allo stesso host
- Previene il throttling delle API e garantisce un uso responsabile

**Resilienza:**
- Retry automatico con backoff esponenziale (1s, 2s, 4s)
- Timeout delle richieste a 10 secondi
- Cache con TTL configurabile (default 60 s)
- Persistenza in localStorage per la cache client-side

### 🏥 Salute & Monitoraggio

**Endpoint di health check:** `GET /api/health`

Verifica di base:
```bash
curl https://your-domain.com/api/health
```

Health check con cache warming:
```bash
curl https://your-domain.com/api/health?warm=true
```

Questo endpoint viene usato da Vercel Cron per mantenere caldo lo snapshot ISR e garantire tempi di risposta rapidi.

## Avvio rapido

Avvia il server di sviluppo:

```bash
npm run dev
# oppure
yarn dev
# oppure
pnpm dev
# oppure
bun dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser per vedere il risultato.

## Variabili d'ambiente

Copia `.env.example` in `.env.local` e configura i valori:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_DEFI_LLAMA_API_URL`: endpoint API di DefiLlama (default: https://yields.llama.fi)

## Test

Esegui la suite di test:

```bash
npm test
```

Esegui i test in modalità watch:

```bash
npm run test:watch
```

## Struttura del progetto

- `/pages` – pagine del Pages Router (legacy, gran parte della UI)
- `/app` – App Router (API routes)
- `/src/lib` – logica di dominio e data fetching
- `/src/types` – definizioni TypeScript
- `/tests` – file di test
- `/components` – componenti React riutilizzabili
- `/data` – dati statici

## Approfondimenti

Per saperne di più su Next.js consulta:

- [Documentazione Next.js](https://nextjs.org/docs) – guida completa a funzionalità e API
- [Learn Next.js](https://nextjs.org/learn) – tutorial interattivo

Puoi anche visitare il [repository GitHub di Next.js](https://github.com/vercel/next.js): feedback e contributi sono benvenuti!

## Deploy su Vercel

Il modo più semplice per distribuire l'app è usare la [piattaforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), sviluppata dagli autori di Next.js.

Consulta la [documentazione ufficiale sul deploy](https://nextjs.org/docs/app/building-your-application/deploying) per ulteriori dettagli.
