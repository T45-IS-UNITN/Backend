const Utente = require("../models/Utente").Utente;
const Recensione = require("../models/Recensione");
const Commento = require("../models/Commento");
const Libro = require("../models/Libro")
const invalidTokens = require("../models/InvalidToken")
const bcrypt = require("bcrypt");

async function setupData() {
    try {

        // Cifratura della password, emula un "POST /user"
        const saltRounds = 10;
        const clearPassword = "password123"
        const hashedPassword = await bcrypt.hash(clearPassword, saltRounds);

        // Creazione di un utente di prova
        const utente = new Utente({
            name: "John Doe",
            email: "johndoe@example.com",
            password: hashedPassword, // password: password123
        });

        await utente.save();

        // Creazione di un libro di prova
        const libro1 = new Libro({
            titolo: "Titolo libro",
            autore: "Autore libro",
            annoPubblicazione: 2022,
        });

        await libro1.save();

        // Creazione di un libro di prova
        const libro2 = new Libro({
            titolo: "Titolo2 libro",
            autore: "Autore2 libro",
            annoPubblicazione: 2023,
        });

        await libro2.save();

        // Creazione di una recensione
        const recensione = new Recensione({
            titolo: "Recensione di prova",
            voto: 4,
            autore: utente._id,
            libro: libro1._id,
            contenuto: "Questa è una recensione di prova",
        });

        await recensione.save();

        // Creazione di commenti correlati alla recensione
        const commento1 = new Commento({
            recensione: recensione._id,
            autore: utente._id,
            testo: "Grazie per la recensione!",
        });

        const commento2 = new Commento({
            recensione: recensione._id,
            autore: utente._id,
            testo: "Mi piace molto questa recensione.",
        });

        await Commento.insertMany([commento1, commento2]);

        const utenteSeguito = new Utente({
            name: "Don Joeh",
            email: "donjoe@example.com",
            password: "password123",
        });

        await utenteSeguito.save();

        // Ritorna i dati di prova che potrebbero essere utili nei test
        return {
            utente,
            utenteSeguito,
            libro1,
            libro2,
            recensione,
            commento1,
            commento2,
            clearPassword

        };
    } catch (error) {
        console.error("Errore durante la creazione dei dati di prova:", error);
        throw error;
    }
}

async function testBefore() {
    try {
        // Rimozione dei documenti dal modello Recensione
        await Recensione.deleteMany({});
        // Rimozione dei documenti dal modello Commento
        await Commento.deleteMany({});
        // Rimozione dei documenti dal modello Libro
        await Libro.deleteMany({});
        // Rimozione dei documenti dal modello Utente
        await Utente.deleteMany({});
        // Rimozione dei token scaduti
        await invalidTokens.deleteMany({});
        console.log("Preparazione del database.");
    } catch (error) {
        console.error("Errore durante la preparazione dei dati di prova:", error);
        throw error;
    }
}

async function testAfter() {
    try {
        // Rimozione dei documenti dal modello Recensione
        await Recensione.deleteMany({});
        // Rimozione dei documenti dal modello Commento
        await Commento.deleteMany({});
        // Rimozione dei documenti dal modello Libro
        await Libro.deleteMany({});
        // Rimozione dei documenti dal modello Utente
        await Utente.deleteMany({});
        // Rimozione dei token scaduti
        await invalidTokens.deleteMany({});
        console.log("Dati di prova rimossi con successo dal database.");
    } catch (error) {
        console.error("Errore durante la rimozione dei dati di prova:", error);
        throw error;
    }
}

module.exports = { setupData, testBefore, testAfter }

