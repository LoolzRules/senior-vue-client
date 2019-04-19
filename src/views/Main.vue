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
      <!--<v-layout row wrap mt-4>-->
      <!--<v-flex pa-2 xs12 sm6 lg4 xl3-->
      <!--v-for="(cat, index) in categories"-->
      <!--v-bind:key="index">-->
      <!--<v-avatar class="primary lighten-4">-->
      <!--<v-icon class="red&#45;&#45;text">{{cat.icon}}</v-icon>-->
      <!--</v-avatar>-->
      <!--<router-link :to="cat.link" class="ml-3 title">{{cat.name}} {{index+1}}</router-link>-->
      <!--</v-flex>-->
      <!--</v-layout>-->
      <v-layout column mt-4>
        <v-card v-for="(result, index) in searchResults" :key="index"
                @click="loadEmployees( result.serviceId )"
                class="response mb-4">
          <v-card-title>
            <span class="headline">
              {{result.serviceName}} - {{result.serviceCost}}₸
            </span>
          </v-card-title>
          <v-card-text>
            <v-flex class="subheader">
              Категория: {{result.categoryName}}
            </v-flex>
            <v-flex class="subheader">
              Компания: {{result.businessCompanyName}}
            </v-flex>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-flex>

    <v-dialog v-model="searchResultEmployees.show" max-width="500px">
      <v-card>
        <v-card-text v-if="searchResultEmployees.loaded">
          <v-list dense subheader>
            <v-list-tile v-for="( field, index ) in searchResultEmployees.data" :key="index">
              <v-list-tile-content class="grow mr-2">
                <router-link :to="{
                  name: 'otherSchedule',
                  params: {
                    employeeId: index,
                    serviceId: searchResultEmployees.serviceId
                  },
                }">{{field.name}}</router-link>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          <v-layout
              justify-center
              align-center>
            <v-progress-circular
                indeterminate
                color="primary">
            </v-progress-circular>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      searchResults: [],
      searchResultEmployees: {
        show: false,
        loaded: false,
        left: 0,
        data: {},
        serviceId: 0,
      },
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
        this.searchResults = response.data
      } ).catch( ( error ) => {
        console.error( error )
      } )
    },
    loadEmployees( id ) {
      this.searchResultEmployees.data = {}
      this.searchResultEmployees.show = true
      this.searchResultEmployees.loaded = false
      this.searchResultEmployees.serviceId = id

      this.$axios.get( `/service/${id}` )
        .then( resp => {
          this.searchResultEmployees.left = resp.data.length

          resp.data.forEach( id => {
            this.$axios.get( `/user/${id}` )
              .then( resp => {
                console.log( resp )
                this.searchResultEmployees.data[id] = resp.data
                this.searchResultEmployees.left--

                console.log( this.searchResultEmployees.left, !this.searchResultEmployees.left )
                this.searchResultEmployees.loaded = !this.searchResultEmployees.left
              } )
              .catch( console.error )
          } )
        } )
        .catch( console.error )
    },
  },
}
</script>

<style lang="stylus">
  .response
    cursor pointer
</style>
