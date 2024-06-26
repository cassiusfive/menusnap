import * as React from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";

import { Link, useRouter } from "expo-router";

const Register = () => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");

    const router = useRouter();

    // start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress,
                password,
            });
            router.replace("/home");
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <View style={styles.containerBox}>
            <View>
                <Text style={styles.helpText}>Create your account</Text>
                <View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={firstName}
                        placeholder="First Name..."
                        onChangeText={(firstName) => setFirstName(firstName)}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={lastName}
                        placeholder="Last Name..."
                        onChangeText={(lastName) => setLastName(lastName)}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email..."
                        onChangeText={(email) => setEmailAddress(email)}
                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        value={password}
                        placeholder="Password..."
                        placeholderTextColor="#000"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
            </View>
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

export default Register;
