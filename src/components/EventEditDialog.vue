<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование записи</span>
      </v-card-title>

      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            {{event.isConfirmed ? "Подтвержден" : "Не подтвержден"}}
          </v-flex>
          <v-flex xs12 sm6>
            Информация о клиенте: {{event.clientId}}
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="accent" flat @click="close">Отмена</v-btn>
        <v-btn color="accent" flat @click="save">Сохранить</v-btn>
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
      editedItem: {},
    }
  },
  methods: {
    open( event ) {
      this.event = event
      this.editedItem = JSON.parse( JSON.stringify( this.event ) )
      this.show = true
    },
    close() {
      this.editedItem = JSON.parse( JSON.stringify( this.event ) )
      this.show = false
    },
    save() {
      this.event = JSON.parse( JSON.stringify( this.editedItem ) )
      this.close()
    },
  },
}
</script>
