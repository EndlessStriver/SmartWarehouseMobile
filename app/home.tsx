import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const Home = () => {
    return (
        <View style={style.container} >
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/barcodescanner')
                }}
            >
                <FontAwesome name="search" size={30} color={"white"} />
                <Text style={style.textButton}>QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/stockentry')
                }}
            >
                <MaterialIcons name="inventory" size={30} color={"white"} />
                <Text style={style.textButton}>Nhập Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/stockentry')
                }}
            >
                <MaterialCommunityIcons name="exit-to-app" size={30} color={"white"} />
                <Text style={style.textButton}>Xuất Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/warehouse')
                }}
            >
                <MaterialCommunityIcons name="warehouse" size={30} color={"white"} />
                <Text style={style.textButton}>Tồn Kho</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'space-evenly',
        padding: 20,
    },
    buttonfnc: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0984e3',
        padding: 10,
        borderRadius: 5,
        width: 150,
        height: 150,
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
        fontWeight: '600'
    }
})

export default Home