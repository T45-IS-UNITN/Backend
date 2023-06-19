const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Utente = require("../models/Utente").Utente;
const Amministratore = require("../models/Utente").Amministratore;
const { verifyToken } = require("../middleware/auth");
require("dotenv/config");

const checkAdmin = async (req, res, next) => {

  // per testare le API ho dovuto disabilitare dal .env il controllo
  // del chiamante di alcune API che richiedono un accesso con privi-
  // legi elevati (Admin o Moderatore).
  const IGNORE_AUTHORITY = process.env.IGNORE_AUTHORITY == "true";
  if (IGNORE_AUTHORITY) return true;

  try {
    const { userId } = req.user;

    // Verifica se l'utente è un amministratore
    const utente = await Utente.findById(userId);
    if (!(utente instanceof Amministratore)) {
      return res.status(403).json({ message: "Accesso negato" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get("/", async (req, res) => {
  try {
    const utenti = await Utente.find();
    res.json(utenti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Utente.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recuperare l'utente" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se l'utente esiste già
    const utenteEsistente = await Utente.findOne({ email });

    if (utenteEsistente) {
      return res
        .status(400)
        .json({ message: "Email già utilizzata da un altro utente" });
    }

    // Crea una nuova istanza dell'utente
    const nuovoUtente = new Utente({
      name,
      email,
      password,
    });

    // Cifratura della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Imposta la password cifrata
    nuovoUtente.password = hashedPassword;

    // Salva il nuovo utente nel database
    await nuovoUtente.save();

    res.json({ message: "Nuovo utente creato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const loggedUserId = req.body.loggedUserId;


      // utente che cancella un altro utente deve essere admin
      if (userId !== loggedUserId) {
        const admin = await Utente.findById(loggedUserId);
        const daRimuovere = await Utente.findById(userId);
        // non permetti a utenti normali di cancellare altri utenti
        // e non permetti ad admin di cancellare altri admin
        if (!(admin instanceof Amministratore) || daRimuovere instanceof Amministratore) {
          return res.status(403).json({ message: "Accesso negato" });
        }
      }

      // Trova e rimuovi l'utente dal database
      const utente = await Utente.findByIdAndDelete(userId);

      if (!utente) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      res.json({ message: "Utente cancellato con successo" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// admin: promuovi utente a moderatore
router.put("/promote/:utenteId",
  checkAdmin,
  async (req, res) => {
    try {
      const { utenteId } = req.params;

      // Verifica se l'utente esiste
      const utente = await Utente.findById(utenteId);
      if (!utente) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      // Aggiorna il ruolo dell'utente a "moderatore"
      utente.ruolo = "moderatore";
      await utente.save();

      res
        .status(200)
        .json({ message: "Ruolo utente aggiornato a moderatore", utente });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// admin: revoca dei privilegi di moderatore
router.put("/declass/:utenteId",
  checkAdmin,
  async (req, res) => {
    try {
      const { utenteId } = req.params;

      // Verifica se l'utente esiste
      const utente = await Utente.findById(utenteId);
      if (!utente) {
        return res.status(404).json({ message: "Utente non trovato" });
      }

      // Verifica se l'utente è un moderatore
      if (!(utente instanceof Moderatore)) {
        return res.status(400).json({ message: "L'utente non è un moderatore" });
      }

      // Revoca il ruolo di moderatore
      const updatedUtente = await Utente.findByIdAndUpdate(
        utenteId,
        { $unset: { __t: 1 }, ruolo: "utente" },
        { new: true }
      );

      res.status(200).json({
        message: "Ruolo di moderatore revocato",
        utente: updatedUtente,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
