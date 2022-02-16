<template>
    <a-table
      :columns="columns"
      :data-source="userFetchList.list"
      :loading="loading['user/fetchList']"
      :pagination="false"
    />
<!--  <button @click="onClick">{{ userFetchList }}</button>-->
  <!--  <div>{{ loading['user/fetchList'] }}</div>-->
<!--    <div>{{ user }}</div>-->
<!--    <div>{{ userFetchList }}</div>-->
<!--  <button @click="onClick">{{list}}</button>-->
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
      actions.userFetchListAction()/* .then((res) => {
        // console.log('userFetchListAction success', res, state)
      }) */
    })

    // const store = reactive({
    //   user: {
    //     fetchList: {
    //       total: 0,
    //       list: [],
    //     },
    //   },
    // });
    //
    // const state = {
    //   userFetchList: computed(() => {
    //     return store.user.fetchList;
    //   }),
    // };

    // const obj = {
    //   aaa: countComputed
    // }

    // console.log('obj', obj)

    // const list = ref([])
    // const listRef = computed(() => list)

    // const userList = toRef(state.userFetchList.value, 'value')
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
      // userFetchList: state.userFetchList,
      // list,
      // onClick: () => {
      //   list.value = [1, 2, 3]
      // }
      // onClick: () => {
      //   // count.value++
      //   store.user.fetchList = {
      //     total: 10,
      //     list: [1, 2, 3],
      //   };
      // },
    }
  }
}
</script>
