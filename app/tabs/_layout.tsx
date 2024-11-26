import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
export default function RootLayout() {
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
