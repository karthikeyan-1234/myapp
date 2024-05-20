
import Navbar from './components/Navbar.vue';
<template>
  <v-app>
    <Navbar/>
    <v-main class="ma-4">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import Navbar from './components/Navbar';
export default{
  name: 'App',
  watch: {
        $route: {
            immediate: true,
            handler(to, from) {
                document.title = 'Business Manager';
            }
        },
    },
  components:{
    Navbar
  }
}
</script>