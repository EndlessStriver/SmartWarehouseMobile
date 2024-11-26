import GetInventories, { Transaction } from "@/service/GetInventories";
import FormatDate from "@/unit/FormatDate";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Inventory: React.FC = () => {
    const [inventories, setInventories] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        GetInventories()
            .then((data) => setInventories(data.data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <FlatList
                    data={inventories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card}
                            onPress={() => {
                                router.push({
                                    pathname: "/iventorydetail",
                                    params: {
                                        iventoryId: item.id,
                                    }
                                });
                            }}
                        >
                            <Text style={styles.label}>
                                <Text style={styles.labelBold}>Mã phiếu: </Text>
                                {item.id}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.labelBold}>Ngày tạo: </Text>
                                {FormatDate(item.create_at)}
                            </Text>
                            <Text style={styles.label}>
                                <Text style={styles.labelBold}>Ghi chú: </Text>
                                {item.note || "Không có ghi chú"}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
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
        backgroundColor: "#fff",
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
        color: "#7f8c8d",
        marginBottom: 5,
    },
    labelBold: {
        fontWeight: "bold",
        color: "#2c3e50",
    },
});

export default Inventory;
