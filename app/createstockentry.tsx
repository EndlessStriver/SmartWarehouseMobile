import GetProductBySupplierId, { ProductBySupplierId } from "@/service/GetProductBySupplierId";
import GetSupplierBySupplierName, { Supplier } from "@/service/GetSupplierBySupplierName";
import { ProductStocEntry } from "@/typedata/ProductStocEntry";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import FormatDate from "@/unit/FormatDate";
import CreateStockEntryAPI from "@/service/CreateStockEntryAPI";
import { useLocalSearchParams, useNavigation } from "expo-router";
import GetStockEntryById from "@/service/GetStockEntryById";
import UpdateStockEntryAPI from "@/service/UpdateStockEntryAPI";

const CreateStockEntry = () => {

    const navigation = useNavigation();

    const { receiveId } = useLocalSearchParams<{ receiveId: string }>();
    const [user, setUser] = useState<User>();
    const [supplier, setSupplier] = useState<{ value: string, lable: string }>();
    const [note, setNote] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleProduct, setModalVisibleProduct] = useState(false);
    const [productChecks, setProductChecks] = useState<ProductStocEntry[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (receiveId) {
            GetStockEntryById(receiveId)
                .then((res) => {
                    setSupplier({
                        value: res.supplier.id,
                        lable: res.supplier.name,
                    });
                    setProductChecks(res.receiveItems.map((item) => ({
                        productId: item.product.id,
                        productName: item.product.name,
                        quantity: item.quantity,
                        currentUnit: item.unit.id,
                        units: item.product.units.map((unit) => {
                            return {
                                unitId: unit.id,
                                unitName: unit.name,
                            }
                        }),
                        skuId: item.sku.id
                    })))
                    setNote(res.description);
                })
        }
    }, [receiveId])

    useLayoutEffect(() => {
        GetAccountInformationCurrent()
            .then((res) => {
                setUser(res);
            })
            .catch((err) => {
                Alert.alert("Lỗi", err.message);
            })
    }, [])

    const addProductCheck = (product: ProductStocEntry) => {
        setProductChecks([...productChecks, product]);
    }

    const validateNumber = (value: string) => {
        const regex = /^[0-9]*$/;
        return regex.test(value);
    }

    const updateQuantityProductCheck = (productId: string, quantity: number) => {
        const newProductChecks = productChecks.map((product) => {
            if (product.productId === productId && validateNumber(quantity.toString()) && quantity > 0) {
                return {
                    ...product,
                    quantity: quantity,
                }
            }
            return product;
        });
        setProductChecks(newProductChecks);
    }

    const updateCurrentUnitProductCheck = (productId: string, unitId: string) => {
        const newProductChecks = productChecks.map((product) => {
            if (product.productId === productId) {
                return {
                    ...product,
                    currentUnit: unitId,
                }
            }
            return product;
        });
        setProductChecks(newProductChecks);
    }

    const checkProductIsChecked = (productId: string) => {
        return productChecks.some((product) => product.productId === productId);
    }

    const deleteProductCheck = (productId: string) => {
        const newProductChecks = productChecks.filter((product) => product.productId !== productId);
        setProductChecks(newProductChecks);
    }

    const addNewSupplier = (value: string, lable: string) => {
        setSupplier({ value, lable });
        setProductChecks([]);
    }

    const handleSubmit = () => {
        if (!supplier) {
            Alert.alert("Lỗi", "Vui lòng chọn nhà cung cấp");
            return;
        }
        if (productChecks.length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn sản phẩm cần nhập kho");
            return;
        }
        if (productChecks.some((product) => product.currentUnit === "")) {
            Alert.alert("Lỗi", "Vui lòng chọn đơn vị tính cho sản phẩm");
            return;
        }
        setLoading(true);
        if (receiveId) {
            UpdateStockEntryAPI({
                receiveBy: user?.fullName || "",
                receiveDate: new Date().toString(),
                description: note,
                receiveItems: productChecks.map((product) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    unitId: product.currentUnit,
                    skuId: product.skuId,
                }))
            }, receiveId)
                .then(() => {
                    Alert.alert("Thành công", "Cập nhật phiếu nhập kho thành công");
                    navigation.reset({
                        index: 1,
                        routes: [
                            { name: "home" as never },
                            { name: "stockentry" as never }
                        ]
                    })
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Lỗi", err.message);
                })
                .finally(() => setLoading(false));
        } else {
            CreateStockEntryAPI({
                receiveBy: user?.fullName || "",
                receiveDate: new Date().toString(),
                supplierId: supplier?.value || "",
                description: note,
                receiveItems: productChecks.map((product) => ({
                    productId: product.productId,
                    quantity: product.quantity,
                    unitId: product.currentUnit,
                    skuId: product.skuId,
                }))
            })
                .then(() => {
                    Alert.alert("Thành công", "Tạo phiếu nhập kho thành công");
                    navigation.reset({
                        index: 1,
                        routes: [
                            { name: "home" as never },
                            { name: "stockentry" as never }
                        ]
                    })
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Lỗi", err.message);
                })
                .finally(() => setLoading(false));
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Người tạo: </Text>
                        {user?.fullName || "N/A"}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Ngày tạo: </Text>
                        {FormatDate(new Date().toString())}
                    </Text>

                    <View style={styles.supplierSection}>
                        <Text style={styles.label}>Nhà cung cấp:</Text>
                        {supplier ? (
                            <View style={styles.supplierInfo}>
                                <Text>{supplier.lable || "N/A"}</Text>
                                {!receiveId && (
                                    <TouchableOpacity onPress={() => setModalVisibleProduct(true)}>
                                        <FontAwesome name="edit" size={16} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setModalVisibleProduct(true)}>
                                <Text style={styles.selectSupplierText}>Chọn nhà cung cấp</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!supplier || productChecks.length === 0}
                    style={[
                        {
                            opacity: supplier && productChecks.length > 0 ? 1 : 0.5,
                        },
                    ]}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? "Đang xử lý..." : receiveId ? "Cập nhật" : "Tạo Phiếu"}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.infoText}>
                <Text style={styles.boldText}>Ghi chú:</Text>
            </Text>
            <TextInput
                style={styles.noteInput}
                onChangeText={setNote}
                value={note}
                placeholder="Nhập ghi chú nếu có..."
            />

            <View style={styles.productListHeader}>
                <Text style={styles.productListTitle}>Danh sách sản phẩm nhập kho</Text>
                <TouchableOpacity
                    disabled={!supplier}
                    style={[
                        styles.addButton,
                        {
                            opacity: supplier ? 1 : 0.5,
                        },
                    ]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Thêm</Text>
                </TouchableOpacity>
            </View>

            {productChecks.length === 0 ? (
                <Text style={styles.noProductText}>Chưa có sản phẩm nào được chọn....</Text>
            ) : (
                <FlatList
                    data={productChecks}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <View style={styles.productRow}>
                                <Text style={styles.productName}>{item.productName}</Text>
                                <View style={styles.productActions}>
                                    <TextInput
                                        style={styles.quantityInput}
                                        onChangeText={(value) =>
                                            updateQuantityProductCheck(item.productId, parseInt(value))
                                        }
                                        value={item.quantity.toString()}
                                        placeholder="Số lượng nhập ..."
                                        placeholderTextColor="#95a5a6"
                                        keyboardType="numeric"
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteProductCheck(item.productId)}
                                    >
                                        <AntDesign name="delete" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Picker
                                selectedValue={item.currentUnit}
                                style={styles.unitPicker}
                                onValueChange={(itemValue) =>
                                    updateCurrentUnitProductCheck(item.productId, itemValue)
                                }
                            >
                                <Picker.Item label="Đơn vị tính..." value="" />
                                {item.units.map((unit) => (
                                    <Picker.Item key={unit.unitId} label={unit.unitName} value={unit.unitId} />
                                ))}
                            </Picker>
                        </View>
                    )}
                    keyExtractor={(item) => item.productId}
                />
            )}

            <ModalListProductSupplier
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                supplierId={supplier?.value || ""}
                addProductCheck={addProductCheck}
                checkProductIsChecked={checkProductIsChecked}
            />
            <ModalFindSupplier
                isModalVisible={isModalVisibleProduct}
                setModalVisible={setModalVisibleProduct}
                setSupplier={addNewSupplier}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    headerSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
    },
    boldText: {
        fontWeight: "bold",
    },
    supplierSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginRight: 10,
    },
    supplierInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    selectSupplierText: {
        color: "#2980b9",
        fontWeight: "bold",
    },
    submitButtonText: {
        color: "#3498db",
        fontWeight: "bold",
        fontSize: 16,
    },
    noteInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        fontSize: 14,
    },
    productListHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    productListTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#3498db",
    },
    addButton: {
        backgroundColor: "#3498db",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    noProductText: {
        color: "#e74c3c",
        fontWeight: "600",
    },
    productItem: {
        marginBottom: 12,
        borderWidth: 1,
        padding: 15,
        borderRadius: 8,
        borderColor: "#3498db",
        backgroundColor: "#ecf0f1",
        elevation: 3,
    },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
    },
    productActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityInput: {
        width: 150,
        height: 40,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginRight: 10,
        backgroundColor: "#fff",
    },
    deleteButton: {
        backgroundColor: "#f1c40f",
        borderRadius: 50,
        padding: 8,
    },
    unitPicker: {
        height: 60,
        backgroundColor: "#bdc3c7",
        borderRadius: 6,
    },
});


export default CreateStockEntry;

interface ModalListProductSupplierProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    supplierId: string;
    addProductCheck: (product: ProductStocEntry) => void;
    checkProductIsChecked: (productId: string) => boolean;
}

const ModalListProductSupplier: React.FC<ModalListProductSupplierProps> = (props) => {

    const [products, setProducts] = useState<ProductBySupplierId[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 1,
    });

    useEffect(() => {
        if (props.supplierId) {
            GetProductBySupplierId(props.supplierId, pagination.limit, pagination.offset)
                .then((res) => {
                    setProducts(res.data);
                    setPagination({
                        limit: res.limit,
                        offset: res.offset,
                    });
                })
                .catch((err) => {
                    Alert.alert("Lỗi", err.message);
                })
        }
    }, [props.supplierId])

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="fade"
        >
            <View style={{
                flex: 1,
                padding: 20,
                backgroundColor: '#fff',
            }}>
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#3498db",
                        marginVertical: 10,
                    }}>
                        Danh sách sản phẩm
                    </Text>
                    <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                        <FontAwesome name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {products.length === 0 ? (
                    <Text style={{
                        fontSize: 18,
                        color: "#7f8c8d",
                        textAlign: "center",
                        marginTop: 20,
                    }}>
                        Không có sản phẩm nào...
                    </Text>
                ) : (
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%", marginTop: 10 }}
                        data={products}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    opacity: props.checkProductIsChecked(item.id) ? 0.5 : 1,
                                }}
                                disabled={props.checkProductIsChecked(item.id)}
                                onPress={() => {
                                    props.addProductCheck({
                                        productId: item.id,
                                        productName: item.name,
                                        quantity: 1,
                                        currentUnit: "",
                                        units: item.units.map(unit => ({
                                            unitId: unit.id,
                                            unitName: unit.name,
                                        })),
                                        skuId: item.productDetails[0].sku[0].id,
                                    });
                                    props.setModalVisible(false);
                                }}
                            >
                                <View style={{
                                    padding: 12,
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    marginBottom: 12,
                                    borderColor: "#3498db",
                                    backgroundColor: "#f9f9f9",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}>
                                    <Text style={{
                                        color: "#3498db",
                                        fontSize: 16,
                                        fontWeight: "500",
                                    }}>
                                        {item.name}
                                    </Text>
                                    {props.checkProductIsChecked(item.id) && (
                                        <AntDesign
                                            style={{ marginLeft: 10 }}
                                            name="checkcircle"
                                            size={20}
                                            color="#3498db"
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id.toString()}
                    />
                )}
            </View>
        </Modal>
    )
}

interface ModalFindSupplierProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    setSupplier: (value: string, lable: string) => void;
}

const ModalFindSupplier: React.FC<ModalFindSupplierProps> = (props) => {

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierName, setSupplierName] = useState('');

    useEffect(() => {
        const id = setTimeout(() => {
            GetSupplierBySupplierName(supplierName)
                .then((res) => {
                    setSuppliers(res);
                })
                .catch((err) => {
                    Alert.alert("Lỗi", err.message);
                })
        }, 500);

        return () => clearTimeout(id);
    }, [supplierName])

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="fade"
        >
            <View style={{
                flex: 1,
                padding: 20,
                backgroundColor: '#fff',
            }}>
                <View style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#3498db",
                        marginVertical: 10,
                    }}>
                        Danh sách nhà cung cấp
                    </Text>
                    <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                        <FontAwesome name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={{
                        height: 45,
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 15,
                        borderColor: "#3498db",
                        color: "#333",
                        marginBottom: 15,
                        fontSize: 16,
                    }}
                    onChangeText={setSupplierName}
                    value={supplierName}
                    placeholder="Nhập tên nhà cung cấp..."
                    placeholderTextColor="#7f8c8d"
                />

                {suppliers.length === 0 && supplierName !== "" && (
                    <Text style={{
                        color: "red",
                        fontSize: 14,
                        marginBottom: 10,
                        textAlign: "center",
                    }}>
                        Không tìm thấy nhà cung cấp phù hợp
                    </Text>
                )}

                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={suppliers}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                props.setSupplier(item.id, item.name);
                                setSupplierName("");
                                props.setModalVisible(false);
                            }}
                        >
                            <View style={{
                                paddingVertical: 12,
                                paddingHorizontal: 15,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderRadius: 8,
                                borderColor: "#3498db",
                                backgroundColor: "#f9f9f9",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <Text style={{
                                    color: "#3498db",
                                    fontSize: 16,
                                    fontWeight: "500",
                                }}>
                                    {item.name}
                                </Text>
                                <FontAwesome name="check" size={18} color="#3498db" />
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </View>

        </Modal>
    )
}