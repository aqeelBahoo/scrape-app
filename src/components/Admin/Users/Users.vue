<template src="./Users.html">
</template>

<script>
import './Users.css'
import router from '../../../router'
import * as auth from '../../../utils/auth.js'

export default {
  name: 'Users',
  data () {
    return {
      isRequestPending: false,
      isDeleteReqPending: -1,
      users: [],
      router: router
    }
  },
  methods: {
    deleteUser (user, i) {
      this.isDeleteReqPending = i
      const userId = user._id
      auth.deleteUser(userId).then(res => {
        this.isDeleteReqPending = -1
        console.log('success')
        this.users.splice(i, 1)
      })
    }
  },
  mounted () {
    this.isRequestPending = true
    auth
      .getUsers().then(res => {
        this.isRequestPending = false
        console.log(res)
        this.users = res
      })
  }
}

</script>
