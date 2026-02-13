import db from "../config/dbConfig.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

   
    const adminsRef = db.collection("admins");
    const snapshot = await adminsRef.where("email", "==", email).where("password", "==", password).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Admin login successful", admin: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
