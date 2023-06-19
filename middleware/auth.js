const jwt = require("jsonwebtoken");
const invalidTokens = require("../models/InvalidToken")
require("dotenv/config");

// Nel tuo frontend, assicurati di includere il token JWT nelle richieste POST per creare commenti e recensioni. Il token dovrebbe essere inviato nell'intestazione "Authorization" come "Bearer [token]".

// Funzione per generare il token JWT
function generateToken(userId) {
  const payload = { userId };
  const options = { expiresIn: "1d" };
  const secret = "GruppoT45IS"; // Modifica con il tuo segreto per la firma del token
  const token = jwt.sign(payload, secret, options);
  return token;
}

// Middleware per verificare il token JWT
function verifyToken(req, res, next) {

  const IGNORE_AUTHORITY = process.env.IGNORE_AUTHORITY == "true";
  if (IGNORE_AUTHORITY) {
    // Salta il controllo del token
    req.userId = null; // Imposta userId a null per identificare l'assenza di autenticazione
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token di autenticazione mancante" });
  }

  try {
    const secret = "GruppoT45IS";
    const decoded = jwt.verify(token, secret);

    // Verifica se la firma del token è presente nell'elenco delle firme invalidate
    if (invalidTokens.includes(decoded.signature)) {
      return res.status(401).json({ message: "Token di autenticazione scaduto" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token di autenticazione non valido" });
  }
}

function verifyRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      return res
        .status(403)
        .json({ message: "Non sei autorizzato a svolgere questa azione" });
    }
    next();
  };
}

module.exports = { generateToken, verifyToken, verifyRole };
