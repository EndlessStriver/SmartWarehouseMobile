import { ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";
import { useEffect, useState } from "react";
import SuggestInbound from "@/service/SuggestInbound";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ModalOptionShelf from "./ModalOptionShelf";

interface ModalAddLocationProductCheckProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    receiveItem?: ReceiveItem,
    addProductIsCheck: (product: ProductIsCheckType) => void;
    checkquantityInbound: (receiveItemId: string) => number;
    productIsCheck: ProductIsCheckType[];
}

export interface LocationType {
    value: string,
    lable: string,
    maxQuantityInbound: number
}

const ModalAddLocationProductCheck: React.FC<ModalAddLocationProductCheckProps> = (props) => {

    const [numberQuantityCheck, setNumberQuantityCheck] = useState("");
    const [statusProduct, setStatusProduct] = useState("NORMAL");
    const [locationSelect, setLocationSelect] = useState<LocationType>({
        value: "",
        lable: "Vị trí...",
        maxQuantityInbound: 0
    });
    const [locations, setLocations] = useState<LocationType[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => {
            if (validateNumber(numberQuantityCheck) && Number(numberQuantityCheck) > 0) {
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
            }
        }, 500);
        return () => clearTimeout(id);
    }, [numberQuantityCheck, statusProduct])

    useEffect(() => {
        const id = setTimeout(() => {
            if (validateNumber(numberQuantityCheck) || Number(numberQuantityCheck) <= 0) {
                setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
                setLocations([]);
            }
        }, 500);
        return () => clearTimeout(id);
    }, [numberQuantityCheck, statusProduct])

    const validateNumber = (value: string) => {
        let regexNumber = /^[0-9]+$/;
        return regexNumber.test(value);
    }

    const checkLocationInProductIsCheck = (value: string) => {
        let check = false;
        props.productIsCheck.forEach((product) => {
            if (product.location.value === value) {
                check = true;
            }
        })
        return check;
    }

    const filterLocation = () => {
        return locations.filter((item) => checkLocationInProductIsCheck(item.value) === false)
    }

    const handleSubmit = () => {
        if (numberQuantityCheck === "" || !validateNumber(numberQuantityCheck)) {
            Alert.alert("Error", "Số lượng kiểm tra không hợp lệ");
            return;
        }
        if (Number(numberQuantityCheck) + props.checkquantityInbound(props.receiveItem?.id || "") > Number(props.receiveItem?.quantity) || 0) {
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
        setNumberQuantityCheck("");
        setStatusProduct("NORMAL");
        setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
        props.setModalVisible(false);
    }

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Kiểm Tra Sản Phẩm</Text>
                    <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfoContainer}>
                    <View>
                        <Text><Text style={styles.boldText}>Mã sản phẩm: </Text>{props.receiveItem?.product.productCode}</Text>
                        <Text><Text style={styles.boldText}>Tên sản phẩm: </Text>{props.receiveItem?.product.name}</Text>
                        <Text><Text style={styles.boldText}>Đơn vị tính: </Text>{props.receiveItem?.product.units[0].name}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={styles.saveButton}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.boldText}>Tình trạng sản phẩm: </Text>
                <Picker
                    style={styles.picker}
                    selectedValue={statusProduct}
                    onValueChange={(itemValue) => setStatusProduct(itemValue)}
                >
                    <Picker.Item label="Bình thường" value="NORMAL" />
                    <Picker.Item label="Bị hư hại" value="DAMAGED" />
                </Picker>

                <Text style={styles.boldText}>Số lượng kiểm tra: </Text>
                <TextInput
                    placeholder="Số lượng kiểm tra..."
                    value={numberQuantityCheck.toString()}
                    onChangeText={(text) => setNumberQuantityCheck(text)}
                    style={styles.input}
                    keyboardType="number-pad"
                />

                <View style={styles.locationSelectContainer}>
                    <Text style={styles.locationText}>
                        Chọn vị trí chứa: <Text style={locationSelect.value === "" ? styles.errorText : styles.validText}>{locationSelect.lable}</Text>
                    </Text>
                    <TouchableOpacity
                        disabled={statusProduct === "" || (numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0)}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.customizeButton}>
                            Tùy chỉnh
                        </Text>
                    </TouchableOpacity>
                </View>

                {filterLocation().length === 0 ? (
                    <Text style={styles.errorText}>Không tìm thấy vị trí chứa phù hợp</Text>
                ) : (
                    <FlatList
                        style={styles.flatList}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={filterLocation()}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <View style={[styles.locationItem, { backgroundColor: locationSelect.value !== item.value ? "#ecf0f1" : "#3498db" }]}>
                                <Text>Kệ <Text style={styles.boldText}>{item.lable}</Text> có thể chứa ({item.maxQuantityInbound})</Text>
                                <TouchableOpacity
                                    style={styles.locationButton}
                                    disabled={locationSelect.value !== "" && locationSelect.value !== item.value}
                                    onPress={() => {
                                        if (locationSelect.value === item.value) {
                                            setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
                                        } else {
                                            setLocationSelect({ value: item.value, lable: item.lable, maxQuantityInbound: item.maxQuantityInbound });
                                        }
                                    }}
                                >
                                    <Text style={[styles.locationButtonText, { color: locationSelect.value === item.value ? "#fff" : "#3498db" }]}>
                                        {locationSelect.value === item.value ? "Hủy" : "Chọn"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}
            </View>

            <ModalOptionShelf
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                typeShelf={statusProduct}
                categoryName={props.receiveItem?.product.category.name || ""}
                setLocationSelect={setLocationSelect}
                receiveItem={props.receiveItem}
                quantity={Number(numberQuantityCheck)}
                productIsCheck={props.productIsCheck}
            />
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#3498db",
    },
    productInfoContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    boldText: {
        fontWeight: "bold",
    },
    saveButton: {
        padding: 10,
        backgroundColor: "#3498db",
        borderRadius: 5,
        color: "#fff",
        fontWeight: "bold",
    },
    picker: {
        width: "100%",
        backgroundColor: "#ecf0f1",
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 5,
    },
    locationSelectContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
    },
    locationText: {
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
    },
    validText: {
        color: "#3498db",
    },
    customizeButton: {
        color: "#3498db",
        fontWeight: "bold",
    },
    flatList: {
        width: "100%",
    },
    locationItem: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    locationButton: {
        padding: 5,
        borderRadius: 5,
    },
    locationButtonText: {
        fontWeight: "bold",
    },
});


export default ModalAddLocationProductCheck;