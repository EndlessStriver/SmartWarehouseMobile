import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Home = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.buttonfnc}
                onPress={() => {
                    router.push('/barcodescanner');
                }}
            >
                <FontAwesome name="search" size={30} color="#3498db" />
                <Text style={styles.textButton}>QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonfnc}
                onPress={() => {
                    router.push('/stockentry');
                }}
            >
                <MaterialIcons name="inventory" size={30} color="#3498db" />
                <Text style={styles.textButton}>Nhập Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonfnc}
                onPress={() => {
                    router.push('/orderexport');
                }}
            >
                <MaterialCommunityIcons name="exit-to-app" size={30} color="#3498db" />
                <Text style={styles.textButton}>Xuất Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonfnc}
                onPress={() => {
                    router.push('/warehouse');
                }}
            >
                <MaterialCommunityIcons name="warehouse" size={30} color="#3498db" />
                <Text style={styles.textButton}>Tồn Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonfnc}
                onPress={() => {
                    router.push('/warehouse');
                }}
            >
                <FontAwesome name="clipboard" size={30} color="#3498db" />
                <Text style={styles.textButton}>Kiểm Kê</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 25,
        justifyContent: 'space-evenly',
        padding: 15,
        backgroundColor: '#f7f7f7',
    },
    buttonfnc: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 160,
        height: 160,
        padding: 15,
        elevation: 3, // For shadow effect on Android
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    textButton: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
        textAlign: 'center',
    },
});

export default Home;
