import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import FormatDate from "@/unit/FormatDate";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ModalListProductWarehouse from "./handleorderexportcomp/ModalListProductWarehouse";
import CreateOrderExportAPI from "@/service/CreateOrderExportAPI";
import { useNavigation } from "expo-router";

interface LocationExport {
    locationCode: string;
    quantity: number;
}

export interface ExportItem {
    productName: string;
    skuId: string;
    productId: string;
    totalQuantity: number;
    unitId: string;
    unitName: string;
    itemStatus: boolean;
    locationExport: LocationExport[];
}

const CreateOrderExport = () => {
    const navigation = useNavigation();
    const exportCode = generateExportCode();
    const [user, setUser] = useState<User>();
    const [note, setNote] = useState<string>('');
    const [productExports, setProductExports] = useState<ExportItem[]>([]);
    const [modalVisiable, setModalVisiable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        GetAccountInformationCurrent()
            .then((res) => {
                setUser(res);
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng');
            });
    }, [])

    function generateExportCode() {
        const now = new Date();
        const timestamp = now.getFullYear().toString() +
            (now.getMonth() + 1).toString().padStart(2, '0') +
            now.getDate().toString().padStart(2, '0') +
            now.getHours().toString().padStart(2, '0') +
            now.getMinutes().toString().padStart(2, '0') +
            now.getSeconds().toString().padStart(2, '0');
        return `XK${timestamp}`;
    }

    const addExportItem = (item: ExportItem) => {
        let check = false
        const newProductExports = [...productExports];
        const myproduct = newProductExports.map((product) => {
            if (product.productId === item.productId && product.itemStatus === item.itemStatus) {
                check = true;
                return item;
            } else {
                return product;
            }
        })
        if (!check) {
            myproduct.push(item);
            setProductExports(myproduct);
        } else {
            setProductExports(myproduct);
        }
    }

    const removeExportItem = (index: number) => {
        const newProductExports = [...productExports];
        newProductExports.splice(index, 1);
        setProductExports(newProductExports);
    }

    const handleSubmit = () => {
        setLoading(true);
        CreateOrderExportAPI({
            description: note,
            exportBy: user?.fullName || '',
            exportCode: exportCode,
            exportDate: new Date().toString(),
            orderExportDetails: productExports.map((product) => ({
                itemStatus: product.itemStatus,
                locationExport: product.locationExport,
                productId: product.productId,
                skuId: product.skuId,
                totalQuantity: product.totalQuantity,
                unitId: product.unitId
            }))
        }).then(() => {
            Alert.alert('Thành công', 'Tạo phiếu xuất thành công');
            navigation.reset({
                index: 1,
                routes: [
                    { name: 'home' as never },
                    { name: 'orderexport' as never }
                ]
            })
        }).catch((err) => {
            console.log(err);
            Alert.alert('Lỗi', 'Không thể tạo phiếu xuất');
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: '100%',
                }}
            >
                <View>
                    <Text style={{ marginBottom: 8, fontSize: 14 }}>
                        <Text style={{ fontWeight: "bold" }}>Mã phiếu xuất: </Text>
                        {exportCode}
                    </Text>
                    <Text style={{ marginBottom: 8, fontSize: 14 }}>
                        <Text style={{ fontWeight: "bold" }}>Người tạo: </Text>
                        {user?.fullName}
                    </Text>
                    <Text style={{ marginBottom: 8, fontSize: 14 }}>
                        <Text style={{ fontWeight: "bold" }}>Ngày tạo: </Text>
                        {FormatDate(new Date().toString())}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={productExports.length === 0 || loading}
                        style={{
                            backgroundColor: "white",
                            padding: 10,
                            borderRadius: 8,
                            opacity: productExports.length === 0 || loading ? 0.5 : 1
                        }}
                    >
                        <Text style={{
                            color: "#3498db",
                            fontWeight: "bold",
                            fontSize: 16,
                            textAlign: "center"
                        }}>
                            {loading ? "Đang xử lý..." : "Tạo phiếu"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 16 }}>Ghi chú:</Text>
            <TextInput
                placeholder="Nhập ghi chú nếu có ...."
                style={{
                    ...styles.input,
                    padding: 10,
                    fontSize: 14,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    marginBottom: 15
                }}
                onChangeText={setNote}
                value={note}
            />

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: '100%',
                    marginBottom: 15
                }}
            >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Danh sách sản phẩm xuất kho</Text>
                <TouchableOpacity
                    onPress={() => setModalVisiable(true)}
                    style={{
                        backgroundColor: "#2ecc71",
                        padding: 4,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text style={{ fontWeight: "bold", color: "white", fontSize: 14 }}>Thêm +</Text>
                </TouchableOpacity>
            </View>

            {productExports.length > 0 ? (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{
                        width: '100%',
                    }}
                    data={productExports}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                marginBottom: 15,
                                backgroundColor: item.itemStatus ? "#2ecc71" : "#e74c3c",
                                padding: 12,
                                borderRadius: 8,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    borderBottomWidth: 1,
                                    borderBottomColor: item.itemStatus ? "#2ecc71" : "#e74c3c",
                                    paddingBottom: 8
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14 }}>
                                        <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                                        {item.productName}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>
                                        <Text style={{ fontWeight: "bold" }}>Đơn vị tính: </Text>
                                        {item.unitName}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>
                                        <Text style={{ fontWeight: "bold" }}>Số lượng: </Text>
                                        {item.totalQuantity}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>
                                        <Text style={{ fontWeight: "bold" }}>Trạng thái: </Text>
                                        {item.itemStatus ? "Bình thường" : "Bị lỗi"}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>
                                        <Text style={{ fontWeight: "bold" }}>Vị trí xuất: </Text>
                                        {item.locationExport.map((location) => location.locationCode).join(', ')}
                                    </Text>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <TouchableOpacity
                                        onPress={() => removeExportItem(productExports.indexOf(item))}
                                        style={{
                                            backgroundColor: "#e74c3c",
                                            paddingVertical: 6,
                                            paddingHorizontal: 12,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <Text style={{ color: "white", fontWeight: "bold" }}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={{ color: "red", textAlign: "center" }}>Chưa có sản phẩm xuất kho nào...</Text>
            )}

            <ModalListProductWarehouse
                modalVisiable={modalVisiable}
                setModalVisiable={setModalVisiable}
                addExportItem={addExportItem}
                productExports={productExports}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#ecf0f1',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        padding: 10,
    }
})

export default CreateOrderExport;