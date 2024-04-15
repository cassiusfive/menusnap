import { initializeApp, getApp } from "firebase/app";
import {
    initializeAuth,
    getAuth,
    getReactNativePersistence,
} from "firebase/auth";
import { ReactNativeAsyncStorage } from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCFq_mZOScJwWdqhOL98uPbLjD7-njuFys",
    authDomain: "snapmenu-meow.firebaseapp.com",
    projectId: "snapmenu-meow",
    storageBucket: "snapmenu-meow.appspot.com",
    messagingSenderId: "203685616343",
    appId: "1:203685616343:web:01da3939e00c900899ae92",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
