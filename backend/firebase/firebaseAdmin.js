const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./firebase-service-account.json"); 


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "handymanapp-b6e50.firebasestorage.app",  //Bucket name
});

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = { admin, db, auth, bucket };
