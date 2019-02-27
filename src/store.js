import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

Vue.use( Vuex )

const store = new Vuex.Store( {
  /* eslint-disable no-magic-numbers */
  state: {
    drawer: false,
    locale: "ru-ru",
    customItemsPerPage: [ 2, 3, 4, 6, 12, { "text": "$vuetify.dataIterator.rowsPerPageAll", "value": -1, }, ],
    defaultWindowName: "VMS",
    windowName: "VMS",
    userData: null,
    appointments: null,
    employees: null,
    categories: null,
    searchResults: [],
    parsedToken: null,
    parsedPermissions: null,
    axios: axios.create( {
      baseURL: "https://api.rustamzh.com",
      timeout: 10000,
    } ),
  },
  /* eslint-enable no-magic-numbers */
  mutations: {
    SET_WINDOW_NAME: ( state, newValue ) => {
      state.windowName = newValue
    },
  },
  actions: {
    setMessage: ( { commit, state, }, newValue ) => {
      if ( !newValue ) {
        commit( "SET_WINDOW_NAME", state.defaultWindowName )
      } else {
        commit( "SET_WINDOW_NAME", newValue )
      }
    },
  },
  getters: {},
} )

export default store
