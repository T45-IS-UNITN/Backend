const express = require("express");
const router = express.Router();
const Utente = require("../models/Utente").Utente;

// Aggiungi un utente alla lista degli utenti seguiti
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const utenteSeguitoId = req.body.utenteSeguitoId;

    if (userId == utenteSeguitoId)
      return res.status(500).json({ message: "Impossibile seguirsi da soli" })

    const utente = await Utente.findById(userId);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    if (utente.follow.includes(utenteSeguitoId)) {
      return res.status(400).json({
        message: "L'utente è già presente nella lista degli utenti seguiti",
      });
    }

    utente.follow.push(utenteSeguitoId);
    await utente.save();

    res.json({ message: "Utente aggiunto alla lista degli utenti seguiti" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni tutti i preferiti di un utente
router.get("/:userId/preferiti", async (req, res) => {
  try {
    const userId = req.params.userId;

    const utente = await Utente.findById(userId).populate("libriPreferiti");

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json({ preferiti: utente.libriPreferiti });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rimuovi un utente dalla lista degli utenti seguiti
router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const utenteSeguitoId = req.body.utenteSeguitoId;

    const utente = await Utente.findById(userId);

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const index = utente.follow.indexOf(utenteSeguitoId);

    if (index === -1) {
      return res.status(400).json({
        message: "L'utente non è presente nella lista degli utenti seguiti",
      });
    }

    utente.follow.splice(index, 1);
    await utente.save();

    res.json({ message: "Utente rimosso dalla lista degli utenti seguiti" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
