import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});