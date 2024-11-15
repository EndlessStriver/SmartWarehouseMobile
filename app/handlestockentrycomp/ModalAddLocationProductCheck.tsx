import { ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";
import { useEffect, useState } from "react";
import SuggestInbound from "@/service/SuggestInbound";
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
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
        setStatusProduct("");
        setLocationSelect({ value: "", lable: "Vị trí...", maxQuantityInbound: 0 });
        props.setModalVisible(false);
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
                    padding: 10,
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
                        marginBottom: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#3498db"
                        }}
                    >
                        Kiểm Tra Sản Phẩm
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
                                padding: 5,
                                backgroundColor: "#2ecc71",
                                borderRadius: 5,
                                color: "#fff",
                                fontWeight: "bold"
                            }}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Tình trạng sản phẩm: </Text>
                <Picker
                    style={{
                        width: "100%",
                        backgroundColor: "#95a5a6",
                    }}
                    selectedValue={statusProduct}
                    onValueChange={(itemValue, itemIndex) => {
                        setStatusProduct(itemValue)
                    }
                    }>
                    <Picker.Item label="Bình thường" value="NORMAL" />
                    <Picker.Item label="Bị hư hại" value="DAMAGED" />
                </Picker>
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>Số lượng kiểm tra: </Text>
                <TextInput
                    placeholder="Số lượng kiểm tra..."
                    value={numberQuantityCheck.toString()}
                    onChangeText={(text) => setNumberQuantityCheck(text)}
                    style={{
                        width: "100%",
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 5
                    }}
                    keyboardType="number-pad"
                />
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >
                    <Text style={{ fontWeight: "bold" }}>
                        Chọn vị trí chứa:
                        <Text
                            style={{
                                color: locationSelect.value === "" ? "red" : "#3498db"
                            }}
                        > {locationSelect.lable}</Text>
                    </Text>
                    <TouchableOpacity
                        disabled={(statusProduct === "" || (numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0)) ? true : false}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text
                            style={{
                                color: "#3498db",
                                fontWeight: "bold",
                                opacity: (statusProduct === "" || (numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0)) ? 0.5 : 1
                            }}
                        >Tùy chỉnh</Text>
                    </TouchableOpacity>
                </View>
                {
                    filterLocation().length === 0 ?
                        <Text style={{ color: "red" }} >Không tìm thấy vị trí chứa phù hợp</Text>
                        :
                        <FlatList
                            style={{ width: "100%" }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={filterLocation()}
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
                                    <Text>Kệ <Text style={{ fontWeight: "bold" }}>{item.lable}</Text> có thể chứa ({item.maxQuantityInbound})</Text>
                                    <TouchableOpacity
                                        style={{
                                            opacity: locationSelect.value !== "" && locationSelect.value !== item.value ? 0.5 : 1
                                        }}
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
            {
                <ModalOptionShelf
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    typeShelf={statusProduct}
                    categoryName={props.receiveItem?.product.category.name || ""}
                    setLocationSelect={setLocationSelect}
                    receiveItem={props.receiveItem}
                    quantity={Number(numberQuantityCheck)}
                />
            }
        </Modal>
    )
}

export default ModalAddLocationProductCheck;