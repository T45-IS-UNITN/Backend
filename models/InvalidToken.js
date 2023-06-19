const mongoose = require("mongoose");

const InvalidTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "30d", // Opzionale: imposta la scadenza del documento a 30 giorni
    },
});

const InvalidToken = mongoose.model("InvalidToken", InvalidTokenSchema);

module.exports = InvalidToken;
