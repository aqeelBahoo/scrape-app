<template>
  <div class="container-fluid h-100">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-3 text-center" style="color: white">
        <div>
            <h3>Welcome</h3>
            <p>Please login to the system</p>
        </div>
        <div>
          <div class="form-group">
            <input type="email" class="form-control" id="inputEmail" placeholder="Email" v-model="email">
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="password" v-on:keydown.enter="login()">
          </div>
          <div class="form-group">
            <button :disabled="email == '' || password == '' || isReqPending"  v-on:click="login()" class="btn btn-success">
              <span v-if="isReqPending" class="fa fa-spinner fa-spin"></span>
              Login</button>
            <!-- Don't have an account? Please <a href="/register">signup</a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as auth from '../utils/auth.js'
import router from '../router/index.js'

export default {
  name: 'Login',
  data () {
    return {
      email: this.email,
      password: this.password,
      isReqPending: false
    }
  },
  methods: {
    login () {
      this.isReqPending = true
      auth.login(this.email, this.password)
        .then((res) => {
          this.isReqPending = false
          if (res.success) {
            localStorage.setItem('jwt', res.token)
            let base64Url = res.token.split('.')[1]
            let base64 = base64Url.replace('-', '+').replace('_', '/')
            localStorage.setItem('user', atob(base64))
            router.push({ name: 'AdminSearch' })
            location.reload()
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
    box-shadow: 4px 4px rgba(0, 0, 0, 0.1);
}

.btn {
    width: 300px;
}

.btn-success {
    background-color: rgb(34, 149, 202);
    box-shadow: 4px 4px rgba(0, 0, 0, 0.1);
    border: none;
}

</style>
