import { Product } from "@/service/GetProductsByNameAndCodeAndSupplierName";
import { ExportItem } from "../createorderexport";
import { useEffect, useState } from "react";
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import GetLocationFIFO from "@/service/GetLocationFIFO";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

interface ModalAddExportItemProps {
    modalVisiable: boolean;
    setModalVisiable: (value: boolean) => void;
    addExportItem: (item: ExportItem) => void;
    selectedProduct: Product | null;
    productExports: ExportItem[];
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

    const getQuantityProductExportByStatusAndProductId = (productId: string, status: boolean) => {
        let quantity = 0;
        props.productExports.forEach((product) => {
            if (product.productId === productId && product.itemStatus === status) {
                quantity += product.totalQuantity;
            }
        })
        return quantity;
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
        if (statusProduct === "NORMAL" && Number(quantityExport) + getQuantityProductExportByStatusAndProductId(props.selectedProduct?.id || "", true) > Number(props.selectedProduct?.productDetails[0].quantity)
            || statusProduct === "DAMAGED" && Number(quantityExport) + getQuantityProductExportByStatusAndProductId(props.selectedProduct?.id || "", false) > Number(props.selectedProduct?.productDetails[0].damagedQuantity)) {
            Alert.alert('Lỗi', 'Tổng Số lượng sản phẩm xuất kho lớn hơn số lượng tồn kho');
            return;
        }
        let number = getQuantityProductExportByStatusAndProductId(props.selectedProduct?.id || "", statusProduct === "NORMAL" ? true : false);
        GetLocationFIFO(props.selectedProduct?.productDetails[0].sku[0].id || "", unit, Number(quantityExport) + number, statusProduct)
            .then((res) => {
                const item: ExportItem = {
                    productName: props.selectedProduct?.name || "",
                    skuId: props.selectedProduct?.productDetails[0].sku[0].id || "",
                    productId: props.selectedProduct?.id || "",
                    totalQuantity: Number(quantityExport) + number,
                    unitId: unit,
                    unitName: props.selectedProduct?.units.find((myunit) => myunit.id === unit)?.name || "",
                    itemStatus: statusProduct === "NORMAL" ? true : false,
                    locationExport: res.map((location) => ({
                        locationCode: location.locationCode,
                        quantity: location.quantityTaken,
                    })),
                }
                props.addExportItem(item);
                setStatusProduct("NORMAL");
                setUnit("");
                setTypeExport("FIFO");
                setQuantityExport("");
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

export default ModalAddExportItem;