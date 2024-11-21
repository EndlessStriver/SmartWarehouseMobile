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
            <View style={styles.header}>
                <View>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Mã phiếu xuất: </Text>{exportCode}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Người tạo: </Text>{user?.fullName}
                    </Text>
                    <Text style={styles.infoText}>
                        <Text style={styles.boldText}>Ngày tạo: </Text>{FormatDate(new Date().toString())}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={productExports.length === 0 || loading}
                        style={[styles.submitButton, { opacity: productExports.length === 0 || loading ? 0.5 : 1 }]}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? "Đang xử lý..." : "Tạo phiếu"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.boldText}>Ghi chú:</Text>
            <TextInput
                placeholder="Nhập ghi chú nếu có ...."
                style={styles.input}
                onChangeText={setNote}
                value={note}
            />

            <View style={styles.productListHeader}>
                <Text style={styles.boldText}>Danh sách sản phẩm xuất kho</Text>
                <TouchableOpacity
                    onPress={() => setModalVisiable(true)}
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>Thêm +</Text>
                </TouchableOpacity>
            </View>

            {productExports.length > 0 ? (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.productList}
                    data={productExports}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.productCard, { backgroundColor: item.itemStatus ? "#2ecc71" : "#e74c3c" }]}>
                            <View>
                                <Text style={styles.productText}>
                                    <Text style={styles.boldText}>Tên sản phẩm: </Text>{item.productName}
                                </Text>
                                <Text style={styles.productText}>
                                    <Text style={styles.boldText}>Đơn vị tính: </Text>{item.unitName}
                                </Text>
                                <Text style={styles.productText}>
                                    <Text style={styles.boldText}>Số lượng: </Text>{item.totalQuantity}
                                </Text>
                                <Text style={styles.productText}>
                                    <Text style={styles.boldText}>Trạng thái: </Text>{item.itemStatus ? "Bình thường" : "Bị lỗi"}
                                </Text>
                                <Text style={styles.productText}>
                                    <Text style={styles.boldText}>Vị trí xuất: </Text>{item.locationExport.map(location => location.locationCode).join(', ')}
                                </Text>
                            </View>
                            <View style={styles.removeButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => removeExportItem(productExports.indexOf(item))}
                                    style={styles.removeButton}
                                >
                                    <Text style={styles.removeButtonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noProductText}>Chưa có sản phẩm xuất kho nào...</Text>
            )}

            {/* Modal */}
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
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fff',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold',
    },
    submitButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#3498db',
        fontWeight: 'bold',
        fontSize: 16,
    },
    input: {
        padding: 10,
        fontSize: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
    },
    productListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#3498db',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 14,
    },
    productList: {
        width: '100%',
    },
    productCard: {
        marginBottom: 15,
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    productText: {
        fontSize: 14,
        marginBottom: 4,
    },
    removeButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noProductText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
});


export default CreateOrderExport;