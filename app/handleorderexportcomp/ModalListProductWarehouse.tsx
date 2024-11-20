import GetProductsByNameAndCodeAndSupplierName, { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ExportItem } from "../createorderexport";
import ModalAddExportItem from "./ModalAddExportItem";

interface ModalListProductWarehouseProps {
    modalVisiable: boolean;
    setModalVisiable: (value: boolean) => void;
    addExportItem: (item: ExportItem) => void;
    productExports: ExportItem[];
}

const ModalListProductWarehouse: React.FC<ModalListProductWarehouseProps> = (props) => {

    const [productName, setProductName] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 1,
        totalPage: 0,
    });
    const [modalVisiable, setModalVisiable] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const id = setTimeout(() => {
            GetProductsByNameAndCodeAndSupplierName(productName)
                .then((res) => {
                    setProducts(res.data);
                    setPagination({
                        limit: res.limit,
                        offset: res.offset,
                        totalPage: res.totalPage,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert('Lỗi', 'Không thể lấy dữ liệu sản phẩm');
                })
        }, 500);

        return () => clearTimeout(id);
    }, [productName])

    return (
        <Modal
            visible={props.modalVisiable}
            onRequestClose={() => props.setModalVisiable(false)}
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Danh sách sản phẩm tồn kho</Text>
                    <TouchableOpacity onPress={() => props.setModalVisiable(false)}>
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Nhập tên sản phẩm cần tìm..."
                    value={productName}
                    onChangeText={setProductName}
                />

                <FlatList
                    style={styles.productList}
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0}
                            onPress={() => {
                                setSelectedProduct(item);
                                setModalVisiable(true);
                            }}
                            style={[
                                styles.productItem,
                                {
                                    opacity: item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0 ? 0.5 : 1,
                                },
                            ]}
                        >
                            <Text style={styles.productName}>
                                <Text style={styles.boldText}>Tên sản phẩm: </Text>{item.name}
                            </Text>
                            <Text style={styles.productCode}>
                                <Text style={styles.boldText}>Mã sản phẩm: </Text>{item.productCode}
                            </Text>
                            <Text style={styles.productQuantity}>
                                <Text style={styles.boldText}>Số lượng tồn kho: </Text>{item.productDetails[0].quantity} sản phẩm
                            </Text>
                            <Text style={styles.productDamagedQuantity}>
                                <Text style={styles.boldText}>Số lượng lỗi tồn kho: </Text>{item.productDetails[0].damagedQuantity} sản phẩm
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <ModalAddExportItem
                modalVisiable={modalVisiable}
                setModalVisiable={setModalVisiable}
                addExportItem={props.addExportItem}
                selectedProduct={selectedProduct}
                productExports={props.productExports}
            />
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#3498db',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
        borderColor: '#ccc',
        fontSize: 14,
    },
    productList: {
        width: '100%',
    },
    productItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    productName: {
        fontSize: 14,
    },
    productCode: {
        fontSize: 14,
    },
    productQuantity: {
        fontSize: 14,
    },
    productDamagedQuantity: {
        fontSize: 14,
    },
    boldText: {
        fontWeight: 'bold',
    },
});




export default ModalListProductWarehouse;