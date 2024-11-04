import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log("Lỗi khi lưu dữ liệu", e);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log("Lỗi khi lấy dữ liệu", e);
    }
};

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log("Lỗi khi xóa dữ liệu", e);
    }
};

export const storeJSON = async (key: string, value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log("Lỗi khi lưu JSON", e);
    }
};

export const getJSON = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log("Lỗi khi lấy JSON", e);
    }
};

