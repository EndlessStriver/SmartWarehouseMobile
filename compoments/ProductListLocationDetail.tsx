import { Product } from "@/service/GetProductInformationById";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

interface ProductListLocationDetailProps {
    product: Product;
}

const ProductListLocationDetail: React.FC<ProductListLocationDetailProps> = ({ product }) => {
    return (
        <>
            <Text style={styles.title}>Thông tin sản phẩm</Text>
            <View style={styles.productInfoContainer}>
                <Image style={styles.imageproduct} source={{ uri: product?.img }} />
                <View style={styles.detailsContainer}>
                    <ProductDetail label="Tên sản phẩm" value={product?.name} />
                    <ProductDetail label="Loại sản phẩm" value={product?.category.name} />
                    <ProductDetail label="Mô tả" value={product?.description} />
                    <ProductDetail
                        label="Số lượng tồn kho"
                        value={`${product?.productDetails[0].quantity} ${product?.units.find((unit) => unit.isBaseUnit)?.name}`}
                    />
                    <ProductDetail label="Mã SKU" value={product?.productDetails[0].sku[0].skuCode} />
                    <ProductDetail label="Trọng lượng" value={`${product?.productDetails[0].sku[0].weight} kg`} />
                    <ProductDetail label="Kích thước" value={`${product?.productDetails[0].sku[0].dimension} cm`} />
                </View>
            </View>

            <Text style={styles.locationTitle}>Danh sách vị trí chứa trong kho</Text>
            {product?.productDetails[0].sku[0].locations.length === 0 ? (
                <Text style={styles.noLocationText}>Không có vị trí chứa sản phẩm</Text>
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.locationList}
                    data={product?.productDetails[0].sku[0].locations.filter((location) => location.quantity > 0)}
                    renderItem={({ item }) => (
                        <View style={styles.locationCard}>
                            <View style={styles.locationItem}>
                                <Text style={styles.locationLabel}>Vị trí: </Text>
                                <Text style={styles.locationText}>{item.locationCode}</Text>
                            </View>
                            <View style={styles.locationItem}>
                                <Text style={styles.locationLabel}>Số lượng: </Text>
                                <Text style={styles.locationText}>{item.quantity} {product?.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            )}
        </>
    );
};

const ProductDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}: </Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default ProductListLocationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0984e3',
        marginBottom: 12,
    },
    productInfoContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    imageproduct: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0984e3',
        marginBottom: 10,
    },
    noLocationText: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    locationList: {
        width: '100%',
    },
    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    locationItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginRight: 5,
    },
    locationText: {
        fontSize: 14,
        color: '#333',
    },
});
