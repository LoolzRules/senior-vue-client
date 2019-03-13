<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
              <template v-if="$store.state.parsedPermissions.permsCategory[2]">
                <v-edit-dialog
                    :return-value.sync="props.item.name"
                    lazy
                    @save="updateCategory(props.item)">
                  {{ props.item.name }}
                  <template v-slot:input>
                    <v-text-field
                        v-model="props.item.name"
                        label="Название"
                        single-line
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
              </template>
              <template v-else>
                {{ props.item.name }}
              </template>

              <v-layout align-content-center justify-end>
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
                <v-list-tile-content>
                  <template v-if="$store.state.parsedPermissions.permsCategory[2]">
                    <v-edit-dialog
                        :return-value.sync="child.name"
                        lazy
                        @save="updateService(props.item, child)">
                      {{ child.name }}
                      <template v-slot:input>
                        <v-text-field
                            v-model="child.name"
                            label="Название"
                            single-line>
                        </v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-else>
                    {{ child.name }}
                  </template>
                </v-list-tile-content>
                <v-list-tile-content class="align-end font-weight-bold">
                  <template v-if="$store.state.parsedPermissions.permsCategory[2]">
                    <v-edit-dialog
                        :return-value.sync="child.cost"
                        lazy
                        @save="updateService(props.item, child)">
                      {{ child.cost }}
                      <template v-slot:input>
                        <v-text-field
                            v-model="child.cost"
                            label="Цена"
                            single-line
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-else>
                    {{ child.cost }}₸
                  </template>
                </v-list-tile-content>

                <v-layout align-content-center justify-end>
                  <v-icon v-if="$store.state.parsedPermissions.permsCategory[3]"
                          @click="deleteService( props.item, child )"
                          small class="my-2">
                    delete
                  </v-icon>
                </v-layout>
              </v-list-tile>
              <v-list-tile v-if="$store.state.parsedPermissions.permsCategory[0]">
                <v-btn @click="showNewServiceDialog( props.item.id )"
                       icon class="ma-0">
                  <v-icon>add</v-icon>
                </v-btn>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
        <v-btn v-if="$store.state.parsedPermissions.permsCategory[0]"
               slot="actions-append" @click="dialogNewCategory.show = true"
               icon class="ma-0">
          <v-icon>add</v-icon>
        </v-btn>
      </v-data-iterator>
    </v-flex>

    <v-dialog v-model="dialogNewCategory.show" max-width="500px">
      <v-card v-if="!dialogNewCategory.loading">
        <v-card-title>
          <span class="headline">Добавление категории</span>
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="newCategoryName" label="Название"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" flat @click="dialogNewCategory = false">Отмена</v-btn>
          <v-btn color="accent" flat @click="addNewCategory">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-layout
              justify-center
              align-center>
            <v-progress-circular v-if="!dialogNewCategory.loaded"
                                 indeterminate
                                 color="primary">
            </v-progress-circular>
            <template v-else>
              <span v-if="dialogNewCategory.statusIs200" class="text-xs-center white--text">
                Категория успешно создана
              </span>
              <span v-else class="text-xs-center white--text">
                При создании категории произошла ошибка, пожалуйста попробуйте еще раз.
              </span>
            </template>

          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewService.show" max-width="500px">
      <v-card v-if="!dialogNewService.loading">
        <v-card-title>
          <span class="headline">Добавление категории</span>
        </v-card-title>

        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field v-model="newService.name" label="Название"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="newService.duration" label="Длительность"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="newService.cost" label="Цена"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" flat @click="dialogNewService = false">Отмена</v-btn>
          <v-btn color="accent" flat @click="addNewService">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-layout
              justify-center
              align-center>
            <v-progress-circular v-if="!dialogNewService.loaded"
                                 indeterminate
                                 color="primary">
            </v-progress-circular>
            <template v-else>
              <span v-if="dialogNewService.statusIs200" class="text-xs-center white--text">
                Услуга успешно создана
              </span>
              <span v-else class="text-xs-center white--text">
                При создании услуги произошла ошибка, пожалуйста попробуйте еще раз.
              </span>
            </template>

          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>

export default {
  name: "business-categories",
  data() {
    return {
      categories: [],
      pagination: {
        rowsPerPage: 2,
      },
      newCategoryName: null,
      newService: {
        name: null,
        cost: null,
        duration: null,
        categoryId: null,
      },
      dialogNewCategory: {
        show: false,
        loading: false,
        loaded: false,
        statusIs200: false,
      },
      dialogNewService: {
        show: false,
        loading: false,
        loaded: false,
        statusIs200: false,
      },
    }
  },
  methods: {
    resetFields( obj ) {
      const twoSeconds = 2000
      setTimeout( _ => {
        obj.show = false
        obj.loading = false
        obj.loaded = false
        obj.statusIs200 = false
      }, twoSeconds )
    },
    showNewServiceDialog( categoryId ) {
      this.newService.categoryId = categoryId
      this.dialogNewService.show = true
    },
    addNewService() {
      this.dialogNewService.loading = true
      this.createService( this.newService )
        .then( response => {
          this.dialogNewService.statusIs200 = ( response.statusIs200 === 201 ) // eslint-disable-line no-magic-numbers
        } )
        .catch( error => {
          console.error( error )
          this.dialogNewService.statusIs200 = false
        } )
        .finally( () => {
          this.dialogNewService.loaded = true
          this.resetFields( this.dialogNewService )
        } )
    },
    addNewCategory() {
      this.dialogNewCategory.loading = true
      this.createCategory( this.newCategoryName )
        .then( response => {
          this.dialogNewCategory.statusIs200 = ( response.statusIs200 === 201 ) // eslint-disable-line no-magic-numbers
        } )
        .catch( error => {
          console.error( error )
          this.dialogNewCategory.statusIs200 = false
        } )
        .finally( () => {
          this.dialogNewCategory.loaded = true
          this.resetFields( this.dialogNewCategory )
        } )
    },
    createCategory( name ) {
      return this.$axios.post( "/category", {
        name,
      } )
    },
    updateCategory( category ) {
      this.$axios.put( `/category/${category.id}`, category.name )
        .then( response => {
          console.log( response )
        } )
    },
    deleteCategory( category ) {
      this.$axios.delete( `/category/${category.id}` )
        .then( response => {
          console.log( response )
        } )
    },
    createService( service ) {
      return this.$axios.post( "/service", service )
    },
    updateService( category, service ) {
      this.$axios.put( `/service/${service.id}`, {
        categoryId: category.id,
        cost: service.cost,
        duration: service.duration,
        name: service.name,
      } )
        .then( response => {
          console.log( response )
        } )
    },
    deleteService( category, service ) {
      this.$axios.delete( "/service", {
        params: {
          serviceId: service.id,
        },
      } )
        .then( response => {
          console.log( response )
        } )
    },
    getCategories() {
      return this.$axios.get( "/category", {
        params: {
          businessId: this.$keycloak.tokenParsed.business_id,
        },
      } )
    },
    getServices( categoryId ) {
      return this.$axios.get( "/service", {
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
}
</script>

<style lang="stylus">
  .my-data-iterator
    width 100%
    display flex
    flex-direction column
</style>
