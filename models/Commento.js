const mongoose = require("mongoose");

const commentoSchema = new mongoose.Schema({
  testo: {
    type: String,
    required: true,
  },
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utente",
    required: true,
  },
  recensione: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recensione",
    required: true,
  },
  dataCreazione: {
    type: Date,
    default: Date.now,
  },
});

const Commento = mongoose.model("Commento", commentoSchema);

module.exports = Commento;
