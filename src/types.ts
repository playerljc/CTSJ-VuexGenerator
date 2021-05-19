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
export type IServiceConfig = Record<string, IService>;

/**
 * IService - Service
 * @interface
 */
export interface IService {
  ['default']: IResponse;
  [propName: string]: any;
}

export type IModules = Record<string, object>;
