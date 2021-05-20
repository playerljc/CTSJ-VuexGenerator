<!--<template>-->
<!--  <div id="app">-->
<!--    <img alt="Vue logo" src="./assets/logo.png" />-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App" />-->
<!--    <p>userLoading:{{ loading['user/fetchList'] }}</p>-->
<!--    <p>userTotal:{{ userFetchList.total }}</p>-->
<!--    <p>userList:{{ userFetchList.list }}</p>-->
<!--    <p @click="userFetchListAction('123')">clickUser</p>-->

<!--    <p>personLoading:{{ loading['person/fetchList'] }}</p>-->
<!--    <p>personTotal:{{ personFetchList.total }}</p>-->
<!--    <p>personList:{{ personFetchList.list }}</p>-->
<!--    <p @click="personFetchListAction('123')">clickPerson</p>-->

<!--    <p>globalLoading:{{ loading.global }}</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapState, mapMutations, mapActions, cleanMixin } from '@ctsj/vuexgenerator';-->

<!--import HelloWorld from './components/HelloWorld.vue';-->

<!--export default {-->
<!--  mixins: [cleanMixin(['user','person'])],-->
<!--  data: () => ({-->
<!--    a: '123',-->
<!--  }),-->
<!--  name: 'App',-->
<!--  components: {-->
<!--    HelloWorld,-->
<!--  },-->
<!--  computed: {-->
<!--    ...mapState(['user', 'person']),-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions(['user', 'person']),-->
<!--    ...mapMutations(['user', 'person']),-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style>-->
<!--#app {-->
<!--  margin-top: 60px;-->
<!--  color: #2c3e50;-->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif;-->
<!--  text-align: center;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--}-->
<!--</style>-->

<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :default-selected-keys="['User']">
        <a-menu-item key="User">
          <a-icon type="user" />
          <router-link to="/user">User</router-link>
        </a-menu-item>
        <a-menu-item key="Person">
          <a-icon type="video-camera" />
          <router-link to="/person">Person</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
