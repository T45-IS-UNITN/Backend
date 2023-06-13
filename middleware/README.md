## Documentazione di auth.js

Questo file contiene funzioni e middleware per gestire l'autenticazione e l'autorizzazione utilizzando token JWT.

### Funzioni

- `generateToken(userId)`: Questa funzione genera un token JWT utilizzando l'ID dell'utente fornito come parametro. Il token generato ha una durata di 1 giorno (24 ore). Assicurati di modificare il valore di `secret` con il tuo segreto per la firma del token.

### Middleware

- `verifyToken(req, res, next)`: Questo middleware verifica il token JWT presente nell'intestazione "Authorization" della richiesta. Se il token non è presente o non è valido, viene restituito un errore di autenticazione. Se il token è valido, l'ID dell'utente viene decodificato dal token e viene aggiunto all'oggetto `req` come `userId`. Il middleware successivo può accedere a `req.userId` per ottenere l'ID dell'utente autenticato.

- `verifyRole(role)`: Questo middleware verifica se l'utente autenticato ha un determinato ruolo. Il ruolo richiesto viene fornito come parametro alla funzione. Se l'utente autenticato non ha il ruolo richiesto, viene restituito un errore di autorizzazione.

### Utilizzo del token JWT

Assicurati di includere il token JWT nelle richieste POST per creare commenti e recensioni nel tuo frontend. Il token deve essere inviato nell'intestazione "Authorization" come "Bearer [token]". Il token può essere ottenuto utilizzando la funzione `generateToken(userId)` fornendo l'ID dell'utente come parametro.

È importante modificare il valore di `secret` nelle funzioni `generateToken` e `verifyToken` con il tuo segreto per la firma del token. Il segreto dovrebbe essere mantenuto segreto e non condiviso pubblicamente.

