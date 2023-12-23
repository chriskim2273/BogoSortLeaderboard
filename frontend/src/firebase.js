// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGnVC5Y2xw23bJzlJi59yFczLdnuEzlvY",
    authDomain: "bogoboard-c5e8d.firebaseapp.com",
    projectId: "bogoboard-c5e8d",
    storageBucket: "bogoboard-c5e8d.appspot.com",
    messagingSenderId: "835979365932",
    appId: "1:835979365932:web:ef7450c9b594be99c7cb89",
    measurementId: "G-B4X65SGP1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const analytics = getAnalytics(app);
