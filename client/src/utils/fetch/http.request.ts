import axios from 'axios';
import { API_SERVICE } from '../config';

export const getDataAPI = async<T>(apiService: API_SERVICE, endpoint: string) => {
  const data: T = await axios.get(`${apiService}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return data;
};

export const postDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, data: any) => {
  const dataResponse: T = await axios.post(`${apiService}/${endpoint}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return dataResponse;
};

export const putDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, data: any) => {
  const dataResponse: T = await axios.put(`${apiService}/${endpoint}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return dataResponse;
};

export const patchDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, data: any) => {
  const dataResponse: T = await axios.patch(`${apiService}/${endpoint}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return dataResponse;
};

export const deleteDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, data: any) => {
  const dataResponse: T = await axios.delete(`${apiService}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  return dataResponse;
};
