<template>
  <v-layout v-resize="setCalendarHeight" xs12 wrap column>
    <v-flex>
      <v-layout id="calendar_controls" row wrap align-start pb-3>
        <v-flex xs12 sm6 pb-1>
          <v-layout column justify-center>
            <span class="title">{{employeeName}}</span>
            <span class="subheading">{{employeeTitle}}</span>
          </v-layout>
        </v-flex>

        <v-flex xs12 sm6>
          <v-layout row
                    :justify-end="$vuetify.breakpoint.smAndUp"
                    :justify-space-between="$vuetify.breakpoint.xsOnly">
            <v-btn @click="$refs.calendar.prev()"
                   icon class="ma-0 primary elevation-1">
              <v-icon>
                keyboard_arrow_left
              </v-icon>
            </v-btn>
            <v-btn @click="$refs.calendar.next()"
                   icon class="my-0 primary elevation-1">
              <v-icon>
                keyboard_arrow_right
              </v-icon>
            </v-btn>
            <v-btn-toggle
                mandatory
                v-model="calendarConfig.type"
                class="elevation-0">
              <v-btn v-for="( option, index ) in calendarConfig.typeOptions"
                     :key="index"
                     :value="option.value">
                {{option.text}}
              </v-btn>
            </v-btn-toggle>
            <template v-if="$store.state.parsedPermissions && $store.state.parsedPermissions.permsSchedule[6]">
              <v-btn @click="$refs.schedulesEditDialog.open( datum.schedules )"
                     icon class="ma-0 ml-2 primary elevation-1">
                <v-icon small>
                  edit
                </v-icon>
              </v-btn>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex>
      <v-calendar
          ref="calendar"
          v-model="calendarConfig.start"
          :locale="$store.state.locale"
          :style="{height: calendarConfig.height}"
          :first-interval="calendarConfig.firstInterval"
          :interval-count="calendarConfig.intervalCount"
          :weekdays="calendarConfig.weekdays"
          :type="calendarConfig.type"
          :end="calendarConfig.end"
          :interval-height="calendarConfig.intervalHeight"
          :interval-format="calendarConfig.intervalFormat"
          v-touch="{
            left: () => $refs.calendar.next(),
            right: () => $refs.calendar.prev(),
          }"
          color="primary">

        <template slot="dayBody" slot-scope="{ date }">
          <v-layout
              column
              v-for="schedule in scheduleMap(date)"
              :key="schedule.id"
              :style="{
                top: `${myTimeToY(schedule.startTime) - calendarConfig.margin + 1}px`,
                height: `${myMinutesToPixels(schedule.duration) + calendarConfig.margin * 2}px`,
              }"
              class="my-schedule">

            <template v-for="n in schedule.slots">
              <v-layout v-if="slotIsFilled( schedule, n-1, eventsMap, date )"
                        :key="n"
                        row align-center
                        class="my-schedule__slot error">
                <span class="slot-index">{{n}}</span>
              </v-layout>
              <v-layout v-else
                        :key="n"
                        row align-center
                        class="my-schedule__slot">
                <span class="slot-index">{{n}}</span>
                <v-layout
                    v-if="!$store.state.parsedPermissions ||
                      $keycloak.tokenParsed.realm_access.roles.includes( 'client' ) ||
                      (employeeId === $keycloak.authenticated && $store.state.parsedPermissions.permsAppointment[0]) ||
                      (employeeId !== $keycloak.authenticated && $store.state.parsedPermissions.permsAppointment[4])"
                    row justify-center
                    @click="$refs.eventCreateDialog.open( schedule, n-1, eventsMap, date, serviceId )"
                    v-ripple class="my-add-event px-1">
                  <v-icon small>add</v-icon>
                </v-layout>
              </v-layout>
            </template>
          </v-layout>

          <template v-if="!$keycloak.tokenParsed.realm_access.roles.includes('client')">
            <div v-for="event in eventsMap[date]"
                 :key="event.id"
                 @click="$refs.eventEditDialog.open( event )"
                 :style="{ top: myTimeToY(event.slotIndex) + 'px', height: myMinutesToPixels(event.slotDuration) + 'px' }"
                 class="my-event px-1 white--text text-truncate">
              {{event.name}}
            </div>
          </template>
        </template>
      </v-calendar>
    </v-flex>

    <event-edit-dialog ref="eventEditDialog"/>

    <event-create-dialog ref="eventCreateDialog"/>

    <schedules-edit-dialog ref="schedulesEditDialog"/>

    <schedule-create-dialog ref="scheduleCreateDialog"/>

    <v-btn @click="$refs.scheduleCreateDialog.open()"
           fab fixed bottom right
           dark class="accent">
      <v-icon>add</v-icon>
    </v-btn>

  </v-layout>
</template>

<script>
import {
  format,
  parse,
} from "date-fns"
import axiosLib from "axios"
import EventEditDialog from "../components/EventEditDialog"
import EventCreateDialog from "../components/EventCreateDialog"
import SchedulesEditDialog from "../components/SchedulesEditDialog"
import ScheduleCreateDialog from "../components/ScheduleCreateDialog"

export default {
  name: "business-home",
  components: {
    EventEditDialog,
    EventCreateDialog,
    SchedulesEditDialog,
    ScheduleCreateDialog,
  },
  props: [
    "employeeId",
    "employeeName",
    "employeeTitle",
    "serviceId",
  ],
  data() {
    return {
      calendarConfig: {
        type: "4day",
        firstInterval: 8,
        intervalCount: 11,
        intervalHeight: 60,
        margin: 1.5,
        intervalFormat( time ) {
          return time.time
        },
        typeOptions: [
          { text: "День", value: "day", },
          { text: "4 дня", value: "4day", },
          { text: "Нед", value: "week", },
        ],
        defaultWeekdays: [ 1, 2, 3, 4, 5, 6, 0, ], // eslint-disable-line no-magic-numbers
        weekdays: [ 1, 2, 3, 4, 5, 6, 0, ], // eslint-disable-line no-magic-numbers
        height: 0, // eslint-disable-line no-magic-numbers
        model: false,
      },
      datum: {
        schedules: [],
        appointments: [],
      },
      requestParams: {},
    }
  },
  methods: {
    getSchedules() {
      return this.$axios.get( "/schedule", {
        params: this.requestParams,
      } )
    },
    getAppointments() {
      if ( this.$keycloak.authenticated && !this.$keycloak.tokenParsed.realm_access.roles.includes( "client" ) ) {
        return this.$axios.get( "/appointment", {
          params: this.requestParams,
        } )
      } else {
        return this.$axios.get( "/appointment/hidden", {
          params: this.requestParams,
        } )
      }
    },
    getEmployeeServices() {
      return this.$axios.get( "/service", {
        params: this.requestParams,
      } )
    },
    myTimeToY( time ) {
      const digitsIndex = -2
      let tTY = this.$refs.calendar.timeToY( time ) + this.calendarConfig.margin
      if ( typeof time === "number" ) {
        // eslint-disable-next-line
        tTY = this.$refs.calendar.timeToY( "09:00" ) + 20 * time + this.calendarConfig.margin
      } else {
        tTY += this.$refs.calendar.minutesToPixels( Number.parseInt( time.substr( digitsIndex ) ) )
      }
      return tTY
    },
    myMinutesToPixels( minutes ) {
      let mTP = this.$refs.calendar.minutesToPixels( minutes )
      mTP -= 2 * this.calendarConfig.margin // eslint-disable-line no-magic-numbers
      return mTP
    },
    setCalendarHeight() {
      /* eslint-disable no-magic-numbers */
      if ( this.$vuetify.breakpoint.mdAndUp ) {
        let toolbarHeight = Number.parseInt( document.getElementById( "toolbar" ).children[ 0 ].style.height.slice( 0, -2 ), 10 )
        let containerPadding = 2 * ( this.$vuetify.breakpoint.mdAndUp ? 24 : 16 )
        let buttonsHeight = document.getElementById( "calendar_controls" ).clientHeight

        this.calendarConfig.height = `${window.innerHeight - toolbarHeight - containerPadding - buttonsHeight}px`
      } else {
        this.calendarConfig.height = "auto"
      }
      /* eslint-enable no-magic-numbers */
    },
    scheduleMap( date ) {
      const sMap = []
      const parsedDate = parse( date, "YYYY-MM-DD", new Date() )
      this.datum.schedules.forEach( ( schedule ) => {
        if ( schedule.weekDays[ parsedDate.getDay() ] ) {
          sMap.push( schedule )
        }
      } )
      return sMap
    },
    slotIsFilled( schedule, index, eventsMap, date ) {
      return eventsMap[ date ] && eventsMap[ date ].some( ( event ) => {
        const sameSchedule = schedule.id === event.scheduleId
        // eslint-disable-next-line
        const sameSlot = ( index >= event.slotIndex ) && ( index < event.slotIndex + 1 )
        // const sameSlot = ( index >= event.slotIndex ) && ( index < event.slotIndex + event.slotDuration )
        return sameSchedule && sameSlot
      } )
    },
  },
  mounted() {
    console.log( this.$keycloak )
    if ( this.employeeId ) {
      this.requestParams.employeeId = this.employeeId
    } else {
      this.requestParams.employeeId = this.$keycloak.tokenParsed.sub
    }

    axiosLib.all( [
      this.getSchedules(),
      this.getAppointments(),
      this.getEmployeeServices(),
    ] )
      .then( axiosLib.spread( ( schedulesResponse, appointmentsResponse, serviceResponse ) => {
        // console.log( schedulesResponse )
        schedulesResponse.data.forEach( schedule => {
          /* *
           * 1) Makes array of day indices from weekdayCode
           * Performs day shift, since
           * for weekdayCode Sunday is the last weekday,
           * whereas for JS it's the first day
           * */

          /* eslint-disable no-magic-numbers */
          schedule.weekDays = new Array( 7 )
          for ( let i = 0; i < 7; i++ ) {
            schedule.weekDays[ ( 7 - i ) % 7 ] = !!( schedule.weekdayCode >> i & 1 )
          }
          /* eslint-enable no-magic-numbers */

          /* *
           * 2) Adds date for startTime
           * */
          schedule.start = parse( `${schedule.startDate}T${schedule.startTime}:00` )
          console.log( schedule.start, "" )

          /* *
           * 3) Adds duration
           * */
          schedule.duration = schedule.slots * schedule.slotDuration
        } )
        console.log( this.employeeId, this.$keycloak.tokenParsed.sub, appointmentsResponse )
        appointmentsResponse.data.forEach( appointment => {
          this.$set( appointment, "name", serviceResponse.data.filter( service => service.id === appointment.serviceId ).pop().name )

          if ( !this.$keycloak.tokenParsed.realm_access.roles.includes( "client" ) ) {
            console.log( "here" )
            this.$axios.get( `/user/${appointment.clientId}` )
              .then( response => {
                console.log( response.data )
                this.$set( appointment, "clientName", response.data.name )
              } )
          }
        } )
        this.datum.schedules = schedulesResponse.data
        this.datum.appointments = appointmentsResponse.data
      } ) )
      .catch( ( errorSchedules, errorAppointments ) => {
        console.error( errorSchedules, errorAppointments )
      } )
  },
  computed: {
    eventsMap() {
      const eMap = {}
      this.datum.appointments.forEach( ( event ) => {
        let i = 0
        while ( this.datum.schedules[ i ].id !== event.scheduleId ) i++

        const schedule = this.datum.schedules[ i ]
        const startDate = new Date( schedule.start )
        startDate.setMinutes( startDate.getMinutes() + ( schedule.slotDuration * event.slotIndex ) )

        event.start = format( startDate, "HH:mm" )
        event.duration = event.slotDuration * schedule.slotDuration

        if ( !eMap[ event.date ] ) eMap[ event.date ] = []
        eMap[ event.date ].push( event )
      } )
      return eMap
    },
  },
}
</script>

<style lang="stylus">

  .my-event, .my-schedule
    position absolute
    text-overflow ellipsis
    font-size 12px
    margin-right 0

  .my-event
    left 16px
    right 0
    border-radius 2px
    background-color var(--v-primary-base)

  .my-schedule
    background-color rgba(127, 127, 127, 0.5)
    left 0
    right 0
    &__slot
      box-sizing border-box
      border-bottom 1px solid rgba(0, 0, 0, 0.5)

      & > .slot-index
        display inline-block
        text-align center
        width 16px

      & > .my-add-event
        cursor pointer

        &:hover
          background-color var(--v-primary-lighten3)

  @media (max-width: 600px)
    .v-calendar-daily_head-day-label
      font-size 20px

  .add-fab
    position absolute

</style>
