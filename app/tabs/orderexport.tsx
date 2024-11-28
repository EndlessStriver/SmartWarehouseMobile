import GetOrderExports, { ExportOrder } from "@/service/GetOrderExports";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrderExport: React.FC = () => {
    const navigation = useNavigation();
    const [tabBarBageNumber, setTabBarBageNumber] = useState(0);
    const [orderExports, setOrderExports] = useState<ExportOrder[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setOrderExports([]);
        setPage(1);
        setHasMore(true);
        setRefreshing(false);
    };

    useEffect(() => {
        if (page === 1) {
            setLoading(true);
            GetOrderExports(10, 1)
                .then(data => {
                    if (data.data.length === 0) {
                        setHasMore(false);
                    } else {
                        setOrderExports(data.data);
                        setTabBarBageNumber(data.pending);
                    }
                })
                .catch(error => {
                    Alert.alert('Error', error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(true);
            GetOrderExports(10, page)
                .then(data => {
                    if (data.data.length === 0) {
                        setHasMore(false);
                    } else {
                        setOrderExports((preData) => [...preData, ...data.data]);
                        setTabBarBageNumber(data.pending);
                    }
                })
                .catch(error => {
                    Alert.alert('Error', error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [page]);

    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarBadgeStyle: {
                color: 'white',
                backgroundColor: 'red',
            },
            tabBarBadge: tabBarBageNumber !== 0 ? tabBarBageNumber : null,

        });
    }, [navigation, tabBarBageNumber]);

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
            <FlatList
                data={orderExports}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={loadMore}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
