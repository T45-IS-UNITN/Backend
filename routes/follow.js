const express = require("express");
const router = express.Router();
const Utente = require("../models/Utente");

// Aggiungi un utente alla lista degli utenti seguiti
router.post("/follow/add/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const utenteSeguitoId = req.body.utenteSeguitoId;

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

// Rimuovi un utente dalla lista degli utenti seguiti
router.delete("/follow/remove/:userId/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const utenteSeguitoId = req.nody.utenteSeguitoId;

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
