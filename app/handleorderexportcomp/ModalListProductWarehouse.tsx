import GetProductsByNameAndCodeAndSupplierName, { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ExportItem } from "../createorderexport";
import GetLocationFIFO from "@/service/GetLocationFIFO";

interface ModalListProductWarehouseProps {
    modalVisiable: boolean;
    setModalVisiable: (value: boolean) => void;
    addExportItem: (item: ExportItem) => void;
}

const ModalListProductWarehouse: React.FC<ModalListProductWarehouseProps> = (props) => {

    const [productName, setProductName] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState({
        limit: 10,
        offset: 1,
        totalPage: 0,
    });
    const [modalVisiable, setModalVisiable] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const id = setTimeout(() => {
            GetProductsByNameAndCodeAndSupplierName(productName)
                .then((res) => {
                    setProducts(res.data);
                    setPagination({
                        limit: res.limit,
                        offset: res.offset,
                        totalPage: res.totalPage,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    Alert.alert('Lỗi', 'Không thể lấy dữ liệu sản phẩm');
                })
        }, 500);

        return () => clearTimeout(id);
    }, [productName])

    return (
        <Modal
            visible={props.modalVisiable}
            onRequestClose={() => props.setModalVisiable(false)}
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    padding: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: "#3498db"
                        }}
                    >Danh sách sản phẩm tồn kho</Text>
                    <TouchableOpacity
                        onPress={() => props.setModalVisiable(false)}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={{
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        marginBottom: 10,
                    }}
                    placeholder="Nhập tên sản phẩm cần tìm..."
                    value={productName}
                    onChangeText={setProductName}
                />
                <FlatList
                    style={{
                        width: '100%',
                    }}
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            disabled={item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0}
                            onPress={() => {
                                setSelectedProduct(item);
                                setModalVisiable(true);
                            }}
                            style={{
                                marginBottom: 10,
                                backgroundColor: "#f1c40f",
                                padding: 10,
                                borderRadius: 5,
                                opacity: item.productDetails[0].quantity === 0 && item.productDetails[0].damagedQuantity === 0 ? 0.5 : 1,
                            }}
                        >
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                                {item.name}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                                {item.productCode}
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Số lượng tồn kho: </Text>
                                {item.productDetails[0].quantity} sản phẩm
                            </Text>
                            <Text>
                                <Text style={{ fontWeight: "bold" }}>Số lượng lỗi tồn kho: </Text>
                                {item.productDetails[0].damagedQuantity} sản phẩm
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <ModalAddExportItem
                modalVisiable={modalVisiable}
                setModalVisiable={setModalVisiable}
                addExportItem={props.addExportItem}
                selectedProduct={selectedProduct}
            />
        </Modal>
    )
}

export default ModalListProductWarehouse;

interface ModalAddExportItemProps {
    modalVisiable: boolean;
    setModalVisiable: (value: boolean) => void;
    addExportItem: (item: ExportItem) => void;
    selectedProduct: Product | null;
}

const ModalAddExportItem: React.FC<ModalAddExportItemProps> = (props) => {

    const [statusProduct, setStatusProduct] = useState("NORMAL");
    const [unit, setUnit] = useState("");
    const [typeExport, setTypeExport] = useState("FIFO");
    const [quantityExport, setQuantityExport] = useState("");

    useEffect(() => {
        if (props.selectedProduct) {
            setUnit(props.selectedProduct?.units.find((unit) => unit.isBaseUnit)?.id || "");
        }
    }, [props.selectedProduct])

    const updateQuantityExport = (value: string) => {
        let regex = /^[0-9]*$/;
        if (!regex.test(value)) {
            setQuantityExport("");
            return;
        }
        setQuantityExport(value);
    }

    const handleSubmit = () => {
        if (quantityExport === "") {
            Alert.alert('Lỗi', 'Chưa nhập số lượng sản phẩm xuất kho');
            return;
        }
        if (Number(quantityExport) === 0) {
            Alert.alert('Lỗi', 'Số lượng sản phẩm xuất kho phải lớn hơn 0');
            return;
        }
        if (statusProduct === "NORMAL" && Number(quantityExport) > Number(props.selectedProduct?.productDetails[0].quantity)
            || statusProduct === "DAMAGED" && Number(quantityExport) > Number(props.selectedProduct?.productDetails[0].damagedQuantity)) {
            Alert.alert('Lỗi', 'Số lượng sản phẩm xuất kho lớn hơn số lượng tồn kho');
            return;
        }
        GetLocationFIFO(props.selectedProduct?.productDetails[0].sku[0].id || "", unit, Number(quantityExport), statusProduct)
            .then((res) => {
                const item: ExportItem = {
                    productName: props.selectedProduct?.name || "",
                    skuId: props.selectedProduct?.productDetails[0].sku[0].id || "",
                    productId: props.selectedProduct?.id || "",
                    totalQuantity: Number(quantityExport),
                    unitId: unit,
                    unitName: props.selectedProduct?.units.find((myunit) => myunit.id === unit)?.name || "",
                    itemStatus: statusProduct === "NORMAL" ? true : false,
                    locationExport: res.map((location) => ({
                        locationCode: location.locationCode,
                        quantity: location.quantityTaken,
                    })),
                }
                props.addExportItem(item);
                props.setModalVisiable(false);
            })
            .catch((err) => {
                console.log(err);
                Alert.alert('Lỗi', 'Không thể lấy vị trí sản phẩm trong kho');
            })
    }

    return (
        <Modal
            visible={props.modalVisiable}
            onRequestClose={() => props.setModalVisiable(false)}
            animationType="fade"
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    padding: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: "#3498db"
                        }}
                    >Thêm Sản Phẩm Xuất Kho</Text>
                    <TouchableOpacity
                        onPress={() => {
                            props.setModalVisiable(false);
                        }}
                    >
                        <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Mã sản phẩm: </Text>
                    {props.selectedProduct?.productCode}
                </Text>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Tên sản phẩm: </Text>
                    {props.selectedProduct?.name}
                </Text>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Loại sản phẩm: </Text>
                    {props.selectedProduct?.category.name}
                </Text>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Số lượng tồn kho: </Text>
                    {props.selectedProduct?.productDetails[0].quantity} sản phẩm
                </Text>
                <Text>
                    <Text style={{ fontWeight: "bold" }}>Số lượng lỗi tồn kho: </Text>
                    {props.selectedProduct?.productDetails[0].damagedQuantity} sản phẩm
                </Text>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Tình trạng sản phẩm:</Text>
                <Picker
                    style={{
                        backgroundColor: "gray",
                    }}
                    selectedValue={statusProduct}
                    onValueChange={(itemValue, itemIndex) =>
                        setStatusProduct(itemValue)
                    }>
                    <Picker.Item label="Bình thường" value="NORMAL" />
                    <Picker.Item label="Bị hư hại" value="DAMAGED" />
                </Picker>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Đơn vị tính:</Text>
                <Picker
                    style={{
                        backgroundColor: "gray",
                    }}
                    selectedValue={unit}
                    onValueChange={(itemValue, itemIndex) => {
                        setUnit(itemValue)
                        console.log(unit);
                    }
                    }>
                    {
                        props.selectedProduct?.units.map((unit) => (
                            <Picker.Item
                                key={unit.id}
                                label={unit.name}
                                value={unit.id}
                            />
                        ))
                    }
                </Picker>
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>Số lượng xuất kho:</Text>
                <TextInput
                    style={{
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        marginTop: 5,
                    }}
                    placeholder="Nhập số lượng sản phẩm xuất kho..."
                    value={quantityExport}
                    onChangeText={(value) => updateQuantityExport(value)}
                    keyboardType="numeric"
                />
                <Text style={{ fontWeight: "bold", marginTop: 5 }}>Kiểu xuất kho:</Text>
                <Picker
                    style={{
                        backgroundColor: "gray",
                    }}
                    selectedValue={typeExport}
                    onValueChange={(itemValue, itemIndex) =>
                        setTypeExport(itemValue)
                    }>
                    <Picker.Item label="Vào trước - Ra trước" value="FIFO" />
                    <Picker.Item label="Vào sau - Ra trước" value="LIFO" />
                </Picker>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        backgroundColor: "#3498db",
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 10,
                    }}
                >
                    <Text style={{ color: "white", textAlign: "center" }}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}