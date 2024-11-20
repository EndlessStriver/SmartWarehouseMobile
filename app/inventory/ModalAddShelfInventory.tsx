import GetShelfOccupiedByLocationId from "@/service/GetShelfOccupiedByLocationId";
import { FontAwesome } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ShelfInventory } from "../createinventory";

interface ModalAddShelfInventoryProps {
    modalVisiable: boolean;
    setModalVisiable: (value: boolean) => void;
    addShelf: (data: ShelfInventory) => void;
}

const ModalAddShelfInventory: React.FC<ModalAddShelfInventoryProps> = (props) => {

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (data) {
            const index = data.lastIndexOf(".");
            let endPoint = data.substring(index + 1);
            const id = data.substring(0, index);
            switch (endPoint) {
                case "shelf": {
                    GetShelfOccupiedByLocationId(id)
                        .then((response) => {
                            props.addShelf({
                                title: { label: response[0].locationCode.split("-")[0], value: id },
                                data: response.map((item) => {
                                    return {
                                        locationId: item.id,
                                        locationCode: item.locationCode,
                                        productName: item.skus.productDetails.product.name,
                                        unit: item.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name || "",
                                        currentQuantity: item.quantity + "",
                                        iventoryQuantity: ""
                                    }
                                })
                            });
                            setData(null);
                            setScanned(false);
                            props.setModalVisiable(false);
                        })
                        .catch((error) => {
                            console.log(error);
                            Alert.alert("Thông báo", "Không tìm thấy kệ hàng nào tương ứng với mã vạch này");
                        });
                    break;
                }
                default: {
                    Alert.alert("Thông báo", "Mã vạch không hợp lệ");
                    break;
                }
            }
        }
    }, [data])

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        setData(data);
    };

    if (hasPermission === null) {
        return <Text>Đang yêu cầu quyền truy cập camera...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Không có quyền truy cập camera</Text>;
    }

    return (
        <Modal
            visible={props.modalVisiable}
            onRequestClose={() => props.setModalVisiable(false)}
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    padding: 10,
                }}
            >
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            marginTop: 15,
                            marginRight: 15,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setData(null);
                                setScanned(false);
                                props.setModalVisiable(false);
                            }}
                        >
                            <FontAwesome name="close" size={30} color="white" />
                        </TouchableOpacity>
                    </View>
                </CameraView>
                {scanned && (
                    <Button title="Quét lại" onPress={() => {
                        setData(null);
                        setScanned(false);
                    }} />
                )}
            </View>
        </Modal>
    )
}

export default ModalAddShelfInventory;