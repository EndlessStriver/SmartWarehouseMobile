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
        name="home"
        options={{
          headerShown: true,
          headerBackVisible: true,
          title: "Trang Chủ",
        }}
      />
      <Stack.Screen
        name="barcodescanner"
        options={{
          headerShown: true,
          title: "Quét Mã Vạch",
        }}
      />
      <Stack.Screen
        name="stockentry"
        options={{
          headerShown: true,
          title: "Nhập Kho",
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
        name="warehouse"
        options={{
          headerShown: true,
          title: "Tồn Kho",
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
        name="createstockentry"
        options={{
          headerShown: true,
          title: "Tạo Phiếu Nhập Kho",
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
        name="orderexport"
        options={{
          headerShown: true,
          title: "Xuất Kho",
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
        name="createorderexport"
        options={{
          headerShown: true,
          title: "Tạo Phiếu Xuất Kho",
        }}
      />
    </Stack>
  );
}
