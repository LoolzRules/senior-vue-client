<template>
  <v-dialog lazy v-model="show" max-width="400px">
    <v-card v-if="!loading">
      <v-card-title>
        <span class="headline">Запись на {{editedEvent.formattedDate}}, {{editedEvent.formattedTime}}</span>
      </v-card-title>

      <v-container grid-list-lg>
        <v-layout row wrap v-if="editedEvent">
          <v-flex xs12 sm6>
            <v-text-field v-model="editedEvent.client.name" label="Полное имя"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="editedEvent.client.phone" label="Телефон"></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field v-model="editedEvent.client.email" label="E-mail"></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" flat @click="close">Отмена</v-btn>
        <v-btn color="accent" flat @click="save">Подтвердить</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <v-layout
            justify-center
            align-center>
          <v-progress-circular
              v-if="!loaded"
              indeterminate
              color="primary">
          </v-progress-circular>
          <template v-else>
            <span v-if="response.status === 200" class="text-xs-center white--text">
              Запись успешно создана, ожидается подтверждение.<br>Вы будете уведомены при изменении статуса.
            </span>
            <span v-else class="text-xs-center white--text">
              При создании записи произошла ошибка, пожалуйста попробуйте еще раз.
            </span>
          </template>

        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  format,
} from "date-fns"

export default {
  name: "event-create-dialog",
  data() {
    return {
      show: false,
      loading: false,
      loaded: false,
      dateDialogShow: false,
      defaultEvent: {
        businessId: false,
        clientId: false,
        client: {
          name: "",
          phone: "",
          email: "",
        },
        scheduleId: false,
        serviceId: false,
        employeeId: false,
        formattedDate: false,
        formattedTime: false,
        slotDuration: false,
        slotIndex: false,
      },
      editedEvent: false,
      schedule: false,
      slotIndex: false,
      eventsMap: false,
      date: false,
      response: {
        status: 200,
      },
    }
  },
  methods: {
    open( schedule, slotIndex, eventsMap, date, serviceId ) {
      this.schedule = schedule
      this.slotIndex = slotIndex
      this.eventsMap = eventsMap
      this.date = date

      this.editedEvent = JSON.parse( JSON.stringify( this.defaultEvent ) )
      this.editedEvent.scheduleId = schedule.id
      this.editedEvent.businessId = schedule.businessId
      this.editedEvent.formattedDate = this.formattedDate
      this.editedEvent.formattedTime = this.formattedTime
      this.editedEvent.serviceId = serviceId
      console.log( this.$keycloak )
      this.editedEvent.employeeId = this.$parent.employeeId
      this.editedEvent.client.name = this.$keycloak.authenticated ? this.$keycloak.tokenParsed.name : false
      this.editedEvent.client.email = this.$keycloak.authenticated ? this.$keycloak.tokenParsed.email : false
      this.editedEvent.clientId = this.$keycloak.authenticated ? this.$keycloak.tokenParsed.sub : false
      this.editedEvent.slotIndex = this.slotIndex
      this.editedEvent.slotDuration = this.schedule.slotDuration
      console.log( this )
      this.show = true
    },
    close() {
      this.show = false

      this.schedule = false
      this.slotIndex = false
      this.eventsMap = false
      this.date = false
      this.editedEvent = JSON.parse( JSON.stringify( this.defaultEvent ) )
    },
    save() {
      this.loading = true
      const toReturn = JSON.parse( JSON.stringify( this.editedEvent ) )
      console.log( toReturn )
      this.$axios.post( "/appointment", {
        businessId: this.editedEvent.businessId,
        clientId: this.editedEvent.clientId,
        date: this.editedEvent.formattedDate,
        employeeId: this.editedEvent.employeeId,
        scheduleId: this.editedEvent.scheduleId,
        serviceId: this.editedEvent.serviceId,
        slotDuration: this.editedEvent.slotDuration,
        slotIndex: this.editedEvent.slotIndex,
      } )
        .then( resp => {
          this.response.status = 200
        } )
        .catch( err => {
          console.error( err )
          this.response.status = 0
        } )
        .finally( _ => {
          this.loaded = true
        } )
      // this.close()
      return toReturn
    },
    detectCollision() {
      return null
    },
  },
  computed: {
    formattedDate() {
      return format( this.date, "YYYY-MM-DD" )
    },
    formattedTime() {
      const eventDate = new Date( this.date )
      eventDate.setHours( this.schedule.start.getHours() )
      eventDate.setMinutes( this.schedule.start.getMinutes() + this.schedule.slotDuration * this.slotIndex )
      return format( eventDate, "HH:mm" )
    },
  },
}
</script>
