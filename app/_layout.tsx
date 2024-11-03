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
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          headerShown: true,
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
    </Stack>
  );
}
