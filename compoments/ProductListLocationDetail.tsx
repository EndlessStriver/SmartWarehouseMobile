import { Product } from "@/service/GetProductInformationById";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductListLocationDetailProps {
    product: Product;
}

const ProductListLocationDetail: React.FC<ProductListLocationDetailProps> = (props) => {
    return (
        <>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#0984e3',
                marginTop: 10,
            }}>Thông tin sản phẩm</Text>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                marginTop: 10,
            }}>
                <View>
                    <Image
                        style={styles.imageproduct}
                        source={{
                            uri: props.product?.img
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={styles.containerlable}>
                        <Text style={styles.lable}>Tên sản phẩm: </Text>
                        <Text style={styles.text}>{props.product?.name}</Text>
                    </Text>
                    <Text style={styles.containerlable}>
                        <Text style={styles.lable}>Loại sản phẩm: </Text>
                        <Text style={styles.text}>{props.product?.category.name}</Text>
                    </Text>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Mô tả: </Text>
                        <Text style={styles.text}>{props.product?.description}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Số lượng tồn kho: </Text>
                        <Text style={styles.text}>{props.product?.productDetails[0].quantity} {props.product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Mã SKU: </Text>
                        <Text style={styles.text}>{props.product?.productDetails[0].sku[0].skuCode}</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Trọng lượng: </Text>
                        <Text style={styles.text}>{props.product?.productDetails[0].sku[0].weight} kg</Text>
                    </View>
                    <View style={styles.containerlable}>
                        <Text style={styles.lable}>Kích thước: </Text>
                        <Text style={styles.text}>{props.product?.productDetails[0].sku[0].dimension} cm</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.lable1}>Danh Sách Vị Trí Chứa Trong Kho</Text>
            {
                props.product?.productDetails[0].sku[0].locations.length === 0 ?
                    <Text style={{ marginBottom: 10 }}>Không có vị trí chứa sản phẩm</Text>
                    :
                    <FlatList
                        style={{
                            marginTop: 10,
                            width: '100%',
                        }}
                        data={props.product?.productDetails[0].sku[0].locations}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={{
                                flexDirection: "row",
                                padding: 10,
                                marginBottom: 10,
                                borderRadius: 5,
                                backgroundColor: '#bdc3c7',
                            }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <Text style={styles.lable}>Vị trí: </Text>
                                    <Text style={{ marginRight: 35 }}>{item.locationCode}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <Text style={styles.lable}>Số lượng: </Text>
                                    <Text>{item.quantity} {props.product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                    />
            }
        </>
    );
}

export default ProductListLocationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
    },
    lable: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    lable1: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: "#0984e3"
    },
    receiveCheck: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#bdc3c7',
    },
    imageproduct: {
        width: 120,
        height: 120,
        marginLeft: 10,
    },
    containerlable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        flexWrap: 'wrap',
    },
});