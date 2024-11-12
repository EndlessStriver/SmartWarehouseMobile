import GetReceives, { ReceiveRecord } from "@/service/GetReceives";
import FormatDate from "@/unit/FormatDate";
import { router, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const StockEntry: React.FC = () => {

    const [receives, setReceives] = useState<ReceiveRecord[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 1,
        totalPage: 0,
        totalElementOfPage: 0
    });

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: '/createstockentry',
                            params: {
                                receiveId: null
                            }
                        })
                    }}
                    style={{
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor: "#3498db",
                        marginRight: 10,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Tạo Phiếu Nhập Kho</Text>
                </TouchableOpacity>
            )
        })
    }, [navigation])

    useEffect(() => {
        GetReceives()
            .then(data => {
                setReceives(data.data);
                setPagination({
                    limit: data.limit,
                    offset: data.offset,
                    totalPage: data.totalPage,
                    totalElementOfPage: data.totalElementOfPage
                });
            })
            .catch(error => {
                Alert.alert('Error', error.message);
            })
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.lable}>Danh Sách Phiếu Nhập Kho</Text>
            <FlatList
                style={{
                    width: '100%'
                }}
                data={receives}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (item.status === "COMPLETERECEIVECHECK") {
                                router.push({
                                    pathname: '/stockentrydetail',
                                    params: {
                                        receiveId: item.id
                                    }
                                })
                            } else {
                                router.push({
                                    pathname: '/handlestockentry',
                                    params: {
                                        receiveId: item.id
                                    }
                                })
                            }
                        }}
                        style={{
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 5,
                            backgroundColor: `${item.status === "COMPLETERECEIVECHECK" ? "#2ecc71" : (item.status === "PENDING") ? "#f1c40f" : "#e74c3c"}`,
                            position: 'relative',
                        }}
                    >
                        <Text style={{ fontWeight: "600", color: "#3498db" }}>{item.receiveCode}</Text>
                        <Text style={{ fontWeight: "600", color: "#e74c3c" }}>{FormatDate(item.receiveDate)}</Text>
                        <Text style={{ fontWeight: "600", color: "#34495e" }}>{item.receiveBy}</Text>
                        <Text style={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            fontWeight: '600',
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
    lable: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
});

export default StockEntry;