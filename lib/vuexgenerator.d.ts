import type { IServiceConfig, IModules } from './types';
/**
 * plugin
 * @param serviceConfig - service的配置
 * @param modules - 模块的配置
 * @return Function
 */
declare const plugin: (serviceConfig: IServiceConfig, modules: IModules) => (store: any) => void;
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
     * beforeDestroy - 重置namespaces数据流的数据
     */
    beforeDestroy(): void;
};
export default plugin;
