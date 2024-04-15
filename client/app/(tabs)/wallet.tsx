import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { auth, db } from "../services/firebase";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";

type Transaction = {
    business_id: string;
    user_id: string;
    amount: number;
    time: string;
};

const Wallet = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const { getToken } = useAuth();
    const getTransactions = async () => {
        const uid = auth.currentUser!.uid;
        const transactionsQuery = query(
            collection(db, "transactions"),
            where("user_id", "==", uid),
        );
        const querySnapshot = await getDocs(transactionsQuery);
        const transactionsData = querySnapshot.docs.map(
            (doc) => doc.data() as Transaction,
        );
        setTransactions(transactionsData);
    };

    useEffect(() => {
        getTransactions().catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <View>
            {transactions.map((transaction, index) => {
                return <Text key={index}>{transaction.amount}</Text>;
            })}
        </View>
    );
};

export default Wallet;
