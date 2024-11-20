import { useState } from "react";
import { Alert, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ModalAddShelfInventory from "./inventory/ModalAddShelfInventory";
import FormatDate from "@/unit/FormatDate";
import CreateInventoryAPI from "@/service/CreateInventoryAPI";
import { useNavigation } from "expo-router";
import { AxiosError } from "axios";

interface TypeSectionList {
    locationId: string;
    locationCode: string;
    productName: string;
    unit: string;
    currentQuantity: string;
    iventoryQuantity?: string;
}

export interface ShelfInventory {
    title: { label: string, value: string },
    data: TypeSectionList[]
}

const CreateInventory: React.FC = () => {

    const navigation = useNavigation();
    const [modalVisiable, setModalVisiable] = useState(false);
    const [shelfList, setShelfList] = useState<ShelfInventory[]>([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddShelf = (data: ShelfInventory) => {
        if (shelfList.find((shelf) => shelf.title.label === data.title.label)) {
            Alert.alert("Thông báo", "Kệ đã tồn tại...");
            return;
        }
        setShelfList([...shelfList, data]);
    }

    const removeShelf = (shelfName: string) => {
        const newShelfList = shelfList.filter((shelf) => shelf.title.label !== shelfName);
        setShelfList(newShelfList);
    }

    const validateNumber = (value: string) => {
        return /^[0-9]*$/.test(value);
    }

    const checkQuantity = () => {
        let isCheck = true;
        shelfList.forEach((shelf) => {
            shelf.data.forEach((data) => {
                if (data.iventoryQuantity === "" || !validateNumber(data?.iventoryQuantity || "0") || Number(data.iventoryQuantity || "0") <= 0) {
                    isCheck = false;
                }
            });
        });
        return isCheck;
    }

    const handleSubmit = () => {
        if (shelfList.length === 0) {
            Alert.alert("Thông báo", "Chưa có thông tin kiểm kê...");
            return;
        }
        if (!checkQuantity()) {
            Alert.alert("Thông báo", "Số lượng kiểm kê không hợp lệ...");
            return;
        }
        setLoading(true);
        CreateInventoryAPI({
            note: note,
            shelfInventory: shelfList.map((shelf) => {
                return {
                    shelfId: shelf.title.value,
                    locationInventory: shelf.data.map((data) => {
                        return {
                            locationId: data.locationId,
                            avaliableQuantity: Number(data.iventoryQuantity || "0"),
                        };
                    }),
                };
            }),
        })
            .then(() => {
                Alert.alert("Thông báo", "Tạo phiếu kiểm kê thành công");
                navigation.reset({
                    index: 1,
                    routes: [
                        { name: "home" as never },
                        { name: "inventory" as never }
                    ],
                })
            })
            .catch((error) => {
                // if ((error as AxiosError).response) {
                //     const axiosError = error as AxiosError;
                //     console.log('Server Error:', axiosError.response);
                // }
                console.log(error);
                Alert.alert("Thông báo", "Có lỗi xảy ra, vui lòng thử lại sau");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#ecf0f1",
                }}
            >
                <Text>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 14
                    }}>Ngày kiểm kê: </Text>
                    {FormatDate(new Date().toString())}
                </Text>
                <TouchableOpacity
                    disabled={loading}
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: "#3498db",
                        padding: 5,
                        borderRadius: 5,
                        opacity: (shelfList.length === 0 || loading) ? 0.5 : 1
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center", fontSize: 12, fontWeight: "bold" }}>{
                        loading ? "Đang xử lý..." : "Hoàn Thành"
                    }</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={{
                    borderWidth: 1,
                    width: '100%',
                    marginBottom: 10,
                    borderColor: "gray",
                    color: "gray",
                    height: 50,
                    padding: 15,
                    textAlignVertical: 'top',
                    borderRadius: 10,
                    marginTop: 10
                }}
                value={note}
                onChange={(e) => setNote(e.nativeEvent.text)}
                placeholder="Nhập ghi chú nếu có..."
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor: "#ecf0f1",
                    marginBottom: 10,

                }}
            >
                <Text style={{ fontWeight: "600", fontSize: 18, color: "#2980b9" }}>Danh Sách Kiểm Kê</Text>
                <TouchableOpacity
                    onPress={() => setModalVisiable(true)}
                    style={{
                        backgroundColor: "#3498db",
                        padding: 5,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center", fontSize: 12, fontWeight: "bold" }}>Thêm +</Text>
                </TouchableOpacity>
            </View>
            {
                shelfList.length === 0 ?
                    <Text style={{
                        textAlign: "center",
                        color: "#7f8c8d",
                        fontSize: 16,
                        fontWeight: "600",
                        marginTop: 20
                    }}>Chưa có thông tin kiểm kê...</Text>
                    :
                    <SectionList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        sections={shelfList.reverse()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <View>
                                    <Text style={styles.locationCode}>{item.locationCode}</Text>
                                    <Text style={styles.productName}>{item.productName}</Text>
                                    <Text style={styles.unit}>{item.unit}</Text>
                                </View>
                                <View style={styles.quantityContainer}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            gap: 5,
                                        }}
                                    >
                                        <Text style={styles.quantity}>Số lượng:</Text>
                                        <Text style={styles.quantity}>{item.currentQuantity}</Text>
                                    </View>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#3498DB",
                                            borderRadius: 5,
                                            padding: 5,
                                            marginTop: 5,
                                            width: 150,
                                        }}
                                        placeholder="Số lượng kiểm kê..."
                                        keyboardType="numeric"
                                        value={item.iventoryQuantity}
                                        onChange={(e) => {
                                            const newShelfList = shelfList.map((shelf) => {
                                                if (shelf.title.label === item.locationCode.split("-")[0]) {
                                                    const newData = shelf.data.map((data) => {
                                                        if (data.locationCode === item.locationCode) {
                                                            return {
                                                                ...data,
                                                                iventoryQuantity: e.nativeEvent.text,
                                                            };
                                                        }
                                                        return data;
                                                    });
                                                    return {
                                                        ...shelf,
                                                        data: newData,
                                                    };
                                                }
                                                return shelf;
                                            });
                                            setShelfList(newShelfList);
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.sectionHeader}>Kệ {title.label}</Text>
                                <TouchableOpacity
                                    onPress={() => removeShelf(title.label)}
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                        top: 10,
                                    }}
                                >
                                    <Text style={{ color: "red", fontWeight: "bold" }}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
            }
            <ModalAddShelfInventory
                modalVisiable={modalVisiable}
                setModalVisiable={setModalVisiable}
                addShelf={handleAddShelf}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#E0E0E0",
        backgroundColor: "#FFFFFF",
    },
    locationCode: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#2C3E50",
    },
    productName: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    unit: {
        fontSize: 12,
        color: "#95A5A6",
    },
    quantityContainer: {
        gap: 5,
    },
    quantity: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#3498DB",
    },
    sectionHeader: {
        backgroundColor: "#ECF0F1",
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontWeight: "bold",
        fontSize: 16,
        color: "#34495E",
    },
});

export default CreateInventory;