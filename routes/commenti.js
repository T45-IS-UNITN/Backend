const express = require("express");
const router = express.Router();
const Commento = require("../models/Commento");
const Recensione = require("../models/Recensione");
const Utente = require("../models/Utente");
const { verifyToken, verifyRole } = require("../middleware/auth");

// commenti di una recensione
router.get("getall/:recensioneId", async (req, res) => {
  try {
    const recensioneId = req.params.recensioneId;
    const commenti = await Commento.find({ recensione: recensioneId });
    res.json(commenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// pubblica un commento
router.post("post/:recensioneId", verifyToken, async (req, res) => {
  try {
    const { contenuto, autoreId } = req.body;
    const { recensioneId } = req.params;

    // Verifica se la recensione esiste
    const recensione = await Recensione.findById(recensioneId);
    if (!recensione) {
      return res.status(404).json({ message: "Recensione non trovata" });
    }

    // Crea un nuovo commento
    const commento = new Commento({
      contenuto,
      autore: autoreId,
      recensione: recensioneId,
    });

    // Salva il commento nel database
    await commento.save();

    res
      .status(201)
      .json({ message: "Commento pubblicato con successo", commento });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// commenti dato un libro
router.get("getbookcomments/:libroId", async (req, res) => {
  try {
    const libroId = req.params.libroId;

    // Trova le recensioni relative al libro
    const recensioni = await Recensione.find({ libro: libroId });

    // Estrai gli ID delle recensioni
    const recensioniIds = recensioni.map((recensione) => recensione._id);

    // Trova i commenti relativi alle recensioni
    const commenti = await Commento.find({
      recensione: { $in: recensioniIds },
    });

    res.json(commenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// commmenti di un autore
router.get("getusercomments/:autoreId", async (req, res) => {
  try {
    const autoreId = req.params.autoreId;

    // Trova l'utente autore
    const autore = await Utente.findById(autoreId);

    if (!autore) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Trova le recensioni dell'utente autore
    const recensioni = await Recensione.find({ autore: autoreId });

    // Estrai gli ID delle recensioni
    const recensioniIds = recensioni.map((recensione) => recensione._id);

    // Trova i commenti relativi alle recensioni dell'utente autore
    const commenti = await Commento.find({
      recensione: { $in: recensioniIds },
    });

    res.json(commenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// cancella commento
router.delete(
  "remove/:commentoId",
  verifyToken,
  verifyRole("moderatore"),
  async (req, res) => {
    try {
      const commentoId = req.params.commentoId;

      // Trova il commento da cancellare
      const commento = await Commento.findById(commentoId);

      if (!commento) {
        return res.status(404).json({ message: "Commento non trovato" });
      }

      // Cancella il commento
      await commento.remove();

      res.json({ message: "Commento cancellato con successo" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
