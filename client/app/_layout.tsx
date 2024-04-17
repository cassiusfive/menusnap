import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { app } from "./services/firebase";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const auth = getAuth(app);

const tokenCache = {
    async getToken(key: string) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

const InitialLayout = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const loginFirebase = async () => {
        const token = await getToken({ template: "integration_firebase" });
        await signInWithCustomToken(auth, token || "");
    };

    useEffect(() => {
        if (!isLoaded) return;

        const inTabsGroup = segments[0] === "(tabs)";

        console.log("User changed: ", isSignedIn);
        if (isSignedIn) {
            loginFirebase();
        }

        if (isSignedIn && !inTabsGroup) {
            router.replace("/explore");
        } else if (!isSignedIn) {
            router.replace("/login");
        }
    }, [isSignedIn]);

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, title: "Snap!" }}
            />
        </Stack>
    );
};

const RootLayout = () => {
    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY!}
            tokenCache={tokenCache}
        >
            <InitialLayout />
        </ClerkProvider>
    );
};

export default RootLayout;
