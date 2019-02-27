<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-data-iterator
          class="fill-height my-data-iterator"
          :items="items"
          :rows-per-page-items="$store.state.customItemsPerPage"
          content-tag="v-layout"
          row wrap>
        <v-flex
            slot="item"
            slot-scope="props"
            pa-1 xs12 sm6 md4 lg3>
          <v-card>
            <v-card-title class="subheading font-weight-bold layout justify-space-between">
              {{ props.item.name }}
              <v-icon small>
                edit
              </v-icon>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile v-for="child in props.item.children"
                           :key="child.id">
                <v-list-tile-content>{{child.name}}</v-list-tile-content>
                <v-list-tile-content class="align-end font-weight-bold">
                  {{child.price}}₸
                </v-list-tile-content>
                <v-icon small class="my-2 ml-2">
                  edit
                </v-icon>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-btn slot="actions-append" @click="addNew"
               icon class="ma-0">
          <v-icon>add</v-icon>
        </v-btn>
      </v-data-iterator>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: "business-categories",
  data() {
    return {
      items: [
        {
          id: "c1",
          name: "Категория 1",
          children: [
            { id: "s11", price: 2000, name: "Услуга 1", },
            { id: "s12", price: 1000, name: "Услуга 2", },
            { id: "s13", price: 1500, name: "Услуга 3", },
          ],
        },
        {
          id: "c2",
          name: "Категория 2",
          children: [
            { id: "s4", price: 200, name: "Услуга 4", },
            { id: "s5", price: 150, name: "Услуга 5", },
            { id: "s6", price: 300, name: "Услуга 6", },
          ],
        },
        {
          id: "c3",
          name: "Категория 3",
          children: [
            { id: "s7", price: 200, name: "Услуга 7", },
            { id: "s8", price: 150, name: "Услуга 8", },
            { id: "s9", price: 300, name: "Услуга 9", },
          ],
        },
        {
          id: "c4",
          name: "Категория 4",
          children: [
            { id: "s10", price: 200, name: "Услуга 10", },
            { id: "s11", price: 150, name: "Услуга 11", },
            { id: "s12", price: 300, name: "Услуга 12", },
          ],
        },
      ],
    }
  },
  methods: {
    edit( item ) {
      console.log( item )
    },
    addNew() {
      console.log()
    },
  },
}
</script>

<style lang="stylus">
  .my-data-iterator
    width 100%
    display flex
    flex-direction column
</style>
