import GetReceives, { ReceiveRecord } from "@/service/GetReceives";
import formatDateTimeVietNamHaveTime from "@/unit/FormatDateVNHaveTime";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StockEntry: React.FC = () => {

    const navigation = useNavigation();
    const [receives, setReceives] = useState<ReceiveRecord[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [tabBarBageNumber, setTabBarBageNumber] = useState(0);
    const [resset, setResset] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        setResset(!resset);
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
        if (hasMore) {
            if (page === 1) {
                setLoading(true);
                GetReceives(10, page)
                    .then(data => {
                        if (data.data.length === 0) {
                            setHasMore(false);
                        } else {
                            setReceives(data.data);
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
                GetReceives(10, page)
                    .then(data => {
                        if (data.data.length === 0) {
                            setHasMore(false);
                        } else {
                            setReceives((preData) => [...preData, ...data.data]);
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
        }
    }, [page, resset]);

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
                style={{
                    width: '100%',
                    flex: 1,
                }}
                data={receives}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={loadMore}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                            {formatDateTimeVietNamHaveTime(item.create_at)}
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