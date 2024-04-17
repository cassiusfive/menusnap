import { Text, View } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
    doc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import Card from "@/shared/Card";

type Item = {
    name: String;
    price: number;
};

const Business = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [businessName, setBusinessName] = useState<String>("Loading...");
    const [items, setItems] = useState<Item[]>([]);

    const getBusinessInfo = async () => {
        const businessRef = doc(db, "businesses", id);
        const businessSnapshot = await getDoc(businessRef);
        const business = businessSnapshot.data();
        if (!business) return;

        const itemsQuery = query(
            collection(db, "items"),
            where("business_id", "==", id),
        );
        const itemsSnapshot = await getDocs(itemsQuery);
        const itemsData = itemsSnapshot.docs.map((doc) => doc.data() as Item);

        setItems(itemsData);
        setBusinessName(business.name);
    };

    useEffect(() => {
        getBusinessInfo().catch((err) => {
            console.log(err);
        });
    }, []);

    return (
        <View>
            <Stack.Screen options={{ title: businessName as string }} />
        </View>
    );
};

export default Business;
