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
            class="xs-12"
            :class="`sm${Math.max( 12/pagination.rowsPerPage, 3 )}`">
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
                <v-list-tile-content class="shrink mr-2">
                  <v-btn @click="setEmployeeList( child.id )"
                         icon small class="ma-0">
                    <v-icon>
                      people
                    </v-icon>
                  </v-btn>
                </v-list-tile-content>
                <v-list-tile-content class="grow mr-2">
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
                      {{ child.cost }}₸
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

                <v-layout v-if="$store.state.parsedPermissions.permsCategory[3]"
                          align-content-center justify-end class="shrink pl-2">
                  <v-btn @click="deleteService( props.item, child )"
                         icon small class="ma-0 my-2">
                    <v-icon small>
                      delete
                    </v-icon>
                  </v-btn>

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
          <v-btn color="accent" flat @click="dialogNewCategory.show = false">Отмена</v-btn>
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
          <v-btn color="accent" flat @click="dialogNewService.show = false">Отмена</v-btn>
          <v-btn color="accent" flat @click="addNewService">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-layout
              justify-center
              align-center>
            <v-progress-circular
                v-if="!dialogNewService.loaded"
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

    <v-dialog v-model="dialogEmployees.show" max-width="500px">
      <v-card>
        <v-card-text v-if="dialogEmployees.loaded">
          <v-list dense subheader>
            <v-list-tile v-for="( field, index ) in dialogEmployees.employees" :key="index">
              <v-list-tile-content class="grow mr-2">
                {{field.name}}
              </v-list-tile-content>
              <v-list-tile-content class="shrink">
                <v-icon v-if="field.hasService"
                        @click="deleteServiceFromEmployee( field.id )">
                  delete
                </v-icon>
                <v-icon v-else
                        @click="addServiceToEmployee( field.id )">
                  add
                </v-icon>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-text v-else>
          <v-layout
              justify-center
              align-center>
            <v-progress-circular
                indeterminate
                color="primary">
            </v-progress-circular>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import axiosLib from "axios"

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
      dialogEmployees: {
        serviceId: null,
        employees: null,
        show: false,
        loaded: false,
      },
    }
  },
  methods: {
    resetFields( obj ) {
      const timeout = 200
      setTimeout( _ => {
        obj.show = false
        obj.loading = false
        obj.loaded = false
        obj.statusIs200 = false
      }, timeout )
    },
    showNewServiceDialog( categoryId ) {
      this.newService.categoryId = categoryId
      this.dialogNewService.show = true
    },
    addNewService() {
      this.dialogNewService.loading = true
      this.createService( this.newService )
        .then( response => {
          this.dialogNewService.statusIs200 = ( response.statusIs200 === 200 ) // eslint-disable-line no-magic-numbers
        } )
        .catch( error => {
          console.error( error )
          this.dialogNewService.statusIs200 = false
        } )
        .finally( () => {
          this.dialogNewService.loaded = true
          this.resetFields( this.dialogNewService )
          this.getCategoriesAndServices()
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
          this.getCategoriesAndServices()
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
        .finally( _ => {
          this.getCategoriesAndServices()
        } )
    },
    deleteCategory( category ) {
      this.$axios.delete( `/category/${category.id}` )
        .then( response => {
          console.log( response )
        } )
        .finally( _ => {
          this.getCategoriesAndServices()
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
        .catch( error => {
          console.error( error )
        } )
        .finally( _ => {
          this.getCategoriesAndServices()
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
        .finally( _ => {
          this.getCategoriesAndServices()
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
    getCategoriesAndServices() {
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
    setEmployeeList( serviceId ) {
      this.dialogEmployees.serviceId = serviceId
      this.dialogEmployees.show = true

      axiosLib.all( [
        this.$axios.get( "/employee" ),
        this.$axios.get( `/service/${serviceId}` ),
      ] ).then( axiosLib.spread( ( responseEmployee, responseService ) => {
        this.dialogEmployees.employees = responseEmployee.data.map( employee => {
          employee.hasService = responseService.data.includes( employee.id )
          return employee
        } )
        this.dialogEmployees.loaded = true
      } ) )
    },
    deleteServiceFromEmployee( eId ) {
      this.$axios.delete( `/service/${this.dialogEmployees.serviceId}?employeeId=${eId}` )
        .finally( _ => {
          this.setEmployeeList( this.dialogEmployees.serviceId )
        } )
    },
    addServiceToEmployee( eId ) {
      this.$axios.post( `/service/${this.dialogEmployees.serviceId}?employeeId=${eId}` )
        .finally( _ => {
          this.setEmployeeList( this.dialogEmployees.serviceId )
        } )
    },
  },
  mounted() {
    this.getCategoriesAndServices()
  },
}
</script>

<style lang="stylus">
  .my-data-iterator
    width 100%
    display flex
    flex-direction column
</style>
