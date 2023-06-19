const express = require("express");
const router = express.Router();
const Utente = require("../models/Utente").Utente;
const Libro = require("../models/Libro");

router.post("/", async (req, res) => {
  try {
    const { userId, libroId } = req.body;

    // Trova l'utente corrispondente
    const utente = await Utente.findById(userId);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Trova il libro da aggiungere ai preferiti
    const libro = await Libro.findById(libroId);

    if (!libro) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    // Verifica se il libro è già presente nella lista dei preferiti dell'utente
    const libroPresente = utente.libriPreferiti.includes(libroId);

    if (libroPresente) {
      return res
        .status(400)
        .json({ message: "Il libro è già presente nella lista dei preferiti" });
    }

    // Aggiungi il libro alla lista dei preferiti dell'utente
    utente.libriPreferiti.push(libroId);

    // Salva le modifiche all'utente
    await utente.save();

    res.json({ message: "Libro aggiunto alla lista dei preferiti" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId, libroId } = req.body;

    // Trova l'utente corrispondente
    const utente = await Utente.findById(userId);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Verifica se il libro è presente nella lista dei preferiti dell'utente
    const index = utente.libriPreferiti.indexOf(libroId);

    if (index === -1) {
      return res
        .status(400)
        .json({ message: "Il libro non è presente nella lista dei preferiti" });
    }

    // Rimuovi il libro dalla lista dei preferiti dell'utente
    utente.libriPreferiti.splice(index, 1);

    // Salva le modifiche all'utente
    await utente.save();

    res.json({ message: "Libro rimosso dalla lista dei preferiti" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Trova l'utente corrispondente
    const utente = await Utente.findById(userId).populate("libriPreferiti");

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json({ preferiti: utente.libriPreferiti });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
