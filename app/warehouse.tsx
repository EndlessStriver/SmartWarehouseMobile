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
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Nhập từ khóa...'
                    value={keyWord}
                    onChangeText={(text) => setKeyWord(text)}
                />
                <TouchableOpacity
                    onPress={() => setKeyWord('')}
                    style={styles.refreshButton}
                >
                    <Ionicons name="refresh" size={16} color={"white"} />
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Thông tin tồn kho</Text>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={products}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/warehousedetail',
                                params: { productId: item.id },
                            });
                        }}
                        style={styles.productItem}
                    >
                        <Image style={styles.image} source={{ uri: item.img }} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productText}><Text style={styles.boldText}>Mã sản phẩm: </Text>{item.productCode}</Text>
                            <Text style={styles.productText}><Text style={styles.boldText}>Tên sản phẩm: </Text>{item.name}</Text>
                            <Text style={styles.productText}><Text style={styles.boldText}>Số lượng tồn kho: </Text>{item.productDetails[0].quantity} {item.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                            <Text style={styles.productText}><Text style={styles.boldText}>Số hàng lỗi tồn kho: </Text>{item.productDetails[0].damagedQuantity} {item.units.find((unit) => unit.isBaseUnit)?.name}</Text>
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
        padding: 15,
        backgroundColor: '#f7f7f7',
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchInput: {
        width: '85%',
        height: 45,
        paddingLeft: 15,
        backgroundColor: '#ecf0f1',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        fontSize: 16,
    },
    refreshButton: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 10,
    },
    list: {
        width: '100%',
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#2c3e50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    productText: {
        fontSize: 16,
        color: '#34495e',
    },
    boldText: {
        fontWeight: '600',
    },
});

export default WareHouse;
