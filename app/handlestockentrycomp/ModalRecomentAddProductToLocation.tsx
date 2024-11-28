import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Checkbox from "expo-checkbox";

interface LocationType {
    value: string;
    lable: string;
    maxQuantityInbound: number;
    isCheck: boolean;
    inputQuantity: string;
}

interface ModalRecomentAddProductToLocationProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    recomentLocation: LocationType[];
    setLocationsSelected: (value: LocationType[]) => void;
    numberQuantityCheck: string;
}

const ModalRecomentAddProductToLocation: React.FC<ModalRecomentAddProductToLocationProps> = (props) => {

    const [myLocationsSelected, setMyLocationsSelected] = React.useState<LocationType[]>([]);

    React.useEffect(() => {
        setMyLocationsSelected(props.recomentLocation);
    }, [props.recomentLocation]);

    const setCheckLocation = (value: string) => {
        let newLocation = [...myLocationsSelected];
        let index = newLocation.findIndex((item) => item.value === value);
        newLocation[index].isCheck = !newLocation[index].isCheck;
        setMyLocationsSelected(newLocation);
    }

    const setInputQuantity = (value: string, index: number) => {
        let newLocation = [...myLocationsSelected];
        newLocation[index].inputQuantity = value;
        setMyLocationsSelected(newLocation);
    }

    const handleSubmit = () => {
        if (myLocationsSelected.filter((localtion) => localtion.isCheck).length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 vị trí để chứa sản phẩm");
            return;
        }
        if (myLocationsSelected.some((localtion) => localtion.isCheck && (localtion.inputQuantity === "" || Number(localtion.inputQuantity) === 0 || !/^[0-9]*$/.test(localtion.inputQuantity)))) {
            Alert.alert("Lỗi", "Số lượng nhập không hợp lệ");
            return
        }
        if (myLocationsSelected.filter((localtion) => localtion.isCheck).reduce((acc, location) => acc + (Number(location.inputQuantity)), 0) > Number(props.numberQuantityCheck)) {
            Alert.alert("Lỗi", "Số lượng nhập vào không được lớn hơn số lượng đã kiểm tra");
            return;
        }

        const locationsSelected = myLocationsSelected.filter(
            (location) => location.isCheck
        );

        props.setLocationsSelected(locationsSelected);
        props.setModalVisible(false);
    }

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Vị Trí Đề Xuất</Text>
                        <TouchableOpacity onPress={() => props.setModalVisible(false)}>
                            <FontAwesome name="close" size={24} color="#555" />
                        </TouchableOpacity>
                    </View>

                    {myLocationsSelected.length === 0 ? (
                        <Text style={styles.noDataText}>
                            Không tìm thấy vị trí chứa phù hợp
                        </Text>
                    ) : (
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={styles.listContainer}
                            data={myLocationsSelected}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <View style={styles.locationItem}>
                                    <View style={styles.locationHeader}>
                                        <Text style={styles.locationText}>
                                            Kệ <Text style={styles.boldText}>{item.lable}</Text> có
                                            thể chứa{" "}
                                            <Text style={styles.boldText}>
                                                ({item.maxQuantityInbound})
                                            </Text>
                                        </Text>
                                        <Checkbox
                                            value={item.isCheck}
                                            onValueChange={() => setCheckLocation(item.value)}
                                            style={styles.checkbox}
                                        />
                                    </View>

                                    <TextInput
                                        placeholder="Nhập số lượng"
                                        keyboardType="number-pad"
                                        value={item.inputQuantity}
                                        style={[
                                            styles.input,
                                            { opacity: item.isCheck ? 1 : 0.5 },
                                        ]}
                                        onChange={(e) =>
                                            setInputQuantity(
                                                e.nativeEvent.text,
                                                props.recomentLocation.findIndex(
                                                    (location) => location.value === item.value
                                                )
                                            )
                                        }
                                        editable={item.isCheck}
                                    />
                                </View>
                            )}
                        />
                    )}

                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                            backgroundColor: "#3498db",
                            padding: 12,
                            borderRadius: 8,
                            marginTop: 16,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Xác Nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: "F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3498db",
    },
    noDataText: {
        textAlign: "center",
        color: "red",
        fontSize: 16,
        marginTop: 20,
    },
    listContainer: {
        maxHeight: "85%",
    },
    locationItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    locationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    locationText: {
        fontSize: 16,
        color: "#333",
    },
    boldText: {
        fontWeight: "bold",
        color: "#3498db",
    },
    checkbox: {
        marginLeft: 8,
    },
    input: {
        height: 40,
        borderColor: "#bdc3c7",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
    },
});

export default ModalRecomentAddProductToLocation;
