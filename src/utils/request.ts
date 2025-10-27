import axios, { AxiosInstance } from "axios";
import { getAccessToken } from "zmp-sdk";

// Lấy VITE_API_URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("VITE_API_URL is not defined in .env file. API calls will fail.");
}

// 1. Khởi tạo Axios Instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Interceptor cho Request: Thêm Authorization Header
api.interceptors.request.use(async (config) => {
  try {
    // Lấy Zalo Access Token. Token này được Zalo Mini App cấp
    const { token } = await getAccessToken({});
    
    // Gửi token này lên Backend để Backend xác thực với Zalo Server
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting Zalo Access Token:", error);
  }
  return config;
});

// 3. Các hàm request tiện ích (Tương thích với logic cũ)

// Hàm request chính (dùng cho GET)
export async function request<T>(path: string): Promise<T> {
  const response = await api.get<T>(path);
  return response.data;
}

// Hàm request với POST
export async function requestWithPost<P, T>(
  path: string,
  payload: P
): Promise<T> {
  const response = await api.post<T>(path, payload);
  return response.data;
}

// Hàm request có fallback (dùng cho các trường hợp không cần thiết phải có dữ liệu)
export async function requestWithFallback<T>(
  path: string,
  fallbackValue: T
): Promise<T> {
  try {
    return await request<T>(path);
  } catch (error) {
    console.warn(
      "An error occurred while fetching data. Falling back to default value!",
      { path, error }
    );
    return fallbackValue;
  }
}

