import GetLocationByShelfId, { StorageLocation } from "@/service/GetLocationByShelfId";
import { Shelf } from "@/service/GetShelfByCategoryNameAndTypeShelf";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { LocationType } from "./ModalAddLocationProductCheck";
import { ReceiveItem } from "@/service/GetStockEntryById";
import ConvertUnit from "@/service/ConvertUnit";

interface ModalOptionLocationProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    shelf: Shelf | null;
    setLocationSelect: (data: LocationType) => void;
    receiveItem?: ReceiveItem
    quantity: number
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
            ConvertUnit(props.receiveItem.product.units[0].id, props.quantity)
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

    const isDisabled = (location: StorageLocation) => {
        let quantityIsUse = getQuantityIsUse(location);
        if (quantityIsUse < (props.quantity * valueConvertUnit)) return true;
        if (location.occupied && props.receiveItem?.product.id !== location.skus?.productDetails?.product?.id) return true;
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
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#3498db",
                        }}
                    >
                        Danh Sách Vị Trí Kệ {props.shelf?.name || ""}
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{
                        width: "100%",
                    }}
                    data={locations}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={isDisabled(item)}
                            onPress={() => {
                                props.setLocationSelect({
                                    value: item.id,
                                    lable: item.locationCode,
                                    maxQuantityInbound: 0
                                });
                                props.setModalVisible(false);
                            }}
                            style={{
                                width: 180,
                                height: 120,
                                padding: 10,
                                backgroundColor: item.occupied ? "#e74c3c" : "#2ecc71",
                                marginBottom: 10,
                                borderRadius: 5,
                                position: "relative",
                                opacity: isDisabled(item) ? 0.5 : 1
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    color: "#fff",
                                }}
                            >
                                {item.locationCode}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: "#fff",
                                    fontWeight: "bold"
                                }}
                            >
                                {item.skus?.productDetails?.product?.name || "Đang trống"}
                            </Text>
                            {
                                item.occupied &&
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: "#fff",
                                    }}
                                >
                                    Số lượng: {item.quantity} {item.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name}
                                </Text>
                            }
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: "#fff",
                                }}
                            >
                                Có thể chứa: {getQuantityIsUse(item)} {props.receiveItem?.product.units.find((unit) => unit.isBaseUnit)?.name}
                            </Text>
                            {
                                isDisabled(item) &&
                                <Text
                                    style={{
                                        position: "absolute",
                                        top: 20,
                                        left: 50,
                                    }}
                                >
                                    <FontAwesome name="ban" size={80} color="white" />
                                </Text>
                            }
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    )
}

export default ModalOptionLocation;