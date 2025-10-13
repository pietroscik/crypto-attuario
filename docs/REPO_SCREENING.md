# Screening del Repository & Roadmap di Ottimizzazione

## 📌 Executive Summary
- **Tipologia progetto:** Next.js ibrido (Pages + App Router) con ingestione dati da DefiLlama e analytics attuariali.
- **Focus principale:** Snapshot ISR giornaliero delle classifiche dei pool DeFi (`/api/attuario`) con filtri runtime opzionali via `/api/attuario/dynamic` e dashboard React su `/attuario`.
- **Stato complessivo:** La pipeline dati è funzionante, ma emergono rischi di manutenibilità, documentazione incoerente e opportunità di ottimizzazione su data fetching, rendering UI e gestione della configurazione.

---

## 🧭 Panoramica Architetturale
| Layer | File chiave | Note |
| --- | --- | --- |
| **API (App Router)** | `app/api/attuario/route.ts`, `app/api/attuario/dynamic/route.ts`, `app/api/health/route.ts` | Snapshot ISR statico + query dinamiche; l'endpoint health avvia il warmup. |
| **Pagine client (Pages Router)** | `pages/attuario.tsx`, `pages/utilities/*` | Pages Router legacy ospita la UI primaria. Molto styling inline. |
| **Logica di dominio** | `src/lib/defillama.ts` | Fetch, normalizzazione e ranking dei pool. |
| **Configurazione** | `next.config.ts`, `vercel.json` | Override custom di `fetch` per asset AMP e impostazioni Vercel build/runtime. |
| **Test** | `tests/*.test.(js|ts)` | Suite in stile Vitest/Jest su matematiche di portafoglio e cache utils. Mancano test sugli endpoint attuario. |

---

## 🚨 Criticità Principali
1. **Disallineamento documentazione vs implementazione sulla volatilità**
   - `pages/attuario.tsx` documenta un minimo di volatilità proxy a `0.001`, ma `rankPools` impone `0.01`.【F:pages/attuario.tsx†L247-L275】【F:src/lib/defillama.ts†L225-L242】
   - Azione: allineare la documentazione al codice o viceversa per evitare confusione in audit.

2. **Doppi passaggi di ordinamento nella dashboard attuariale**
   - `useMemo` ordina già i pool per `riskAdjustedMetric`, poi `getSortedData()` riesegue un sort a ogni render.【F:pages/attuario.tsx†L61-L121】【F:pages/attuario.tsx†L143-L183】
   - Impatto: lavoro O(n log n) ripetuto, evidente con limiti >50.
   - Azione: consolidare l'ordinamento in un'unica funzione memoizzata guidata da campo/direzione.

3. **Rischi dall'override globale di fetch**
   - `next.config.ts` sovrascrive `globalThis.fetch` per intercettare asset AMP.【F:next.config.ts†L1-L68】
   - Impatto: il wrapper può rompere runtime serverless o interferire con strumenti di osservabilità.
   - Azione: limitare l'override ai soli casi necessari o introdurre un flag d'ambiente.

4. **Edge case nel warmup dell'endpoint health**
   - `app/api/health/route.ts` deriva `baseUrl` da `request.nextUrl.origin`; su edge Vercel può risultare `undefined`, generando URL errati.【F:app/api/health/route.ts†L15-L56】
   - Azione: fallback a `process.env.NEXT_PUBLIC_SITE_URL` o `VERCEL_URL` per garantire URL assoluti validi.

5. **Assenza di test mirati per l'API attuariale**
   - Nessun test copre la logica ISR dello snapshot o la sanitizzazione parametri della route dinamica.
   - Azione: aggiungere suite Vitest che mockano `getPools` e verificano header, default e clamp dei parametri.

6. **Stile inline esteso limita il riuso**
   - La pagina `/attuario` contiene oggetti di stile inline molto ampi, complicando temi condivisi.【F:pages/attuario.tsx†L86-L320】
   - Azione: estrarre componenti riutilizzabili o CSS module per migliorare consistenza e ridurre bundle.

7. **Gestione errori fetch lato client incoerente**
   - Il fetcher SWR risolve `.json()` anche su risposte non 2xx, silenziando errori.
   - Azione: lanciare esplicitamente un errore se `!res.ok` per propagare gli status 503 dello snapshot.

---

## ⚙️ Opportunità di Ottimizzazione
1. **Ranking memoizzato e sensibile ai parametri**
   Memorizzare i pool normalizzati e applicare i filtri via selector memoizzati per evitare ricalcoli quando cambia solo `limit`.【F:pages/attuario.tsx†L61-L141】

2. **Tag per l'Incremental Static Regeneration**
   Aggiungere `revalidateTag('attuario-daily')` in una route dedicata e taggare la risposta per supportare refresh mirati da cron.【F:app/api/attuario/route.ts†L1-L31】

3. **Guard runtime per la route dinamica**
   Rinforzare il parsing dei parametri con schema validator (zod/valibot) per errori tipizzati e documentazione automatica.【F:app/api/attuario/dynamic/route.ts†L1-L28】

4. **Resilienza del data fetch**
   - Introdurre retry con backoff esponenziale in `fetchJSON` per errori di rete transitori.
   - Log strutturati (JSON) per integrazione con piattaforme di osservabilità.【F:src/lib/defillama.ts†L18-L120】

5. **Riduzione bundle client**
   - Estrarre helper (`formatNumber`, `formatCurrency`) in util condivisi per favorire tree-shaking.
   - Spostare gli stili inline voluminosi in CSS module o Tailwind per sfruttare la minificazione.

6. **Budget prestazionale per le tabelle**
   Introdurre virtualizzazione (es. `react-virtualized`) oltre ~200 risultati per evitare thrashing del layout.

7. **Monitoraggio & Telemetria**
   - Emettere metriche dagli endpoint API (latenza, cache hit) tramite logger leggero.
   - Correlare le metriche con le risposte dell'endpoint health.

---

## ✅ Checklist Quick Wins
- [ ] Allineare la documentazione della volatilità proxy con l'implementazione.
- [ ] Rifattorizzare l'ordinamento della tabella `/attuario` in un solo passaggio memoizzato.
- [ ] Rendere più robusta la generazione dell'URL di warmup nell'health check.
- [ ] Aggiungere gestione errori al fetcher SWR per propagare i fallimenti dello snapshot ISR.
- [ ] Introdurre test Vitest per `/api/attuario` e `/api/attuario/dynamic`.
- [ ] Estrarre stili/utilità condivise per la dashboard attuariale.

---

## 📈 Roadmap di medio periodo
1. **Versioning API & pubblicazione schema**
   Pubblicare OpenAPI/JSON schema per gli endpoint snapshot e dinamico a supporto di integrazioni terze.

2. **Analytics storiche**
   Archiviare gli snapshot giornalieri (es. Supabase o S3) per trend e metriche di rischio su trailing window.

3. **Access control & rate limiting**
   Introdurre API key o middleware di rate limiting per `/api/attuario/dynamic` se esposto pubblicamente.

4. **Internationalization**
   Localizzare UI e tooltip (oggi prevalentemente in italiano) per ampliare l'audience.

5. **Automazione**
   Aggiungere GitHub Actions per revalidazioni schedulate, lint e test continui.

---

## 🧪 Gap di Testing
| Area | Stato attuale | Raccomandazione |
| --- | --- | --- |
| `/api/attuario` ISR | ❌ Copertura assente | Mock di `getPools`, asserzione su default, header e payload. |
| Parametri `/api/attuario/dynamic` | ❌ Copertura assente | Test su clamp di `rf`, `minTVL`, `limit` e status 503 senza dati. |
| Filtri pagina `/attuario` | ⚠️ Solo test UI indiretti | Aggiungere test (React Testing Library) su filtri e toggling dell'ordinamento. |
| Warmup health | ❌ Non coperto | Mock del fetch per verificare warmup e gestione timeout. |

---

## 📝 Prossimi Passi Suggeriti per i Maintainer
1. Prioritizzare i quick win per stabilizzare documentazione, gestione errori e warmup.
2. Programmare refactor prestazionali (ordinamento, styling) nel prossimo sprint frontend.
3. Pianificare il rafforzamento dei test insieme all'automazione CI per prevenire regressioni ISR.
4. Valutare se lo shim AMP su `fetch` sia ancora necessario; in caso contrario rimuoverlo o isolarlo dietro feature flag.

---

_Compilato dallo screening automatico del repository. Ultimo aggiornamento: 2025-10-13._
