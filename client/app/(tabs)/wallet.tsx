import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import Card from "@/shared/Card";

type Transaction = {
    business_id: string;
    user_id: string;
    amount: number;
    time: string;
};

type TransactionCardProps = { transaction: Transaction };

const TransactionCard = (props: TransactionCardProps) => {
    return <Card></Card>;
};

const Wallet = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<Number>(0);

    const getWalletInfo = async () => {
        const uid = auth.currentUser!.uid;

        const transactionsQuery = query(
            collection(db, "transactions"),
            where("user_id", "==", uid),
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map(
            (doc) => doc.data() as Transaction,
        );
        setTransactions(transactionsData);

        const balanceRef = doc(db, "users", uid);
        const balanceSnapshot = await getDoc(balanceRef);
        setBalance(balanceSnapshot.data()!.balance);
    };

    useEffect(() => {
        getWalletInfo().catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <Card
                style={{
                    backgroundColor: "#27ae60",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                }}
            >
                <Text
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 40,
                    }}
                >
                    ${balance.toFixed(2)}
                </Text>
            </Card>
            <Text style={styles.header}>Latest Transactions</Text>
            {transactions.map((transaction, index) => {
                return (
                    <TransactionCard
                        key={index}
                        transaction={transaction}
                    ></TransactionCard>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
    },
});

export default Wallet;
