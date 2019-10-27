<template>
  <nav class="navbar navbar-expand-md fixed-top">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto nav-pills">
        <li class="nav-item active" >
          <!-- <router-link class="nav-item active" to="/admin/search">New search</router-link> -->
          <button class="btn btn-success btn-sm" v-if="jwt" v-on:click="logout()">Logout</button>
          <button class="btn btn-success btn-sm" v-if="jwt" v-on:click="router.push({ name: 'Register' })">Signup</button>
          <button class="btn btn-success btn-sm" v-if="jwt" v-on:click="router.push({name: 'Users'})">Delete Users</button>
        </li>
        <!-- <li class="nav-item">
          <router-link class="nav-item" to="/admin/history">History</router-link>
        </li> -->
      </ul>
    </div>
    <img id="logo" src="../assets/img/logo.jpg" height="50px">
  </nav>
</template>

<script>
import router from '../router/index.js'

export default {
  name: 'Navbar',
  data: () => {
    return {
      router: router,
      msg: 'Welcome to Your Vue.js App',
      jwt: localStorage.getItem('jwt')
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      location.reload()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
    background-color: white;
    box-shadow: 0px 2px 13px 0px rgba(0, 0, 0, 0.1);
    color: #2793CF;
}

#logo {
    margin-right: 2rem;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
    color: #fff;
    background-color: #2793CF;
}

.btn-primary {
  background-color: rgb(34, 149, 202);
  border: none;
}

li {
    margin-left: 10px;
}
</style>
