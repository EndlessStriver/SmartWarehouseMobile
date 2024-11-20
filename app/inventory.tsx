import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Inventory: React.FC = () => {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => {
                        router.push("/createinventory");
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Tạo phiếu +</Text>
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#3498db'
                }}
            >Lịch Sử Kiểm Kê</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    }
});

export default Inventory;