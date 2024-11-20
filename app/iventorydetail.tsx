import GetIventoryById, { Transaction } from "@/service/GetIventoryById";
import FormatDate from "@/unit/FormatDate";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    SectionList,
    StyleSheet,
    Text,
    View,
} from "react-native";

const InventoryDetail = () => {
    const { iventoryId } = useLocalSearchParams<{ iventoryId: string }>();
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        GetIventoryById(iventoryId)
            .then((response) => {
                setTransaction(response);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Thông báo", "Không tìm thấy thông tin phiếu kiểm kho");
            });
    }, []);

    const convertDataToSectionListData = () => {
        if (transaction) {
            return transaction?.inventory.map((inventory) => {
                return {
                    title: { name: inventory.shelves.name, typeShelf: inventory.shelves.typeShelf },
                    data: inventory.inventoryDetail.map((detail) => {
                        return {
                            locationCode: detail.location.locationCode,
                            productName: detail.products.name,
                            quantity: detail.quantity,
                            isIncrease: detail.isIncrease,
                        };
                    }),
                };
            });
        }
        return [];
    };

    return (
        <View style={styles.container}>
            <View style={styles.transactionDetails}>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Mã phiếu: </Text>
                    {transaction?.id}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Ngày lập: </Text>
                    {FormatDate(transaction?.transactionDate || "")}
                </Text>
                <Text style={styles.detailText}>
                    <Text style={styles.label}>Ghi chú: </Text>
                    {transaction?.note || "Không có"}
                </Text>
            </View>
            <SectionList
                sections={convertDataToSectionListData()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText} numberOfLines={2} ellipsizeMode="tail">
                            {item.locationCode}
                        </Text>
                        <Text style={styles.itemText} numberOfLines={2} ellipsizeMode="tail">
                            {item.productName}
                        </Text>
                        <Text style={styles.itemText} numberOfLines={2} ellipsizeMode="tail">
                            {item.quantity}
                        </Text>
                        <Text
                            style={[
                                styles.itemText,
                                item.isIncrease ? styles.increase : styles.decrease,
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.quantity === 0 ? "---------" : item.isIncrease ? "Tăng" : "Giảm"}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText} numberOfLines={1} ellipsizeMode="tail">
                                Kệ {title.name}
                            </Text>
                            <Text style={styles.sectionHeaderText} numberOfLines={1} ellipsizeMode="tail">
                                Loại kệ: {title.typeShelf === "NORMAL" ? "Thường" : "Lỗi"}
                            </Text>
                        </View>
                        <View style={[styles.itemContainer, styles.headerItemContainer]}>
                            <Text style={[styles.itemText, styles.headerItemText]}>Mã vị trí</Text>
                            <Text style={[styles.itemText, styles.headerItemText]}>Sản phẩm</Text>
                            <Text style={[styles.itemText, styles.headerItemText]}>Số lượng</Text>
                            <Text style={[styles.itemText, styles.headerItemText]}>Tăng/Giảm</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    header: {
        padding: 15,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        marginBottom: 15,
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    transactionDetails: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#eee",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#555",
        flex: 1,
        textAlign: "center",
        overflow: "hidden",
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 1,
    },
    itemText: {
        fontSize: 13,
        color: "#333",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 5,
        overflow: "hidden",
    },
    increase: {
        color: "#4CAF50",
    },
    decrease: {
        color: "#F44336",
    },
    headerItemContainer: {
        backgroundColor: "#f0f0f0",
        shadowOpacity: 0,
        elevation: 0,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    headerItemText: {
        fontWeight: "bold",
        color: "#444",
        textAlign: "center",
    },
});

export default InventoryDetail;
