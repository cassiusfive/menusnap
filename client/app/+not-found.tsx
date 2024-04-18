import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Redirect } from "expo-router";

export default function NotFoundScreen() {
    return (
        <>
            <Redirect href="/explore" />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: "#2e78b7",
    },
});
