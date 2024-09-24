import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // Replace with your actual API base URL
  timeout: 5000, // Optional timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login on unauthorized response
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
