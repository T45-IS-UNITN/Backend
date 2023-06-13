const mongoose = require("mongoose");

const recensioneSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: true,
  },
  contenuto: {
    type: String,
    required: true,
  },
  voto: {
    type: Number,
    required: true,
  },
  autore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utente",
    required: true,
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Libro",
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

const Recensione = mongoose.model("Recensione", recensioneSchema);

module.exports = Recensione;
