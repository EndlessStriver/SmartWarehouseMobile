import GetLocationByShelfId, { StorageLocation } from "@/service/GetLocationByShelfId";
import { Shelf } from "@/service/GetShelfByCategoryNameAndTypeShelf";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LocationType } from "./ModalAddLocationProductCheck";
import { ReceiveItem } from "@/service/GetStockEntryById";
import ConvertUnit from "@/service/ConvertUnit";
import { ProductIsCheckType } from "../handlestockentry";

interface ModalOptionLocationProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    shelf: Shelf | null;
    // setLocationSelect: (data: LocationType) => void;
    receiveItem?: ReceiveItem
    quantity: number
    productIsCheck: ProductIsCheckType[]
}

const ModalOptionLocation: React.FC<ModalOptionLocationProps> = (props) => {

    const [locations, setLocations] = useState<StorageLocation[]>([]);
    const [valueConvertUnit, setValueConvertUnit] = useState<number>(0);

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
        return location.id === props.productIsCheck.find((product) => product.location.value === location.id)?.location.value
    }

    const isDisabled = (location: StorageLocation) => {
        let quantityIsUse = getQuantityIsUse(location);
        if (isChoose(location)) return false;
        if (quantityIsUse < (props.quantity * valueConvertUnit)) return true;
        if (location.occupied && props.receiveItem?.product.id !== location.skus?.productDetails?.product?.id) return true;
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
                                // props.setLocationSelect({
                                //     value: item.id,
                                //     lable: item.locationCode,
                                //     maxQuantityInbound: 0,
                                // });
                                props.setModalVisible(false);
                            }}
                            style={[
                                styles.locationContainer,
                                {
                                    backgroundColor: item.occupied ? '#e74c3c' : '#2ecc71',
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
                                <Text style={styles.checkIcon}>
                                    <AntDesign name="checkcircle" size={80} color="white" />
                                </Text>
                            ) : isDisabled(item) ? (
                                <Text style={styles.disabledIcon}>
                                    <FontAwesome name="ban" size={80} color="white" />
                                </Text>
                            ) : null}
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    locationContainer: {
        width: '48%',
        height: 140,
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'space-between',
        backgroundColor: '#ecf0f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    locationCode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 5,
    },
    productName: {
        fontSize: 14,
        color: '#3498db',
        marginBottom: 5,
    },
    occupiedQuantity: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    availableCapacity: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#f1c40f',
    },
    checkIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    disabledIcon: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});


export default ModalOptionLocation;