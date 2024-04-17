import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions,
} from "react-native";
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
            </Card>
        </Pressable>
    );
};

const Business = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [businessName, setBusinessName] = useState<String>("Loading...");
    const [items, setItems] = useState<Item[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]);

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

    if (items.length === 0) {
        return (
            <>
                <Stack.Screen options={{ title: "Loading..." }} />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator />
                    <Text style={{ margin: 24 }}>Getting menu items</Text>
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
            <View style={styles.peepingContainer}></View>
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
    },
});

export default Business;
