const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: true,
  },
  autore: {
    type: String,
    required: true,
  },
  annoPubblicazione: {
    type: Number,
    required: true,
  },
  generi: [
    {
      type: String,
    },
  ],
  recensioni: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recensione",
    },
  ],
});

const Libro = mongoose.model("Libro", libroSchema);

module.exports = Libro;
