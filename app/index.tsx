import LoginService from "@/service/LoginService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = () => {
    LoginService(username, password)
      .then(() => {
        router.push('/home');
      })
      .catch(() => {
        Alert.alert('Đăng nhập thất bại');
      });
  }

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.lableLogin}>Đăng Nhập</Text>
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
      <View style={styles.buttonContainer}>
        <Button
          title="Đăng Nhập"
          onPress={() => login()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lableLogin: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    width: '100%',
    height: 40,
    margin: 12,
  }
});
