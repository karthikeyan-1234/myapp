<template>
    <v-menu v-model="menu" offset-y :close-on-content-click="false">
      <template v-slot:activator="{ on }">
        <v-icon v-on="on" color="primary">mdi-calendar</v-icon>
      </template>
      <v-date-picker v-model="picker" @click="menu = false" />
    </v-menu>
  </template>
  <script>
  import moment from 'moment';

  export default {
    props: {
      value: {
        type: String,
        default: new Date().toISOString().substr(0, 10),
      },
    },
    data() {
      return {
        menu: false,
      };
    },
    computed: {
      picker: {
        get() {
          return moment(this.value).format('yyyy-MM-DD');
        },
        set(val) {
          this.menu = false;
          this.$emit("input", moment(val).format('yyyy-MM-DD'));
        },
      },
    },
  };
  </script>