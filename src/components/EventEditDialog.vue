<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title class="d-layout justify-space-between">
        <span class="subheading">Редактирование записи</span>
        <v-btn icon @click="close" class="ma-0">
          <v-icon>
            close
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>
            Статус:
          </v-list-tile-content>
          <v-list-tile-content class="align-end font-weight-bold">
            {{event.isConfirmed ? "Подтвержден" : "Не подтвержден"}}
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            Имя:
          </v-list-tile-content>
          <v-list-tile-content class="align-end font-weight-bold">
            {{event.clientName}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" flat @click="cancelEvent">Отменить</v-btn>
        <v-btn v-if="!event.isConfirmed"
               color="accent" flat @click="confirmEvent">Подтвердить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "event-edit-dialog",
  data() {
    return {
      show: false,
      event: {},
    }
  },
  methods: {
    open( event ) {
      this.event = event
      this.show = true
    },
    close() {
      this.show = false
    },
    cancelEvent() {
      this.$axios.put( `/appointment/${this.event.id}/employee`, {
        isConfirmed: false,
        status: -1,
      }, {
        headers: {
          "Content-type": "application/json",
        },
      } )
        .then( resp => {
          this.event.isConfirmed = resp.data.isConfirmed
          this.event.status = resp.data.status
        } )
        .finally( _ => {
          this.close()
        } )
    },
    confirmEvent() {
      this.$axios.put( `/appointment/${this.event.id}/employee`, {
        isConfirmed: true,
        status: 1,
      }, {
        headers: {
          "Content-type": "application/json",
        },
      } )
        .then( resp => {
          this.event.isConfirmed = resp.data.isConfirmed
          this.event.status = resp.data.status
        } )
        .finally( _ => {
          this.close()
        } )
    },
  },
}
</script>
