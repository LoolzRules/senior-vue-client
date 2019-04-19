import Vue from "vue"
import App from "./App.vue"
import permissionMap from "./permissionsMap"
import router from "./plugins/router"
import store from "./plugins/store"
import keycloak from "./plugins/keycloak"
import axios from "./plugins/axios"
import axiosLib from "axios"
import {
  cacheAdapterEnhancer,
} from "axios-extensions"
import "./plugins/vuetify"

Vue.config.productionTip = false

const mapPermissions = rolesArray => {
  const toReturn = {}
  for ( let key in permissionMap ) {
    Vue.set( toReturn, key, [] )
    permissionMap[ key ].forEach( permission => {
      toReturn[ key ].push( rolesArray.includes( permission ) )
    } )
  }
  return toReturn
}

const unmapPermissions = permsObject => {
  const toReturn = []
  for ( let key in permissionMap ) {
    permsObject[key].forEach( ( bool, ind ) => {
      if ( bool ) {
        toReturn.push( permissionMap[key][ind] )
      }
    } )
  }
  return toReturn
}

// const keycloakInterceptor = keycloak => {
//   store.state.parsedToken = keycloak.idTokenParsed
//   if ( keycloak.authenticated ) {
//     store.state.axios.defaults.headers.common[ "Authorization" ] = `Bearer ${keycloak.idToken}`
//     store.state.parsedPermissions = mapPermissions( keycloak.idTokenParsed.realm_access.roles )
//   }
// }

// Vue.use( VueKeyCloak, {
//   onReady: ( keycloak ) => {
//     console.log( "here" )
//     keycloakInterceptor( keycloak )
//     store.state.axios.defaults.params = {}
//     store.state.axios.defaults.params[ "version" ] = "1.0"
//   },
//   onTokenExpired: () => {
//     console.log( "kek" )
//   },
// } )

Vue.use( axios, {
  baseURL: "https://api.rustamzh.com",
  timeout: 10000,
  adapter: cacheAdapterEnhancer( axiosLib.defaults.adapter, {
    enabledByDefault: false,
  } ),
} )

Vue.use( keycloak, {
  url: "https://auth.rustamzh.com/auth/",
  realm: "Vqms",
  clientId: "vqms",
}, )

new Vue( {
  store,
  router,
  render: createInstance => createInstance( App ),
  beforeCreate() {
    this.$axios.defaults.params = {}
    this.$axios.defaults.params[ "version" ] = "1.0"

    const keycloakInit = {
      onLoad: "check-sso",
      checkLoginIframe: false,
    }
    const token = window.localStorage.getItem( "keycloakToken" )
    const refreshToken = window.localStorage.getItem( "keycloakRefreshToken" )
    if ( token && refreshToken ) {
      keycloakInit.token = token
      keycloakInit.refreshToken = refreshToken
    }

    this.$axios.interceptors.request.use( config => {
      if ( !( config.data && config.data.mainSearch ) ) {
        if ( this.$keycloak.token ) {
          config.headers.Authorization = `Bearer ${this.$keycloak.token}`
        }
      } else {
        config.data = null
        config.headers["accept"] = "application/vnd.dto.1.0+json"
      }
      return config
    } )

    this.$axios.interceptors.response.use(
      response => response,
      error => {
        alert( `${error.response.status}: ${error.response.data.message}` )
        throw error
      }
    )

    this.$keycloak.init( keycloakInit ).success( () => {
      if ( this.$keycloak.tokenParsed ) {
        this.$store.state.parsedPermissions = mapPermissions( this.$keycloak.tokenParsed.realm_access.roles )
      }
    } )
  },
} ).$mount( "#app" )

Vue.mixin( {
  methods: {
    mapPermissions,
    unmapPermissions,
  },
} )
