import { GoodsReceipt, ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";
import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ModalAddLocationProductCheck from "./ModalAddLocationProductCheck";

interface ModalAddProductCheckProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    receiveOrder?: GoodsReceipt;
    addProductIsCheck: (product: ProductIsCheckType) => void;
    checkQuantityInbound: (receiveItemId: string) => number;
    productIsCheck: ProductIsCheckType[];
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
                        Danh Sách Sản Phẩm Cần Kiểm Tra
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
                                        opacity: props.checkQuantityInbound(item.id) === item.quantity ? 0.5 : 1
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
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Số lượng đã kiểm tra: </Text>
                                        {props.checkQuantityInbound(item.id)} {item.product.units[0].name}
                                    </Text>
                                    <TouchableOpacity
                                        disabled={props.checkQuantityInbound(item.id) === item.quantity}
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
                                        <Text style={{
                                            color: props.checkQuantityInbound(item.id) === item.quantity ? "#2ecc71" : "#3498db",
                                            fontWeight: "bold"
                                        }}>
                                            {
                                                props.checkQuantityInbound(item.id) === item.quantity ?
                                                    "Đã kiểm tra"
                                                    :
                                                    "Kiểm tra"
                                            }
                                        </Text>
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
                checkquantityInbound={props.checkQuantityInbound}
                productIsCheck={props.productIsCheck}
            />
        </Modal>
    )
}

export default ModalAddProductCheck;