import GetProductsByNameAndCodeAndSupplierName, { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WareHouse = () => {

    const [keyWord, setKeyWord] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    useEffect(() => {
        GetProductsByNameAndCodeAndSupplierName(keyWord, pagination.pageSize, pagination.page)
            .then((response) => {
                setProducts(response.data);
                setPagination({
                    page: response.offset,
                    pageSize: response.limit,
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.lable}>Thông tin tồn kho</Text>
            <FlatList
                style={{
                    width: '100%'
                }}
                data={products}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/warehousedetail',
                                params: {
                                    productId: item.id
                                }
                            });
                        }}
                        style={styles.receiveCheck}
                    >
                        <View>
                            <Image
                                style={styles.image}
                                source={{ uri: item.img }}
                            />
                        </View>
                        <View>
                            <Text>
                                <Text style={{ fontWeight: '600' }}>Mã sản phẩm: </Text>
                                {item.productCode}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: '600' }}>Tên sản phẩm: </Text>
                                {item.name}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: '600' }}>Số lượng tồn kho: </Text>
                                {item.productDetails[0].quantity} {item.units.find((unit) => unit.isBaseUnit)?.name}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: '600' }}>Số hàng lỗi tồn kho: </Text>
                                {item.productDetails[0].damagedQuantity} {item.units.find((unit) => unit.isBaseUnit)?.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
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
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    receiveCheck: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#bdc3c7',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    }
});

export default WareHouse;