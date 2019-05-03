<template>
  <v-layout column wrap>
    <v-data-iterator
        class="fill-height my-data-iterator"
        :items="appointments"
        :rows-per-page-items="$store.state.customItemsPerPage"
        :pagination.sync="pagination"
        content-tag="v-layout"
        row wrap>
      <v-flex
          slot="item"
          slot-scope="props"
          class="xs-12"
          :class="`sm${Math.max( 12/pagination.rowsPerPage, 3 )}`">
        <v-card>
          <v-card-title class="subheading font-weight-bold layout">
            {{ props.item.service.name }} - {{ props.item.formattedDate }} {{ props.item.time }}
          </v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>
                Цена:
              </v-list-tile-content>
              <v-list-tile-content class="align-end font-weight-bold">
                {{ props.item.service.cost }}₸
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                Имя:
              </v-list-tile-content>
              <v-list-tile-content class="align-end font-weight-bold">
                {{ props.item.employee.name }}
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-btn icon small :href="`tel:${props.item.employee.phone}`">
              <v-icon small>
                phone
              </v-icon>
            </v-btn>
            <v-btn icon small :href="`mailto:${props.item.employee.email}`">
              <v-icon small>
                email
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-layout>
</template>

<script>
import axiosLib from "axios"
import {
  format,
} from "date-fns"

export default {
  name: "client-appointments",
  data() {
    return {
      appointments: [],
      pagination: {
        rowsPerPage: 2,
      },
    }
  },
  mounted() {
    this.getAppointments()
      .then( res => {
        res.data.forEach( appointment => {
          appointment.employee = {}
          appointment.service = {}
          appointment.time = ""
          appointment.formattedDate = format( new Date( appointment.date ), "DD.MM.YYYY" )
        } )
        this.appointments = res.data
        this.appointments.forEach( appointment => {
          axiosLib.all( [
            this.getAppointmentEmployee( appointment.employeeId ),
            this.getAppointmentService( appointment.employeeId ),
            this.getAppointmentSchedule( appointment.employeeId ),
          ] )
            .then( axiosLib.spread( ( eResp, sResp, hResp ) => {
              this.$set( appointment, "employee", eResp.data )
              this.$set( appointment, "service", sResp.data.filter( service => service.id === appointment.serviceId ).pop() )
              this.$set( appointment, "time", this.formatTime( hResp.data.filter( schedule => schedule.id === appointment.scheduleId ).pop(), appointment.slotIndex ) )
            } ) )
        } )
      } )
      .catch( console.error )
  },
  methods: {
    getAppointments() {
      return this.$axios.get( "/appointment", {
        employeeId: this.$keycloak.tokenParsed.sub,
      } )
    },
    getAppointmentEmployee( employeeId ) {
      return this.$axios.get( `/user/${employeeId}` )
    },
    getAppointmentService( employeeId ) {
      return this.$axios.get( `/service?employeeId=${employeeId}` )
    },
    getAppointmentSchedule( employeeId ) {
      return this.$axios.get( `/schedule?employeeId=${employeeId}` )
    },
    formatTime( schedule, index ) {
      const date = new Date( `${schedule.startDate}T${schedule.startTime}` )
      date.setMinutes( date.getMinutes() + schedule.slotDuration * index )
      return format( date, "HH:mm" )
    },
  },
}
</script>

<style lang="stylus">
</style>
