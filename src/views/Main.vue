<template>
  <v-layout row align-content-start justify-center wrap>
    <v-flex xs12 sm10 md8 pa-2 class="primary">
      <v-layout row align-center>
        <v-text-field v-model="searchValue"
                      placeholder="Поиск"
                      solo single-line hide-details
                      clearable autofocus
                      class="mr-2">
        </v-text-field>
        <v-btn @click="search"
               :large="$vuetify.breakpoint.smAndUp"
               :icon="$vuetify.breakpoint.xsOnly"
               round class="ma-0 accent elevation-1">
          <v-icon>search</v-icon>
        </v-btn>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm10 md8>
      <v-layout row wrap mt-4>
        <!--<v-flex pa-2 xs12 sm6 lg4 xl3-->
        <!--v-for="(cat, index) in categories"-->
        <!--v-bind:key="index">-->
        <!--<v-avatar class="primary lighten-4">-->
        <!--<v-icon class="red&#45;&#45;text">{{cat.icon}}</v-icon>-->
        <!--</v-avatar>-->
        <!--<router-link :to="cat.link" class="ml-3 title">{{cat.name}} {{index+1}}</router-link>-->
        <!--</v-flex>-->
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data() {
    return {
      searchValue: "",
      categories: [
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
        {
          link: "/",
          icon: "home",
          name: "Категория",
        },
      ],
    }
  },
  methods: {
    search() {
      this.$axios.get( "/service", {
        params: {
          serviceName: this.searchValue,
        },
        data: {
          mainSearch: true,
        },
      } ).then( ( response ) => {
        console.log( response )
      } ).catch( ( error ) => {
        console.error( error )
      } )
    },
  },
}
</script>

<style>

</style>
