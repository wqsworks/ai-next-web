import { useAccessStore } from "@/app/store";
import { message } from "antd";
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { error } from "console";
import { cloneDeep } from "lodash-es";

function getCookie(name: string) {
  let cookieArr = document.cookie.split("; ");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    // 如果找到的是我们想要的 cookie，返回其值
    if (name == cookiePair[0]) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // 如果没有找到，返回 null
  return null;
}

const createHttp = () => {
  const client = axios.create({
    timeout: 1000 * 100,
    headers: {},
  });

  client.interceptors.request.use((config) => {
    const conf = cloneDeep(config);
    const token = getCookie("__GLOBAL__TOKEN__");
    if (token) {
      conf.headers.set("Authorization", token);
    }
    return conf;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.data.code !== 0) {
        if (response.data.code === 401) {
          message.error("请先登录");
          window.GlobalBridge.returnAuthPage?.();
          return Promise.reject(response.data);
        }
        message.error(response.data?.msg);
        return Promise.reject(response.data);
      }
      return Promise.resolve(response.data);
    },
    (error: AxiosError) => {
      const { response } = error;
      if (response?.status === 401) {
        message.error("请先登录");
        window.GlobalBridge.returnAuthPage?.();
      }

      return Promise.reject(error);
    },
  );
  return client;
};

const $http = (config: AxiosRequestConfig) => {
  return createHttp()
    .request({ ...config })
    .then((res) => res.data);
};
export { $http };
