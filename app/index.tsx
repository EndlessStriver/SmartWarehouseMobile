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
    <View style={styles.container}>
      <Text style={styles.headerText}>LEON WARHOUSE</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Nhập tên đăng nhập..."
        placeholderTextColor="#95a5a6"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Nhập mật khẩu..."
        secureTextEntry={true}
        placeholderTextColor="#95a5a6"
      />
      <TouchableOpacity onPress={login} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Đăng Nhập</Text>
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
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: "#0984e3",
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 10,
    fontSize: 16,
    color: "#2c3e50",
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#3498db",
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  }
});
