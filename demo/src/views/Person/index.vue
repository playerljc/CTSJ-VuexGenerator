<template>
  <a-table :columns="columns" :data-source="personFetchList.list" :loading="loading['person/fetchList']" :pagination="false" />
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
    this.personFetchListAction()
  },
  mixins: [cleanMixin(['person'])],
  computed: {
    ...mapState(['person'])
  },
  methods: {
    ...mapActions(['person']),
    ...mapMutations(['person'])
  }
}
</script>
