import { ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";
import { useEffect, useState } from "react";
import SuggestInbound from "@/service/SuggestInbound";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ModalOptionShelf from "./ModalOptionShelf";
import ModalRecomentAddProductToLocation from "./ModalRecomentAddProductToLocation";

interface ModalAddLocationProductCheckProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    receiveItem?: ReceiveItem,
    addProductIsCheck: (products: ProductIsCheckType[]) => void;
    checkquantityInbound: (receiveItemId: string) => number;
    productIsCheck: ProductIsCheckType[];
}

export interface LocationType {
    value: string,
    lable: string,
    maxQuantityInbound: number,
    inputQuantity: string,
    isCheck: boolean,
}

const ModalAddLocationProductCheck: React.FC<ModalAddLocationProductCheckProps> = (props) => {

    const [numberQuantityCheck, setNumberQuantityCheck] = useState("");
    const [statusProduct, setStatusProduct] = useState("NORMAL");
    const [locationSelect, setLocationSelect] = useState<LocationType[]>([]);
    const [locations, setLocations] = useState<LocationType[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalRecomentAddProductToLocation, setModalRecomentAddProductToLocation] = useState(false);

    useEffect(() => {
        setNumberQuantityCheck(props.receiveItem?.quantity.toString() || "");
    }, [props.receiveItem])

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
                            maxQuantityInbound: item.maxQuantityInbound,
                            inputQuantity: item.maxQuantityInbound < (props.receiveItem?.quantity || 0) ? item.maxQuantityInbound.toString() : (props.receiveItem?.quantity || 0).toString(),
                            isCheck: false,
                        })))
                    })
            }
        }, 500);
        return () => clearTimeout(id);
    }, [numberQuantityCheck, statusProduct, props.receiveItem])

    useEffect(() => {
        const id = setTimeout(() => {
            if (validateNumber(numberQuantityCheck) || Number(numberQuantityCheck) <= 0) {
                setLocationSelect([]);
                setLocations([]);
            }
        }, 500);
        return () => clearTimeout(id);
    }, [numberQuantityCheck, statusProduct])

    useEffect(() => {
        const newLocations = locations.map((location) => {
            let a = locationSelect.find((item) => item.value === location.value)
            if (a) {
                return {
                    ...location,
                    inputQuantity: a.inputQuantity,
                    isCheck: true,
                }
            } else {
                return {
                    ...location,
                    inputQuantity: location.maxQuantityInbound.toString(),
                    isCheck: false,
                }
            }
        })
        setLocations(newLocations);
    }, [locationSelect])

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

    const checkLocationIsSelect = (value: string) => {
        let check = false;
        locationSelect.forEach((location) => {
            if (location.value === value) {
                check = true;
            }
        })
        return check;
    }

    const filterLocation = () => {
        return locations.filter((item) => checkLocationInProductIsCheck(item.value) === false && checkLocationIsSelect(item.value) === false)
    }

    const addLocationSelect = (location: LocationType) => {
        if (locationSelect.length === 0) {
            setLocationSelect([location]);
            return;
        }
        if (locationSelect.length > 0) {
            let check = false;
            locationSelect.forEach((item) => {
                if (item.value === location.value) {
                    check = true;
                }
            })
            if (check === false) {
                setLocationSelect([...locationSelect, location]);
            } else {
                Alert.alert("Lỗi", "Vị trí này đã được chọn");
            }
        }
    }

    const handleSubmit = () => {
        if (numberQuantityCheck === "" || !validateNumber(numberQuantityCheck)) {
            Alert.alert("Lỗi", "Số lượng kiểm tra không hợp lệ");
            return;
        }
        if (Number(numberQuantityCheck) + props.checkquantityInbound(props.receiveItem?.id || "") > Number(props.receiveItem?.quantity) || 0) {
            Alert.alert("Lỗi", "Số lượng kiểm tra không được lớn hơn số lượng cần nhập");
            return;
        }
        if (statusProduct === "") {
            Alert.alert("Lỗi", "Vui lòng chọn tình trạng sản phẩm");
            return;
        }
        if (locationSelect.length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn vị tri chứa sản phẩm");
            return;
        }
        if (locationSelect.reduce((acc, location) => acc + (Number(location.inputQuantity)), 0) !== Number(numberQuantityCheck)) {
            Alert.alert("Lỗi", "Tổng số lượng nhập vào các vị trí không bằng số lượng kiểm tra");
            return;
        }
        props.addProductIsCheck(locationSelect.map((location) => {
            return {
                productName: props.receiveItem?.product.name || "",
                receiveItemId: props.receiveItem?.id || "",
                quantityCheck: Number(location.inputQuantity),
                statusProduct: statusProduct,
                location: {
                    lable: location.lable,
                    value: location.value,
                }
            }
        }));
        setNumberQuantityCheck("");
        setStatusProduct("NORMAL");
        setLocationSelect([]);
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
                    <TouchableOpacity onPress={() => {
                        props.setModalVisible(false)
                        setNumberQuantityCheck("");
                        setStatusProduct("NORMAL");
                        setLocationSelect([]);
                    }}>
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.productInfoContainer}>
                    <View>
                        <Text><Text style={styles.boldText}>Mã sản phẩm: </Text>{props.receiveItem?.product.productCode}</Text>
                        <Text><Text style={styles.boldText}>Tên sản phẩm: </Text>{props.receiveItem?.product.name}</Text>
                        <Text><Text style={styles.boldText}>Số lượng cần kiểm tra: </Text>{props.receiveItem?.quantity}</Text>
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
                        Danh sách vị trí chứa sản phẩm
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                opacity: (numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0) ? 0.5 : 1
                            }}
                            disabled={numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0}
                            onPress={() => setModalRecomentAddProductToLocation(true)}
                        >
                            <Text style={{ color: "#e67e22", fontWeight: "bold" }}>Đề xuất</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                opacity: (numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0) ? 0.5 : 1
                            }}
                            disabled={numberQuantityCheck === "" || Number(numberQuantityCheck) <= 0}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={{ color: "#3498db", fontWeight: "bold" }}>Tùy chỉnh</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    locationSelect.length > 0 ?
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={styles.flatList}
                            data={locationSelect}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <View style={styles.locationItem}>
                                    <Text style={styles.locationText}>
                                        Kệ <Text style={styles.boldText}>{item.lable}</Text> số lượng{" "} <Text style={styles.boldText}>({item.inputQuantity})</Text>
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setLocationSelect(locationSelect.filter((location) => location.value !== item.value))
                                        }}
                                    >
                                        <Text style={{ color: "red" }}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        :
                        <Text style={{ color: "#7f8c8d", textAlign: "center" }}>Chưa chọn vị trí chứa sản phẩm</Text>
                }
            </View>
            <ModalOptionShelf
                isModalVisible={isModalVisible}
                setModalVisible={setModalVisible}
                typeShelf={statusProduct}
                categoryName={props.receiveItem?.product.category.name || ""}
                addLocationSelect={addLocationSelect}
                receiveItem={props.receiveItem}
                quantity={Number(numberQuantityCheck)}
                productIsCheck={props.productIsCheck}
                locationIsSelect={locationSelect}
            />
            <ModalRecomentAddProductToLocation
                isModalVisible={isModalRecomentAddProductToLocation}
                setModalVisible={() => setModalRecomentAddProductToLocation(false)}
                recomentLocation={locations}
                setLocationsSelected={setLocationSelect}
                numberQuantityCheck={numberQuantityCheck}
                locationIsSelect={locationSelect}
            />
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
    },
    productInfoContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    boldText: {
        fontWeight: "600",
        color: "#34495E",
    },
    saveButton: {
        padding: 12,
        backgroundColor: "#1ABC9C",
        borderRadius: 5,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign: "center",
        marginTop: 10,
    },
    picker: {
        backgroundColor: "#ECF0F1",
        marginVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#D0D3D4",
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#D0D3D4",
        backgroundColor: "#FFFFFF",
        marginTop: 5,
        fontSize: 16,
    },
    locationSelectContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 20,
    },
    locationText: {
        fontWeight: "700",
        color: "#2C3E50",
    },
    flatList: {
        marginTop: 10,
    },
    locationItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    locationButtonText: {
        color: "#E74C3C",
        fontWeight: "600",
    },
    customizeButton: {
        color: "#3498DB",
        fontWeight: "600",
    },
});



export default ModalAddLocationProductCheck;