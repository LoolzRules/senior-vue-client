<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-data-iterator
          class="fill-height my-data-iterator"
          :items="employees"
          :rows-per-page-items="$store.state.customItemsPerPage"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row wrap>
        <v-flex
            slot="item"
            slot-scope="props"
            pa-1
            class="xs-12"
            :class="`sm${Math.max( 12/pagination.rowsPerPage, 3 )}`">
          <v-card>
            <v-card-title class="subheading font-weight-bold layout justify-space-between">
              {{ props.item.name }}
              <v-layout justify-end align-center>
                <v-icon v-if="$store.state.parsedPermissions.permsEmployee[2]"
                        @click="updateEmployeeDialog( props.item )"
                        small>
                  edit
                </v-icon>
                <v-icon v-if="$store.state.parsedPermissions.permsEmployee[3]"
                        @click="deleteEmployeeDialog( props.item )"
                        small>
                  delete
                </v-icon>
                <v-icon v-if="$store.state.parsedPermissions.permsSchedule[5]"
                        @click="viewEmployeeSchedules( props.item )"
                        small>
                  schedule
                </v-icon>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense subheader>
              <template v-for="( field, index ) in tableFields">
                <v-list-tile v-if="!Array.isArray( props.item[field.value] )"
                             :key="index">
                  <v-list-tile-content class="grow mr-2">
                    {{field.text}}
                  </v-list-tile-content>
                  <v-list-tile-content class="shrink">
                    <span class="pl-1 font-weight-bold text-truncate valueText">
                      {{props.item[field.value]}}
                    </span>
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-group v-else-if="field.value !== 'serviceId'" :key="index">
                  <v-list-tile slot="activator">{{field.text}}</v-list-tile>
                  <v-list-tile v-for="( perm, i ) in props.item[field.value]"
                               :key="i">
                    <v-list-tile-content class="grow mr-2">
                      {{ $store.state.permissionsNames[field.value][i] }}
                    </v-list-tile-content>
                    <v-list-tile-content class="shrink">
                      <span class="pl-1 font-weight-bold text-truncate valueText">
                        {{ answers[ perm + 0 ] }}
                      </span>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>

                <v-list-group v-else :key="index">
                  <v-list-tile slot="activator">{{field.text}}</v-list-tile>
                  <v-list-tile v-for="( service, i ) in props.item[field.value]"
                               :key="i">
                    <v-list-tile-content>
                      {{ service }}
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
              </template>

            </v-list>
          </v-card>
        </v-flex>
        <v-btn v-if="$store.state.parsedPermissions.permsEmployee[0]"
               slot="actions-append" @click="addEmployeeDialog"
               icon class="ma-0">
          <v-icon>
            add
          </v-icon>
        </v-btn>
      </v-data-iterator>
    </v-flex>

    <v-dialog
        v-if="($store.state.parsedPermissions.permsEmployee[0] && editedIndex === -1) ||
              ($store.state.parsedPermissions.permsEmployee[2] && editedIndex !== -1)"
        v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editedIndex === -1 ? "Создание" : "Редактирование" }} сотрудника</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.name" label="Имя"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.title" label="Должность"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.phone" label="Телефон"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field v-model="editedItem.email" label="E-mail"></v-text-field>
              </v-flex>
              <v-flex v-for="(perms, key) in $store.state.permissionsNames" :key="key">
                <span class="caption">
                  {{
                    tableFields.filter( field => field.value === key )[0].text
                  }}
                </span>
                <v-checkbox v-for="(name, i) in perms" :key="i"
                            v-model="editedItem[key][i]"
                            :label="name"></v-checkbox>
                <v-divider></v-divider>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" flat @click="close">Отмена</v-btn>
          <v-btn color="accent" flat @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import axiosLib from "axios"

export default {
  name: "business-employees",
  data() {
    return {
      dialog: false,
      dialogServices: false,
      tableFields: [
        {
          text: "Должность",
          value: "title",
        },
        {
          text: "Телефон",
          value: "phone",
        },
        {
          text: "E-mail",
          value: "email",
        },
        {
          text: "Категории и сервисы",
          value: "permsCategory",
        },
        {
          text: "Сотрудники",
          value: "permsEmployee",
        },
        {
          text: "Разрешения",
          value: "permsPermission",
        },
        {
          text: "Расписания",
          value: "permsSchedule",
        },
        {
          text: "Записи",
          value: "permsAppointment",
        },
      ],
      pagination: {
        rowsPerPage: 4,
      },
      answers: [ "Нет", "Да", ],
      employees: [],
      defaultItem: {
        name: "",
        title: "",
        phone: "",
        email: "",
        permsCategory: [ false, false, false, false, ],
        permsEmployee: [ false, false, false, false, ],
        permsSchedule: [ false, false, false, false, false, false, false, false, ],
        permsAppointment: [ false, false, false, false, false, false, false, false, ],
        permsPermission: [ false, false, ],
      },
      editedItem: {
        name: "",
        title: "",
        phone: "",
        email: "",
        permsCategory: [ false, false, false, false, ],
        permsEmployee: [ false, false, false, false, ],
        permsSchedule: [ false, false, false, false, false, false, false, false, ],
        permsAppointment: [ false, false, false, false, false, false, false, false, ],
        permsPermission: [ false, false, ],
      },
      editedIndex: -1,
    }
  },
  methods: {
    close() {
      this.editedItem = JSON.parse( JSON.stringify( this.defaultItem ) )
      this.dialog = false
    },
    save() {
      const notFoundIndex = -1
      if ( this.editedIndex === notFoundIndex ) {
        this.createEmployee( this.editedItem )
      } else {
        this.updateEmployee( this.editedItem )
      }
      this.close()
    },
    createEmployee( newEmployee ) {
      this.$axios.post( "/employee", {
        "employeeEmail": newEmployee.email,
        "employeeName": newEmployee.name,
        "employeePhone": newEmployee.phone,
        "employeeTitle": newEmployee.title,
        "permissions": this.unmapPermissions( newEmployee ),
      } )
        .then( response => {
          this.employees.push( JSON.parse( JSON.stringify( newEmployee ) ) )
          console.log( response )
        } )
        .catch( error => {
          console.error( error )
        } )
        .finally( _ => {
          this.getEmployeesWithPermissions()
        } )
    },
    updateEmployee( employee ) {
      axiosLib.all( [
        this.$axios.put( `/employee/${employee.id}`, {
          "employeeName": employee.name,
          "employeePhone": employee.phone,
          "employeeTitle": employee.title,
        } ),
        this.$axios.put( `/permission?userId=${employee.id}`,
          this.unmapPermissions( employee ),
        ),
      ] )
        .then( axiosLib.spread( ( responseEmployee, responsePermissions ) => {
          this.$set( this.employees, this.editedIndex, JSON.parse( JSON.stringify( employee ) ) )
          console.log( responseEmployee, responsePermissions )
        } ) )
        .catch( error => {
          console.error( error )
        } )
        .finally( _ => {
          this.getEmployeesWithPermissions()
        } )
    },
    deleteEmployee( employee ) {
      this.$axios.delete( `/employee/${employee.id}` )
        .then( console.log )
        .catch( console.error )
        .finally( _ => {
          this.getEmployeesWithPermissions()
        } )
    },
    addEmployeeDialog() {
      this.editedIndex = -1
      this.editedItem = JSON.parse( JSON.stringify( this.defaultItem ) )
      this.dialog = true
    },
    updateEmployeeDialog( employee ) {
      this.editedIndex = this.employees.indexOf( employee )
      this.editedItem = JSON.parse( JSON.stringify( employee ) )
      this.dialog = true
    },
    deleteEmployeeDialog( employee ) {
      // const index = this.employees.indexOf( employee )
      // const itemsToDelete = 1
      if ( confirm( "Вы действительно хотите удалить сотрудника?" ) ) {
        // this.employees.splice( index, itemsToDelete )
        this.deleteEmployee( employee )
      }
    },
    getEmployees() {
      return this.$axios.get( "/employee" )
    },
    getEmployeePermissions( id ) {
      return this.$axios.get( "/permission", {
        params: {
          userId: id,
        },
      } )
    },
    viewEmployeeSchedules( employee ) {
      this.$router.push( {
        name: "otherSchedule",
        params: {
          employeeId: employee.id,
          employeeName: employee.name,
          employeeTitle: employee.title,
        },
      } )
    },
    getEmployeesWithPermissions() {
      this.getEmployees()
        .then( ( response ) => {
          response.data.forEach( employee => {
            this.getEmployeePermissions( employee.id )
              .then( resp => {
                const permissions = this.mapPermissions( resp.data )
                for ( let key in permissions ) {
                  this.$set( employee, key, permissions[ key ] )
                }
              } )
              .catch( err => {
                console.log( err )
              } )
          } )
          this.employees = response.data
        } )
        .catch( ( error ) => {
          console.log( error )
        } )
    },
  },
  mounted() {
    this.getEmployeesWithPermissions()
  },
}
</script>

<style lang="stylus">
  .valueText
    line-height 1!important
    max-width 100%
</style>
