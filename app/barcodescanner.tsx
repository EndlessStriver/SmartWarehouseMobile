import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Alert, Image, FlatList } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import GetProductInformationById, { Product } from '@/service/GetProductInformationById';

export default function BarcodeScanner() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [data, setData] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, [scanned]);

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
                style={StyleSheet.absoluteFillObject}
            >
                {
                    data &&
                    <View style={styles.overlay}>
                        <Image
                            style={styles.imageproduct}
                            source={{
                                uri: product?.img
                            }}
                        />
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Mã sản phẩm: </Text>
                            <Text>{product?.productCode}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Tên sản phẩm: </Text>
                            <Text>{product?.name}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Loại sản phẩm: </Text>
                            <Text>{product?.category.name}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Mô tả: </Text>
                            <Text>{product?.description}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Số lượng tồn kho: </Text>
                            <Text>{product?.productDetails[0].quantity} {product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Mã SKU: </Text>
                            <Text>{product?.productDetails[0].sku[0].skuCode}</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Trọng lượng: </Text>
                            <Text>{product?.productDetails[0].sku[0].weight} kg</Text>
                        </View>
                        <View style={styles.containerlable}>
                            <Text style={styles.lable}>Kích thước: </Text>
                            <Text>{product?.productDetails[0].sku[0].dimension} cm</Text>
                        </View>
                        <Text style={styles.lable1}>Danh Sách Vị Trí Chứa Trong Kho</Text>
                        {
                            product?.productDetails[0].sku[0].locations.length === 0 ?
                                <Text style={{ marginBottom: 10 }}>Không có vị trí chứa sản phẩm</Text>
                                :
                                <FlatList
                                    data={product?.productDetails[0].sku[0].locations}
                                    renderItem={({ item }) => (
                                        <View style={styles.containerlable}>
                                            <Text style={styles.lable}>Vị trí: </Text>
                                            <Text style={{ marginRight: 10 }}>{item.locationCode}</Text>
                                            <Text style={styles.lable}>Số lượng đang chứa: </Text>
                                            <Text>{item.quantity} {product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                        }
                        {scanned && (
                            <Button title="Quét lại" onPress={() => {
                                setScanned(false);
                                setData(null);
                                setHasPermission(false);
                            }} />
                        )}
                    </View>
                }
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: 20,
    },
    containerlable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lable: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lable1: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: "#0984e3"
    },
    imageproduct: {
        width: 100,
        height: 100,
    }
});
