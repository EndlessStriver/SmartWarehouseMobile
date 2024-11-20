import { GoodsReceipt, ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Danh Sách Kiểm Tra</Text>
                    <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {props.receiveOrder ? (
                    <FlatList
                        style={styles.list}
                        data={props.receiveOrder.receiveItems}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.itemContainer,
                                    {
                                        opacity: props.checkQuantityInbound(item.id) === item.quantity ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <Text>
                                    <Text style={styles.bold}>Mã sản phẩm: </Text>
                                    {item.product.productCode}
                                </Text>
                                <Text>
                                    <Text style={styles.bold}>Tên sản phẩm: </Text>
                                    {item.product.name}
                                </Text>
                                <Text>
                                    <Text style={styles.bold}>Số lượng nhập: </Text>
                                    {item.quantity} {item.product.units[0].name}
                                </Text>
                                <Text>
                                    <Text style={styles.bold}>Số lượng đã kiểm tra: </Text>
                                    {props.checkQuantityInbound(item.id)} {item.product.units[0].name}
                                </Text>

                                <TouchableOpacity
                                    disabled={props.checkQuantityInbound(item.id) === item.quantity}
                                    onPress={() => {
                                        setReceiveItem(item);
                                        setModalVisible(true);
                                    }}
                                    style={styles.checkButton}
                                >
                                    <Text
                                        style={{
                                            color:
                                                props.checkQuantityInbound(item.id) === item.quantity
                                                    ? "#2ecc71"
                                                    : "#3498db",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {props.checkQuantityInbound(item.id) === item.quantity
                                            ? "Đã kiểm tra"
                                            : "Kiểm tra"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noInfoText}>Không có thông tin</Text>
                )}
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

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3498db',
    },
    list: {
        width: '100%',
    },
    itemContainer: {
        backgroundColor: '#ecf0f1',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        position: 'relative',
    },
    bold: {
        fontWeight: 'bold',
    },
    checkButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    noInfoText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 20,
    },
});


export default ModalAddProductCheck;