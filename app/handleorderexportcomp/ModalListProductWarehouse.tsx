import GetProductsByNameAndCodeAndSupplierName, { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
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
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    padding: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: "#3498db"
                        }}
                    >Danh sách sản phẩm tồn kho</Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisiable(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={{
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 10,
                    }}
                    placeholder="Nhập tên sản phẩm cần tìm..."
                    value={productName}
                    onChangeText={setProductName}
                />
                <FlatList
                    style={{
                        width: '100%',
                    }}
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0}
                            onPress={() => {
                                setSelectedProduct(item);
                                setModalVisiable(true);
                            }}
                            style={{
                                marginBottom: 10,
                                backgroundColor: "#f1c40f",
                                padding: 10,
                                borderRadius: 5,
                                opacity: item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0 ? 0.5 : 1,
                            }}
                        >
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                                {item.name}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                                {item.productCode}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Số lượng tồn kho: </Text>
                                {item.productDetails[0].quantity} sản phẩm
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Số lượng lỗi tồn kho: </Text>
                                {item.productDetails[0].damagedQuantity} sản phẩm
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

export default ModalListProductWarehouse;