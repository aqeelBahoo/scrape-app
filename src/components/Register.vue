<template>
  <div class="container-fluid h-100">
     <div v-on:click="router.push({name: 'AdminSearch'})" class="home">
        <span class="fas fa-home"></span>
     </div>
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-3 text-center" style="color: white">
        <div>
            <h3>Welcome</h3>
            <p>Please Signup to the system</p>
        </div>
        <div>
         <div class="form-group">
            <input type="name" class="form-control" id="inputEmail" placeholder="*Name" v-model="name">
          </div>
          <div class="form-group">
            <input type="email" class="form-control" id="inputEmail" placeholder="*Email" v-model="email">
            <div style="color:red;" v-if="fail">Please select a different email to proceed</div>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="inputPassword" placeholder="*Password" v-model="password">
          </div>
          <div class="form-group">
          <button v-on:click="register()" :disabled="email=='' || password=='' || name=='' || isReqPending" class="btn btn-success">
              <span v-if="isReqPending" class="fa fa-spinner fa-spin"></span>
            Register</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as auth from '../utils/auth.js'
import router from '../router/index.js'
import swal from 'sweetalert'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      name: '',
      fail: false,
      isReqPending: false,
      router: router
    }
  },
  methods: {
    clearFields () {
      this.email = ''
      this.password = ''
      this.name = ''
    },
    register () {
      this.isReqPending = true
      this.$data.fail = false
      auth.register(this.name, this.email, this.password).then(res => {
        this.isReqPending = false
        if (res.success) {
          this.clearFields()
          swal('Success!', 'user has been created!', 'success')
          //  router.push('login')
        } else {
          this.$data.fail = true
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
.home {
  position: absolute;
  top: 70px;
  cursor: pointer;
  color: white;
}
</style>
