const mongoose = require("mongoose");

// Schema dell'Utente
const utenteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  libriPreferiti: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Libro",
    },
  ],
  follow: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utente",
    },
  ],
});

// Schema dell'Utente Amministratore
const amministratoreSchema = new mongoose.Schema({
  ruolo: {
    type: String,
    default: "amministratore",
  },
});

// Schema dell'Utente Moderatore
const moderatoreSchema = new mongoose.Schema({
  ruolo: {
    type: String,
    default: "moderatore",
  },
});

// Modello dell'Utente
const Utente = mongoose.model("Utente", utenteSchema);

// Modello dell'Utente Amministratore
const Amministratore = Utente.discriminator(
  "Amministratore",
  amministratoreSchema
);

// Modello dell'Utente Moderatore
const Moderatore = Utente.discriminator("Moderatore", moderatoreSchema);

module.exports = { Utente, Amministratore, Moderatore };
