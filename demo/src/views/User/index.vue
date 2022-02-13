<template>
  <a-table :columns="columns" :data-source="userFetchList.list" :loading="loading['user/fetchList']" :pagination="false" />
</template>

<script>
import { mapState, mapMutations, mapActions, cleanMixin } from '@ctsj/vuexgenerator'

export default {
  data () {
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
      ]
    }
  },
  mounted () {
    this.userFetchListAction()
  },
  mixins: [cleanMixin(['user'])],
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['user']),
    ...mapMutations(['user'])
  }
}
</script>
