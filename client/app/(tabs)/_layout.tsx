import React from "react";
import { Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="history" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: "Snap!",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="camera" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabLayout;
