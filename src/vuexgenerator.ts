import type Store from 'vuex/types/index';
import {
  mapActions as mappingActions,
  mapState as mappingState,
  mapMutations as mappingMutations,
} from 'vuex';

import type { IServiceConfig, IModules } from './types';

// @ts-ignore
let $store: Store;
let $serviceConfig: IServiceConfig;
let $modules: IModules;

/**
 * createActions
 * @param namespace
 * @param service
 * @param serviceKeys
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createActions({ namespace, service, serviceKeys }): object {
  const actions = {};

  for (let i = 0; i < serviceKeys.length; i++) {
    const key = serviceKeys[i];

    // eslint-disable-next-line no-continue
    if (key === 'default') continue;

    /**
     * action
     * @param context
     * @param params
     */
    actions[key] = ({ commit, state }, params) => {
      return new Promise((resolve, reject) => {
        // 设置loading为true
        commit('loading/receive', { key: `${namespace}/${key}`, value: true }, { root: true });

        service[key]
          .call(params)
          .then((response) => {
            const { codeKey, codeSuccessKey, dataKey } = service.default;

            if (response[codeKey] === codeSuccessKey) {
              // 向数据流里放入Service的方法名为key,response[dataKey]为值的数据
              commit('receive', { ...state, [key]: response[dataKey] });

              // 更新loading为false
              commit(
                'loading/receive',
                { key: `${namespace}/${key}`, value: false },
                { root: true },
              );

              resolve(response);
            }
          })
          .catch((response) => {
            reject(response);
          });
      });
    };
  }

  return actions;
}

/**
 * registerLoading
 */
function registerLoading(): void {
  // state
  // eslint-disable-next-line no-underscore-dangle
  const _state = {
    global: false,
  };

  // service的属性
  const namespaces = Object.keys($modules);

  for (let i = 0; i < namespaces.length; i++) {
    // _state[namespaces[i]] = false;
    const namespace = namespaces[i];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    serviceKeys.forEach((key) => {
      if (key !== 'default') {
        _state[`${namespace}/${key}`] = false;
      }
    });
  }

  // 动态注册loading模块
  $store.registerModule('loading', {
    // 开启命名空间
    namespaced: true,
    // @ts-ignore
    state: _state,
    mutations: {
      receive(state, { key, value }) {
        // eslint-disable-next-line no-param-reassign
        state[key] = value;

        const { global, ...others } = state;

        let globalLoading = false;

        const props = Object.keys(others);

        for (let i = 0; i < props.length; i++) {
          const prop = props[i];

          if (others[prop]) {
            globalLoading = true;
            break;
          }
        }

        // eslint-disable-next-line no-param-reassign
        state.global = globalLoading;

        // console.log('key', key);
        // console.log('value', value);
        // console.log('globalLoading', globalLoading);
        // console.log('state', state);
      },
    },
  });
}

/**
 * registerBusinessModules
 */
function registerBusinessModules(): void {
  // 获取所有模块的命名空间
  const namespaces = Object.keys($modules);

  for (let i = 0; i < namespaces.length; i++) {
    // 命名空间
    const namespace = namespaces[i];

    // module的缺省对象
    const module = $modules[namespace];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    const defaultState = {};

    serviceKeys.forEach((key) => {
      if (key !== 'default') {
        defaultState[key] = Service[key].defaultResult();
      }
    });

    // 动态模块注册
    $store.registerModule(namespace, {
      // 开启命名空间
      namespaced: true,
      // @ts-ignore
      state: () => ({ ...defaultState, ...((module || {}).state || {}) }),
      mutations: {
        receive(state, payload) {
          const keys = Object.keys(state);
          // eslint-disable-next-line @typescript-eslint/no-shadow
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // eslint-disable-next-line no-param-reassign
            state[key] = payload[key];
          }
        },
        // @ts-ignore
        ...((module || {}).mutations || {}),
      },
      getters: {
        // @ts-ignore
        ...((module || {}).getters || {}),
      },
      actions: {
        ...createActions({ namespace, service: Service, serviceKeys }),
        // @ts-ignore
        ...((module || {}).actions || {}),
      },
    });
  }
}

/**
 * formatKey 转换第一个字符为大写
 * @param key
 * @return string
 */
function formatKey(key: string): string {
  const firstChart = key.charAt(0);

  return `${firstChart.toUpperCase()}${key.substring(1)}`;
}

/**
 * plugin
 * @param serviceConfig - service的配置
 * @param modules - 模块的配置
 * @return Function
 */
const plugin = (serviceConfig: IServiceConfig, modules: IModules) => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~plugin的构造函数');
  $serviceConfig = serviceConfig;
  $modules = modules;

  console.log('~~~~~~~~~~~~~~~~~~~~~~~~plugin的构造函数1',$serviceConfig);
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~plugin的构造函数2',$modules);

  /**
   * vuex的一个VuexGenerator插件
   * @param context
   */
  // @ts-ignore
  return (store: Store) => {
    // 获取vuex的store对象
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $store = store;

    // 创建loading的module
    registerLoading();

    // 根据serviceConfig配置自动生成module配置
    registerBusinessModules();
  };
};

/**
 * mapState
 * @param namespaces
 * @return object
 */
export const mapState = (namespaces: string[]) => {
  console.log('mapState', namespaces);

  const states = {
    loading: (state) => state.loading,
  };

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    for (let j = 0; j < serviceKeys.length; j++) {
      const key = serviceKeys[j];

      // eslint-disable-next-line no-continue
      if (key === 'default') continue;

      states[`${namespace}${formatKey(key)}`] = (state) => state[namespace][key];
    }
  }

  return mappingState(states);
};

/**
 * mapActions
 * @param namespaces
 * @return object
 */
export const mapActions = (namespaces: string[]) => {
  const actions = {};

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    for (let j = 0; j < serviceKeys.length; j++) {
      const key = serviceKeys[j];

      // eslint-disable-next-line no-continue
      if (key === 'default') continue;

      actions[`${namespace}${formatKey(key)}Action`] = `${namespace}/${key}`;
    }
  }

  return mappingActions(actions);
};

/**
 * mapMutations
 * @param namespaces
 * @return object
 */
export const mapMutations = (namespaces: string[]) => {
  const mutations = {};

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    mutations[`${namespace}ReceiveMutation`] = `${namespace}/receive`;
  }

  return mappingMutations(mutations);
};

/**
 * cleanMixin - 在组件销毁之前重置所用的namespace的数据流为初始化数据
 * @param namespaces
 * @return function
 */
export const cleanMixin = (namespaces: string[]) => {
  return {
    /**
     * beforeDestroy - 重置namespaces数据流的数据
     */
    beforeDestroy(): void {
      namespaces.forEach((namespace: string) => {
        const Service = $serviceConfig[namespace];

        const serviceKeys = Object.keys(Service);

        const defaultState = {};

        serviceKeys.forEach((key) => {
          if (key !== 'default') {
            defaultState[key] = Service[key].defaultResult();
          }
        });

        // @ts-ignore
        this.$store.commit(`${namespace}/receive`, defaultState);
      });
    },
  };
};

export default plugin;
