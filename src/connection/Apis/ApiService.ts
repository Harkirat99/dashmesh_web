import api from '../axios'; // Ensure you have the correct import path for the API instance
import { AxiosInstance, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint, { params });
        console.log("EERERE", response.data)
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async post<T>(endpoint: string, data: Record<string, any> = {}, config = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async put<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(endpoint, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export const apiService = new ApiService();
export default api;
