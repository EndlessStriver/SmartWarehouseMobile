import GetProductInformationById, { Product } from "@/service/GetProductInformationById";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";

const WareHouseDetail = () => {

    const { productId } = useLocalSearchParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        GetProductInformationById(productId)
            .then((res) => {
                setProduct(res);
            })
            .catch((err) => {
                console.error(err);
                Alert.alert('Lỗi', err.message);
            });
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.lable}>Thông tin sản phẩm</Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                marginTop: 10,
            }}>
                <View>
                    <Image
                        style={styles.imageproduct}
                        source={{
                            uri: product?.img
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Tên sản phẩm: </Text>
                        <Text style={styles.text}>{product?.name}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Loại sản phẩm: </Text>
                        <Text style={styles.text}>{product?.category.name}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Mô tả: </Text>
                        <Text style={styles.text}>{product?.description}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Số lượng tồn kho: </Text>
                        <Text style={styles.text}>{product?.productDetails[0].quantity} {product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Mã SKU: </Text>
                        <Text style={styles.text}>{product?.productDetails[0].sku[0].skuCode}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Trọng lượng: </Text>
                        <Text style={styles.text}>{product?.productDetails[0].sku[0].weight} kg</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Kích thước: </Text>
                        <Text style={styles.text}>{product?.productDetails[0].sku[0].dimension} cm</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.lable1}>Danh Sách Vị Trí Chứa Trong Kho</Text>
            {
                product?.productDetails[0].sku[0].locations.length === 0 ?
                    <Text style={{ marginBottom: 10 }}>Không có vị trí chứa sản phẩm</Text>
                    :
                    <FlatList
                        style={{
                            width: '100%',
                        }}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
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
    receiveCheck: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#bdc3c7',
    },
    imageproduct: {
        width: 120,
        height: 120,
    },
    containerlable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        flexWrap: 'wrap',
    },
});

export default WareHouseDetail;