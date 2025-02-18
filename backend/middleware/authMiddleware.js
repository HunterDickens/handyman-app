const { auth } = require("../firebase/firebaseAdmin");

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token.split(" ")[1]);
    req.user = decodedToken; // Attach Firebase user data to request
    next();
  } catch (error) {
    console.error("Firebase Token Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyFirebaseToken };
