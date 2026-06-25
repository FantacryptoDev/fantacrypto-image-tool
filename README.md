# Fantacrypto Image Tool

Tool React/Vite per cercare immagini con licenze aperte, scegliere le anteprime migliori e scaricare uno ZIP già organizzato per cartelle.

## Funzioni

- Upload Excel
- Lettura colonna A = percorso/nome file
- Lettura colonna B = query di ricerca
- Ricerca su Openverse e Wikimedia Commons
- 6 anteprime per riga
- Selezione manuale dell'immagine
- Rigenera risultati
- Filtro orientamento
- Filtro licenza Openverse
- Esporta CSV con licenze e fonti
- Genera ZIP con nomi e cartelle corretti

## Formato Excel

| Nome file | Ricerca |
|---|---|
| altcoin/ethereum-network.jpg | ethereum coin blockchain |
| mercato/bull-market.jpg | bull statue financial market |

## Installazione

```bash
npm install
npm run dev
```

## Deploy Vercel

1. Carica questa cartella su GitHub
2. Importa il repository su Vercel
3. Framework: Vite
4. Build command: `npm run build`
5. Output: `dist`

## Nota licenze

Il tool mostra licenza e fonte quando disponibili. Prima dell'uso commerciale controlla sempre la licenza della singola immagine.
