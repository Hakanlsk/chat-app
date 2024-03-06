import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv6L44X7PbFDMTipy82iXuMkZP3r7Hln0",
  authDomain: "chat-application-faba1.firebaseapp.com",
  projectId: "chat-application-faba1",
  storageBucket: "chat-application-faba1.appspot.com",
  messagingSenderId: "857910859164",
  appId: "1:857910859164:web:9f17f0e5bb2849d7caa459",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB };
