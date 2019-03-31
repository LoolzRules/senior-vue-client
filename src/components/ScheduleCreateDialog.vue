<template>
  <v-dialog lazy persistent v-model="show" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Создание расписания</span>
      </v-card-title>

      <v-container grid-list-lg>
        <v-layout row wrap v-if="newSchedule">
          {{
          /* {
          * "id": "5c76a7e2ec8d21000140065a",
          * "employeeId": "51622a1c-7704-4ba4-a0f0-328b3e44d289",
          * "businessId": "5c728ffc31ba3f000134ef64",
          * "weekdayCode": 80,
          * "startTime": "09:00",
          * "slotDuration": 40,
          * "slots": 5,
          * "startDate": "2019-02-27",
          * "endDate": "2019-04-27",
          * "weekDays": [ false, true, false, true, false, false, false ],
          * "start": null,
          * "duration": 200
          * } */
          }}
          <v-flex xs12 sm6>
            <v-text-field v-model="newSchedule.startDate" label="Дата начала"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="newSchedule.endDate" label="Дата конца"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="newSchedule.startTime" label="Время начала"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="newSchedule.slotDuration" label="Длительность слота"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="newSchedule.slots" label="Количество слотов"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-checkbox v-for="(day, i) in daysOfTheWeek" :key="i"
                        v-model="newSchedule.weekDays[i]"
                        :label="day"></v-checkbox>
          </v-flex>
          <v-divider></v-divider>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" flat @click="close">Отмена</v-btn>
        <v-btn color="accent" flat @click="save">Подтвердить</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  name: "schedule-create-dialog",
  data() {
    return {
      show: false,
      defaultSchedule: {
        slotDuration: 15,
        slots: 32,
        startTime: "09:00",
        weekDays: [ true, true, true, true, true, false, false, ],
        endDate: "2029-03-28",
        startDate: "2019-03-28",
      },
      newSchedule: null,
      daysOfTheWeek: [
        "пн", "вт", "ср", "чт", "пт", "сб", "вс",
      ],
    }
  },
  methods: {
    open() {
      this.newSchedule = JSON.parse( JSON.stringify( this.defaultSchedule ) )
      this.show = true
    },
    close() {
      this.newSchedule = null
      this.show = false
    },
    save() {
      this.addSchedule( this.newSchedule )
        .then( response => {
          console.log( response )
        } )
        .catch( error => {
          console.error( error )
        } )
        .finally( _ => {
          this.close()
        } )
    },
    addSchedule( schedule ) {
      const businessId = this.$keycloak.tokenParsed.business_id
      const employeeId = this.$parent.employeeId || this.$keycloak.tokenParsed.sub
      const toSend = {
        businessId,
        employeeId,
        slotDuration: schedule.slotDuration,
        slots: schedule.slots,
        startTime: schedule.startTime,
        weekdayCode: this.weekDaysToCode( schedule ),
        endDate: schedule.endDate, // "2019-03-28"
        startDate: schedule.startDate,
      }
      return this.$axios.post( "/schedule", toSend )
    },
    weekDaysToCode( schedule ) {
      /* eslint-disable no-magic-numbers */
      return schedule.weekDays.reduce( ( accumulator, current, index ) => {
        return accumulator + ( Math.pow( 2, 6 - index ) * ( +current ) )
      }, 0 )
      /* eslint-enable no-magic-numbers */
    },
  },
}
</script>
