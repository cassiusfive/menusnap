import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCFq_mZOScJwWdqhOL98uPbLjD7-njuFys",
    authDomain: "snapmenu-meow.firebaseapp.com",
    projectId: "snapmenu-meow",
    storageBucket: "snapmenu-meow.appspot.com",
    messagingSenderId: "203685616343",
    appId: "1:203685616343:web:01da3939e00c900899ae92",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
