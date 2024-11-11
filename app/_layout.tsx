import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0984e3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Đăng nhập",

        }}
      />
      <Stack.Screen
        name="home"
        options={{
          headerShown: true,
          headerBackVisible: false,
          title: "Trang chủ",
        }}
      />
      <Stack.Screen
        name="barcodescanner"
        options={{
          headerShown: true,
          title: "Quét mã vạch",
        }}
      />
      <Stack.Screen
        name="stockentry"
        options={{
          headerShown: true,
          title: "Nhập kho",
        }}
      />
      <Stack.Screen
        name="stockentrydetail"
        options={{
          headerShown: true,
          title: "Chi tiết phiếu nhập kho",
        }}
      />
      <Stack.Screen
        name="warehouse"
        options={{
          headerShown: true,
          title: "Tồn kho",
        }}
      />
      <Stack.Screen
        name="warehousedetail"
        options={{
          headerShown: true,
          title: "Chi tiết sản phẩm tồn kho",
        }}
      />
      <Stack.Screen
        name="createstockentry"
        options={{
          headerShown: true,
          title: "Tạo phiếu nhập kho",
        }}
      />
    </Stack>
  );
}
