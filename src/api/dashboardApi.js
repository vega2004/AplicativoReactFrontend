import { axiosClient } from './axiosClient';

export const getDashboardResumen = async () => {
  const response = await axiosClient.get('/dashboard/resumen');
  return response.data;
};

export const getDashboardGraficas = async () => {
  const response = await axiosClient.get('/dashboard/graficas');
  return response.data;
};