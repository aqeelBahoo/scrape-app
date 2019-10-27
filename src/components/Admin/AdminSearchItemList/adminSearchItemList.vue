
<template src="./adminSearchItemList.html"></template>

<script>
import { AdminMixins } from '../../mixins/AdminMixins'
import './adminSearchItemList.css'
import * as auth from '../../../utils/auth.js'
import router from '../../../router'
import swal from 'sweetalert'

export default {
  name: 'AdminSearchItemList',
  mixins: [AdminMixins],
  data () {
    return {
      modal: {},
      category: '',
      searchResults: [],
      allUsers: [],
      loaderIndex: -1,
      isAssignToUserReqPending: false,
      selectedUsersId: [],
      router: router
    }
  },
  methods: {
    setModalValue (index) {
      this.modal = this.searchResults[index]
    },
    getUsers (i) {
      this.loaderIndex = i
      this.setModalValue(i)
      auth.getUsers().then(res => {
        this.loaderIndex = -1
        this.allUsers = res
        $('#assignItemDialog').modal()
      })
    },
    assignItemToUser () {
      if (this.selectedUsersId.length === 0) {
        return
      }
      this.isAssignToUserReqPending = true
      auth
        .saveItemWithAssignUsers(this.selectedUsersId, this.modal)
        .then(res => {
          if (!res) {
            this.isAssignToUserReqPending = false
            swal('Something Bad Happened!', 'Try Again!', 'error')
            return
          }
          this.isAssignToUserReqPending = false
          $('#assignItemDialog').modal('hide')
          this.selectedUsersId = []
        })
    }
  },
  mounted () {
    this.searchResults = this.getList()
  }
}
</script>
