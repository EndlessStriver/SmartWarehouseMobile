import { Product } from "@/service/GetProductInformationById";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductListLocationDetailProps {
    product: Product;
}

const ProductListLocationDetail: React.FC<ProductListLocationDetailProps> = ({ product }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin sản phẩm</Text>

            <View style={styles.productInfoContainer}>
                <Image style={styles.imageproduct} source={{ uri: product?.img }} />
                <View style={styles.detailsContainer}>
                    <ProductDetail label="Tên sản phẩm" value={product?.name} />
                    <ProductDetail label="Loại sản phẩm" value={product?.category.name} />
                    <ProductDetail label="Mô tả" value={product?.description} />
                    <ProductDetail label="Số lượng tồn kho"
                        value={`${product?.productDetails[0].quantity} ${product?.units.find((unit) => unit.isBaseUnit)?.name}`} />
                    <ProductDetail label="Mã SKU" value={product?.productDetails[0].sku[0].skuCode} />
                    <ProductDetail label="Trọng lượng" value={`${product?.productDetails[0].sku[0].weight} kg`} />
                    <ProductDetail label="Kích thước" value={`${product?.productDetails[0].sku[0].dimension} cm`} />
                </View>
            </View>

            <Text style={styles.locationTitle}>Danh Sách Vị Trí Chứa Trong Kho</Text>

            {product?.productDetails[0].sku[0].locations.length === 0 ? (
                <Text style={styles.noLocationText}>Không có vị trí chứa sản phẩm</Text>
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={product?.productDetails[0].sku[0].locations}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.locationItem}>
                            <Text style={styles.locationLabel}>Vị trí: </Text>
                            <Text style={styles.locationText}>{item.locationCode}</Text>
                            <Text style={styles.locationLabel}>Số lượng: </Text>
                            <Text style={styles.locationText}>{item.quantity} {product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
};

const ProductDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.containerlable}>
        <Text style={styles.lable}>{label}: </Text>
        <Text style={styles.text}>{value}</Text>
    </View>
);

export default ProductListLocationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0984e3',
        marginBottom: 10,
    },
    productInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    imageproduct: {
        width: 120,
        height: 120,
        marginRight: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    containerlable: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    lable: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    text: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    locationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0984e3',
        marginTop: 15,
        marginBottom: 10,
    },
    noLocationText: {
        marginBottom: 10,
        color: '#7f8c8d',
    },
    locationItem: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#ecf0f1',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    locationText: {
        fontSize: 14,
        color: '#333',
        marginRight: 35,
    },
});
