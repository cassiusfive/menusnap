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
    business_name: string;
    business_id: string;
    user_id: string;
    amount: number;
    time: any;
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
        console.log(transactions);

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
            {/* the test acc im on didnt have any data history so i made some dummy vals, styled it, and switched it with the actual transaction.data */}
            <Text style={styles.header}>Latest Transactions</Text>
            {transactions.map((transaction, index) => {
                return (
                    <Card key={index} style={styles.horizontalBox}>
                        {/* this is the green color box rounded */}
                        <Card style={styles.littleBox}>
                            <Card style={styles.greenBox}></Card>
                            {/* vertical */}
                            <Card style={styles.verticalBox}>
                                {/* bold this */}
                                <Text style={styles.boldText}>
                                    {transaction.business_name}
                                </Text>
                                <Text>Corvallis, OR</Text>
                                <Text>
                                    {transaction.time.toDate().toString()}
                                </Text>
                            </Card>
                        </Card>
                        <Text style={styles.moneyText}>
                            ${transaction.amount}
                        </Text>
                    </Card>
                );
            })}

            {/* test dummy vals */}
            {/* horizontal */}
            {/* <Card style={styles.horizontalBox}> */}
            {/* this is the green color box rounded */}
            {/* <Card style={styles.littleBox}> */}
            {/* <Card style={styles.greenBox}></Card> */}
            {/* vertical */}
            {/* <Card style={styles.verticalBox}> */}
            {/* bold this */}
            {/* <Text style={styles.boldText}>Local Boyz</Text> */}
            {/* <Text>Corvallis, OR</Text> */}
            {/* <Text>4/17/24</Text> */}
            {/* </Card> */}
            {/* </Card> */}
            {/* <Text style={styles.moneyText}>$20</Text> */}
            {/* </Card> */}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "center",
    },
    horizontalBox: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: 0,
        paddingBottom: 0,
    },
    littleBox: {
        flexDirection: "row",
        flexWrap: "wrap",
        shadowOpacity: 0,
        margin: 0,
        padding: 0,
    },
    verticalBox: {
        shadowOpacity: 0,
        margin: 0,
        padding: 0,
        paddingLeft: 15,
    },
    greenBox: {
        backgroundColor: "#27ae60",
        width: 40,
        height: 40,
        shadowOpacity: 0,
        padding: 0,
        margin: 0,
        alignSelf: "center",
    },
    // maybe put like a checkmark wthhin the grreenbox
    //have a selection of different colors and have a random number generator tha select one of them
    boldText: {
        fontWeight: "bold",
    },
    moneyText: {
        paddingTop: 10,
    },
});

export default Wallet;
