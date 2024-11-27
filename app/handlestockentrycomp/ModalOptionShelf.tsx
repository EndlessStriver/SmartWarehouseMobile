import GetShelfByCategoryNameAndTypeShelf, { Shelf } from "@/service/GetShelfByCategoryNameAndTypeShelf";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import ModalOptionLocation from "./ModalOptionLocation";
import { LocationType } from "./ModalAddLocationProductCheck";
import { ProductIsCheckType } from "../handlestockentry";
import Checkbox from "expo-checkbox";
import GetAllShelf from "@/service/GetAllShelf";
import { ReceiveItem } from "@/service/GetStockEntryById";

interface ModalOptionShelfProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    categoryName: string,
    typeShelf: string,
    receiveItem?: ReceiveItem
    quantity: number
    productIsCheck: ProductIsCheckType[]
}

const ModalOptionShelf: React.FC<ModalOptionShelfProps> = (props) => {

    const [shelfs, setShelfs] = useState<Shelf[]>([]);
    const [navigation, setNavigation] = useState({
        limit: 10,
        offset: 1,
        totalPage: 0,
    });
    const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
    const [isModalLocationVisible, setIsModalLocationVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        if (!isChecked) {
            if (props.categoryName && props.typeShelf) {
                GetShelfByCategoryNameAndTypeShelf(props.categoryName, props.typeShelf, navigation.offset, navigation.limit)
                    .then((res) => {
                        setShelfs(res.data)
                        setNavigation({
                            limit: res.limit,
                            offset: res.offset,
                            totalPage: res.totalPage
                        })
                    })
                    .catch((err) => {
                        Alert.alert("Error", err.message)
                    })
            }
        } else {
            GetAllShelf(navigation.limit, navigation.offset)
                .then((res) => {
                    setShelfs(res.data)
                    setNavigation({
                        limit: res.limit,
                        offset: res.offset,
                        totalPage: res.totalPage
                    })
                })
                .catch((err) => {
                    Alert.alert("Error", err.message)
                })
        }
    }, [props.categoryName, props.typeShelf, navigation.offset, navigation.limit, isChecked])

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="slide"
            transparent={true}
        >
            <View
                style={{
                    flex: 1,
                    padding: 15,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 10,
                    margin: 20,
                    elevation: 5,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 15,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "600",
                            color: "#3498db",
                        }}
                    >
                        Danh Sách Kệ
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                        marginBottom: 15,
                        alignItems: 'center'
                    }}
                >
                    <Checkbox
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#3498db' : '#C0C0C0'}
                    />
                    <Text style={{ fontSize: 16, color: '#333' }}>Lấy tất cả kệ</Text>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: "100%",
                        marginBottom: 20,
                    }}
                    data={shelfs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedShelf(item);
                                setIsModalLocationVisible(true);
                            }}
                            style={{
                                backgroundColor: "#ffffff",
                                padding: 18,
                                marginBottom: 15,
                                borderRadius: 8,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                borderWidth: 1,
                                borderColor: "#ddd",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: "600" }}>Tên kệ: {item.name}</Text>
                                <Text style={{ fontSize: 14, color: '#555' }}>Thể tích khả dụng: {(Number(item.maxCapacity) - Number(item.currentCapacity)).toLocaleString()} cm³</Text>
                                <Text style={{ fontSize: 14, color: '#555' }}>Khối lượng còn có thể chứa: {(Number(item.maxWeight) - Number(item.currentWeight)).toLocaleString()} kg</Text>
                                <Text style={{ fontSize: 14, color: '#555' }}>Loại kệ: {item.typeShelf === "NORMAL" ? "Kệ thường" : "Chứa hàng lỗi"}</Text>
                                <Text style={{ fontSize: 14, color: '#555' }}>Loại hàng: {item.category.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <ModalOptionLocation
                isModalVisible={isModalLocationVisible}
                setModalVisible={setIsModalLocationVisible}
                shelf={selectedShelf}
                receiveItem={props.receiveItem}
                quantity={props.quantity}
                productIsCheck={props.productIsCheck}
            />
        </Modal>
    )
}

export default ModalOptionShelf;
