import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface AuthResponse {
    access: {
      token: string,
    },
    refresh: {
      token: string,
    }
}
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/v1",
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
        const response = await api.post<AuthResponse>('auth/refresh-tokens', { refreshToken });
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access.token);
        localStorage.setItem('refreshToken', refresh.token);
        originalRequest.headers.Authorization = `Bearer ${ access.token}`;
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