<template>
  <v-layout row wrap>
    <v-list>
      <v-list-tile>
        <v-list-tile-content>

        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-layout>
</template>

<script>
export default {
  name: "business-dashboard",
  data() {
    return {
      past: 0,
      future: 0,
      rating: 0,
      employees: [],
      pastByEmployee: [],
      futureByEmployee: [],
      ratingByEmployee: [],
    }
  },
  methods: {
    getPast() {
      return this.$axios.get( "/statistics/appointments/amount/owner", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getFuture() {
      return this.$axios.get( "/statistics/appointments/amount/future/owner", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getRating() {
      return this.$axios.get( "/statistics/appointments/rating/owner", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getEmployees() {
      return this.$axios.get( "/employee" )
    },
    getPastByEmployee( ids ) {
      return this.$axios.get( "/statistics/appointments/amount", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getFutureByEmployee( ids ) {
      return this.$axios.get( "/statistics/appointments/amount/future", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getRatingByEmployee( ids ) {
      return this.$axios.get( "/statistics/appointments/rating", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
  },
  mounted() {
    this.getPast()
      .then( console.log )
      .catch( console.error )
    this.getFuture()
      .then( console.log )
      .catch( console.error )
    this.getRating()
      .then( console.log )
      .catch( console.error )

    this.getEmployees()
      .then( resp => {
        this.employees = resp.data

        this.getPastByEmployee()
          .then( console.log )
          .catch( console.error )
        this.getFutureByEmployee()
          .then( console.log )
          .catch( console.error )
        this.getRatingByEmployee()
          .then( console.log )
          .catch( console.error )
      } )
  },
}
</script>

<style>
</style>
