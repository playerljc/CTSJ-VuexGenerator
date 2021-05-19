/**
 * IResponse - 接口的返回值
 */
export interface IResponse {
    codeKey: string;
    codeSuccessKey: number | string;
    dataKey: any;
    messageKey: string;
}
/**
 * IServiceConfig
 * @interface IServiceConfig
 */
export declare type IServiceConfig = Record<string, IService>;
/**
 * IService - Service
 * @interface
 */
export interface IService {
    ['default']: IResponse;
    [propName: string]: any;
}
export declare type IModules = Record<string, object>;
