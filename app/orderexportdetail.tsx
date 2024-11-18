import CancelOrderExportById from "@/service/CancelOrderExportById";
import ConfirmOrderExportById from "@/service/ConfirmOrderExportById";
import GetOrderExportById, { ExportOrder } from "@/service/GetOrderExportById";
import FormatDate from "@/unit/FormatDate";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrderExportDetail = () => {

    const navigate = useNavigation();
    const { orderExportId } = useLocalSearchParams<{ orderExportId: string }>();
    const [orderExport, setOrderExport] = useState<ExportOrder | null>(null);

    useEffect(() => {
        GetOrderExportById(orderExportId)
            .then((res) => {
                setOrderExport(res);
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể lấy dữ liệu phiếu xuất kho');
            });
    }, [orderExportId])

    const cancelOrderExport = () => {
        CancelOrderExportById(orderExportId)
            .then(() => {
                Alert.alert('Thành công', 'Hủy phiếu xuất kho thành công');
                navigate.reset({
                    index: 1,
                    routes: [
                        { name: "home" as never },
                        { name: "orderexport" as never }
                    ]
                })
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể hủy phiếu xuất kho');
            });
    }

    const confirmOrderExport = () => {
        ConfirmOrderExportById(orderExportId)
            .then(() => {
                Alert.alert('Thành công', 'Xác nhận xuất kho thành công');
                navigate.reset({
                    index: 1,
                    routes: [
                        { name: "home" as never },
                        { name: "orderexport" as never }
                    ]
                })
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể xác nhận xuất kho');
            });
    }

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: '600',
                    marginBottom: 10,
                    color: "#3498db"
                }}
            >Chi Tiết Phiếu Xuất Kho</Text>
            <View
                style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: orderExport?.status === "PENDING" ? "#f1c40f" : (orderExport?.status === "EXPORTED") ? "#2ecc71" : "#e74c3c",
                    marginBottom: 10,
                }}
            >
                <View>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Mã phiếu xuất kho: </Text>
                        {orderExport?.exportCode}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Ngày tạo: </Text>
                        {FormatDate(orderExport?.create_at || "")}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Người tạo: </Text>
                        {orderExport?.exportBy}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Trạng thái: </Text>
                        {orderExport?.status === "PENDING" ? "Chờ xác nhận" : (orderExport?.status === "EXPORTED") ? "Đã xuất" : "Đã hủy"}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Tổng số lượng sản phẩm: </Text>
                        {orderExport?.totalQuantity}
                    </Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Ghi chú: </Text>
                        {orderExport?.description}
                    </Text>
                </View>
                {
                    orderExport?.status === "PENDING" &&
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn hủy phiếu này?', [
                                    {
                                        text: 'Hủy',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Xác nhận',
                                        onPress: () => cancelOrderExport()
                                    }
                                ]);
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: '600',
                                    backgroundColor: "#e74c3c",
                                    padding: 10,
                                    borderRadius: 5,
                                    textAlign: 'center',
                                    marginTop: 10,
                                }}
                            >Hủy phiếu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xuất kho phiếu này?', [
                                    {
                                        text: 'Hủy',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Xác nhận',
                                        onPress: () => confirmOrderExport()
                                    }
                                ]);
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: '600',
                                    backgroundColor: "#2ecc71",
                                    padding: 10,
                                    borderRadius: 5,
                                    textAlign: 'center',
                                    marginTop: 10,
                                }}
                            >Xuất kho</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: "#3498db"
                }}
            >Danh sách sản phẩm xuất kho</Text>
            <FlatList
                style={{
                    width: '100%',
                    marginTop: 10,
                }}
                data={orderExport?.orderExportDetails}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            marginBottom: 10,
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: item.itemStatus ? "#2ecc71" : "#e74c3c",
                        }}
                    >
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Mã SKU: </Text>
                            {item.sku.skuCode}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                            {item.product.name}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Số lượng: </Text>
                            {item.quantity}
                        </Text>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>Vị trí xuất: </Text>
                            {item.locationExport.map((location) => location.locationCode).join(", ")}
                        </Text>
                    </View>
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

export default OrderExportDetail;