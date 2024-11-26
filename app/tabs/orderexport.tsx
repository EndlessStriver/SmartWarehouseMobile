import GetOrderExports, { ExportOrder } from "@/service/GetOrderExports";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrderExport: React.FC = () => {
    const [orderExports, setOrderExports] = useState<ExportOrder[]>([]);

    useEffect(() => {
        GetOrderExports()
            .then((res) => {
                setOrderExports(res.data);
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể lấy dữ liệu phiếu xuất kho');
            });
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={orderExports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/orderexportdetail",
                            params: { orderExportId: item.id }
                        })}
                        style={[styles.orderItem, getStatusStyle(item.status)]}
                    >
                        <Text style={styles.orderCode}>{item.exportCode}</Text>
                        <Text style={styles.orderDate}>{item.exportDate}</Text>
                        <Text style={styles.orderBy}>{item.exportBy}</Text>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>
                                {getStatusText(item.status)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "PENDING":
            return { backgroundColor: "#f1c40f" };
        case "EXPORTED":
            return { backgroundColor: "#2ecc71" };
        case "CANCEL":
            return { backgroundColor: "#e74c3c" };
        default:
            return {};
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case "PENDING":
            return "Chờ xử lý";
        case "EXPORTED":
            return "Đã xuất kho";
        case "CANCEL":
            return "Đã hủy";
        default:
            return "Không xác định";
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: "#2c3e50",
    },
    headerButton: {
        paddingVertical: 10,
    },
    headerButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    orderItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        position: 'relative',
    },
    orderCode: {
        fontWeight: "600",
        color: "#ffffff",
    },
    orderDate: {
        fontWeight: "600",
        color: "#e67e22",
    },
    orderBy: {
        fontWeight: "600",
        color: "#34495e",
    },
    statusContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    statusText: {
        color: "#fff",
        fontWeight: '600',
    },
});

export default OrderExport;
