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
import { router } from "expo-router";

const CreateStockEntry = () => {

    const [user, setUser] = useState<User>();
    const [supplier, setSupplier] = useState<{ value: string, lable: string }>();
    const [note, setNote] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleProduct, setModalVisibleProduct] = useState(false);
    const [productChecks, setProductChecks] = useState<ProductStocEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useLayoutEffect(() => {
        GetAccountInformationCurrent()
            .then((res) => {
                setUser(res);
            })
            .catch((err) => {
                Alert.alert("Lỗi", err.message);
            })
    }, [])

    useEffect(() => {
        if (supplier) {
            setProductChecks([]);
        }
    }, [supplier])

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
                router.replace("/stockentry")
            })
            .catch((err) => {
                console.log(err);
                Alert.alert("Lỗi", err.message);
            })
            .finally(() => setLoading(false));
    }

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 10
            }}>
                <View>
                    <Text style={styles.containergroup}>
                        <Text style={styles.fontweight}>Người tạo: </Text>
                        {user?.fullName || ""}
                    </Text>
                    <Text style={styles.containergroup}>
                        <Text style={styles.fontweight}>Ngày tạo: </Text>
                        {FormatDate(new Date().toString())}
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        marginBottom: 10,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            marginRight: 10
                        }}>
                            Nhà cung cấp:
                        </Text>
                        {
                            supplier && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 10,
                                    }}
                                >
                                    <Text>{supplier ? supplier.lable : ""}</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisibleProduct(true)}
                                    >
                                        <FontAwesome name="edit" size={16} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        {
                            !supplier && (
                                <TouchableOpacity
                                    onPress={() => setModalVisibleProduct(true)}
                                >
                                    <Text style={{ color: "#3498db" }}>Chọn nhà cung cấp</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!supplier || productChecks.length === 0}
                    >
                        <Text style={{
                            backgroundColor: "#3498db",
                            color: "#fff",
                            padding: 10,
                            borderRadius: 5,
                            fontWeight: "bold",
                            textAlign: "center",
                            width: "100%",
                            opacity: supplier && productChecks.length > 0 ? 1 : 0.5
                        }}>
                            {loading ? "Đang tạo..." : "Tạo"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.containergroup}>
                <Text style={styles.fontweight}>Ghi chú:</Text>
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setNote}
                value={note}
                placeholder="Nhập ghi chú nếu có..."
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%"
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 10,
                    marginBottom: 10,
                    color: "#3498db"
                }}>Danh sách sản phẩm nhập kho</Text>
                <TouchableOpacity
                    disabled={!supplier}
                    style={{
                        opacity: supplier ? 1 : 0.5
                    }}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={{
                        fontSize: 12,
                        padding: 10,
                        borderRadius: 5,
                        fontWeight: "bold",
                        backgroundColor: "#2ecc71",
                        color: "#fff"
                    }}>+ Thêm</Text>
                </TouchableOpacity>
            </View>
            {
                productChecks.length === 0 ?
                    <Text>Chưa có sản phẩm nào được chọn</Text> :
                    <FlatList
                        style={{
                            width: "100%",
                        }}
                        data={productChecks}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    flexDirection: "column",
                                    marginBottom: 5,
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                    borderColor: "#3498db",
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
                                    <Text style={{ fontWeight: "600" }}>{item.productName}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <TextInput
                                            style={{
                                                width: 100,
                                                height: 30,
                                                borderWidth: 1,
                                                padding: 5,
                                                marginRight: 5,
                                                borderColor: "gray",
                                                color: "black",
                                                borderRadius: 5,
                                                backgroundColor: "#fff"
                                            }}
                                            onChangeText={(value) => updateQuantityProductCheck(item.productId, parseInt(value))}
                                            value={item.quantity.toString()}
                                            placeholder="Số lượng"
                                        />
                                        <TouchableOpacity
                                            style={{ marginLeft: 10 }}
                                            onPress={() => deleteProductCheck(item.productId)}
                                        >
                                            <AntDesign name="delete" size={24} color="red" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Picker
                                    selectedValue={item.currentUnit}
                                    style={{
                                        height: 50,
                                        width: "100%",
                                        backgroundColor: "#95a5a6",
                                    }}
                                    onValueChange={(itemValue) => updateCurrentUnitProductCheck(item.productId, itemValue)}
                                >
                                    <Picker.Item label="Đơn vị tính..." value="" />
                                    {
                                        item.units.map((unit) => (
                                            <Picker.Item key={unit.unitId} label={unit.unitName} value={unit.unitId} />
                                        ))
                                    }
                                </Picker>
                            </View>
                        )}
                        keyExtractor={item => item.productId}
                    />
            }
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
                setSupplier={setSupplier}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#ecf0f1',
    },
    containergroup: {
        marginBottom: 10,
    },
    fontweight: {
        fontWeight: "bold"
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        marginBottom: 10,
        borderColor: "gray",
        color: "gray",
        borderRadius: 5,
    }
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
            <View
                style={{
                    flex: 1,
                    padding: 20,
                    alignItems: 'flex-start',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 10,
                            marginBottom: 10,
                            color: "#3498db"
                        }}
                    >
                        Danh sách sản phẩm
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {
                    products.length === 0 ?
                        <Text>Không có sản phẩm nào...</Text>
                        :
                        <FlatList
                            style={{
                                width: "100%",
                            }}
                            data={products}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        opacity: props.checkProductIsChecked(item.id) ? 0.5 : 1
                                    }}
                                    disabled={props.checkProductIsChecked(item.id)}
                                    onPress={() => {
                                        props.addProductCheck({
                                            productId: item.id,
                                            productName: item.name,
                                            quantity: 1,
                                            currentUnit: "",
                                            units: item.units.map((unit) => ({
                                                unitId: unit.id,
                                                unitName: unit.name,
                                            })),
                                            skuId: item.productDetails[0].sku[0].id
                                        });
                                        props.setModalVisible(false);
                                    }}
                                >
                                    <View style={{
                                        padding: 10,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        marginBottom: 5,
                                        borderColor: "#3498db",
                                        width: "100%",
                                        position: "relative",
                                    }}>
                                        <Text style={{ color: "#3498db", }}>{item.name}</Text>
                                        {
                                            props.checkProductIsChecked(item.id) && (
                                                <AntDesign
                                                    style={{ position: "absolute", right: 10, top: 13 }}
                                                    name="checkcircle"
                                                    size={16}
                                                    color="#3498db"
                                                />
                                            )
                                        }
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                        />
                }
            </View>
        </Modal>
    )
}

interface ModalFindSupplierProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    setSupplier: (value: { value: string, lable: string }) => void;
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
            <View
                style={{
                    flex: 1,
                    padding: 20,
                    alignItems: 'flex-start',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginTop: 10,
                            marginBottom: 10,
                            color: "#3498db"
                        }}
                    >
                        Danh sách nhà cung cấp
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={{
                        height: 40,
                        borderWidth: 1,
                        padding: 10,
                        width: '100%',
                        marginBottom: 10,
                        borderColor: "gray",
                        color: "gray",
                        borderRadius: 5,
                    }}
                    onChangeText={setSupplierName}
                    value={supplierName}
                    placeholder="Nhập tên nhà cung cấp..."
                />
                {
                    suppliers.length === 0 && (
                        <Text style={{ color: "red" }}>Không tìm thấy nhà cung cấp phù hợp</Text>
                    )
                }
                <FlatList
                    style={{
                        width: "100%",
                    }}
                    data={suppliers}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                props.setSupplier({ value: item.id, lable: item.name });
                                setSupplierName("");
                                props.setModalVisible(false);
                            }}
                        >
                            <Text style={{
                                padding: 10,
                                borderWidth: 1,
                                borderRadius: 5,
                                marginBottom: 5,
                                borderColor: "#3498db",
                                width: "100%",
                                color: "#3498db",
                            }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </Modal>
    )
}