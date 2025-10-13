# Riscaldamento della Cache ISR con Vercel Cron

## Panoramica

Il progetto utilizza Vercel Cron per riscaldare automaticamente la cache ISR (Incremental Static Regeneration) dell'endpoint `/api/attuario`, garantendo risposte rapide e dati aggiornati.

## Configurazione

### vercel.json

Il file `vercel.json` configura un cron job che gira ogni 5 minuti:

```json
{
  "crons": [
    {
      "path": "/api/health?warm=true",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Opzioni di schedulazione

Puoi modificare la pianificazione in `vercel.json` usando la sintassi cron standard:

- `*/5 * * * *` – ogni 5 minuti (consigliato per traffico medio-alto)
- `*/1 * * * *` – ogni minuto (per dati critici o picchi elevati)
- `0 * * * *` – ogni ora (per siti a basso traffico)

## Endpoint di Health Check

### GET /api/health

Verifica di base senza riscaldamento cache:

```bash
curl https://your-domain.com/api/health
```

Risposta:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T14:30:00.000Z",
  "service": "crypto-attuario",
  "version": "1.0.0"
}
```

### GET /api/health?warm=true

Verifica con warmup della cache ISR:

```bash
curl https://your-domain.com/api/health?warm=true
```

Risposta:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-12T14:30:00.000Z",
  "service": "crypto-attuario",
  "version": "1.0.0",
  "cache_warmed": true,
  "cache_status": 200
}
```

## Benefici

1. **Riduzione della latenza**: gli utenti ricevono sempre risposte da cache, evitando cold start
2. **Dati freschi**: il cron mantiene caldo lo snapshot giornaliero generato via ISR
3. **Resilienza**: l'health check continua a rispondere 200 anche se il warmup fallisce
4. **Monitoraggio**: lo stato della cache è incluso nella risposta dell'health check

## Monitoraggio

Puoi monitorare il riscaldamento della cache tramite:

1. **Vercel Dashboard**: controlla i log Cron del progetto
2. **Endpoint Health**: chiama manualmente `/api/health?warm=true`
3. **Log dell'applicazione**: cerca messaggi "ISR warmup failed"

## Troubleshooting

### Il warmup fallisce

Se `cache_warmed: false` appare nella risposta:

1. Controlla il campo `cache_error` per maggiori dettagli
2. Verifica che l'endpoint `/api/attuario` risponda correttamente
3. Consulta i log delle funzioni Vercel per timeout o problemi di rete

### Il cron non viene eseguito

1. Assicurati che `vercel.json` sia versionato nel repository
2. Verifica che il progetto Vercel abbia Cron attivo (richiede piano Pro)
3. Controlla nella dashboard di Vercel → scheda Cron per i log di esecuzione

## Considerazioni sui costi

- Vercel Cron è disponibile dai piani Pro in su
- Ogni esecuzione Cron conta come invocazione di funzione serverless
- Esecuzione ogni 5 minuti = ~8.640 invocazioni/mese
- Valuta i limiti del piano e adatta la schedulazione di conseguenza
