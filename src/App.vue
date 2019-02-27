<template>
  <v-app toolbar>
    <!--<v-navigation-drawer app fixed dark class="primary"-->
    <!--v-if="this.$keycloak.authenticated"-->
    <!--v-model="this.$store.state.drawer">-->
    <v-navigation-drawer app fixed dark width="250"
                         class="secondary"
                         v-model="$store.state.drawer">

      <v-toolbar flat class="secondary darken-1">
        <v-toolbar-title>Меню</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile v-for="(item, index) in menu"
                     active-class="primary"
                     @click="$store.dispatch('setMessage', item.name)"
                     :to="item.href"
                     :key="index">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.name}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark class="secondary darken-1" id="toolbar">
      <v-toolbar-side-icon @click="switchDrawer">
        <v-icon>{{this.$store.state.drawer ? "arrow_back" : "menu"}}</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-title class="ml-2">{{$store.state.windowName}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="this.$keycloak.authenticated">
        <v-icon @click="this.$keycloak.logoutFn">exit_to_app</v-icon>
      </template>
      <template v-else>
        <v-btn depressed class="accent" @click="this.$keycloak.loginFn">Войти</v-btn>
      </template>
    </v-toolbar>

    <v-content class="white">
      <v-container fluid fill-height>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      menu: [
        {
          href: "/",
          name: "Домашняя",
          icon: "home",
        },
        {
          href: "/schedule",
          name: "Расписание",
          icon: "schedule",
        },
        {
          href: "/business_employees",
          name: "Сотрудники",
          icon: "people",
        },
        {
          href: "/business_categories",
          name: "Категории",
          icon: "list",
        },
      ],
    }
  },
  methods: {
    switchDrawer() {
      this.$store.state.drawer = !this.$store.state.drawer
    },
  },
  // mounted() {
  //   console.log( this.$keycloak, this.$store )
  // },
}
</script>

<style>
  html {
    overflow-y: auto;
  }
</style>
