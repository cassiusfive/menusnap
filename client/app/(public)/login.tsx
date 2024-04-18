import React from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const Login = () => {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            console.log(err);
        }
    };
    return (
        <View style={styles.containerBox}>
            <Text style={styles.snapMenuText}>Menusnap</Text>
            <View style={styles.containerBox}>
                <Text style={styles.helpText}>Login to your account</Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Email..."
                    onChangeText={(emailAddress) =>
                        setEmailAddress(emailAddress)
                    }
                />
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder="Password..."
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity onPress={onSignInPress} style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <Text style={styles.helpText}>Don't have an account yet?</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace("/register")}
            >
                <Text style={styles.buttonText}>Create account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBox: {
        marginTop: 150,
    },
    snapMenuText: {
        fontSize: 50,
        // fontFamily: 'Verdana',
        fontWeight: "800",
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#333",
        margin: 10,
    },
    button: {
        backgroundColor: "#007bff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        margin: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    helpText: {
        color: "#333",
        textAlign: "center",
    },
    returnButton: {
        padding: 10,
        textAlign: "center",
    },
});

export default Login;
