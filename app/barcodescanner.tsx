import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Alert, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import GetProductInformationById, { Product } from '@/service/GetProductInformationById';
import GetLocationInformationByCode, { LocationData } from '@/service/GetLocationInformationById';
import ProductListLocationDetail from '@/compoments/ProductListLocationDetail';
import LocationInformationDetail from '@/compoments/LocationInformationDetail';

export default function BarcodeScanner() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [data, setData] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [location, setLocation] = useState<LocationData | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (data) {
            let index = data.lastIndexOf('.');
            let typeInfo = data.substring(index + 1);
            const key = data.substring(0, index);
            switch (typeInfo) {
                case 'product':
                    GetProductInformationById(key)
                        .then((res) => {
                            setProduct(res);
                        })
                        .catch((err) => {
                            console.error(err);
                            Alert.alert('Lỗi', err.message);
                        });
                    break;
                case 'location':
                    GetLocationInformationByCode(key)
                        .then((res) => {
                            setLocation(res);
                        })
                        .catch((err) => {
                            console.error(err);
                            Alert.alert('Lỗi', err.message);
                        });
                    break;
                default:
                    Alert.alert('Lỗi', 'Mã QR không hợp lệ');
                    break;
            }
        }
    }, [data])

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setData(data);
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
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ flex: 1, width: '100%' }}
            >
                {
                    data && product &&
                    <View style={styles.overlay}>
                        <ProductListLocationDetail product={product} />
                    </View>
                }
                {
                    data && location &&
                    <View style={styles.overlay}>
                        <LocationInformationDetail location={location} />
                    </View>
                }
                {scanned && data && (
                    <Button title="Quét lại" onPress={() => {
                        setScanned(false);
                        setData(null);
                        setProduct(null);
                        setLocation(null);
                    }} />
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: 10,
    },
});
