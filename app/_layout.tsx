import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        statusBarStyle: "light",
        statusBarBackgroundColor: "#2980b9",
        headerStyle: {
          backgroundColor: "#2980b9",
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
          title: "Đăng Nhập",
        }}
      />
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="stockentrydetail"
        options={{
          headerShown: true,
          title: "Chi Tiết Phiếu Nhập Kho",
        }}
      />
      <Stack.Screen
        name="warehousedetail"
        options={{
          headerShown: true,
          title: "Chi Tiết Sản Phẩm Tồn Kho",
        }}
      />
      <Stack.Screen
        name="handlestockentry"
        options={{
          headerShown: true,
          title: "Xử lý Phiếu Nhập Kho",
        }}
      />
      <Stack.Screen
        name="orderexportdetail"
        options={{
          headerShown: true,
          title: "Chi Tiết Phiếu Xuất Kho",
        }}
      />
      <Stack.Screen
        name="createinventory"
        options={{
          headerShown: true,
          title: "Tạo Phiếu Kiểm Kê",
        }}
      />
      <Stack.Screen
        name="iventorydetail"
        options={{
          headerShown: true,
          title: "Chi Tiết Phiếu Kiểm Kê",
        }}
      />
    </Stack>
  );
}
