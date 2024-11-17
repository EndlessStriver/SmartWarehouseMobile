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
                <FontAwesome name="search" size={24} color={"black"} />
                <Text style={style.textButton}>QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/stockentry')
                }}
            >
                <MaterialIcons name="inventory" size={24} color={"black"} />
                <Text style={style.textButton}>Nhập Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/orderexport')
                }}
            >
                <MaterialCommunityIcons name="exit-to-app" size={24} color={"black"} />
                <Text style={style.textButton}>Xuất Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/warehouse')
                }}
            >
                <MaterialCommunityIcons name="warehouse" size={24} color={"black"} />
                <Text style={style.textButton}>Tồn Kho</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/warehouse')
                }}
            >
                <FontAwesome name="clipboard" size={24} color="black" />
                <Text style={style.textButton}>Kiểm Kê</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 25,
        justifyContent: 'space-evenly',
        padding: 10,
    },
    buttonfnc: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        width: 150,
        height: 150,
        padding: 10,
    },
    textButton: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10
    }
})

export default Home