import GetShelfByCategoryNameAndTypeShelf, { Shelf } from "@/service/GetShelfByCategoryNameAndTypeShelf";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import ModalOptionLocation from "./ModalOptionLocation";
import { LocationType } from "./ModalAddLocationProductCheck";
import { ReceiveItem } from "@/service/GetStockEntryById";
import { ProductIsCheckType } from "../handlestockentry";

interface ModalOptionShelfProps {
    isModalVisible: boolean;
    setModalVisible: (value: boolean) => void;
    categoryName: string,
    typeShelf: string,
    setLocationSelect: (data: LocationType) => void;
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

    useEffect(() => {
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
    }, [props.categoryName, props.typeShelf, navigation.offset, navigation.limit])

    return (
        <Modal
            visible={props.isModalVisible}
            onRequestClose={() => props.setModalVisible(false)}
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    padding: 10,
                    alignItems: 'flex-start',
                    backgroundColor: '#fff',
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#3498db",
                        }}
                    >
                        Danh Sách Kệ
                    </Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisible(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ width: "100%" }}
                    data={shelfs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "#ecf0f1",
                                padding: 15,
                                marginBottom: 10,
                                borderRadius: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <Text><Text style={{ fontWeight: "bold" }}>Tên kệ:</Text> {item.name}</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Thể tích khả dụng:</Text> {(Number(item.maxCapacity) - Number(item.currentCapacity)).toLocaleString()} cm3</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Khối lượng còn có thể chứa:</Text> {(Number(item.maxWeight) - Number(item.currentWeight)).toLocaleString()} kg</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Loại kệ:</Text> {item.typeShelf === "NORMAL" ? "Kệ thường" : "Chứa hàng lỗi"}</Text>
                                <Text><Text style={{ fontWeight: "bold" }}>Loại hàng:</Text> {item.category.name}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedShelf(item);
                                    setIsModalLocationVisible(true);
                                }}
                            >
                                <Text style={{ color: "#3498db", fontWeight: "bold" }}>Chọn</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <ModalOptionLocation
                isModalVisible={isModalLocationVisible}
                setModalVisible={setIsModalLocationVisible}
                shelf={selectedShelf}
                setLocationSelect={props.setLocationSelect}
                receiveItem={props.receiveItem}
                quantity={props.quantity}
                productIsCheck={props.productIsCheck}
            />
        </Modal>
    )
}

export default ModalOptionShelf;