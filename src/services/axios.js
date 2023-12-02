import axios from "axios";

// export const api = axios.create({
//   baseURL: "https://clinicsystem.io.vn",
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Content-Type": "application/json; charset=utf-8",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const createAxios = () => {
  const api = axios.create({
    baseURL: "https://clinicsystem.io.vn",
    timeout: 5000, // Thời gian chờ tối đa cho yêu cầu (ms)
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  const get = async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(`GET request to ${endpoint} failed: ${error.message}`);
    }
  };

  const getWithData = async (endpoint, data) => {
    try {
      const response = await api.get(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(`GET request to ${endpoint} failed: ${error.message}`);
    }
  };

  const post = (endpoint, data) => {
    return api
      .post(endpoint, data)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`POST request to ${endpoint} failed: ${error.message}`);
      });
  };

  const put = (endpoint, data) => {
    return api
      .put(endpoint, data)
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`PUT request to ${endpoint} failed: ${error.message}`);
      });
  };

  const postWithHeaders = (endpoint, data, customHeaders) => {
    return api
      .post(endpoint, data, {
        headers: {
          ...api.defaults.headers,
          ...customHeaders, // Thêm các headers tùy chỉnh ở đây
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        throw new Error(`POST request to ${endpoint} failed: ${error.message}`);
      });
  };
  return {
    get,
    getWithData,
    post,
    postWithHeaders,
    put
  };

};

export default createAxios;

