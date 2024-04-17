import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const Snap = () => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            setCapturedImage(photo.uri);
            sendImage(photo.uri);

            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;
            const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

            const base64ImageData = await FileSystem.readAsStringAsync(
                photo.uri,
                {
                    encoding: FileSystem.EncodingType.Base64,
                },
            );

            const requestData = {
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
                    },
                ],
            };

            const apiResponse = await axios.post(apiURL, requestData);
            console.log(
                apiResponse.data.responses[0].textAnnotations[0].description,
            );
        } else {
            console.log("Camera ref is not set.");
        }
    };

    const sendImage = (imageUri: string) => {
        // Your code to send the image to the 'sendImage' function
        console.log("Sending image:", imageUri);
        // Call your sendImage function here passing imageUri as an argument
    };

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type}
                ref={(ref) => (cameraRef.current = ref)}
            />
            <Button title="Take Picture" onPress={handleTakePicture} />
            {/* {capturedImage && (
                <Image
                    source={{ uri: capturedImage }}
                    style={styles.imagePreview}
                />
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        width: "100%",
        height: "80%",
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 10,
    },
});

export default Snap;
