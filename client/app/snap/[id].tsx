import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions,
    Animated,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    doc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    Timestamp,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import "firebase/firestore";
import Card from "@/shared/Card";
import { router } from "expo-router";

type Item = {
    name: string;
    description: string;
    price: number;
};

type MenuItemProps = {
    item: Item;
    quantity: number;
    addToCart: () => void;
    removeFromCart: () => void;
};

const MenuItem = (props: MenuItemProps) => {
    const handlePress = (event: any) => {
        const x = event.nativeEvent.locationX;
        if (x < Dimensions.get("window").width / 2) {
            props.removeFromCart();
        } else {
            props.addToCart();
        }
    };
    return (
        <Pressable onPress={handlePress}>
            <Card style={{ padding: 16, gap: 5 }}>
                <View style={styles.itemLabelsContainer}>
                    <Text style={styles.itemHeader}>{props.item.name}</Text>
                    {props.quantity > 0 ? (
                        <View style={styles.quantityLabelContainer}>
                            <Text style={styles.quantityLabel}>
                                +{props.quantity}
                            </Text>
                        </View>
                    ) : null}
                    <Text style={styles.itemPrice}>
                        ${props.item.price.toFixed(2)}
                    </Text>

                </View>
                <Text style={{ padding: 0 }}>{props.item.description}</Text>
                <View pointerEvents="none" 
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingTop: 0,
                    paddingBottom: 0,
                }}>
                    <Pressable onPress={handlePress}>
                        <Card style={{ gap: 5, shadowOpacity: 0, margin: 0, padding: 0, backgroundColor: 'black', width: 30,height: 31, textAlign: "center", }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, margin:0, padding:0 }}>-</Text>
                        </Card>
                    </Pressable>
                    <Pressable onPress={handlePress}>
                        <Card style={{ gap: 5, shadowOpacity: 0, margin: 0, padding: 0, backgroundColor: 'black', width: 30, height: 31, textAlign: "center", }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, margin: 0, padding: 0 }}>+</Text>
                        </Card>
                    </Pressable>
                </View>
            </Card>
        </Pressable>
    );
};

const Business = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [businessName, setBusinessName] = useState<string>("Loading...");
    const [items, setItems] = useState<Item[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]);
    const [loaderString, setLoaderString] = useState<string>(
        "Fetching menu items",
    );

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

        setBusinessName(business.name);
        setItems(itemsData);
        setQuantities(new Array(itemsData.length).fill(0));
    };

    useEffect(() => {
        getBusinessInfo().catch((err) => {
            console.log(err);
        });
    }, []);

    const heightAnim = useRef(new Animated.Value(100)).current;
    const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);

    useEffect(() => {
        if (checkoutOpen) {
            Animated.timing(heightAnim, {
                toValue: 500,
                duration: 400,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(heightAnim, {
                toValue: 100,
                duration: 400,
                useNativeDriver: false,
            }).start();
        }
    }, [checkoutOpen]);

    if (items.length === 0) {
        return (
            <>
                <Stack.Screen options={{ title: businessName }} />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator />
                    <Text style={{ margin: 24 }}>{loaderString}</Text>
                </View>
            </>
        );
    }

    const updateQuantity = (num: number, index: number) => {
        const newQuantities = [...quantities];
        let newQuantity = newQuantities[index] + num;
        if (newQuantity < 0) {
            newQuantity = 0;
        }
        newQuantities[index] = newQuantity;
        setQuantities(newQuantities);
    };

    const toggleOpen = () => {
        setCheckoutOpen(!checkoutOpen);
    };

    const subtotal = items.reduce(
        (sum, item, index) => sum + item.price * quantities[index],
        0,
    );

    const checkout = async () => {
        const transactionData = {
            business_id: id,
            user_id: auth.currentUser!.uid,
            business_name: businessName,
            amount: subtotal,
            time: Timestamp.now(),
        };
        setLoaderString("Processing transaction");
        setItems([]);
        const transactionsCollection = collection(db, "transactions");
        const transaction = await addDoc(
            transactionsCollection,
            transactionData,
        );
        const balanceRef = doc(db, "users", auth.currentUser!.uid);
        const balanceSnapshot = await getDoc(balanceRef);
        const newBalance = await updateDoc(balanceRef, {
            balance: balanceSnapshot.data()!.balance - subtotal,
        });
        router.replace("/wallet");
    };

    return (
        <>
            <Stack.Screen options={{ title: businessName as string }} />

            <ScrollView style={{ padding: 10 }}>
                {items.length
                    ? items.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                item={item}
                                quantity={quantities[index]}
                                addToCart={() => {
                                    updateQuantity(1, index);
                                }}
                                removeFromCart={() => {
                                    updateQuantity(-1, index);
                                }}
                            />
                        );
                    })
                    : null}
            </ScrollView>
            <Animated.View
                style={[styles.peepingContainer, { height: heightAnim }]}
            >
                <Pressable
                    onPress={toggleOpen}
                    style={{
                        borderRadius: 10,
                        height: 38,
                        justifyContent: "center",
                        marginBottom: 20,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "white",
                            paddingTop: 20,
                            paddingBottom: 50,
                        }}
                    >
                        Order Summary
                    </Text>
                </Pressable>
                <Text
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 20,
                        color: "white",
                        paddingTop: 50,
                        paddingBottom: 50,
                    }}
                >
                    Subtotal: ${subtotal.toFixed(2)}
                </Text>
                <Pressable
                    onPress={checkout}
                    style={{
                        backgroundColor: "black",
                        padding: 16,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "white",
                        }}
                    >
                        Complete Purchase!
                    </Text>
                </Pressable>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    quantityLabelContainer: {
        marginHorizontal: 12,
        backgroundColor: "black",
        paddingHorizontal: 8,
        borderRadius: 5,
        alignSelf: "center",
    },
    quantityLabel: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    itemLabelsContainer: {
        width: "auto",
        flexDirection: "row",
        alignItems: "baseline",
    },
    itemHeader: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "left",
    },
    itemPrice: {
        color: "#27ae60",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "right",
        flex: 1,
    },
    peepingContainer: {
        backgroundColor: "#27ae60",
        height: 100,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
});

export default Business;
