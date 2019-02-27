<template>
  <v-layout column v-if="this.eventSchedule.length > 0">
    <v-card-actions class="justify-space-between">
      <v-btn icon class="accent" @click="prev">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <span class="title">{{this.formatDateNoYear( this.eventSchedule[this.window][0] )}}</span>
      <v-btn icon class="accent" @click="next">
        <v-icon>chevron_right</v-icon>
      </v-btn>
    </v-card-actions>

    <v-window v-model="window">
      <v-window-item v-for="(day, index) in eventSchedule"
                     :key="index">
        <v-expansion-panel>
          <v-expansion-panel-content v-for="(part, ind) in day[1]"
                                     :key="ind">
            <div slot="header">{{partStartFinishTime(part)}}</div>
            <v-list>
              <v-list-tile
                  v-for="(slot, i) in part"
                  :key="i">

                <v-list-tile-content>
                  <v-list-tile-title v-text="`${slot.start} - ${slot.finish}`"></v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn v-if="slot.isEmpty"
                      icon ripple>
                    <v-icon color="primary">add</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-window-item>
    </v-window>

  </v-layout>
</template>

<script>
export default {
  name: "mobile-schedule",
  data() {
    return {
      window: 0,
      eventSchedule: [],
    }
  },
  methods: {
    makeDatesForMonthMobile() {
      const toBinary = 2
      const arrayMaxLength = 8
      const msToMins = 60000

      this.$parent.datum.schedules.forEach( ( schedule ) => {
        const str = schedule.weekdayCode.toString( toBinary )
        schedule.days = new Array( arrayMaxLength - str.length ).join( "0" ) + str
      } )

      this.$parent.datum.schedules.sort( ( a, b ) => {
        const c = new Date( `01/01/2000 ${a.startTime.hour}:${a.startTime.minute}` )
        const d = new Date( `01/01/2000 ${b.startTime.hour}:${b.startTime.minute}` )
        return c.getTime() - d.getTime()
      } )

      let currentDate = new Date()
      const monthShift = 1
      const month = new Date()
      month.setMonth( month.getMonth() + monthShift )

      this.eventSchedule = []
      const dayIncrement = 1
      const slotIndexShift = 1
      const toAdd = 6
      const toMod = 7

      while ( currentDate.getTime() < month.getTime() ) {
        const schedulePartIndex = 1
        let toPush = [ new Date( currentDate ), null, ]

        this.$parent.datum.schedules.forEach( ( schedule ) => {
          const day = ( currentDate.getDay() + toAdd ) % toMod

          if ( schedule.days[ day ] === "1" ) {
            let schedulePart = []
            let sDate = new Date( `01/01/2000 ${schedule.startTime.hour}:${schedule.startTime.minute}` )

            for ( let i = 0; i < schedule.slots; i++ ) {
              let start = new Date( sDate.getTime() + i * msToMins * schedule.duration )
              let finish = new Date( sDate.getTime() + ( i + slotIndexShift ) * msToMins * schedule.duration )

              let isEmpty = true
              let customer = false

              this.$parent.datum.appointments.forEach( ( event ) => {
                if ( isEmpty && event.schedule.id === schedule.id ) {
                  let eDate = new Date( event.date )
                  if ( eDate.getDay() === currentDate.getDay() &&
                    eDate.getMonth() === currentDate.getMonth() &&
                    eDate.getFullYear() === currentDate.getFullYear() ) {
                    if ( event.index === i ) {
                      isEmpty = false
                      if ( !this.$keycloak.decryptedToken.realm_access.roles.includes( "client" ) ) {
                        customer = event.customer
                        customer.eventId = event.id
                      }
                    }
                  }
                }
              } )

              schedulePart.push( {
                start: this.formatTime( start ),
                finish: this.formatTime( finish ),
                isEmpty,
                customer,
                id: schedule.id,
              } )
            }

            if ( toPush[ schedulePartIndex ] === null ) {
              toPush[ schedulePartIndex ] = []
            }
            toPush[ schedulePartIndex ].push( schedulePart )
          }
        } )

        if ( toPush[ schedulePartIndex ] !== null ) {
          this.eventSchedule.push( toPush )
        }

        currentDate.setDate( currentDate.getDate() + dayIncrement )
      }
    },
    next() {
      this.window = Math.min( this.eventSchedule.length - 1, this.window + 1 ) // eslint-disable-line no-magic-numbers
    },
    prev() {
      this.window = Math.max( 0, this.window - 1 ) // eslint-disable-line no-magic-numbers
    },
    partStartFinishTime( part ) {
      const startIndex = 0
      const finishIndex = part.length - 1 // eslint-disable-line no-magic-numbers
      return `${part[ startIndex ].start} - ${part[ finishIndex ].finish}`
    },
  },
  mounted() {
    this.makeDatesForMonthMobile()
    console.log( this.eventSchedule )
    console.log( this.$store.state.drawer )
  },
}
</script>
