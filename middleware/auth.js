const jwt = require("jsonwebtoken");

// Nel tuo frontend, assicurati di includere il token JWT nelle richieste POST per creare commenti e recensioni. Il token dovrebbe essere inviato nell'intestazione "Authorization" come "Bearer [token]".

// Funzione per generare il token JWT
function generateToken(userId) {
  const payload = { userId };
  const options = { expiresIn: "1d" };
  const secret = "il_tuo_segreto"; // Modifica con il tuo segreto per la firma del token
  const token = jwt.sign(payload, secret, options);
  return token;
}

// Middleware per verificare il token JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token di autenticazione mancante" });
  }

  try {
    const secret = "il_tuo_segreto"; // Modifica con il tuo segreto per la firma del token
    const decoded = jwt.verify(token, secret);
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
