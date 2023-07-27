import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import mockData from "./mock"
import { isBaseURL } from "./config";

type Result<T> = {
    code: number;
    message: string;
    data: T;
};

const isDev = import.meta.env.DEV;
// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
    // axios 实例
    instance: AxiosInstance;
    // 基础配置，url和超时时间
    baseConfig: AxiosRequestConfig = { baseURL: !isBaseURL ? import.meta.env.VITE_API_BASE : "", timeout: 60000 };

    constructor(config: AxiosRequestConfig) {
        // 使用axios.create创建axios实例
        this.instance = axios.create(Object.assign(this.baseConfig, config));

        //  请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                const fullPath = `${config.baseURL}${config.url}`;
                // 根据fullPath获取mock数据
                const mockResponse = mockData.find((item) => item.url === fullPath);
                const data = mockResponse?.data;
                // 如果是开发环境，且mock数据存在，则返回mock数据
                if (!isDev && data) {
                    config.data = data
                }
                // 一般会请求拦截里面加token，用于后端的验证
                const token = localStorage.getItem("token") as string
                if (token) {
                    config.headers!.Authorization = token;
                }
                return config;
            },
            (err: AxiosError) => {
                // 请求错误，这里可以用全局提示框进行提示
                if (!isDev && err.config?.data) {
                    console.log("生产模式下mock");
                    err.response!.data = {
                        data: {
                            data: err.config.data
                        },
                        code: 200,
                        message: "success",
                    };
                    return Promise.resolve(err.response);
                }
                return Promise.reject(err);
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            (res: AxiosResponse) => {
                // 直接返回res，当然你也可以只返回res.data
                // 系统如果有自定义code也可以在这里处理
                if (!isDev && res.config?.data) {
                    res.data = {
                        data: {
                            data: JSON.parse(res.config.data),
                        },
                        code: 200,
                        message: "success",
                    };
                }

                return res;
            },
            (err: AxiosError) => {
                if (!isDev && err.config?.data) {
                    err.response = {
                        config: err.config,
                        data: {
                            data: {
                                data: JSON.parse(err.config.data),
                                code: 200,
                                message: "success",
                            },
                            code: 200,
                            message: "success",
                        },
                        headers: err.request.headers,
                        request: err.request,
                        status: 200,
                        statusText: "OK",
                    };
                    return Promise.resolve(err.response);
                }

                // 这里用来处理http常见错误，进行全局提示
                let message = "";
                switch (err.response?.status) {
                    case 400:
                        message = "请求错误(400)";
                        break;
                    case 401:
                        message = "未授权，请重新登录(401)";
                        // 这里可以做清空storage并跳转到登录页的操作
                        break;
                    case 403:
                        message = "拒绝访问(403)";
                        break;
                    case 404:
                        message = "请求出错(404)";
                        break;
                    case 408:
                        message = "请求超时(408)";
                        break;
                    case 500:
                        message = "服务器错误(500)";
                        break;
                    case 501:
                        message = "服务未实现(501)";
                        break;
                    case 502:
                        message = "网络错误(502)";
                        break;
                    case 503:
                        message = "服务不可用(503)";
                        break;
                    case 504:
                        message = "网络超时(504)";
                        break;
                    case 505:
                        message = "HTTP版本不受支持(505)";
                        break;
                    default:
                        message = `连接出错(${err.response?.status})!`;
                }
                // 这里错误消息可以使用全局弹框展示出来
                // 比如element plus 可以使用 ElMessage
                // ElMessage({
                //   showClose: true,
                //   message: `${message}，请检查网络或联系管理员！`,
                //   type: "error",
                // });
                // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
                return Promise.reject(err.response);
            }
        );
    }

    // 定义请求方法
    public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config);
    }

    public get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.get(url, config);
    }

    public post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.post(url, data, config);
    }

    public put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.put(url, data, config);
    }

    public delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<Result<T>>> {
        return this.instance.delete(url, config);
    }
}

// 默认导出Request实例
export default new Request({})
