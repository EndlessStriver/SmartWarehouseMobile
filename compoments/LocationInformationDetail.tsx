import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LocationData } from "@/service/GetLocationInformationById";

interface LocationInformationDetailProps {
    location: LocationData;
}

const LocationInformationDetail: React.FC<LocationInformationDetailProps> = ({ location }) => {
    return (
        <>
            <Text style={styles.sectionTitle}>Thông tin vị trí</Text>
            <View style={styles.card}>
                <InfoRow label="Tên vị trí:" value={location?.locationCode} />
                <InfoRow
                    label="Trạng thái:"
                    value={location?.occupied ? "Đã chứa sản phẩm" : "Chưa chứa sản phẩm"}
                    valueStyle={location?.occupied ? styles.statusOccupied : styles.statusAvailable}
                />
                <InfoRow label="Thể tích tối đa:" value={`${Number(location?.maxCapacity).toLocaleString()} cm3`} />
                <InfoRow label="Thể tích chiếm dụng:" value={`${Number(location?.currentCapacity).toLocaleString()} cm3`} />
                <InfoRow label="Sức chứa tối đa:" value={`${Number(location?.maxWeight).toLocaleString()} kg`} />
                <InfoRow label="Khối lượng hiện tại:" value={`${Number(location?.currentWeight).toLocaleString()} kg`} />
            </View>

            <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
            {location?.occupied ? (
                <View style={[styles.card, styles.productCard]}>
                    <Image style={styles.image} source={{ uri: location.skus.productDetails.product.img }} />
                    <View style={styles.productDetails}>
                        <InfoRow label="Mã SKU:" value={location.skus.skuCode} />
                        <InfoRow label="Mã sản phẩm:" value={location.skus.productDetails.product.productCode} />
                        <InfoRow label="Tên sản phẩm:" value={location.skus.productDetails.product.name} />
                        <InfoRow
                            label="Số lượng:"
                            value={`${location.quantity} ${location.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name
                                }`}
                        />
                        <InfoRow label="Trọng lượng:" value={`${location.skus.weight} kg`} />
                        <InfoRow label="Kích thước:" value={`${location.skus.dimension} cm`} />
                    </View>
                </View>
            ) : (
                <Text style={styles.noProduct}>Vị trí chưa chứa sản phẩm nào</Text>
            )}
        </>
    );
};

const InfoRow = ({ label, value, valueStyle }: { label: string; value: string; valueStyle?: any }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
);

export default LocationInformationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f8fa",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0984e3",
        marginBottom: 15,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20,
        width: "100%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    value: {
        fontSize: 14,
        color: "#555",
    },
    statusOccupied: {
        color: "red",
        fontWeight: "bold",
    },
    statusAvailable: {
        color: "green",
        fontWeight: "bold",
    },
    productCard: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    noProduct: {
        fontSize: 14,
        color: "#999",
    },
});
