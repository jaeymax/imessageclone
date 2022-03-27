// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4Ho6TmmnPSMRbs__mstEnzl1xicf_CTo",
  authDomain: "react-messenger-89827.firebaseapp.com",
  projectId: "react-messenger-89827",
  // databaseURL:"http://"
  storageBucket: "react-messenger-89827.appspot.com",
  messagingSenderId: "756370506700",
  appId: "1:756370506700:web:6f5e0023b9fd45b3b3d369"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage};