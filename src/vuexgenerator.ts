import type Store from 'vuex/types/index';
import {
  mapActions as mappingActions,
  mapState as mappingState,
  mapMutations as mappingMutations,
} from 'vuex';

import { computed, toRef } from 'vue';

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
function createActions({ namespace, service, serviceKeys }): object {
  const actions = {};

  for (let i = 0; i < serviceKeys.length; i++) {
    const key = serviceKeys[i];

    if (key === 'default') continue;

    /**
     * action
     * @param context
     * @param payload
     */
    actions[key] = ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        // 设置loading为true
        commit('loading/receive', { key: `${namespace}/${key}`, value: true }, { root: true });

        service[key]
          .call(payload)
          .then((response) => {
            const { codeKey, codeSuccessKey, dataKey } = service.default;

            if (response[codeKey] === codeSuccessKey) {
              // 向数据流里放入Service的方法名为key,response[dataKey]为值的数据
              // commit('receive', { ...state, [key]: response[dataKey] });
              commit(`${namespace}/receive`, { key, value: response[dataKey] }, { root: true });

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
        defaultState[key] = {
          value: Service[key].defaultResult(),
        };
      }
    });

    // 动态模块注册
    $store.registerModule(namespace, {
      // 开启命名空间
      namespaced: true,
      state: () => ({
        ...defaultState,
        // @ts-ignore
        ...((module || {})?.state || {}),
      }),
      /**
       * {
       *    fetchList:{
       *        value: {
       *            total: 10,
       *            records: []
       *        }
       *    }
       * }
       */
      mutations: {
        receive(state, { key, value }) {
          if (!key) return;

          state[key].value = value;
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
 * mapState
 * @param namespaces
 * @return object
 */
export const mapState = (namespaces: string[]) => {
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

      if (key === 'default') continue;

      states[`${namespace}${formatKey(key)}`] = (state) => state[namespace][key].value;
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
     * beforeMount - 重置namespaces数据流的数据
     */
    beforeMount(): void {
      namespaces.forEach((namespace: string) => {
        const Service = $serviceConfig[namespace];

        const serviceKeys = Object.keys(Service);

        const defaultState = {};

        serviceKeys.forEach((key) => {
          if (key !== 'default') {
            defaultState[key] = Service[key].defaultResult();
          }
        });

        Object.keys(defaultState).forEach((key) => {
          // @ts-ignore
          this.$store.commit(`${namespace}/receive`, { key, value: defaultState[key] });
        });
      });
    },
  };
};

/**
 * useState
 * @description 支持setup的useState
 * @param namespaces
 */
export const useState = (namespaces: string[]) => {
  const store = $store;

  const states = {
    loading: computed(() => store.state.loading),
  };

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    for (let j = 0; j < serviceKeys.length; j++) {
      const key = serviceKeys[j];

      if (key === 'default') continue;

      // const keyComputed = computed(() => store.state[namespace][key]);
      //
      // states[`${namespace}${formatKey(key)}`] = toRef(keyComputed.value, 'value');
      states[`${namespace}${formatKey(key)}`] = toRef(store.state[namespace][key], 'value');
    }
  }

  return states;
};

/**
 * useMutations
 * @description 支持setup的useMutations
 * @param namespaces
 */
export const useMutations = (namespaces: string[]) => {
  const store = $store;

  const mutations = {};

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    mutations[`${namespace}ReceiveMutation`] = (payload?: any) =>
      store.commit(`${namespace}/receive`, payload);
  }

  return mutations;
};

/**
 * useActions
 * @description 支持setup的useActions
 * @param namespaces
 */
export const useActions = (namespaces: string[]) => {
  const store = $store;

  const actions = {};

  for (let i = 0; i < namespaces.length; i++) {
    const namespace = namespaces[i];

    // service的实例
    const Service = $serviceConfig[namespace];

    const serviceKeys = Object.keys(Service);

    for (let j = 0; j < serviceKeys.length; j++) {
      const key = serviceKeys[j];

      if (key === 'default') continue;

      actions[`${namespace}${formatKey(key)}Action`] = (payload?: any) =>
        store.dispatch(`${namespace}/${key}`, payload);
    }
  }

  return actions;
};

/**
 * plugin
 * @param serviceConfig - service的配置
 * @param modules - 模块的配置
 * @return Function
 */
export default (serviceConfig: IServiceConfig, modules: IModules) => {
  $serviceConfig = serviceConfig;
  $modules = modules;

  /**
   * vuex的一个VuexGenerator插件
   * @param context
   */
  // @ts-ignore
  return (store: Store) => {
    // 获取vuex的store对象
    $store = store;

    // 创建loading的module
    registerLoading();

    // 根据serviceConfig配置自动生成module配置
    registerBusinessModules();
  };
};
