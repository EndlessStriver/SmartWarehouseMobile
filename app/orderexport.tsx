import GetOrderExports, { ExportOrder } from "@/service/GetOrderExports";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrderExport: React.FC = () => {

    const navigation = useNavigation();
    const [orderExports, setOrderExports] = useState<ExportOrder[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 1,
        totalPage: 0,
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => router.push("/createorderexport")}
                >
                    <Text style={{ color: "#ffffff" }}>Tạo Phiếu Xuất +</Text>
                </TouchableOpacity>
            ),
        });
    })

    useEffect(() => {
        GetOrderExports()
            .then((res) => {
                setOrderExports(res.data);
                setPagination({
                    limit: res.limit,
                    offset: res.offset,
                    totalPage: res.totalPage,
                });
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể lấy dữ liệu phiếu xuất kho');
            });
    }, [])

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 10,
                }}
            >Danh Sách Phiếu Xuất Kho</Text>
            <FlatList
                style={{
                    width: '100%',
                }}
                data={orderExports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push({
                            pathname: "/orderexportdetail",
                            params: {
                                orderExportId: item.id
                            }
                        })}
                        style={{
                            marginBottom: 10,
                            backgroundColor: item.status === "PENDING" ? "#f1c40f" : (item.status === "EXPORTED") ? "#2ecc71" : "#e74c3c",
                            padding: 10,
                            borderRadius: 5,
                            position: 'relative',
                        }}
                    >
                        <Text style={{ fontWeight: "600", color: "#ffffff" }}>{item.exportCode}</Text>
                        <Text style={{ fontWeight: "600", color: "#e74c3c" }}>{item.exportDate}</Text>
                        <Text style={{ fontWeight: "600", color: "#34495e" }}>{item.exportBy}</Text>
                        <View
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: '600',
                                }}
                            >{item.status === "PENDING" ? "Chở xử lý" : (item.status === "EXPORTED") ? "Đã xuất kho" : "Đã hủy"}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
    },
});

export default OrderExport;