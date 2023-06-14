const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");
const Utente = require("../models/Utente");

router.get("/libri", async (req, res) => {
  try {
    const userId = req.query.userId;

    // Trova l'utente con l'ID specificato
    const utente = await Utente.findById(userId);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Ottieni i generi dei libri preferiti dell'utente
    const generiPreferiti = utente.libriPreferiti.map((libro) => libro.genere);

    // Calcola il numero minimo di generi che devono corrispondere per il feed
    const minGeneriCorrispondenti = Math.ceil(generiPreferiti.length / 2);

    // Trova i libri nel feed che corrispondono ai generi preferiti dell'utente
    const libriConsigliati = await Libro.find({
      genere: { $in: generiPreferiti },
    })
      .limit(10) // Limita i risultati a 10 libri (puoi impostare il valore desiderato)
      .exec();

    // Filtra ulteriormente i libri per garantire che abbiano almeno il 50% di generi in comune
    const libriFiltrati = libriConsigliati.filter((libro) => {
      const generiLibro = libro.genere;
      const generiComuni = generiPreferiti.filter((genere) =>
        generiLibro.includes(genere)
      );
      return generiComuni.length >= minGeneriCorrispondenti;
    });

    res.json(libriFiltrati);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recensioni", async (req, res) => {
  try {
    const { userId } = req.query;

    // Determina se l'utente è autenticato o meno
    const isUserAuthenticated = !!userId;

    // Crea un array vuoto per contenere le recensioni
    let recensioni = [];

    if (isUserAuthenticated) {
      // Utente autenticato
      const utente = await Utente.findById(userId);

      if (!utente) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      const generiPreferiti = utente.libriPreferiti.map(
        (libro) => libro.genere
      );

      // Trova le recensioni che hanno almeno il 50% dei generi compatibili
      recensioni = await Recensione.find({
        "libro.genere": { $in: generiPreferiti },
        autore: { $in: utente.follow },
      }).sort({ data: -1 });
    } else {
      // Utente non autenticato
      recensioni = await Recensione.find().sort({ data: -1 }).limit(10);
    }

    res.json(recensioni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
