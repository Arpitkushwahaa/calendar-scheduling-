import axios from "axios";
import { useStore } from "@/store/store";
import { CustomError } from "@/types/custom-error.type";
import { ENV } from "./get-env";

const baseURL = ENV.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "MeetlyApp/1.0"
  }
};

//*** FOR API WITH TOKEN */
export const API = axios.create(options);

API.interceptors.request.use((config) => {
  const accessToken = useStore.getState().accessToken;
  if (accessToken) {
    config.headers["Authorization"] = "Bearer " + accessToken;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Safely handle case where error.response might be undefined
    if (error.response) {
      const { data, status } = error.response;
      
      // Handle authentication errors
      if ((data === "Unauthorized" && status === 401) || status === 403) {
        const store = useStore.getState();
        store.clearUser();
        store.clearAccessToken();
        store.clearExpiresAt();
        window.location.href = "/";
      }

      console.log("API Error Response:", data);
      const customError: CustomError = {
        ...error,
        message: data?.message || "Unknown error occurred",
        errorCode: data?.errorCode || "UNKNOWN_ERROR",
      };

      return Promise.reject(customError);
    } else {
      // Handle network errors or CORS issues
      console.error("Network error:", error);
      const customError: CustomError = {
        ...error,
        message: "Network error - could not connect to server. Please try again later.",
        errorCode: "NETWORK_ERROR",
      };
      return Promise.reject(customError);
    }
  }
);

//*** FOR API DONT NEED TOKEN */
export const PublicAPI = axios.create(options);

PublicAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Safely handle case where error.response might be undefined
    const data = error.response?.data;
    const customError: CustomError = {
      ...error,
      message: data?.message || "Network error occurred",
      errorCode: data?.errorCode || "NETWORK_ERROR",
    };
    return Promise.reject(customError);
  }
);

// Helper function to check if the API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await PublicAPI.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API Health check failed:', error);
    return false;
  }
};
