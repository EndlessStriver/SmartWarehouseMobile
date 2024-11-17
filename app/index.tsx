import LoginService from "@/service/LoginService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (username === '') {
      Alert.alert('Lỗi', 'Tên đăng nhập không được để trống');
      return false;
    }
    if (password === '') {
      Alert.alert('Lỗi', 'Mật khẩu không được để trống');
      return false;
    }
    return true;
  }

  const login = () => {
    if (validateForm()) {
      LoginService(username, password)
        .then(() => {
          router.replace('/home');
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Đăng nhập thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng');
        });
    }
  }

  return (
    <View
      style={styles.container}
    >
      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#0984e3"
      }}>LEON WARSEHOUSE</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Nhập tên đăng nhập..."
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Nhập mật khẩu..."
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={login}
        style={{
          backgroundColor: "#3498db",
          width: '100%',
          height: 45,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },
  lableLogin: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray"
  }
});
