import GetAccountInformationCurrent, { User } from "@/service/GetAccountInformationCurrent";
import logout from "@/service/Logout";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
export default function RootLayout() {

    const [user, setUser] = React.useState<User>();

    React.useEffect(() => {
        GetAccountInformationCurrent()
            .then((res) => {
                setUser(res);
            })
            .catch((err) => {
                Alert.alert("Lỗi", "Lỗi không thể lấy được thông tin người dùng");
            })
    }, [])

    const handleLogout = () => {
        Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
            {
                text: "Hủy",
                style: "cancel"
            },
            {
                text: "Đồng ý",
                onPress: () => {
                    logout()
                        .then(() => {
                            router.replace("/");
                        })
                }
            }
        ])
    }

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#2980b9",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => handleLogout()}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "right" }}>{user?.fullName || "N/A"}</Text>
                        <Text style={{ color: "yellow", fontWeight: "bold", textAlign: "right" }}>Đăng xuất</Text>
                    </TouchableOpacity>
                )
            }}
        >
            <Tabs.Screen
                name="stockentry"
                options={{
                    title: "Nhập kho",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="inventory" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="orderexport"
                options={{
                    title: "Xuất kho",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="package-variant-closed" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="barcodescanner"
                options={{
                    title: "Quét mã vạch",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="search" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="warehouse"
                options={{
                    title: "Tồn Kho",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="warehouse" size={size} color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: "Kiểm kho",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="clipboard" size={size} color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
