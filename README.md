# Backend

### Per eseguire il backend:

1. Eseguire `npm install` per installare le dipendenze.
2. Creare un file `.env` e popolarlo basandosi sul contenuto del file `.env.example`
3. Eseguire `npm start`

### Testing

1. Eseguire `npm run test`.

>Nota bene: la variabile d'ambiente `IGNORE_AUTHORITY` va settata su "false" per poter eseguire con successo i test delle API, perchè diversi metodi dietro alle API richiedono l'autenticazione (Token JWT), oppure il possesso del ruolo di Admin o Moderatore.


