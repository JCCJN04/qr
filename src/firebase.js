// Importa las funciones que necesitas desde los SDKs que necesitas
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa Firestore
import { getStorage } from "firebase/storage"; // Importa Storage
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase para tu aplicación web
const firebaseConfig = {
  apiKey: "AIzaSyCLwOIWqjZ3guXy_PSzOTj_MQZsvueoId0",
  authDomain: "prueba-604fc.firebaseapp.com",
  projectId: "prueba-604fc",
  storageBucket: "prueba-604fc.appspot.com",
  messagingSenderId: "288802089902",
  appId: "1:288802089902:web:4fcda1db4968e6cab4763f",
  measurementId: "G-R9RGV7SRGC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Storage
const storage = getStorage(app); // Agrega esta línea para Storage

// Inicializa Analytics
const analytics = getAnalytics(app);

// Exporta db y storage para usarlos en otros archivos
export { db, storage };
