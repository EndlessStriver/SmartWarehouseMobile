import { LocationData } from "@/service/GetLocationInformationById";
import { Image, StyleSheet, Text, View } from "react-native";

interface LocationInformationDetailProps {
    location: LocationData;
}

const LocationInformationDetail: React.FC<LocationInformationDetailProps> = (props) => {
    return (
        <>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 10,
                color: "#0984e3"
            }}>Thông tin vị trí</Text>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Tên vị trí: </Text>
                <Text>{props.location?.locationCode}</Text>
            </View>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Trạng thái: </Text>
                {
                    props.location?.occupied ?
                        <Text style={{ color: 'red' }}>Đã chứa sản phẩm</Text> :
                        <Text style={{ color: 'green' }}>Chưa chứa sản phẩm</Text>
                }
            </View>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Thể tích tối đa: </Text>
                <Text>{Number(props.location?.maxCapacity).toLocaleString()} cm3</Text>
            </View>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Thể tích chiếm dụng: </Text>
                <Text>{Number(props.location?.currentCapacity).toLocaleString()} cm3</Text>
            </View>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Sức chứa tối đa: </Text>
                <Text>{Number(props.location?.maxWeight).toLocaleString()} kg</Text>
            </View>
            <View style={styles.containerlable}>
                <Text style={styles.lable}>Khối lượng hiện tại: </Text>
                <Text>{Number(props.location?.currentWeight).toLocaleString()} kg</Text>
            </View>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 10,
                color: "#0984e3"
            }}>Thông tin sản phẩm</Text>
            {
                props.location.occupied ?
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10
                    }}>
                        <View>
                            <Image
                                style={styles.imageproduct}
                                source={{
                                    uri: props.location.skus.productDetails.product.img
                                }}
                            />
                        </View>
                        <View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Mã SKU: </Text>
                                <Text>{props.location.skus.skuCode}</Text>
                            </View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Mã sản phẩm: </Text>
                                <Text>{props.location.skus.productDetails.product.productCode}</Text>
                            </View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Tên sản phẩm: </Text>
                                <Text>{props.location.skus.productDetails.product.name}</Text>
                            </View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Số lượng: </Text>
                                <Text>{props.location.quantity} {props.location.skus.productDetails.product.units.find((unit) => unit.isBaseUnit)?.name}</Text>
                            </View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Trọng lượng: </Text>
                                <Text>{props.location.skus.weight} kg</Text>
                            </View>
                            <View style={styles.containerlable}>
                                <Text style={styles.lable}>Kích thước: </Text>
                                <Text>{props.location.skus.dimension} cm</Text>
                            </View>
                        </View>
                    </View>
                    :
                    <Text style={{ marginBottom: 10 }}>Vị trí chưa chứa sản phẩm nào</Text>
            }
        </>
    );
}

export default LocationInformationDetail;

const styles = StyleSheet.create({
    containerlable: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    lable: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    lable1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#0984e3"
    },
    imageproduct: {
        width: 140,
        height: 140,
    }
});