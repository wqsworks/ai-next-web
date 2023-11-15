import { useAccessStore } from "@/app/store";
import axios, { AxiosResponse, AxiosError } from "axios";
import { error } from "console";
import { cloneDeep } from "lodash-es";

const createHttp = () => {
  const client = axios.create({
    timeout: 1000 * 100,
    headers: {},
  });

  client.interceptors.request.use((config) => {
    const conf = cloneDeep(config);

    if (window.__GLOBAL__TOKEN__) {
      conf.headers.set("Authorization", window.__GLOBAL__TOKEN__);
    }

    return conf;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return Promise.resolve(response);
    },
    (error: AxiosError) => {
      const { response } = error;
      if (response?.status === 401) {
      }

      return Promise.reject(error);
    },
  );
};

const $http = createHttp();
export { $http };
