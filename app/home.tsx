import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useNavigation } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import { useEffect, useLayoutEffect, useState } from "react";
import logout from "@/service/logout";

const Home = () => {

    const navigation = useNavigation();
    const [user, setUser] = useState<User>();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                return (
                    <TouchableOpacity style={styles.container1} onPress={() => handleLogout()}>
                        <Text style={styles.userName}>{user?.fullName}</Text>
                        <Text style={styles.logoutButton}>Đăng xuất</Text>
                    </TouchableOpacity>
                );
            }
        });
    }, [user])

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

    const handleLogout = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'Đăng xuất',
                    onPress: () => {
                        logout()
                            .then(() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'index' as never }],
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                Alert.alert('Lỗi', 'Không thể đăng xuất');
                            });
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const checkHasPermission = (roles: string[]) => {
        if (user && user.role) return roles.includes(user.role.name);
        return false;
    }

    return (
        <View style={styles.container}>
            {
                checkHasPermission(["admin", "warehouse_manager", "inventory_specialist"]) &&
                <TouchableOpacity
                    style={styles.buttonfnc}
                    onPress={() => {
                        router.push('/barcodescanner');
                    }}
                >
                    <FontAwesome name="search" size={30} color="#3498db" />
                    <Text style={styles.textButton}>QR Code</Text>
                </TouchableOpacity>
            }
            {
                checkHasPermission(["admin", "warehouse_manager", "inventory_specialist"]) &&
                <TouchableOpacity
                    style={styles.buttonfnc}
                    onPress={() => {
                        router.push('/stockentry');
                    }}
                >
                    <MaterialIcons name="inventory" size={30} color="#3498db" />
                    <Text style={styles.textButton}>Nhập Kho</Text>
                </TouchableOpacity>
            }
            {
                checkHasPermission(["admin", "warehouse_manager", "inventory_specialist"]) &&
                <TouchableOpacity
                    style={styles.buttonfnc}
                    onPress={() => {
                        router.push('/orderexport');
                    }}
                >
                    <MaterialCommunityIcons name="package-variant-closed" size={30} color="#3498db" />
                    <Text style={styles.textButton}>Xuất Kho</Text>
                </TouchableOpacity>
            }
            {
                checkHasPermission(["admin", "warehouse_manager", "inventory_specialist"]) &&
                <TouchableOpacity
                    style={styles.buttonfnc}
                    onPress={() => {
                        router.push('/warehouse');
                    }}
                >
                    <MaterialCommunityIcons name="warehouse" size={30} color="#3498db" />
                    <Text style={styles.textButton}>Tồn Kho</Text>
                </TouchableOpacity>
            }
            {
                checkHasPermission(["admin", "warehouse_manager"]) &&
                <TouchableOpacity
                    style={styles.buttonfnc}
                    onPress={() => {
                        router.push('/inventory');
                    }}
                >
                    <FontAwesome name="clipboard" size={30} color="#3498db" />
                    <Text style={styles.textButton}>Kiểm Kê</Text>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 25,
        justifyContent: 'space-evenly',
        padding: 15,
        backgroundColor: '#f7f7f7',
    },
    buttonfnc: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 160,
        height: 160,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    textButton: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
        textAlign: 'center',
    },
    container1: {
        flexDirection: "column",
        alignItems: "flex-end",
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    logoutButton: {
        fontSize: 14,
        color: "#f1c40f",
        fontWeight: "500",
        marginTop: 2,
    },
});

export default Home;
