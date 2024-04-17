import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import React from "react";

const Index = () => {
    return (
        <View>
            <Text>Home</Text>
            <Link href="/snap/e2fcrvPOJmyt4HET5Pnt">Go to business</Link>
        </View>
    );
};

export default Index;
