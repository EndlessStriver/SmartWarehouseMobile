import GetStockEntryById, { ReceiveItem, ReceiveOrder } from "@/service/GetStockEntryById";
import SuggestInbound from "@/service/SuggestInbound";
import FormatDate from "@/unit/FormatDate";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler";

interface ProductIsCheckType {
    productName: string,
    receiveItemId: string,
    quantityCheck: number,
    statusProduct: string,
    location: { value: string, lable: string },
}

const HandleStockEntry = () => {

    const { receiveId } = useLocalSearchParams<{ receiveId: string }>();
    const [receiveOrder, setReceiveOrder] = useState<ReceiveOrder>();
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [productIsCheck, setProductIsCheck] = useState<ProductIsCheckType[]>([]);

    useEffect(() => {
        setLoading(true);
        GetStockEntryById(receiveId)
            .then((res) => {
                setReceiveOrder(res)
            })
            .catch((err) => {
                Alert.alert('Error', err.message)
            })
            .finally(() => setLoading(false))
    }, [receiveId])

    const addProductIsCheck = (product: ProductIsCheckType) => {
        console.log(product)
        setProductIsCheck([...productIsCheck, product])
    }

    return (
        <View style={styles.container}>
            {
                loading ?
                    <Text>Đang tải dữ liệu...</Text>
                    :
                    <View style={{ flex: 1, width: "100%" }}>
                        <Text style={styles.containergroup}>
                            <Text style={styles.fontweight}>Mã phiếu nhập: </Text>
                            {receiveOrder?.receiveCode}
                        </Text>
                        <Text style={styles.containergroup}>
                            <Text style={styles.fontweight}>Ngày tạo: </Text>
                            {FormatDate(receiveOrder?.create_at.toString() || "")}
                        </Text>
                        <Text style={styles.containergroup}>
                            <Text style={styles.fontweight}>Người tạo: </Text>
                            {receiveOrder?.receiveBy || ""}
                        </Text>
                        <Text style={styles.containergroup}>
                            <Text style={styles.fontweight}>Nhà cung cấp: </Text>
                            {receiveOrder?.supplier.name}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    marginBottom: 10,
                                    color: "#3498db"
                                }}
                            >
                                Danh sách sản phẩm đã kiểm tra
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={{
                                    padding: 10,
                                    backgroundColor: "#2ecc71",
                                    borderRadius: 5,
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold" }}>Thêm +</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            productIsCheck.length === 0 ?
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "#e74c3c",
                                        fontSize: 16,
                                        marginTop: 10
                                    }}
                                >Chưa có sản phẩm nào được kiểm tra...</Text>
                                :
                                <FlatList
                                    style={{ width: "100%" }}
                                    data={productIsCheck}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                backgroundColor: "#ecf0f1",
                                                padding: 15,
                                                marginBottom: 10,
                                                borderRadius: 5,
                                                width: "100%"
                                            }}
                                        >
                                            <Text>
                                                <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                                                {item.productName}
                                            </Text>
                                            <Text>
                                                <Text style={{ fontWeight: "bold" }}>Số lượng kiểm tra: </Text>
                                                {item.quantityCheck}
                                            </Text>
                                            <Text>
                                                <Text style={{ fontWeight: "bold" }}>Tình trạng sản phẩm: </Text>
                                                {item.statusProduct === "NORMAL" ? "Bình thường" : "Hư hại"}
                                            </Text>
                                            <Text>
                                                <Text style={{ fontWeight: "bold" }}>Vị trí chứa: </Text>
                                                {item.location.lable}
                                            </Text>
                                        </View>
                                    )}
                                />
                        }
                    </View>
            }
            <ModalAddProductCheck
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                receiveOrder={receiveOrder}
                addProductIsCheck={addProductIsCheck}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containergroup: {
        marginBottom: 10
    },
    fontweight: {
        fontWeight: 'bold'
    }
});

export default HandleStockEntry

interface ModalAddProductCheckProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    receiveOrder?: ReceiveOrder;
    addProductIsCheck: (product: ProductIsCheckType) => void;
}


const ModalAddProductCheck: React.FC<ModalAddProductCheckProps> = (props) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [receiveItem, setReceiveItem] = useState<ReceiveItem>();

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
                        Danh sách sản phẩm cần kiểm tra
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {
                    props.receiveOrder ?
                        <FlatList
                            style={{ width: "100%" }}
                            data={props.receiveOrder.receiveItems}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        backgroundColor: "#ecf0f1",
                                        padding: 15,
                                        marginBottom: 10,
                                        borderRadius: 5,
                                        position: "relative",
                                    }}
                                >
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                                        {item.product.productCode}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                                        {item.product.name}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Số lượng nhập: </Text>
                                        {item.quantity} {item.product.units[0].name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setReceiveItem(item);
                                            setModalVisible(true);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            right: 10
                                        }}
                                    >
                                        <Text style={{ color: "#3498db" }}>Kiểm tra</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        :
                        <Text>Không có thông tin</Text>
                }
            </View>
            <ModalAddLocationProductCheck
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                receiveItem={receiveItem}
                addProductIsCheck={props.addProductIsCheck}
            />
        </Modal>
    )
}

interface ModalAddLocationProductCheckProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    receiveItem?: ReceiveItem,
    addProductIsCheck: (product: ProductIsCheckType) => void;
}

interface LocationType {
    value: string,
    lable: string,
    maxQuantityInbound: number
}

const ModalAddLocationProductCheck: React.FC<ModalAddLocationProductCheckProps> = (props) => {

    const [numberQuantityCheck, setNumberQuantityCheck] = useState("");
    const [statusProduct, setStatusProduct] = useState("");
    const [locationSelect, setLocationSelect] = useState<LocationType>({
        value: "",
        lable: "Vị trí...",
        maxQuantityInbound: 0
    });
    const [locations, setLocations] = useState<LocationType[]>([]);

    useEffect(() => {
        if (validateNumber(numberQuantityCheck) && statusProduct !== "") {
            SuggestInbound({
                quantity: Number(numberQuantityCheck),
                skuId: props.receiveItem?.sku.id || "",
                unitId: props.receiveItem?.product.units[0].id || "",
                typeShelf: statusProduct,
            })
                .then((res) => {
                    setLocations(res.map((item) => ({
                        value: item.locationId,
                        lable: item.locationCode,
                        maxQuantityInbound: item.maxQuantityInbound
                    })))
                })
                .catch((err) => {
                    Alert.alert("Error", err.message)
                })
        }
    }, [numberQuantityCheck, statusProduct])

    useEffect(() => {
        if (numberQuantityCheck === "" && !validateNumber(numberQuantityCheck)) {
            setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
            setLocations([]);
        }
    }, [numberQuantityCheck])

    useEffect(() => {
        if (statusProduct === "") {
            setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
            setLocations([]);
        }
    }, [statusProduct])

    const validateNumber = (value: string) => {
        let regexNumber = /^[0-9]+$/;
        return regexNumber.test(value);
    }

    const handleSubmit = () => {
        if (numberQuantityCheck === "" || !validateNumber(numberQuantityCheck)) {
            Alert.alert("Error", "Số lượng kiểm tra không hợp lệ");
            return;
        }
        if (Number(numberQuantityCheck) > Number(props.receiveItem?.quantity) || 0) {
            Alert.alert("Error", "Số lượng kiểm tra không được lớn hơn số lượng cần nhập");
            return;
        }
        if (statusProduct === "") {
            Alert.alert("Error", "Vui lòng chọn tình trạng sản phẩm");
            return;
        }
        if (locationSelect.value === "") {
            Alert.alert("Error", "Vui lòng chọn vị tri chứa sản phẩm");
            return;
        }
        props.addProductIsCheck({
            productName: props.receiveItem?.product.name || "",
            receiveItemId: props.receiveItem?.id || "",
            quantityCheck: Number(numberQuantityCheck),
            statusProduct: statusProduct,
            location: locationSelect
        });
    }

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
                        Kiểm tra sản phẩm
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                            {props.receiveItem?.product.productCode}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                            {props.receiveItem?.product.name}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Đơn vị tính: </Text>
                            {props.receiveItem?.product.units[0].name}
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={handleSubmit}
                        >
                            <Text style={{
                                padding: 10,
                                backgroundColor: "#2ecc71",
                                borderRadius: 5,
                                color: "#fff",
                                fontWeight: "bold"
                            }}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontWeight: "bold" }}>Tình trạng: </Text>
                <Picker
                    style={{
                        width: 150,
                        borderRadius: 5,
                        padding: 5,
                        marginTop: 5
                    }}
                    selectedValue={statusProduct}
                    onValueChange={(itemValue, itemIndex) =>
                        setStatusProduct(itemValue)
                    }>
                    <Picker.Item label="Tình trạng..." value="" />
                    <Picker.Item label="Bình thường" value="NORMAL" />
                    <Picker.Item label="Bị hư hại" value="DAMAGED" />
                </Picker>
                <Text style={{ fontWeight: "bold" }}>Số lượng kiểm tra: </Text>
                <TextInput
                    placeholder="Số lượng kiểm tra..."
                    value={numberQuantityCheck.toString()}
                    onChangeText={(text) => setNumberQuantityCheck(text)}
                    style={{
                        width: 150,
                        padding: 5,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 5
                    }}
                    keyboardType="number-pad"
                />
                <Text style={{ fontWeight: "bold", marginTop: 5, marginBottom: 10 }}>
                    Chọn vị trí chứa:
                    <Text
                        style={{
                            color: locationSelect.value === "" ? "red" : "#3498db",
                            marginLeft: 5
                        }}
                    >{locationSelect.lable}</Text>
                </Text>
                {
                    locations.length === 0 ?
                        <Text style={{ color: "red" }} >Không tìm thấy vị trí chứa phù hợp</Text>
                        :
                        <FlatList
                            style={{ width: "100%" }}
                            data={locations}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        backgroundColor: (locationSelect && locationSelect.value !== item.value) ? "#ecf0f1" : "#3498db",
                                        padding: 15,
                                        marginBottom: 10,
                                        borderRadius: 5,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>{item.lable + " " + "(" + item.maxQuantityInbound + ")"}</Text>
                                    <TouchableOpacity
                                        disabled={locationSelect.value !== "" && locationSelect.value !== item.value}
                                        onPress={() => {
                                            if (locationSelect.value !== "" && locationSelect.value === item.value) {
                                                setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
                                            } else {
                                                setLocationSelect({
                                                    value: item.value,
                                                    lable: item.lable,
                                                    maxQuantityInbound: item.maxQuantityInbound
                                                });
                                            }
                                        }}
                                    >
                                        <Text style={{
                                            color: (locationSelect.value !== item.value) ? "#3498db" : "#fff",
                                            opacity: locationSelect && locationSelect.value !== item.value ? 0.5 : 1
                                        }}>
                                            {
                                                locationSelect.value && locationSelect.value === item.value ?
                                                    "Hủy"
                                                    :
                                                    "Chọn"
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                }
            </View>
        </Modal>
    )
}