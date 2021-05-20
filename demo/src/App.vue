<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <p>userLoading:{{ loading['user/fetchList'] }}</p>
    <p>userTotal:{{ userFetchList.total }}</p>
    <p>userList:{{ userFetchList.list }}</p>
    <p @click="userFetchListAction('123')">clickUser</p>

    <p>personLoading:{{ loading['person/fetchList'] }}</p>
    <p>personTotal:{{ personFetchList.total }}</p>
    <p>personList:{{ personFetchList.list }}</p>
    <p @click="personFetchListAction('123')">clickPerson</p>

    <p>globalLoading:{{ loading.global }}</p>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, cleanMixin } from '@ctsj/vuexgenerator';

import HelloWorld from './components/HelloWorld.vue';

export default {
  mixins: [cleanMixin(['user','person'])],
  data: () => ({
    a: '123',
  }),
  name: 'App',
  components: {
    HelloWorld,
  },
  computed: {
    ...mapState(['user', 'person']),
  },
  methods: {
    ...mapActions(['user', 'person']),
    ...mapMutations(['user', 'person']),
  },
};
</script>

<style>
#app {
  margin-top: 60px;
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
