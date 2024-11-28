import GetLocationByShelfId, { StorageLocation } from "@/service/GetLocationByShelfId";
import { Shelf } from "@/service/GetShelfByCategoryNameAndTypeShelf";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LocationType } from "./ModalAddLocationProductCheck";
import { ReceiveItem } from "@/service/GetStockEntryById";
import ConvertUnit from "@/service/ConvertUnit";
import { ProductIsCheckType } from "../handlestockentry";

interface ModalOptionLocationProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    shelf: Shelf | null;
    addLocationSelect: (location: LocationType) => void;
    receiveItem?: ReceiveItem
    quantity: number
    productIsCheck: ProductIsCheckType[]
    locationIsSelect: LocationType[]
}

const ModalOptionLocation: React.FC<ModalOptionLocationProps> = (props) => {

    const [locations, setLocations] = useState<StorageLocation[]>([]);
    const [valueConvertUnit, setValueConvertUnit] = useState<number>(0);
    const [inputQuantity, setInputQuantity] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [locationIsChoose, setLocationIsChoose] = useState<StorageLocation | null>(null);

    useEffect(() => {
        setInputQuantity(props.quantity - getQuantityIsAddLocation() + "");
    }, [props.quantity, props.locationIsSelect])

    useEffect(() => {
        if (props.shelf?.id) {
            GetLocationByShelfId(props.shelf.id)
                .then((res) => {
                    setLocations(res);
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Lỗi", "Không thể lấy dữ liệu vị trí kệ");
                });
        }
    }, [props.shelf?.id])

    useEffect(() => {
        if (props.receiveItem) {
            ConvertUnit(props.receiveItem.unit.id, props.quantity)
                .then((res) => {
                    setValueConvertUnit(res);
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert("Lỗi", "Không thể chuyển đổi đơn vị");
                })
        }
    }, [props.receiveItem, props.quantity])

    const getVolumn = () => {
        let dimension = props.receiveItem?.sku.dimension;
        return dimension?.split("x").reduce((acc, cur) => acc * Number(cur), 1) || 0;
    }

    const getQuantityIsUse = (location: StorageLocation) => {
        let quantityIsUseVolumn = (Number(location.maxCapacity) - Number(location.currentCapacity)) / (getVolumn() * valueConvertUnit);
        let quantityIsUseWeight = (Number(location.maxWeight) - Number(location.currentWeight)) / (Number(props.receiveItem?.sku.weight) * valueConvertUnit);
        return Math.min(quantityIsUseVolumn, quantityIsUseWeight);
    }

    const isChoose = (location: StorageLocation) => {
        return location.id === props.productIsCheck.find((product) => product.location.value === location.id)?.location.value ||
            props.locationIsSelect.find((mylocation) => mylocation.value === location.id) !== undefined;
    }

    const isDisabled = (location: StorageLocation) => {
        let quantityIsUse = getQuantityIsUse(location);
        if (isChoose(location)) return false;
        if (quantityIsUse < (props.quantity * valueConvertUnit)) return true;
        if (location.occupied && props.receiveItem?.product.id !== location.skus?.productDetails?.product?.id) return true;
    }

    const getQuantityIsAddLocation = () => {
        let quantity = props.locationIsSelect.reduce((acc, cur) => {
            return acc + Number(cur.inputQuantity);
        }, 0);
        return quantity;
    }

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="fade"
        >
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>
                        Danh Sách Vị Trí Kệ {props.shelf?.name || ''}
                    </Text>
                    <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                        <FontAwesome name="close" size={30} color="#333" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={locations}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={isDisabled(item) || isChoose(item)}
                            onPress={() => {
                                setLocationIsChoose(item);
                                setShowModal(true);
                            }}
                            style={[
                                styles.locationContainer,
                                {
                                    backgroundColor: item.occupied ? '#FF6B6B' : '#4CAF50',
                                    opacity: isChoose(item) || isDisabled(item) ? 0.6 : 1,
                                },
                            ]}
                        >
                            <Text style={styles.locationCode}>{item.locationCode}</Text>
                            <Text style={styles.productName}>
                                {item.skus?.productDetails?.product?.name || 'Đang trống'}
                            </Text>
                            {item.occupied && (
                                <Text style={styles.occupiedQuantity}>
                                    Đang chứa: {item.quantity} {item.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name}
                                </Text>
                            )}
                            <Text style={styles.availableCapacity}>
                                Có thể chứa: {Math.floor(getQuantityIsUse(item))} {props.receiveItem?.unit.name}
                            </Text>
                            {isChoose(item) ? (
                                <AntDesign name="checkcircle" size={24} color="white" />
                            ) : isDisabled(item) ? (
                                <FontAwesome name="ban" size={24} color="white" />
                            ) : null}
                        </TouchableOpacity>
                    )}
                />
            </View>

            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalInputContainer}>
                        <Text style={styles.modalInputTitle}>Nhập số lượng muốn nhập:</Text>
                        <TextInput
                            placeholder="Nhập số lượng..."
                            value={inputQuantity}
                            onChangeText={(text) => setInputQuantity(text)}
                            keyboardType="numeric"
                            style={styles.inputField}
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowModal(false);
                                    setInputQuantity("");
                                }}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (inputQuantity === "") {
                                        Alert.alert("Lỗi", "Vui lòng nhập số lượng");
                                        return;
                                    }
                                    if (Number(inputQuantity) > Math.floor(getQuantityIsUse(locationIsChoose || locations[0]))) {
                                        Alert.alert("Lỗi", "Số lượng nhập không được vượt quá số lượng mà kệ có thể chứa");
                                        return;
                                    }
                                    if (Number(inputQuantity) + getQuantityIsAddLocation() > props.quantity) {
                                        Alert.alert("Lỗi", "Tổng số lượng nhập của sản phẩm không được vượt quá số lượng cần kiểm tra của sản phẩm");
                                        return;
                                    }
                                    props.addLocationSelect({
                                        value: locationIsChoose?.id || "",
                                        lable: locationIsChoose?.locationCode || "",
                                        maxQuantityInbound: Math.floor(getQuantityIsUse(locationIsChoose || locations[0])),
                                        inputQuantity: inputQuantity,
                                        isCheck: true,
                                    });
                                    setShowModal(false);
                                    setInputQuantity("");
                                    props.setModalVisible(false);
                                }}
                                style={[styles.modalButton, styles.confirmButton]}
                            >
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34495e',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    locationContainer: {
        width: '48%',
        height: 140,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    locationCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    productName: {
        fontSize: 14,
        color: '#ecf0f1',
    },
    occupiedQuantity: {
        fontSize: 12,
        color: '#FFEB3B',
    },
    availableCapacity: {
        fontSize: 12,
        color: '#f1c40f',
    },

    // Modal input
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalInputContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalInputTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    inputField: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    confirmButton: {
        backgroundColor: '#2ecc71',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});



export default ModalOptionLocation;