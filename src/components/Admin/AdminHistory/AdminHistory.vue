<template src="./AdminHistory.html"></template>

<script>
import './AdminHistory.css'
import * as auth from '../../../utils/auth.js'
import router from '../../../router'

export default {
  name: 'AdminHistory',
  data () {
    return {
      name: '',
      modal: {},
      price: '',
      brand: '',
      description: '',
      category: '',
      site: '',
      isReqPending: false,
      list: [],
      loaderIndex: '',
      router: router
    }
  },
  methods: {
    setModalValue (index) {
      this.modal = this.list[index].list
    },
    deleteItem (index) {
      this.loaderIndex = index
      const itemId = this.list[index]._id
      console.log(itemId)
      auth
        .deleteItem(itemId)
        .then(res => {
          this.loaderIndex = ''
          this.list.splice(index, 1)
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.isReqPending = true
    auth
      .getItemList()
      .then(res => {
        this.isReqPending = false
        this.list = res.data
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
