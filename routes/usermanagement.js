const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Utente, Amministratore } = require("../models/utente");
const { verifyToken } = require("../middleware/auth");

router.post("/nuovoUtente", async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // Verifica se l'utente esiste già
    const utenteEsistente = await Utente.findOne({ email });

    if (utenteEsistente) {
      return res
        .status(400)
        .json({ message: "Email già utilizzata da un altro utente" });
    }

    // Crea una nuova istanza dell'utente
    const nuovoUtente = new Utente({
      nome,
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

router.delete("/cancellaUtente/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedUserId = req.userId;

    if (userId !== loggedUserId) {
      return res
        .status(403)
        .json({ message: "Non sei autorizzato a cancellare questo utente" });
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
router.put("/utenti/:utenteId/moderatore", checkAdmin, async (req, res) => {
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
router.put(
  "/utenti/:utenteId/revocaModeratore",
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
        return res
          .status(400)
          .json({ message: "L'utente non è un moderatore" });
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
  }
);

const checkAdmin = async (req, res, next) => {
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

module.exports = router;
