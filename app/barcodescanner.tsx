import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

export default function BarcodeScanner() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [data, setData] = useState<string | null>(null);
    // const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        setData(data);
        alert(`Mã vạch có kiểu ${type} và dữ liệu là: ${data}`);
    };

    if (hasPermission === null) {
        return <Text>Đang yêu cầu quyền truy cập camera...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Không có quyền truy cập camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    {scanned && (
                        <Button title="Quét lại" onPress={() => setScanned(false)} />
                    )}
                    {data && <Text style={styles.barcodeData}>Dữ liệu mã vạch: {data}</Text>}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    barcodeData: {
        fontSize: 16,
        color: 'blue',
        marginTop: 20,
    },
});
