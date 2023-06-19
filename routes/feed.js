const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");
const Utente = require("../models/Utente").Utente;
const Recensione = require("../models/Recensione")

router.get('/libri/:utenteId', async (req, res) => {
  try {
    const { utenteId } = req.params;

    if (!utenteId) {
      // Se l'utenteId non è fornito, restituisci una lista di 10 libri ordinati per aggiunta
      const libri = await Libro.find()
        .sort({ aggiunta: -1 })
        .limit(10);

      return res.json(libri);
    }

    // Verifica se l'utente esiste nel database
    const utente = await Utente.findById(utenteId);

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Ottieni i generi dei libri preferiti dell'utente
    const generiPreferiti = utente.libriPreferiti.map((libro) => libro.genere);

    // Trova i libri nel database che corrispondono ai generi preferiti dell'utente
    const libriConsigliati = await Libro.find({
      genere: { $in: generiPreferiti },
    }).limit(10);

    res.json(libriConsigliati);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recensioni/:utenteId', async (req, res) => {
  try {
    const { utenteId } = req.params;

    if (!utenteId) {
      // Se l'utenteId non è fornito, restituisci una lista generica delle 10 recensioni più recenti
      const recensioni = await Recensione.find()
        .sort({ data: -1 })
        .limit(10);

      return res.json(recensioni);
    }

    // Verifica se l'utente esiste nel database
    const utente = await Utente.findById(utenteId);

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Ottieni i generi dei libri preferiti dell'utente
    const generiPreferiti = utente.libriPreferiti.map((libro) => libro.genere);

    // Trova le recensioni che hanno almeno il 50% dei generi compatibili
    const recensioniConsigliate = await Recensione.find({
      'libro.genere': { $in: generiPreferiti },
    }).sort({ data: -1 });

    res.json(recensioniConsigliate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
