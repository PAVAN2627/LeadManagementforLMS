import admin from "firebase-admin";
import serviceAccount from "../firebaseKey.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log(" Firebase Firestore initialized");
}

const db = admin.firestore();
export default db;
