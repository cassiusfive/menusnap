import React from "react";
import { Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "blue",
            tabBarStyle: { height: 100 },
        }} >
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="compass" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="snap"
                options={{
                    title: "Snap!",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="camera" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: "Wallet",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="wallet" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
