import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "../services/firebase";

const auth = getAuth(app);

const History = () => {
    const [transactions, setTransactions] = useState([]);

    const { getToken } = useAuth();
    const getTransactions = async () => {
        const token = await getToken({ template: "integration_firebase" });
        const userCredentials = await signInWithCustomToken(auth, token || "");
        console.log("User:", userCredentials.user);
    };

    useEffect(() => {
        getTransactions();
    }, []);

    return <View></View>;
};

export default History;
