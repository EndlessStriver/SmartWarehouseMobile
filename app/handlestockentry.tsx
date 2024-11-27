import CreateReceiveCheck from "@/service/CreateReceiveCheck";
import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import GetStockEntryById, { GoodsReceipt } from "@/service/GetStockEntryById";
import FormatDate from "@/unit/FormatDate";
import { router, useLocalSearchParams } from "expo-router";
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
    const [receiveOrder, setReceiveOrder] = useState<GoodsReceipt>();
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [productIsCheck, setProductIsCheck] = useState<ProductIsCheckType[]>([]);

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

    const addProductIsCheck = (products: ProductIsCheckType[]) => {
        setProductIsCheck([...productIsCheck, ...products])
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
        if (!receiveOrder) return;

        for (const item of receiveOrder.receiveItems) {
            if (checkQuantityInbound(item.id) !== item.quantity) {
                Alert.alert("Lỗi", "Số lượng sản phẩm kiểm tra chưa đủ");
                return;
            }
        }

        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xử lý phiếu nhập kho này?",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    onPress: () => {
                        CreateReceiveCheck({
                            receiveId: receiveOrder?.id || "",
                            receiveDate: new Date().toISOString(),
                            receiveBy: user?.fullName || "",
                            supplierId: receiveOrder?.supplier.id || "",
                            receiveItems: productIsCheck.map((item) => ({
                                receiveItemId: item.receiveItemId,
                                receiveQuantity: item.quantityCheck,
                                itemStatus: item.statusProduct === "NORMAL" ? true : false,
                                locationId: item.location.value,
                            })),
                        })
                            .then(() => {
                                Alert.alert("Thành công", "Kiểm tra sản phẩm thành công");
                                router.replace("/tabs/stockentry");
                            })
                            .catch((err) => {
                                Alert.alert("Lỗi", err.message);
                            });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            ) : (
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Mã phiếu nhập: </Text>
                                {receiveOrder?.receiveCode}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Ngày tạo: </Text>
                                {FormatDate(receiveOrder?.create_at?.toString() || "")}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Người tạo: </Text>
                                {receiveOrder?.receiveBy || ""}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.boldText}>Nhà cung cấp: </Text>
                                {receiveOrder?.supplier?.name || ""}
                            </Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                disabled={productIsCheck.length === 0}
                                onPress={handleSubmit}
                                style={{
                                    opacity: productIsCheck.length === 0 ? 0.5 : 1,
                                }}
                            >
                                <Text style={styles.confirmText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.productHeader}>
                        <Text style={styles.productHeaderText}>
                            Danh Sách Đã Kiểm Tra
                        </Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonText}>Thêm +</Text>
                        </TouchableOpacity>
                    </View>

                    {productIsCheck.length === 0 ? (
                        <Text style={styles.noProductText}>
                            Chưa có sản phẩm nào được kiểm tra...
                        </Text>
                    ) : (
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={productIsCheck}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.productItem}>
                                    <View>
                                        <Text>
                                            <Text style={styles.boldText}>Mã sản phẩm: </Text>
                                            {item.productName}
                                        </Text>
                                        <Text>
                                            <Text style={styles.boldText}>Số lượng kiểm tra: </Text>
                                            {item.quantityCheck}
                                        </Text>
                                        <Text>
                                            <Text style={styles.boldText}>Tình trạng sản phẩm: </Text>
                                            {item.statusProduct === "NORMAL" ? "Bình thường" : "Hư hại"}
                                        </Text>
                                        <Text>
                                            <Text style={styles.boldText}>Vị trí chứa: </Text>
                                            {item.location?.lable || ""}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => removeProductIsCheck(productIsCheck.findIndex(i => i === item))}
                                    >
                                        <Text style={styles.deleteButtonText}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            )}
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
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#7f8c8d',
    },
    contentContainer: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    confirmText: {
        color: '#3498db',
        fontWeight: 'bold',
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    productHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3498db',
    },
    addButton: {
        padding: 5,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noProductText: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#ecf0f1',
        borderRadius: 5,
        marginBottom: 10,
    },
    deleteButtonText: {
        color: '#e74c3c',
        fontWeight: 'bold',
    },
});

export default HandleStockEntry