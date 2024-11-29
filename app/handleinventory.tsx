import { useEffect, useState } from "react";
import { Alert, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FormatDate from "@/unit/FormatDate";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import GetIventoryById, { Transaction } from "@/service/GetIventoryById";
import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import GetShelfOccupiedByLocationId from "@/service/GetShelfOccupiedByLocationId";
import CreateInventoryAPI from "@/service/CreateInventoryAPI";

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

const HandleInventory: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    const { iventoryId } = useLocalSearchParams<{ iventoryId: string }>();
    const [shelfList, setShelfList] = useState<ShelfInventory[]>([]);
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        setLoading(true);
        GetIventoryById(iventoryId)
            .then((response) => {
                setTransaction(response);
                response.inventory.map((shelf) => {
                    GetShelfOccupiedByLocationId(shelf.shelves.id)
                        .then((response) => {
                            setShelfList((prev) => [...prev, {
                                title: { label: response[0].locationCode.split("-")[0], value: shelf.shelves.id },
                                data: response.filter((location) => location.quantity !== 0).map((item) => {
                                    return {
                                        locationId: item.id,
                                        locationCode: item.locationCode,
                                        productName: item.skus.productDetails.product.name,
                                        unit: item.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name || "",
                                        currentQuantity: item.quantity + "",
                                        iventoryQuantity: item.quantity + "",
                                    }
                                })
                            }]);
                        })
                        .catch((error) => {
                            console.log(error);
                            Alert.alert("Thông báo", "Không tìm thấy kệ hàng nào tương ứng với mã vạch này");
                        });
                })
            })
            .then(() => {
                return GetAccountInformationCurrent();
            })
            .then((response) => {
                setUser(response);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Thông báo", "Không tìm thấy thông tin phiếu kiểm kho");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
        if (!checkQuantity()) {
            Alert.alert("Thông báo", "Vui lòng nhập số lượng kiểm kê hợp lệ");
            return;
        }
        CreateInventoryAPI(
            iventoryId,
            {
                note: transaction?.note || "",
                shelfInventory: shelfList.map((shelf) => {
                    return {
                        shelfId: shelf.title.value,
                        locationInventory: shelf.data.map((data) => {
                            return {
                                locationId: data.locationId,
                                avaliableQuantity: Number(data.iventoryQuantity)
                            }
                        })
                    }
                })
            }
        )
            .then(() => {
                Alert.alert("Thông báo", "Kiểm kê thành công");
                router.replace("/tabs/inventory");
            })
            .catch((error) => {
                console.log(error);
                Alert.alert("Thông báo", "Kiểm kê thất bại");
            });
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
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
                <View>
                    <Text style={{ marginBottom: 5 }}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 14
                        }}>Người kiểm kê: </Text>
                        {user?.fullName}
                    </Text>
                    <Text style={{ marginBottom: 5 }}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 14
                        }}>Ngày kiểm kê: </Text>
                        {FormatDate(new Date().toString())}
                    </Text>
                    <Text style={{ marginBottom: 5 }}>
                        <Text style={{
                            fontWeight: "bold",
                            fontSize: 14
                        }}>Ghi chú: </Text>
                        {transaction?.note || "Không có ghi chú"}
                    </Text>
                </View>
                <TouchableOpacity
                    disabled={loading}
                    onPress={() => {
                        Alert.alert(
                            "Xác Nhận",
                            "Vui lòng xác nhận để hoàn thành kiểm kê!",
                            [
                                {
                                    text: "Hủy",
                                    style: "cancel",
                                },
                                {
                                    text: "Xác nhận",
                                    onPress: () => handleSubmit(),
                                    style: "default",
                                },
                            ],
                        );
                    }}
                    style={{
                        backgroundColor: "#3498db",
                        padding: 5,
                        borderRadius: 5,
                        opacity: (shelfList.length === 0 || loading) ? 0.5 : 1
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center", fontSize: 14, fontWeight: "bold" }}>{
                        loading ? "Đang xử lý..." : "Xác nhận"
                    }</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: "600", fontSize: 18, color: "#2980b9", marginBottom: 10 }}>Danh Sách Kiểm Kê</Text>
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
                                            setShelfList(newShelfList.reverse());
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.sectionHeader}>Kệ {title.label}</Text>
                        )}
                    />
            }
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

export default HandleInventory;