<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-data-iterator
          class="fill-height my-data-iterator"
          :items="categories"
          :rows-per-page-items="$store.state.customItemsPerPage"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row wrap>
        <v-flex
            slot="item"
            slot-scope="props"
            pa-1 :class="`xs${Math.max( 12/pagination.rowsPerPage, 3 )}`">
          <v-card>
            <v-card-title class="subheading font-weight-bold layout justify-space-between">
              {{ props.item.name }}
              <v-layout align-content-center justify-end>
                <v-icon v-if="$store.state.parsedPermissions.permsCategory[2]"
                        @click="editCategory( props.item )"
                        small class="my-2 ml-2">
                  edit
                </v-icon>
                <v-icon v-if="$store.state.parsedPermissions.permsCategory[3]"
                        @click="deleteCategory( props.item )"
                        small class="my-2">
                  delete
                </v-icon>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile v-for="child in props.item.children"
                           :key="child.id">
                <v-list-tile-content>{{child.name}}</v-list-tile-content>
                <v-list-tile-content class="align-end font-weight-bold">
                  {{child.cost}}₸
                </v-list-tile-content>
                <v-icon v-if="$store.state.parsedPermissions.permsCategory[2]"
                        @click="editService( props.item, child )"
                        small class="my-2 ml-2">
                  edit
                </v-icon>
                <v-icon v-if="$store.state.parsedPermissions.permsCategory[3]"
                        @click="deleteService( props.item, child )"
                        small class="my-2">
                  delete
                </v-icon>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-btn v-if="$store.state.parsedPermissions.permsCategory[0]"
               slot="actions-append" @click="addNewCategory"
               icon class="ma-0">
          <v-icon>add</v-icon>
        </v-btn>
      </v-data-iterator>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  mapState,
} from "vuex"

export default {
  name: "business-categories",
  data() {
    return {
      categories: [],
      pagination: {
        rowsPerPage: 2,
      },
      newCategoryName: null,
      newCategoryDialog: false,
    }
  },
  methods: {
    editCategory( category ) {
      console.log( category )
    },
    deleteCategory( category ) {
      console.log( category )
    },
    editService( category, service ) {
      console.log( category, service )
    },
    deleteService( category, service ) {
      console.log( category, service )
    },
    addNewCategory() {
      console.log()
    },
    getCategories() {
      return this.axios.get( "/category", {
        params: {
          businessId: this.$store.state.parsedToken.business_id,
        },
      } )
    },
    getServices( categoryId ) {
      return this.axios.get( "/service", {
        params: {
          categoryId,
        },
      } )
    },
  },
  mounted() {
    this.getCategories()
      .then( response => {
        response.data.forEach( category => {
          category.children = []
          this.getServices( category.id )
            .then( resp => {
              category.children = resp.data
            } )
            .catch( err => {
              console.error( err )
            } )
        } )
        this.categories = response.data
      } )
      .catch( error => {
        console.error( error )
      } )
  },
  computed: {
    ...mapState( [
      "axios",
    ] ),
  },
}
</script>

<style lang="stylus">
  .my-data-iterator
    width 100%
    display flex
    flex-direction column
</style>
