import GetReceiveCheckByStockEntryId, { Receipt } from "@/service/GetReceiveCheckByStockEntryId";
import FormatDate from "@/unit/FormatDate";
import formatDateTimeVietNamHaveTime from "@/unit/FormatDateVNHaveTime";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

const StockEntryDetail = () => {
    const { receiveId } = useLocalSearchParams<{ receiveId: string }>();
    const [receiveCheck, setReceiveCheck] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        GetReceiveCheckByStockEntryId(receiveId)
            .then(data => {
                setReceiveCheck(data);
            })
            .catch(error => {
                Alert.alert('Error', error.message);
            })
            .finally(() => setLoading(false));
    }, [receiveId]);

    return (
        <View style={styles.container}>
            {loading && <Text>Loading...</Text>}
            {receiveCheck && (
                <View style={{ flex: 1, width: "100%" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: "#3498db"
                        }}>Thông Tin Phiếu Nhập</Text>
                        <Text>
                            <Text style={styles.fontweight} >Mã phiếu: </Text>
                            {receiveCheck.id}
                        </Text>
                        <Text>
                            <Text style={styles.fontweight} >Ngày tạo: </Text>
                            {formatDateTimeVietNamHaveTime(receiveCheck.create_at)}
                        </Text>
                        <Text>
                            <Text style={styles.fontweight} >Người lập: </Text>
                            {receiveCheck.receiveBy}
                        </Text>
                        <Text>
                            <Text style={styles.fontweight} >Tổng số lượng: </Text>
                            {receiveCheck.totalReceiveQuantity}
                        </Text>
                    </View>
                    <View style={{ flex: 5 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: "#3498db"
                        }}>Danh Sách Kiểm Tra</Text>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={receiveCheck.checkItems}
                            renderItem={({ item }) => (
                                <View style={styles.receiveCheck}>
                                    <Text>
                                        <Text style={styles.fontweight} >Mã sản phẩm: </Text>
                                        {item.product.productCode}
                                    </Text>
                                    <Text>
                                        <Text style={styles.fontweight} >Tên sản phẩm: </Text>
                                        {item.product.name}
                                    </Text>
                                    <Text>
                                        <Text style={styles.fontweight} >Số lượng kiểm tra: </Text>
                                        {item.receiveQuantity}
                                    </Text>
                                    <Text>
                                        <Text style={styles.fontweight} >Trạng thái: </Text>
                                        {item.itemStatus ? "Bình thường" : "Lỗi"}
                                    </Text>
                                    <Text>
                                        <Text style={styles.fontweight} >Vị trí: </Text>
                                        {item.locations[0]?.locationCode || "Chưa xác định"}
                                    </Text>
                                </View>
                            )}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
            )}
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
    receiveCheck: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#bdc3c7',
    },
    fontweight: {
        fontWeight: '600',
    }
});

export default StockEntryDetail;