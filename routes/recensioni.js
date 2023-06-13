const express = require("express");
const router = express.Router();
const Recensione = require("../models/Recensione");
const { verifyToken, verifyRole } = require("../middleware/auth");

// pubblica una recensione
router.post("/recensioni", verifyToken, async (req, res) => {
  try {
    const { titolo, contenuto, voto, autore, libro } = req.body;
    const recensione = new Recensione({
      titolo,
      contenuto,
      voto,
      autore,
      libro,
    });
    const nuovaRecensione = await recensione.save();
    res.status(201).json(nuovaRecensione);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// prende tutte le recensioni
router.get("/recensioni", async (req, res) => {
  try {
    const recensioni = await Recensione.find();
    res.json(recensioni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// recensioni dato il libro
router.get("/recensioni/:libroId", async (req, res) => {
  try {
    const libroId = req.params.libroId;
    const recensioni = await Recensione.find({ libro: libroId });
    res.json(recensioni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// recensioni dato l'utente autore
router.get("/recensioni/:utenteId", async (req, res) => {
  try {
    const utenteId = req.params.utenteId;
    const recensioni = await Recensione.find({ autore: utenteId });
    res.json(recensioni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// cancella recensione
router.delete(
  "/recensioni/:recensioneId",
  verifyToken,
  verifyRole("moderatore"),
  async (req, res) => {
    try {
      const recensioneId = req.params.recensioneId;

      // Trova la recensione da cancellare
      const recensione = await Recensione.findById(recensioneId);

      if (!recensione) {
        return res.status(404).json({ message: "Recensione non trovata" });
      }

      // Cancella la recensione
      await recensione.remove();

      res.json({ message: "Recensione cancellata con successo" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
