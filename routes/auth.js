const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Utente = require("../models/Utente").Utente;
const { generateToken, verifyToken } = require("../middleware/auth");

// Endpoint per il login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste nel database
    const user = await Utente.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Verifica la password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password non valida" });
    }

    // Genera il token di autenticazione
    const token = generateToken(user._id);

    res.json({ "token": token, "userId":user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", verifyToken, (req, res) => {
  try {
    // Ottieni il token dalla richiesta
    const token = req.headers.authorization.split(" ")[1];

    // Invalida il token nel server
    jwt.invalidate(token);

    res.json({ message: "Logout effettuato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
