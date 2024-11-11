import GetSupplierBySupplierName, { Supplier } from "@/service/GetSupplierBySupplierName";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const CreateStockEntry = () => {

    const [supplier, setSupplier] = useState<{ value: string, lable: string }>();
    const [note, setNote] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleProduct, setModalVisibleProduct] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.containergroup}>
                <Text style={styles.fontweight}>Người tạo: </Text>
                Ngô Thiên Phú
            </Text>
            <Text style={styles.containergroup}>
                <Text style={styles.fontweight}>Ngày tạo: </Text>
                20/10/2021
            </Text>
            <Text style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 10
            }}>
                <Text style={styles.fontweight}>Nhà cung cấp: </Text>
                {
                    supplier && (
                        <Text>
                            {supplier ? supplier.lable : ""}
                            <TouchableOpacity
                                style={{ marginLeft: 10 }}
                                onPress={() => setModalVisibleProduct(true)}
                            >
                                <FontAwesome name="edit" size={16} color="black" />
                            </TouchableOpacity>
                        </Text>
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
            </Text>
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
            <ModalListProductSupplier
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
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
}

const ModalListProductSupplier: React.FC<ModalListProductSupplierProps> = (props) => {
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