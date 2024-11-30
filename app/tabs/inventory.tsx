import GetInventories, { InventoryTransaction } from "@/service/GetInventories";
import FormatDate from "@/unit/FormatDate";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Inventory: React.FC = () => {

    const navigation = useNavigation();
    const [tabBarBageNumber, setTabBarBageNumber] = useState(0);
    const [inventories, setInventories] = useState<InventoryTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        setRefreshing(false);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            tabBarBadgeStyle: {
                color: 'white',
                backgroundColor: 'red',
            },
            tabBarBadge: tabBarBageNumber !== 0 ? tabBarBageNumber : null,

        });
    }, [navigation, tabBarBageNumber]);

    useEffect(() => {
        if (page === 1) {
            setLoading(true);
            GetInventories(page)
                .then((data) => {
                    if (data.data.length === 0) {
                        setHasMore(false);
                    }
                    setInventories(data.data);
                    setTabBarBageNumber(data.pending);
                })
                .catch((error) => console.log(error))
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            GetInventories(page)
                .then((data) => {
                    if (data.data.length === 0) {
                        setHasMore(false);
                    }
                    setInventories((preData) => [...preData, ...data.data]);
                    setTabBarBageNumber(data.pending);
                })
                .catch((error) => console.log(error))
                .finally(() => setLoading(false));
        }
    }, [page, refreshing]);

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
            {loading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <>
                    {
                        inventories.length === 0 &&
                        <Text>Không có dữ liệu</Text>
                    }
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={inventories}
                        keyExtractor={(item) => item.id}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.5}
                        onEndReached={loadMore}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={
                                    [
                                        styles.card,
                                        { backgroundColor: item.inventory[0].status === "PENDING" ? "#f1c40f" : (item.inventory[0].status === "COMPLETED" ? "#2ecc71" : "#e74c3c") }
                                    ]
                                }
                                onPress={() => {
                                    if (item.inventory[0].status === "PENDING") {
                                        router.push({
                                            pathname: "/handleinventory",
                                            params: {
                                                iventoryId: item.id,
                                            }
                                        });
                                    } else {
                                        router.push({
                                            pathname: "/iventorydetail",
                                            params: {
                                                iventoryId: item.id,
                                            }
                                        });
                                    }
                                }}
                            >
                                <Text style={[styles.label, { color: item.inventory[0].status === "CANCELLED" ? "black" : "#7f8c8d" }]}>
                                    <Text style={styles.labelBold}>Mã phiếu: </Text>
                                    {item.id}
                                </Text>
                                <Text style={[styles.label, { color: item.inventory[0].status === "CANCELLED" ? "black" : "#7f8c8d" }]}>
                                    <Text style={styles.labelBold}>Ngày tạo: </Text>
                                    {FormatDate(item.create_at)}
                                </Text>
                                <Text style={[styles.label, { color: item.inventory[0].status === "CANCELLED" ? "black" : "#7f8c8d" }]}>
                                    <Text style={styles.labelBold}>Ghi chú: </Text>
                                    {item.note || "Không có ghi chú"}
                                </Text>
                                <Text style={[styles.label, { color: item.inventory[0].status === "CANCELLED" ? "black" : "#7f8c8d" }]}>
                                    <Text style={styles.labelBold}>Trạng thái: </Text>
                                    {item.inventory[0].status === "PENDING" ? "Chờ xử lý" : (item.inventory[0].status === "COMPLETED" ? "Đã xử lý" : "Đã hủy")}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    headerButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#3498db",
        borderRadius: 5,
    },
    headerButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 15,
    },
    card: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderColor: "#ecf0f1",
        borderWidth: 1,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    labelBold: {
        fontWeight: "bold",
        color: "#2c3e50",
    },
});

export default Inventory;
