import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://192.168.1.139:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});