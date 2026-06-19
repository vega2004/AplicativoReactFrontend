import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://10.104.221.137:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});