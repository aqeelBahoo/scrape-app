<template src='./userDashboard.html'> </template>

<script>
import * as auth from '../../utils/auth.js'
import * as api from '../../utils/api.js'
import './userDashboard.css'

export default {
  name: 'UserDashboard',
  data () {
    return {
      isReqPending: false,
      name: '',
      item: {},
      price: '',
      brand: '',
      site: '',
      description: '',
      category: '',
      lists: [],
      loaderIndex: -1
    }
  },
  methods: {
    setItemInModal (index) {
      this.item = this.lists[index].list
    },
    refresh (item, i) {
      console.log(item._id)
      api.refreshItem(item._id)
    }
  },
  mounted () {
    this.isReqPending = true
    auth
      .getListsByUser()
      .then(res => {
        this.isReqPending = false
        this.lists = res
      })
      .catch(err => {
        this.isReqPending = false
        console.log('Errrrorr', err)
      })
  }
}
</script>
