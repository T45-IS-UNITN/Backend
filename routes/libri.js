const express = require("express");
const router = express.Router();
const Libro = require("../models/Libro");
const Recensione = require("../models/Recensione");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Aggiungi un nuovo libro
router.post("/", async (req, res) => {
  try {
    const { titolo, autore, annoPubblicazione, generi } = req.body;
    const libro = new Libro({
      titolo,
      autore,
      annoPubblicazione,
      generi,
    });
    const nuovoLibro = await libro.save();
    res.status(201).json(nuovoLibro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// aggiungi array di libri[]
router.post("/add/list", async (req, res) => {
  try {
    const libri = req.body.libri;

    // Verifica che l'array di libri sia presente nella richiesta
    if (!libri || !Array.isArray(libri)) {
      return res.status(400).json({ message: "Array di libri mancante" });
    }

    // Aggiungi i libri all'array di documenti da inserire
    const libriDaInserire = libri.map((libro) => {
      return new Libro(libro);
    });

    // Inserisci i libri nel database
    const libriInseriti = await Libro.insertMany(libriDaInserire);

    res.status(201).json(libriInseriti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni tutti i libri
router.get("/", async (req, res) => {
  try {
    const libri = await Libro.find();
    res.json(libri);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni un libro specifico per ID
router.get("/:libroId", async (req, res) => {
  try {
    const libroId = req.params.libroId;
    const libro = await Libro.findById(libroId);
    if (!libro) {
      return res.status(404).json({ message: "Libro non trovato" });
    }
    res.json(libro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aggiungi una recensione a un libro
router.post("/:libroId/recensioni", verifyToken, async (req, res) => {
  try {
    const libroId = req.params.libroId;
    const { titolo, contenuto, voto, autore } = req.body;

    const libro = await Libro.findById(libroId);
    if (!libro) {
      return res.status(404).json({ message: "Libro non trovato" });
    }

    const recensione = new Recensione({
      titolo,
      contenuto,
      voto,
      autore,
      libro: libroId,
    });

    const nuovaRecensione = await recensione.save();

    libro.recensioni.push(nuovaRecensione._id);
    await libro.save();

    res.status(201).json(nuovaRecensione);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ottieni tutte le recensioni di un libro
router.get("/:libroId/recensioni", async (req, res) => {
  try {
    const libroId = req.params.libroId;
    const recensioni = await Recensione.find({ libro: libroId });
    res.json(recensioni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
