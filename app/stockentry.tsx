import GetReceives, { ReceiveRecord } from "@/service/GetReceives";
import FormatDate from "@/unit/FormatDate";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StockEntry: React.FC = () => {

    const [receives, setReceives] = useState<ReceiveRecord[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        router.push({ pathname: '/createstockentry' })
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Tạo Phiếu +</Text>
                </TouchableOpacity>
            ),
        })
    }, [navigation])

    useEffect(() => {
        setLoading(true);
        GetReceives(10, page)
            .then(data => {
                if (data.data.length === 0) {
                    setHasMore(false);
                } else {
                    setReceives((preData) => [...preData, ...data.data]);
                }
            })
            .catch(error => {
                Alert.alert('Error', error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prePage) => prePage + 1);
        }
    }

    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size="large" color="#3498db" />;
    };

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#34495e"
            }}>Danh Sách Phiếu Nhập Kho</Text>
            <FlatList
                style={{
                    width: '100%'
                }}
                data={receives}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.75}
                onEndReached={loadMore}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (item.status === "COMPLETERECEIVECHECK") {
                                router.push({
                                    pathname: '/stockentrydetail',
                                    params: {
                                        receiveId: item.id
                                    }
                                });
                            } else {
                                router.push({
                                    pathname: '/handlestockentry',
                                    params: {
                                        receiveId: item.id
                                    }
                                });
                            }
                        }}
                        style={{
                            padding: 15,
                            marginBottom: 12,
                            borderRadius: 8,
                            backgroundColor: item.status === "COMPLETERECEIVECHECK" ? "#2ecc71" : (item.status === "PENDING") ? "#f39c12" : "#e74c3c",
                            position: 'relative',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 5,
                            elevation: 3,
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={{ fontWeight: "600", color: "#ffffff", fontSize: 16 }}>{item.receiveCode}</Text>
                        <Text style={{
                            fontWeight: "600",
                            color: item.status === "PENDING" ? "#c0392b" : "#f39c12",
                            fontSize: 14
                        }}>
                            {FormatDate(item.receiveDate)}
                        </Text>
                        <Text style={{ fontWeight: "600", color: "#34495e", fontSize: 14 }}>{item.receiveBy}</Text>
                        <Text style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontSize: 12,
                            textTransform: 'uppercase',
                        }}>
                            {item.status === "COMPLETERECEIVECHECK" ? "Đã nhập kho" : (item.status === "PENDING") ? "Chờ Xử Lý" : "Đã hủy"}
                        </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
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

export default StockEntry;