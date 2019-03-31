<template>
  <v-dialog lazy persistent v-model="show" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование расписаний</span>
      </v-card-title>

      <v-container grid-list-lg>
        <v-layout row v-if="true">
          <v-layout row xs12 wrap
                    v-for="schedule in schedules"
                    :key="schedule.id">
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
              <v-text-field v-model="schedule.startDate" label="Дата начала"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="schedule.endDate" label="Дата конца"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="schedule.startTime" label="Время начала"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="schedule.slotDuration" label="Длительность слота"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field v-model="schedule.slots" label="Количество слотов"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-checkbox v-for="(day, i) in daysOfTheWeek" :key="i"
                          v-model="schedule.weekDays[i]"
                          :label="day"></v-checkbox>
            </v-flex>
            <v-divider></v-divider>
          </v-layout>
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
  name: "schedules-edit-dialog",
  data() {
    return {
      schedules: [],
      show: false,
      daysOfTheWeek: [
        "пн", "вт", "ср", "чт", "пт", "сб", "вс",
      ],
    }
  },
  methods: {
    open( schedules ) {
      console.log( schedules )
      this.schedules = schedules
      this.show = true
    },
    close() {
      this.show = false
    },
    save() {
      this.close()
    },
  },
  mounted() {
    console.log( this.$parent, this.$keycloak )
  },
}
</script>
