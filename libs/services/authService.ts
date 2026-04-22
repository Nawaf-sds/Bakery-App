// import apiClient from './axiosClient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// export const register = async (name: string, email: string, password: string) => {
//   try {
//     const response = await apiClient.post('/api/auth/register', {
//       name,
//       email,
//       password,
//     });

//     // ...
//   } catch (error) {
//     // ...
//   }
// };

// export const login = async (email: string, password: string) => {
//   try {
//     const response = await apiClient.post('/api/auth/login', { email, password });

//     // ...
//   } catch (error) {
//     // ...
//   }
// };



import apiClient from '../services/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
    });

    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'فشل التسجيل. يرجى التحقق من اتصالك بالشبكة.';
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // @ts-ignore
      throw error.response?.data?.message || 'بيانات الدخول غير صحيحة.';
    } else {
      throw 'بيانات الدخول غير صحيحة.';
    }
  }
};

