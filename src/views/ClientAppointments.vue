<template>
  <v-layout column wrap>

  </v-layout>
</template>

<script>
export default {
  name: "client-appointments",
  mounted() {
    console.log( this.$keycloak.tokenParsed.sub )
    this.getAppointments()
      .then( res => {
        console.log( res )
      } )
      .catch( console.error )
  },
  methods: {
    getAppointments() {
      return this.$axios.get( "/appointment", {
        employeeId: this.$keycloak.tokenParsed.sub,
      } )
    },
  },
}
</script>

<style lang="stylus">
</style>
