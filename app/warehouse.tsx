import GetProductsByNameAndCodeAndSupplierName, { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const WareHouse = () => {

    const [keyWord, setKeyWord] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    useEffect(() => {
        const id = setTimeout(() => {
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
        }, 500);

        return () => clearTimeout(id);
    }, [keyWord, pagination.page, pagination.pageSize]);

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                width: '100%',
            }}>
                <TextInput
                    style={{
                        width: 320,
                        height: 40,
                        padding: 10,
                        backgroundColor: '#ecf0f1',
                        borderRadius: 5,
                        borderWidth: 1,
                    }}
                    placeholder='Nhập từ khóa...'
                    value={keyWord}
                    onChangeText={(text) => setKeyWord(text)}
                />
                <TouchableOpacity
                    onPress={() => {
                        setKeyWord('');
                    }}
                    style={{
                        backgroundColor: '#3498db',
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    <Ionicons name="refresh" size={16} color={"white"} />
                </TouchableOpacity>
            </View>
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