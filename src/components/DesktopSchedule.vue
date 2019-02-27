<template>
  <v-layout column v-if="this.eventSchedule.length > 0">
    <v-data-table disable-initial-sort
                  hide-actions
                  :pagination.sync="pagination"
                  :headers="headers"
                  :items="restructuredEventSchedule"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.time }}</td>
        <td v-for="(key, index) in weekKeys" :key="index">
          {{
            !props.item[key] ? "Недоступно" : (props.item[key].isEmpty ? "Записаться" : "Занято")
          }}
        </td>
        <td>
          <v-icon small class="mr-2" @click="editItem(props.item)">
            edit
          </v-icon>
          <v-icon small @click="deleteItem(props.item)">
            delete
          </v-icon>
        </td>
      </template>
      <template slot="footer">
        <td :colspan="headers.length">
          <v-btn icon class="accent" @click="prev">
            <v-icon>chevron_left</v-icon>
          </v-btn>
          <v-btn icon class="accent" @click="next">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>

export default {
  name: "desktop-schedule",
  data() {
    return {
      eventSchedule: [],
      currentWeek: 0,
      weekKeys: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", ],
      pagination: {
        page: 0,
        rowsPerPage: -1, // -1 for All
      },
      headers: [
        {
          text: "Время",
          align: "left",
          sortable: false,
          value: "name",
        },
        {
          text: "ПН",
          sortable: false,
          value: "name",
        },
        {
          text: "ВТ",
          sortable: false,
          value: "name",
        },
        {
          text: "СР",
          sortable: false,
          value: "name",
        },
        {
          text: "ЧТ",
          sortable: false,
          value: "name",
        },
        {
          text: "ПТ",
          sortable: false,
          value: "name",
        },
        {
          text: "СБ",
          sortable: false,
          value: "name",
        },
        {
          text: "ВС",
          sortable: false,
          value: "name",
        },
        {
          text: "Действия",
          sortable: false,
          value: "name",
        },
      ],
    }
  },
  methods: {
    makeDatesForMonthDesktop() {
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

      const monthShift = 1
      const month = new Date()
      month.setMonth( month.getMonth() + monthShift )

      this.eventSchedule = []
      const dayIncrement = 1
      const slotIndexShift = 1
      const toAdd = 6
      const toMod = 7

      this.$parent.datum.schedules.forEach( ( schedule ) => {
        let schedulePart = []
        let sDate = new Date( `01/01/2000 ${schedule.startTime.hour}:${schedule.startTime.minute}` )

        for ( let i = 0; i < schedule.slots; i++ ) {
          const start = new Date( sDate.getTime() + i * msToMins * schedule.duration )
          const finish = new Date( sDate.getTime() + ( i + slotIndexShift ) * msToMins * schedule.duration )

          let currentDate = new Date()

          let days = []
          while ( currentDate.getTime() < month.getTime() ) {
            if ( schedule.days[ ( currentDate.getDay() + toAdd ) % toMod ] === "1" ) {
              let eventToPush = {
                isEmpty: true,
                customer: false,
              }
              this.$parent.datum.appointments.forEach( ( event ) => {
                if ( event.schedule.id === schedule.id ) {
                  let eDate = new Date( event.date )
                  if ( eDate.getDay() === currentDate.getDay() &&
                    eDate.getMonth() === currentDate.getMonth() &&
                    eDate.getFullYear() === currentDate.getFullYear() ) {
                    if ( event.index === i ) {
                      eventToPush.isEmpty = false
                      if ( this.$keycloak.decryptedToken.realm_access.roles.includes( "employee" ) ||
                        this.$keycloak.decryptedToken.realm_access.roles.includes( "owner" ) ) {
                        eventToPush.customer = event.customer
                        eventToPush.customer.eventId = event.id
                      }
                    }
                  }
                }
              } )
              days.push( [ new Date( currentDate ), eventToPush, ] )
            } else {
              days.push( [ new Date( currentDate ), null, ] )
            }

            currentDate.setDate( currentDate.getDate() + dayIncrement )
          }

          schedulePart.push( {
            id: schedule.id,
            start: this.formatTime( start ),
            finish: this.formatTime( finish ),
            days,
          } )
        }
        this.eventSchedule.push( schedulePart )
      } )
    },
    prev() {
      const minIndex = 0
      this.currentWeek = Math.max( this.currentWeek - 1, minIndex ) // eslint-disable-line no-magic-numbers
    },
    next() {
      const maxIndex = 4
      this.currentWeek = Math.min( this.currentWeek + 1, maxIndex ) // eslint-disable-line no-magic-numbers
    },
  },
  computed: {
    restructuredEventSchedule() {
      const daysInWeek = 7
      const finalSchedule = []
      const dateIndex = 0
      const eventIndex = 1
      const sIndex = this.currentWeek * daysInWeek
      const indexShift = 1

      this.eventSchedule.forEach( part => {
        part.forEach( timeSlot => {
          let toPush = {}
          toPush.time = `${timeSlot.start} - ${timeSlot.finish}`

          for ( let i = 0; i < daysInWeek; i++ ) {
            const day = timeSlot.days[ i + sIndex ]
            if ( !day ) {
              this.headers[i + indexShift].text = "" // eslint-disable-line vue/no-side-effects-in-computed-properties
              toPush[ this.weekKeys[i] ] = null
            } else {
              this.headers[i + indexShift].text = this.formatDateNoYear( day[ dateIndex ] ) // eslint-disable-line vue/no-side-effects-in-computed-properties
              toPush[ this.weekKeys[i] ] = day[ eventIndex ]
            }
          }
          finalSchedule.push( toPush )
        } )
      } )
      console.log( finalSchedule )
      return finalSchedule
    },
  },
  mounted() {
    this.makeDatesForMonthDesktop()
    const reducer = ( acc, curVal ) => acc + curVal.length
    const initVal = 0
    this.pagination.rowsPerPage = this.eventSchedule.reduce( reducer, initVal )
    console.log( this.eventSchedule )
  },
}
</script>
