<template>
  <v-layout column wrap>
    <v-flex xs12>
      <v-data-iterator
          class="fill-height my-data-iterator"
          :items="employees"
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
              <v-layout justify-end align-center>
                <!--<v-btn v-if="$store.state.parsedPermissions.permsEmployee[2]"-->
                       <!--@click="updateEmployee( props.item.id )"-->
                       <!--icon small class="ma-0">-->
                  <!--<v-icon small>-->
                    <!--edit-->
                  <!--</v-icon>-->
                <!--</v-btn>-->
                <v-btn v-if="$store.state.parsedPermissions.permsEmployee[3]"
                       @click="deleteEmployee( props.item.id )"
                       icon small class="ma-0">
                  <v-icon small>
                    delete
                  </v-icon>
                </v-btn>
                <v-btn v-if="$store.state.parsedPermissions.permsSchedule[5]"
                       @click="viewEmployee( props.item.id )"
                       icon small class="ma-0">
                  <v-icon small>
                    schedule
                  </v-icon>
                </v-btn>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense subheader>
              <template v-for="( field, index ) in tableFields">
                <v-list-tile v-if="!Array.isArray( props.item[field.value] )"
                             :key="index">
                  <v-list-tile-content>
                    {{field.text}}
                  </v-list-tile-content>
                  <v-list-tile-content class="align-end font-weight-bold">
                    {{props.item[field.value]}}
                  </v-list-tile-content>
                </v-list-tile>

                <v-list-group v-else-if="field.value !== 'serviceId'" :key="index">
                  <v-list-tile slot="activator">{{field.text}}</v-list-tile>
                  <v-list-tile v-for="( perm, i ) in props.item[field.value]"
                               :key="i">
                    <v-list-tile-content>
                      {{ labels[ (i + (props.item[field.value].length === 2)) % 4 ] }}
                      {{ props.item[field.value].length === 4 ? "" : ownerships[ 0 + (props.item[field.value].length ===
                      2) + (i > 3) ] }}
                    </v-list-tile-content>
                    <v-list-tile-content class="align-end font-weight-bold">
                      {{ answers[ perm + 0 ] }}
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>

                <v-list-group v-else :key="index">
                  <v-list-tile slot="activator">{{field.text}}</v-list-tile>
                  <v-list-tile v-for="( service, i ) in props.item[field.value]"
                               :key="i">
                    <v-list-tile-content>
                      {{ service.name }}
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list-group>
              </template>

            </v-list>
          </v-card>
        </v-flex>
        <v-btn v-if="$store.state.parsedPermissions.permsEmployee[0]"
               slot="actions-append" @click="editItem(defaultItem)"
               icon class="ma-0">
          <v-icon>
            add
          </v-icon>
        </v-btn>
      </v-data-iterator>
    </v-flex>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Создание сотрудника</span>
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
              <v-flex xs12 sm6>
                <v-checkbox v-model="editedItem.permsCatsC" label="Создание категорий"></v-checkbox>
                <v-checkbox v-model="editedItem.permsCatsR" label="Получение категорий"></v-checkbox>
                <v-checkbox v-model="editedItem.permsCatsU" label="Обновление категорий"></v-checkbox>
                <v-checkbox v-model="editedItem.permsCatsD" label="Удаление категорий"></v-checkbox>
              </v-flex>
              <v-flex xs12 sm6>
                <v-checkbox v-model="editedItem.permsEmpsC" label="Создание сотрудников"></v-checkbox>
                <v-checkbox v-model="editedItem.permsEmpsR" label="Получение сотрудников"></v-checkbox>
                <v-checkbox v-model="editedItem.permsEmpsU" label="Обновление сотрудников"></v-checkbox>
                <v-checkbox v-model="editedItem.permsEmpsD" label="Удаление сотрудников"></v-checkbox>
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
import {
  mapState,
} from "vuex"

export default {
  name: "business-employees",
  data() {
    return {
      dialog: false,
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
          text: "Сервисы",
          value: "services",
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
      labels: [ "Может создавать", "Может видеть", "Может обновлять", "Может удалять", ],
      ownerships: [ "свои", "чужие", ],
      answers: [ "Нет", "Да", ],
      employees: [
        // {
        //   name: "Майкл Шэнкс",
        //   title: "Старший менеджер",
        //   phone: "87777777777",
        //   email: "email@email.com",
        //   serviceId: [
        //     {
        //       name: "a",
        //       id: "ss1",
        //     },
        //     {
        //       name: "b",
        //       id: "ss2",
        //     },
        //   ],
        //   permsCategory: [ false, false, false, false, ],
        //   permsEmployee: [ false, false, false, false, ],
        //   permsSchedule: [ false, false, false, false, false, false, false, false, ],
        //   permsAppointment: [ false, false, false, false, false, false, false, false, ],
        //   permsPermission: [ false, false, ],
        // },
        // {
        //   name: "Кристиан Бэйл",
        //   title: "Менеджер",
        //   phone: "87777777777",
        //   email: "email@email.com",
        //   permsCategory: [ false, false, false, false, ],
        //   permsEmployee: [ false, false, false, false, ],
        //   permsSchedule: [ false, false, false, false, false, false, false, false, ],
        //   permsAppointment: [ false, false, false, false, false, false, false, false, ],
        //   permsPermission: [ false, false, ],
        // },
        // {
        //   name: "Уилл Смит",
        //   title: "Уборщик",
        //   phone: "87777777777",
        //   email: "email@email.com",
        //   permsCategory: [ false, false, false, false, ],
        //   permsEmployee: [ false, false, false, false, ],
        //   permsSchedule: [ false, false, false, false, false, false, false, false, ],
        //   permsAppointment: [ false, false, false, false, false, false, false, false, ],
        //   permsPermission: [ false, false, ],
        // },
        // {
        //   name: "Майкл Шэнкс",
        //   title: "Старший менеджер",
        //   phone: "87777777777",
        //   email: "email@email.com",
        //   permsCategory: [ false, false, false, false, ],
        //   permsEmployee: [ false, false, false, false, ],
        //   permsSchedule: [ false, false, false, false, false, false, false, false, ],
        //   permsAppointment: [ false, false, false, false, false, false, false, false, ],
        //   permsPermission: [ false, false, ],
        // },
        // {
        //   name: "Майкл Шэнкс",
        //   title: "Старший менеджер",
        //   phone: "87777777777",
        //   email: "email@email.com",
        //   permsCategory: [ false, false, false, false, ],
        //   permsEmployee: [ false, false, false, false, ],
        //   permsSchedule: [ false, false, false, false, false, false, false, false, ],
        //   permsAppointment: [ false, false, false, false, false, false, false, false, ],
        //   permsPermission: [ false, false, ],
        // },
      ],
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
        this.employees.push( JSON.parse( JSON.stringify( this.editedItem ) ) )
      } else {
        this.$set( this.employees, this.editedIndex, JSON.parse( JSON.stringify( this.editedItem ) ) )
      }
      this.close()
    },
    editItem( item ) {
      this.editedIndex = this.employees.indexOf( item )
      this.editedItem = JSON.parse( JSON.stringify( item ) )
      this.dialog = true
    },
    deleteItem( item ) {
      const index = this.employees.indexOf( item )
      const itemsToDelete = 1
      confirm( "Вы действительно хотите удалить сотрудника?" ) && this.employees.splice( index, itemsToDelete )
    },
    getEmployees() {
      return this.axios.get( "/employee" )
    },
    getEmployeePermissions( id ) {
      return this.axios.get( "/permission", {
        params: {
          userId: id,
        },
      } )
    },
  },
  mounted() {
    this.getEmployees()
      .then( ( response ) => {
        response.data.forEach( employee => {
          this.getEmployeePermissions( employee.id )
            .then( response => {
              const permissions = this.mapPermissions( response.data )
              for ( let key in permissions ) {
                this.$set( employee, key, permissions[ key ] )
              }
            } )
            .catch( error => {
              console.log( error )
            } )
        } )
        this.employees = response.data
      } )
      .catch( ( error ) => {
        console.log( error )
      } )
  },
  computed: {
    ...mapState( [
      "axios",
    ] ),
  },
}
</script>
