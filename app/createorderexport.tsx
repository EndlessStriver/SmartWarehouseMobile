import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import FormatDate from "@/unit/FormatDate";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ModalListProductWarehouse from "./handleorderexportcomp/ModalListProductWarehouse";

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
    const exportCode = generateExportCode();
    const [user, setUser] = useState<User>();
    const [note, setNote] = useState<string>('');
    const [productExports, setProductExports] = useState<ExportItem[]>([]);
    const [modalVisiable, setModalVisiable] = useState<boolean>(false);

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
        const newProductExports = [...productExports];
        newProductExports.push(item);
        setProductExports(newProductExports);
    }

    const removeExportItem = (index: number) => {
        const newProductExports = [...productExports];
        newProductExports.splice(index, 1);
        setProductExports(newProductExports);
    }

    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Mã phiếu xuất: </Text>
                {exportCode}
            </Text>
            <Text style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Người tạo: </Text>
                {user?.fullName}
            </Text>
            <Text style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Ngày tạo: </Text>
                {FormatDate(new Date().toString())}
            </Text>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Ghi chú: </Text>
            <TextInput
                placeholder="Nhập ghi chú nếu có ...."
                style={styles.input}
                onChangeText={setNote}
                value={note}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 5
                }}
            >
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>Danh sách sản phẩm xuất kho</Text>
                <TouchableOpacity
                    onPress={() => setModalVisiable(true)}
                    style={{
                        backgroundColor: "#2ecc71",
                        padding: 5,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ fontWeight: "bold", color: "white" }}>Thêm +</Text>
                </TouchableOpacity>
            </View>
            {
                productExports.length > 0 &&
                <FlatList
                    style={{
                        width: '100%',
                    }}
                    data={productExports}
                    keyExtractor={(item) => item.skuId}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                marginBottom: 10,
                                backgroundColor: item.itemStatus ? "#2ecc71" : "#e74c3c",
                                padding: 10,
                                borderRadius: 5,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    borderWidth: 1,
                                    borderColor: item.itemStatus ? "#2ecc71" : "#e74c3c",
                                }}
                            >
                                <View>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                                        {item.productName}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Đơn vị tính: </Text>
                                        {item.unitName}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Số lượng: </Text>
                                        {item.totalQuantity}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Trạng thái: </Text>
                                        {item.itemStatus ? "Bình thường" : "Bị lỗi"}
                                    </Text>
                                    <Text>
                                        <Text style={{ fontWeight: "bold" }}>Vị trí xuất: </Text>
                                        {item.locationExport.map((location) => location.locationCode).join(', ')}
                                    </Text>
                                </View>
                                <View
                                >
                                    <TouchableOpacity
                                        onPress={() => removeExportItem(productExports.indexOf(item))}
                                        style={{
                                            backgroundColor: "#e74c3c",
                                            padding: 5,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text style={{ color: "white" }}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            }
            {
                productExports.length === 0 &&
                <Text style={{ color: "red" }}>Chưa có sản phẩm xuất kho nào...</Text>
            }
            <ModalListProductWarehouse
                modalVisiable={modalVisiable}
                setModalVisiable={setModalVisiable}
                addExportItem={addExportItem}
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