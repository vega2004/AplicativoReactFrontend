import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://10.104.221.245:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});