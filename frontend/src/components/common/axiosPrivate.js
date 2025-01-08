import axios from "axios";


// Set up Axios Interceptors
axios.interceptors.request.use(
  async (config) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (user) {
      config.headers = {
        ...config.headers,
        "X-Auth-Token": `Bearer ${user.token}`, // Use token directly
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      //   return axios(config); // Retry the request if unauthorized
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios;
