import axios from 'axios';
import { API_SERVICE } from '../config';

export const getDataAPI = async<T>(apiService: API_SERVICE, endpoint: string) => {
  const response = await axios.get(`${apiService}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  const data: T = response.data 
  return data;
};

export const postDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, body: any) => {
  const response = await axios.post(`${apiService}/${endpoint}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
  const data: T = response.data 
  return data;
};

export const putDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, body: any) => {
  const response = await axios.put(`${apiService}/${endpoint}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
  const data: T = response.data 
  return data;
};

export const patchDataAPI = async<T>(apiService: API_SERVICE, endpoint: string, body: any) => {
  const response = await axios.patch(`${apiService}/${endpoint}`, body, {
    headers: { 'Content-Type': 'application/json' }
  });
  const data: T = response.data 
  return data;
};

export const deleteDataAPI = async<T>(apiService: API_SERVICE, endpoint: string) => {
  const response = await axios.delete(`${apiService}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' }
  });
  const data: T = response.data 
  return data;
};
