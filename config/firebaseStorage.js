import admin from 'firebase-admin';
import dotenv from "dotenv";
import serviceAccount from '../creditial.json' assert  {type: 'json'};

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = admin.storage().bucket();

export default storage;