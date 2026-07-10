import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQ057Zbh3rNOseMJO9NV0rAvit0uMVmX0",
  authDomain: "lista-aurora-elis.firebaseapp.com",
  projectId: "lista-aurora-elis",
  storageBucket: "lista-aurora-elis.firebasestorage.app",
  messagingSenderId: "921516765933",
  appId: "1:921516765933:web:75103d68b6a185dd2092e4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);