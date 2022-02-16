import type { IServiceConfig, IModules } from './types';
/**
 * mapState
 * @param namespaces
 * @return object
 */
export declare const mapState: (namespaces: string[]) => {
    loading: () => any;
};
/**
 * mapActions
 * @param namespaces
 * @return object
 */
export declare const mapActions: (namespaces: string[]) => {};
/**
 * mapMutations
 * @param namespaces
 * @return object
 */
export declare const mapMutations: (namespaces: string[]) => {};
/**
 * cleanMixin - 在组件销毁之前重置所用的namespace的数据流为初始化数据
 * @param namespaces
 * @return function
 */
export declare const cleanMixin: (namespaces: string[]) => {
    /**
     * beforeMount - 重置namespaces数据流的数据
     */
    beforeMount(): void;
};
/**
 * useState
 * @description 支持setup的useState
 * @param namespaces
 */
export declare const useState: (namespaces: string[]) => {
    loading: import("@vue/reactivity").ComputedRef<any>;
};
/**
 * useMutations
 * @description 支持setup的useMutations
 * @param namespaces
 */
export declare const useMutations: (namespaces: string[]) => {};
/**
 * useActions
 * @description 支持setup的useActions
 * @param namespaces
 */
export declare const useActions: (namespaces: string[]) => {};
declare const _default: (serviceConfig: IServiceConfig, modules: IModules) => (store: any) => void;
/**
 * plugin
 * @param serviceConfig - service的配置
 * @param modules - 模块的配置
 * @return Function
 */
export default _default;
