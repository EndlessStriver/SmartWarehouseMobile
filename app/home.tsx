import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from "expo-router";

const Home = () => {
    return (
        <View style={style.container} >
            <TouchableOpacity
                style={style.buttonfnc}
                onPress={() => {
                    router.push('/barcodescanner')
                }}
            >
                <FontAwesome name="search" size={30} color="white" />
                <Text style={style.textButton}>Tra Cứu</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 20,
    },
    buttonfnc: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: 160,
        height: 160,
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
    }
})

export default Home