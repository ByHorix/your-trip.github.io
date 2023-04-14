// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyBVpyrqLtV1hjs51gnxKVr0VMe_btpYkho",
    authDomain: "your-trips-a2a5e.firebaseapp.com",
    projectId: "your-trips-a2a5e",
    storageBucket: "your-trips-a2a5e.appspot.com",
    messagingSenderId: "296199889974",
    appId: "1:296199889974:web:50f68b3d90fb27f0ace497"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);