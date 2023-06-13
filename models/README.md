## Commento Modello

Il file `Commento.js` definisce lo schema del modello `Commento` utilizzato per rappresentare i commenti alle recensioni.

### Proprietà

- `testo`: Una stringa che rappresenta il testo del commento. È obbligatorio.
- `autore`: Un riferimento all'oggetto `Utente` che rappresenta l'autore del commento. È obbligatorio.
- `recensione`: Un riferimento all'oggetto `Recensione` a cui il commento fa riferimento. È obbligatorio.
- `dataCreazione`: Una data che rappresenta la data di creazione del commento. Viene impostata automaticamente come la data corrente se non specificata.

### Collegamenti

- `autore`: Rappresenta l'autore del commento e fa riferimento all'oggetto `Utente`.
- `recensione`: Rappresenta la recensione a cui il commento è associato e fa riferimento all'oggetto `Recensione`.

### Requisiti

Per utilizzare correttamente il modello `Commento`, è necessario includere il pacchetto `mongoose` e definire uno schema che corrisponda alla struttura descritta sopra. Il modello `Commento` viene quindi creato utilizzando lo schema e viene esportato per essere utilizzato in altre parti dell'applicazione.

## Libro Modello

Il file `Libro.js` definisce lo schema del modello `Libro` utilizzato per rappresentare le informazioni di un libro.

### Proprietà

- `titolo`: Una stringa che rappresenta il titolo del libro. È obbligatorio.
- `autore`: Una stringa che rappresenta l'autore del libro. È obbligatorio.
- `annoPubblicazione`: Un numero intero che rappresenta l'anno di pubblicazione del libro. È obbligatorio.
- `generi`: Un array di stringhe che rappresenta i generi a cui il libro appartiene.
- `recensioni`: Un array di riferimenti agli oggetti `Recensione` che rappresentano le recensioni associate al libro.

### Collegamenti

- `recensioni`: Rappresenta le recensioni associate al libro e fa riferimento agli oggetti `Recensione`.

### Requisiti

Per utilizzare correttamente il modello `Libro`, è necessario includere il pacchetto `mongoose` e definire uno schema che corrisponda alla struttura descritta sopra. Il modello `Libro` viene quindi creato utilizzando lo schema e viene esportato per essere utilizzato in altre parti dell'applicazione.

## Recensione Modello

Il file `Recensione.js` definisce lo schema del modello `Recensione` utilizzato per rappresentare le informazioni di una recensione di un libro.

### Proprietà

- `titolo`: Una stringa che rappresenta il titolo della recensione. È obbligatorio.
- `contenuto`: Una stringa che rappresenta il contenuto della recensione. È obbligatorio.
- `voto`: Un numero che rappresenta il voto assegnato alla recensione. È obbligatorio.
- `autore`: Un riferimento all'oggetto `Utente` che rappresenta l'autore della recensione. È obbligatorio.
- `libro`: Un riferimento all'oggetto `Libro` a cui la recensione si riferisce. È obbligatorio.
- `data`: Una data che rappresenta la data di creazione della recensione. Viene impostata di default alla data corrente.

### Collegamenti

- `autore`: Rappresenta l'autore della recensione e fa riferimento all'oggetto `Utente`.
- `libro`: Rappresenta il libro a cui la recensione si riferisce e fa riferimento all'oggetto `Libro`.

### Requisiti

Per utilizzare correttamente il modello `Recensione`, è necessario includere il pacchetto `mongoose` e definire uno schema che corrisponda alla struttura descritta sopra. Il modello `Recensione` viene quindi creato utilizzando lo schema e viene esportato per essere utilizzato in altre parti dell'applicazione.

## Utente Modello

Il file `Utente.js` definisce lo schema del modello `Utente` utilizzato per rappresentare le informazioni di un utente nel sistema.

### Proprietà

- `nome`: Una stringa che rappresenta il nome dell'utente. È obbligatorio.
- `email`: Una stringa che rappresenta l'email dell'utente. È obbligatorio e unico (non può essere duplicato).
- `password`: Una stringa che rappresenta la password dell'utente. È obbligatoria.
- `libriPreferiti`: Un array di riferimenti agli oggetti `Libro` che rappresentano i libri preferiti dell'utente.
- `follow`: Un array di riferimenti agli oggetti `Utente` che rappresentano gli utenti seguiti dall'utente.

### Sottotipi di Utente

Il modello `Utente` è esteso per creare due sottotipi specifici: `Amministratore` e `Moderatore`. Questi sottotipi hanno uno schema aggiuntivo per rappresentare i ruoli specifici di amministratore e moderatore.

### Schema di Amministratore

- `ruolo`: Una stringa che rappresenta il ruolo dell'utente amministratore. Il valore predefinito è "amministratore".

### Schema di Moderatore

- `ruolo`: Una stringa che rappresenta il ruolo dell'utente moderatore. Il valore predefinito è "moderatore".

### Collegamenti

- `libriPreferiti`: Rappresenta i libri preferiti dell'utente e fa riferimento agli oggetti `Libro`.
- `follow`: Rappresenta gli utenti seguiti dall'utente e fa riferimento agli oggetti `Utente`.

### Requisiti

Per utilizzare correttamente il modello `Utente`, è necessario includere il pacchetto `mongoose` e definire gli schemi dell'utente, dell'amministratore e del moderatore. Successivamente, il modello `Utente` viene creato utilizzando lo schema di base, mentre i modelli `Amministratore` e `Moderatore` vengono creati come sottotipi di `Utente` utilizzando gli schemi specifici per il ruolo. Infine, i tre modelli vengono esportati per essere utilizzati in altre parti dell'applicazione.