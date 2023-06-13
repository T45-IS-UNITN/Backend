## Recensioni API

Questo file contiene i metodi per gestire le recensioni dei libri.

### Endpoint

- `POST /recensioni`: Pubblica una recensione.
- `GET /recensioni`: Prende tutte le recensioni.
- `GET /recensioni/:libroId`: Prende le recensioni di un libro specifico.
- `GET /recensioni/:utenteId`: Prende le recensioni di un utente autore specifico.
- `DELETE /recensioni/:recensioneId`: Cancella una recensione (richiede autenticazione come moderatore).

### Middleware

- `verifyToken`: Middleware per verificare il token di autenticazione dell'utente.
- `verifyRole("moderatore")`: Middleware per verificare che l'utente abbia il ruolo di moderatore.

### Implementazione

Il metodo `POST /recensioni` viene utilizzato per pubblicare una nuova recensione. I parametri richiesti nel corpo della richiesta includono `titolo`, `contenuto`, `voto`, `autore` e `libro`. Viene creato un nuovo oggetto `Recensione` con i dati forniti e salvato nel database. Viene restituito il nuovo oggetto della recensione.

Il metodo `GET /recensioni` viene utilizzato per ottenere tutte le recensioni presenti nel database.

Il metodo `GET /recensioni/:libroId` viene utilizzato per ottenere le recensioni di un libro specifico. Il parametro `libroId` viene utilizzato per filtrare le recensioni in base all'ID del libro.

Il metodo `GET /recensioni/:utenteId` viene utilizzato per ottenere le recensioni di un utente autore specifico. Il parametro `utenteId` viene utilizzato per filtrare le recensioni in base all'ID dell'utente autore.

Il metodo `DELETE /recensioni/:recensioneId` viene utilizzato per cancellare una recensione. È necessaria l'autenticazione come moderatore per eseguire questa operazione. Viene verificata l'esistenza della recensione corrispondente all'ID fornito e, se presente, viene rimossa dal database.

### Requisiti

Per utilizzare correttamente l'API, è necessario includere il pacchetto `express`, il modello `Recensione` e i middleware `verifyToken` e `verifyRole` corrispondenti.

## Preferiti API

Questo file contiene i metodi per gestire i libri preferiti degli utenti.

### Endpoint

- `POST /aggiungiPreferito`: Aggiunge un libro alla lista dei preferiti dell'utente.
- `DELETE /rimuoviPreferito`: Rimuove un libro dalla lista dei preferiti dell'utente.

### Requisiti

Per utilizzare questa API, è necessario includere il pacchetto `express` e i modelli `Utente` e `Libro`.

#### POST /aggiungiPreferito

Aggiunge un libro alla lista dei preferiti dell'utente.

Parametri richiesti nel corpo della richiesta:
- `userId`: ID dell'utente.
- `libroId`: ID del libro da aggiungere ai preferiti.

#### DELETE /rimuoviPreferito

Rimuove un libro dalla lista dei preferiti dell'utente.

Parametri richiesti nella query della richiesta:
- `userId`: ID dell'utente.
- `libroId`: ID del libro da rimuovere dai preferiti.

### Implementazione

Il metodo `POST /aggiungiPreferito` cerca l'utente corrispondente all'ID fornito e il libro corrispondente all'ID fornito. Verifica se il libro è già presente nella lista dei preferiti dell'utente e, in caso positivo, restituisce un errore. Altrimenti, aggiunge il libro alla lista dei preferiti dell'utente e salva le modifiche.

Il metodo `DELETE /rimuoviPreferito` cerca l'utente corrispondente all'ID fornito e verifica se il libro è presente nella lista dei preferiti dell'utente. Se il libro non è presente, restituisce un errore. Altrimenti, rimuove il libro dalla lista dei preferiti dell'utente e salva le modifiche.

### Requisiti

Per utilizzare correttamente l'API, è necessario includere il pacchetto `express` e i modelli `Utente` e `Libro` corrispondenti.

## Feed API

Questo file contiene i metodi per generare il feed di libri e recensioni personalizzato per gli utenti.

### Endpoint

- `GET /feedLibri`: Ottiene i libri consigliati per l'utente.
- `GET /feedRecensioni`: Ottiene le recensioni nel feed.

### Requisiti

Per utilizzare questa API, è necessario includere il pacchetto `express`, i modelli `Libro` e `Utente`.

#### GET /feedLibri

Ottiene i libri consigliati per l'utente.

Parametri richiesti:
- `userId`: ID dell'utente.

#### GET /feedRecensioni

Ottiene le recensioni nel feed.

Parametri richiesti:
- `userId`: ID dell'utente (opzionale).

### Implementazione

Il metodo `GET /feedLibri` genera i libri consigliati per l'utente basandosi sui generi dei libri preferiti dell'utente. Vengono calcolati il numero minimo di generi che devono corrispondere per il feed e quindi trovati i libri nel feed che corrispondono ai generi preferiti dell'utente. Infine, i libri vengono filtrati per garantire che abbiano almeno il 50% dei generi in comune.

Il metodo `GET /feedRecensioni` genera le recensioni nel feed. Se l'utente è autenticato, vengono considerati i generi dei libri preferiti dell'utente e viene filtrato anche per autori che l'utente segue. Se l'utente non è autenticato, vengono restituite le recensioni più recenti (fino a un massimo di 10).

### Requisiti

Per utilizzare correttamente l'API, è necessario includere il pacchetto `express` e i modelli `Libro` e `Utente` corrispondenti.

## Commenti API

Questo file contiene i metodi per gestire le operazioni legate ai commenti delle recensioni. L'API richiede l'utilizzo di JSON Web Token (JWT) per l'autenticazione e include anche la verifica del ruolo dell'utente.

### Endpoint

- `GET /commenti/:recensioneId`: Ottiene tutti i commenti relativi a una recensione specifica.
- `POST /recensioni/:recensioneId/commenti`: Pubblica un commento per una recensione specifica.
- `GET /commenti/:libroId`: Ottiene tutti i commenti relativi a un libro specifico.
- `GET /commenti/:autoreId`: Ottiene tutti i commenti di un autore specifico.
- `DELETE /commenti/:commentoId`: Cancella un commento specifico.

### Middleware

- `verifyToken`: Middleware per verificare il token JWT dell'utente.
- `verifyRole("moderatore")`: Middleware per verificare se l'utente ha il ruolo di moderatore.

#### GET /commenti/:recensioneId

Ottiene tutti i commenti relativi a una recensione specifica.

Parametri richiesti:
- `recensioneId`: ID della recensione.

#### POST /recensioni/:recensioneId/commenti

Pubblica un commento per una recensione specifica.

Parametri richiesti:
- `contenuto`: Contenuto del commento.
- `autoreId`: ID dell'autore del commento.
- `recensioneId`: ID della recensione.

#### GET /commenti/:libroId

Ottiene tutti i commenti relativi a un libro specifico.

Parametri richiesti:
- `libroId`: ID del libro.

#### GET /commenti/:autoreId

Ottiene tutti i commenti di un autore specifico.

Parametri richiesti:
- `autoreId`: ID dell'autore.

#### DELETE /commenti/:commentoId

Cancella un commento specifico. Questa azione può essere eseguita solo da un utente con il ruolo di moderatore.

Parametri richiesti:
- `commentoId`: ID del commento da cancellare.

### Middleware

#### verifyToken

Middleware per verificare se il token JWT dell'utente è valido. Viene utilizzato per proteggere le route che richiedono autenticazione.

#### verifyRole("moderatore")

Middleware per verificare se l'utente ha il ruolo di moderatore. Viene utilizzato per proteggere le route che richiedono privilegi di moderatore.

### Requisiti

Per utilizzare questa API, è necessario includere il pacchetto `express`, i modelli `Commento`, `Recensione` e `Utente`, e i middleware `verifyToken` e `verifyRole` per l'autenticazione e la verifica del ruolo.

## User Management API

Questo file contiene i metodi per gestire le operazioni legate agli utenti, come la creazione di un nuovo utente, la cancellazione di un utente, la promozione di un utente a moderatore e la revoca dei privilegi di moderatore. L'API richiede l'utilizzo di JSON Web Token (JWT) per l'autenticazione.

### Endpoint

- `POST /nuovoUtente`: Crea un nuovo utente.
- `DELETE /cancellaUtente/:userId`: Cancella l'utente specificato.
- `PUT /utenti/:utenteId/moderatore`: Promuove l'utente a moderatore.
- `PUT /utenti/:utenteId/revocaModeratore`: Revoca i privilegi di moderatore dall'utente.

### Middleware

- `checkAdmin`: Middleware per verificare se l'utente è un amministratore.

#### POST /nuovoUtente

Crea un nuovo utente nel sistema.

Parametri richiesti:
- `nome`: Nome dell'utente.
- `email`: Email dell'utente.
- `password`: Password dell'utente.

#### DELETE /cancellaUtente/:userId

Cancella l'utente specificato dal sistema. L'utente può cancellare soltanto se stesso.

Parametri richiesti:
- `userId`: ID dell'utente da cancellare.

#### PUT /utenti/:utenteId/moderatore

Promuove l'utente specificato a moderatore. Questa azione può essere eseguita solo da un utente amministratore.

Parametri richiesti:
- `utenteId`: ID dell'utente da promuovere a moderatore.

#### PUT /utenti/:utenteId/revocaModeratore

Revoca i privilegi di moderatore dall'utente specificato. Questa azione può essere eseguita solo da un utente amministratore.

Parametri richiesti:
- `utenteId`: ID dell'utente da cui revocare i privilegi di moderatore.

### Middleware

#### checkAdmin

Middleware per verificare se l'utente che effettua la richiesta è un amministratore. Questo middleware viene utilizzato per proteggere le route che richiedono privilegi di amministratore.

### Requisiti

Per utilizzare questa API, è necessario includere il pacchetto `express`, `bcrypt`, i modelli degli utenti `Utente` e `Amministratore`, e il middleware `verifyToken` per l'autenticazione JWT.

## Documentazione di follow.js

Questo file contiene i metodi per gestire l'aggiunta e la rimozione di utenti dalla lista degli utenti seguiti.

### Endpoint

- `POST /follow/:userId`: Aggiunge un utente alla lista degli utenti seguiti.
- `DELETE /unfollow/:userId/:utenteSeguitoId`: Rimuove un utente dalla lista degli utenti seguiti.

### Implementazione

Il metodo `POST /follow/:userId` viene utilizzato per aggiungere un utente alla lista degli utenti seguiti. L'ID dell'utente che segue viene fornito come parametro nella richiesta, mentre l'ID dell'utente da seguire viene fornito nel corpo della richiesta. Viene controllata l'esistenza dell'utente che segue e verificato che l'utente da seguire non sia già presente nella lista degli utenti seguiti. In caso positivo, l'utente viene aggiunto alla lista e viene restituito un messaggio di successo.

Il metodo `DELETE /unfollow/:userId/:utenteSeguitoId` viene utilizzato per rimuovere un utente dalla lista degli utenti seguiti. L'ID dell'utente che segue e l'ID dell'utente da rimuovere vengono forniti come parametri nella richiesta. Viene controllata l'esistenza dell'utente che segue e verificato che l'utente da rimuovere sia presente nella lista degli utenti seguiti. In caso positivo, l'utente viene rimosso dalla lista e viene restituito un messaggio di successo.

In caso di errori durante l'esecuzione dei metodi, vengono restituiti messaggi di errore con il relativo codice HTTP.

### Requisiti

Il file richiede l'utilizzo del framework Express.js e il modello Utente, che devono essere inclusi tramite `require`.