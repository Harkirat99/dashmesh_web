import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await api.post<AuthResponse>('/refresh-token', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// export const registerUser = async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> =>
//   api.post('/register', userData).then((res) => res.data);

// export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> =>
//   api.post('/login', credentials).then((res) => res.data);

// export const refreshToken = async (token: string): Promise<AuthResponse> =>
//   api.post('/refresh-token', { refreshToken: token }).then((res) => res.data);