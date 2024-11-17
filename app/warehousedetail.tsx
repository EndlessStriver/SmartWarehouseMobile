import ProductListLocationDetail from "@/compoments/ProductListLocationDetail";
import GetProductInformationById, { Product } from "@/service/GetProductInformationById";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

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
            {
                product ?
                    <ProductListLocationDetail product={product} />
                    : <Text>Đang tải dữ liệu...</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default WareHouseDetail;