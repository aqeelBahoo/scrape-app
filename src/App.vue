<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
  min-height: 38rem;
  padding-top: 5rem;
  background-color:#77ac41;
}

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

li {
    margin-left: 10px;
}
</style>
