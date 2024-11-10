import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const StockEntryDetail = () => {
    const { receiveId } = useLocalSearchParams<{ receiveId: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.lable}>Thông tin phiếu nhập kho</Text>
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
    receiveCheck: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#bdc3c7',
    }
});

export default StockEntryDetail;