import CreateReceiveCheck from "@/service/CreateReceiveCheck";
import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import GetStockEntryById, { ReceiveOrder } from "@/service/GetStockEntryById";
import FormatDate from "@/unit/FormatDate";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ModalAddProductCheck from "./handlestockentrycomp/ModalAddProductCheck";

export interface ProductIsCheckType {
    productName: string,
    receiveItemId: string,
    quantityCheck: number,
    statusProduct: string,
    location: { value: string, lable: string },
}

const HandleStockEntry = () => {

    const [user, setUser] = useState<User>();
    const { receiveId } = useLocalSearchParams<{ receiveId: string }>();
    const [receiveOrder, setReceiveOrder] = useState<ReceiveOrder>();
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [productIsCheck, setProductIsCheck] = useState<ProductIsCheckType[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        GetAccountInformationCurrent()
            .then((res) => {
                setUser(res)
            })
            .catch((err) => {
                Alert.alert('Error', err.message)
            })
    }, [])

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
        setProductIsCheck([...productIsCheck, product])
    }

    const checkQuantityInbound = (receiveItemId: string) => {
        return productIsCheck.reduce((acc, item) => {
            if (item.receiveItemId === receiveItemId) {
                return acc + item.quantityCheck;
            }
            return acc;
        }, 0)
    }

    const removeProductIsCheck = (index: number) => {
        setProductIsCheck(productIsCheck.filter((item, i) => i !== index))
    }

    const handleSubmit = () => {
        if (receiveOrder) {
            for (const item of receiveOrder.receiveItems) {
                if (checkQuantityInbound(item.id) !== item.quantity) {
                    Alert.alert("Error", "Số lượng sản phẩm kiểm tra chưa đủ");
                    return;
                }
            }
        }
        CreateReceiveCheck({
            receiveId: receiveOrder?.id || "",
            receiveDate: new Date().toISOString(),
            receiveBy: user?.fullName || "",
            supplierId: receiveOrder?.supplier.id || "",
            receiveItems: productIsCheck.map((item) => ({
                receiveItemId: item.receiveItemId,
                receiveQuantity: item.quantityCheck,
                itemStatus: item.statusProduct === "NORMAL" ? true : false,
                locationId: item.location.value
            }))
        })
            .then(() => {
                Alert.alert("Success", "Kiểm tra sản phẩm thành công");
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: "home" as never },
                        { name: "stockentry" as never }
                    ]
                })
            })
            .catch((err) => {
                Alert.alert("Error", err.message)
            })
    }

    return (
        <View style={styles.container}>
            {
                loading ?
                    <Text>Đang tải dữ liệu...</Text>
                    :
                    <View style={{ flex: 1, width: "100%" }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
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
                            </View>
                            <TouchableOpacity
                                disabled={productIsCheck.length === 0}
                                onPress={handleSubmit}
                                style={{
                                    opacity: productIsCheck.length === 0 ? 0.5 : 1,
                                }}
                            >
                                <Text style={{ color: "#3498db", fontWeight: "bold" }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                marginBottom: 10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: "#3498db"
                                }}
                            >
                                Danh sách sản phẩm đã kiểm tra
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={{
                                    padding: 4,
                                    borderRadius: 5,
                                    backgroundColor: "#2ecc71",
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
                                        fontSize: 14,
                                        marginTop: 10,
                                        fontWeight: "600"
                                    }}
                                >Chưa có sản phẩm nào được kiểm tra...</Text>
                                :
                                <FlatList
                                    style={{ width: "100%", marginTop: 10 }}
                                    data={productIsCheck}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                backgroundColor: "lightblue",
                                                padding: 15,
                                                marginBottom: 10,
                                                borderRadius: 5,
                                                width: "100%"
                                            }}
                                        >
                                            <View>
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
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() => removeProductIsCheck(productIsCheck.findIndex((i) => i === item))}
                                                    style={{
                                                        padding: 10,
                                                        backgroundColor: "#e74c3c",
                                                        borderRadius: 5,
                                                        marginTop: 10,
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Text style={{ color: "white", fontWeight: "bold" }}>Xóa</Text>
                                                </TouchableOpacity>
                                            </View>
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
                checkQuantityInbound={checkQuantityInbound}
                productIsCheck={productIsCheck}
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