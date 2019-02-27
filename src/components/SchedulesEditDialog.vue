<template>
  <v-dialog lazy persistent v-model="show" max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline"></span>
      </v-card-title>

      <v-container grid-list-lg>
        <v-layout row wrap v-if="true">

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
      show: false,
    }
  },
  methods: {
    open( schedules ) {
      console.log( schedules )
      this.show = true
    },
    close() {
      this.show = false
    },
    save() {
      this.close()
    },
  },
}
</script>
