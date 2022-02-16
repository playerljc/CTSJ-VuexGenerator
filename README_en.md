# CTSJ-VuexGenerator

vuex 生成器，能通过 Service 自动映射成组件引用 vuex 的 State、Action 和 Mutation 并带有自动重置功能(此功能是一个 vuex 的插件)

# 简介

&ensp;&ensp;一个简单的例子，用 vuex 编写一个标椎用户的模块，用户模块中是标准的 CRUD 操作，我们大致会这样去写

1. 定义 UserService，UserService 大致会是这样

```javascript
import { stringify } from 'qs';
import request from '@/utils/request';

// &#x5217;&#x8868;
export async function fetchtList(params) {
    return request.get('fetchList');
}

// &#x8BE6;&#x60C5;
export async function fetchtInfo(id) {
    return request.get('fetchtInfo');
}

// &#x6DFB;&#x52A0;
export async function fetchtSave(payload) {
    return request.post('fetchSave');
}

// &#x5220;&#x9664;
export async function fetchtDelete(id) {
    return request.delete('fetchtDelete');
}

// &#x4FEE;&#x6539;
export async function fetchtUpdate(payload) {
    return request.put('fetchtUpdate');
}
```

2. 定义 UserModel，UserModel 大致会是这样

```javascript
import {
    fetchtList,
    fetchtInfo,
    fetchtSave,
    fetchtDelete,
    fetchtUpdate,
} from '@/services/UserService';

export default {
    namespace: true,
    state: {
        list: {
            list: [],
            total: 0,
        },
        info: {},
    },
    actions: {
        // &#x5217;&#x8868;
        fetchList({ commit, state }, payload) {
            fetchtList(payload).then((response) => {
                if (response.code === 0) {
                    commit('receive', {
                        ...state,
                        list: response.data,
                    });
                }
            });
        },
        // &#x8BE6;&#x60C5;
        fetchInfo({ commit, state }, { id }) {
            fetchInfo(id).then((response) => {
                if (response.code === 0) {
                    commit('receive', {
                        ...state,
                        info: response.data,
                    });
                }
            });
        },
        // &#x6DFB;&#x52A0;
        feachSave({ commit, state }, { success, ...other }) {
            feachSave(other).then((response) => {
                if (response.code === 0) {
                    if (success) {
                        success();
                    }
                }
            });
        },
        // &#x4FEE;&#x6539;
        feachUpdate({ commit, state }, { success, ...other }) {
            feachUpdate(other).then((response) => {
                if (response.code === 0) {
                    if (success) {
                        success();
                    }
                }
            });
        },
        // &#x5220;&#x9664;
        feachDelete({ commit, state }, { success, id }) {
            feachDelete(id).then((response) => {
                if (response.code === 0) {
                    if (success) {
                        success();
                    }
                }
            });
        },
    },
    mutations: {
        receive(state, payload) {
            const keys = Object.keys(state);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                state[key] = payload[key];
            }
        },
    },
};
```

3. 定义 UserPage, UserPage 大致会是这样
```javascript
<template>...</template>
<script>
    export default {
    computed: {
    ...mapState({
    list: state => state.user.list.list,
    info: state => state.user.info,
}),
},
    methods: {
    ...mapActions({
    fetchList: 'user/fetchList',
    fetchInfo: 'user/fetchInfo',
    feachSave: 'user/feachSave',
    feachUpdate: 'user/feachUpdate',
    feachDelete: 'user/feachDelete',
}),
    ...mapMutations({
    receive:'user/receive'
}),
}
};
</script>
```

&ensp;&ensp;我们会发现一个问题，像这样比较常规的 CRUD 操作，从 Service -> Model -> Component 的 computed 和 methods 方法的名字都是一一对应的， 而 Model 中的 actions 操作基本都是调用 Service 中相应的接口，并且注入到数据流当中，而且 Service 也是按照相应模块编写的比如 UserService 就是处理 User 相关的操作， 这样就和 Model 中的 namespace 相对应，再则 Model 中的 Mutations 里面应该只有一个 receive 的 Mutation， 不应该有多个处理，actions 中所有的 commit(mutation)都应该调用 commit('receive')来进行处理 所以我们就可以根据 Service 自动生成 computed 和 methods 和 Model 中的 actions 和 mutations， 我们只处理标椎模块，如果自动生成的这三部分不能满足需求，可以进行重写覆盖

# 安装

```javascript
  npm install @ctsj/vuexgenerator
  yarn add @ctsj/vuexgenerator
```

# 例子

1. 定义 UserService

```javascript
import { stringify } from 'qs';
import request from '@/utils/request';

// &#x5217;&#x8868;
export async function fetchtList(params) {
  return request.get('fetchList');
}

// &#x8BE6;&#x60C5;
export async function fetchtInfo(id) {
  return request.get('fetchtInfo');
}

// &#x6DFB;&#x52A0;
export async function fetchtSave(payload) {
  return request.post('fetchSave');
}

// &#x5220;&#x9664;
export async function fetchtDelete(id) {
  return request.delete('fetchtDelete');
}

// &#x4FEE;&#x6539;
export async function fetchtUpdate(payload) {
  return request.put('fetchtUpdate');
}

// &#x9ED8;&#x8BA4;&#x5BFC;&#x51FA;&#x4E0E;&#x63A5;&#x53E3;&#x5148;&#x5173;&#x7684;&#x53C2;&#x6570;
export default {
  // &#x63A5;&#x53E3;&#x6210;&#x529F;&#x5931;&#x8D25;&#x7684;&#x72B6;&#x6001;&#x952E;
  codeKey: 'code',
  // &#x63A5;&#x53E3;&#x6210;&#x529F;&#x7684;&#x72B6;&#x6001;&#x503C;
  codeSuccessKey: 200,
  // &#x63A5;&#x53E3;&#x6570;&#x636E;&#x7684;&#x952E;
  dataKey: 'data',
  // &#x63A5;&#x53E3;&#x6D88;&#x606F;&#x952E;
  messageKey: 'message',
};
```

2. 定义 UserModel

```javascript
export default {};
```

3. 定义 UserPage

```javascript
<template>
  <a-table :columns="columns" :data-source="userFetchList.list" :loading="loading['user/fetchList']" :pagination="false">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o"> Name</a-icon></span>
    <span slot="tags" slot-scope="tags">
      <a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a>Invite &#x4E00; {{ record.name }}</a>
      <a-divider type="vertical">
      <a>Delete</a>
      <a-divider type="vertical">
      <a class="ant-dropdown-link"> More actions <a-icon type="down"> </a-icon></a>
    </a-divider></a-divider></span>
  </a-table>
</template>

<script>
  import { mapState, mapMutations, mapActions, cleanMixin } from '@ctsj/vuexgenerator';
  export default {
    data() {
      return {
        columns: [
            {
              dataIndex: 'name',
              key: 'name',
              slots: { title: 'customTitle' },
              scopedSlots: { customRender: 'name' },
            },
            {
              title: 'Age',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: 'Address',
              dataIndex: 'address',
              key: 'address',
            },
            {
              title: 'Tags',
              key: 'tags',
              dataIndex: 'tags',
              scopedSlots: { customRender: 'tags' },
            },
            {
              title: 'Action',
              key: 'action',
              scopedSlots: { customRender: 'action' },
            },
        ]
      }
    },
    mounted() {
      this.userFetchListAction();
    },
    mixins: [cleanMixin(['user'])],
    computed: {
      ...mapState(['user']),
    },
    methods: {
      ...mapActions(['user']),
      ...mapMutations(['user']),
    },
};
</script>
```

4. 使用setup
```javascript
<template>
    <a-table
      :columns="columns"
      :data-source="userFetchList.list"
      :loading="loading['user/fetchList']"
      :pagination="false"
    />
</template>

<script lang="js">
import { useState, useActions, cleanMixin } from '@ctsj/vuexgenerator'
import { onMounted } from 'vue'

export default {
  mixins: [cleanMixin(['user'])],
  setup () {
    const state = useState(['user'])

    const actions = useActions(['user'])

    onMounted(() => {
      actions.userFetchListAction().then((res) => {
        console.log('userFetchListAction success', res, state)
      }) 
    })
    
    return {
      columns: [
        {
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address'
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags'
        },
        {
          title: 'Action',
          key: 'action'
        }
      ],
      ...state
    }
  }
}
</script>
```

5. 注册 Service(在一个单独的文件中 VuexGeneratorPlugin.js)

```javascript
import VuexGenerator from '@ctsj/vuexgenerator';

import UserModel from '../modules/user';
import PersonModel from '../modules/person';

function serviceRegister() {
  const requireComponent = require.context('../../service', false, /.*\.(js)$/);

  const services = {};
  requireComponent.keys().forEach((fileName) => {
    const serviceKey = fileName.substring(2, fileName.length - 3);
    services[serviceKey] = requireComponent(fileName);
  });

  return services;
}

// &#x521B;&#x5EFA;VuexGeneratorPlugin&#x63D2;&#x4EF6;
export default VuexGenerator(serviceRegister(), {
  user: UserModel,
  person: PersonModel,
});
```

6. 在 main.js 中进行引用插件

```javascript
import { createApp } from 'vue'
import Antd from 'ant-design-vue'

import store from './store'
import router from './router'
import App from './App.vue'

import './registerServiceWorker'

import 'ant-design-vue/dist/antd.css'

createApp(App).use(store).use(router).use(Antd).mount('#app')
```

# API

- 工厂方法 - 创建 vuex 的插件(传入 ServiceConfig 和 Modules 的定义)

- mapState - state 的辅助函数
- mapActions - action 的辅助函数
- mapMutations - Mutations 的辅助函数
- useState - 在setup中获取数据的辅助函数
- useMutations - 在setup中更新state的辅助函数
- useActions - 在setup中进行异步更新state的辅助函数
- cleanMixin - 用户自动重置 vuex 数据的 mixin

# 其他

demo 目录下附带了一个 demo
