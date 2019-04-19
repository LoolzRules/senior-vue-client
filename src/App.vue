<template>
  <v-app toolbar>
    <v-navigation-drawer
        v-if="this.$keycloak.authenticated"
        v-model="$store.state.drawer"
        app fixed dark width="250"
        class="secondary">

      <v-toolbar flat class="secondary darken-1">
        <v-toolbar-title>Меню</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile v-for="(item, index) in menu[menuToShow]"
                     active-class="primary"
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
      <v-toolbar-side-icon
          v-if="this.$keycloak.authenticated"
          @click="switchDrawer">
        <v-icon>{{$store.state.drawer ? "arrow_back" : "menu"}}</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-title class="ml-2">{{$store.state.windowName}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="$keycloak.authenticated">
        <v-icon @click="$keycloak.logout">exit_to_app</v-icon>
      </template>
      <template v-else-if="$keycloak.ready">
        <v-btn @click="$keycloak.login"
               depressed class="accent">
          Войти
        </v-btn>
        <v-btn
            @click="$keycloak.register"
            depressed class="accent">
          Регистрация
        </v-btn>
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
        [
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
        [
          {
            href: "/",
            name: "Домашняя",
            icon: "home",
          },
          {
            href: "/appointments",
            name: "Записи",
            icon: "people",
          },
        ],
      ],
    }
  },
  computed: {
    menuToShow() {
      return +this.$keycloak.tokenParsed.realm_access.roles.includes( "client" )
    },
  },
  methods: {
    switchDrawer() {
      this.$store.state.drawer = !this.$store.state.drawer
    },
  },
}
</script>

<style lang="stylus">
  html
    overflow-y auto

  .v-icon
    display inline-flex !important
</style>
