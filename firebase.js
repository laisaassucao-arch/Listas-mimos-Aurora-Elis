import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvAXVqH0L0lnzb20p3RIvosjx_in6Uw0b0",
  authDomain: "mimos-da-aurora.firebaseapp.com",
  projectId: "mimos-da-aurora",
  storageBucket: "mimos-da-aurora.firebasestorage.app",
  messagingSenderId: "1056970312986",
  appId: "1:1056970312986:web:7e09482e2b4770f4b5b0a3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
