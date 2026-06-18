import { axiosClient } from './axiosClient';

export const getDatos = async () => {
  const response = await axiosClient.get('/datos');
  return response.data;
};

export const filtrarDatos = async (filtros) => {
  const response = await axiosClient.get('/datos/filtrar', {
    params: filtros,
  });

  return response.data;
};