import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./plugins/vuetify"
import VueKeyCloak from "@dsb-norge/vue-keycloak-js"
import permissionMap from "./permissionsMap"

Vue.config.productionTip = false

const mapPermissions = rolesArray => {
  const toReturn = {}
  for ( let key in permissionMap ) {
    Vue.set( toReturn, key, [] )
    permissionMap[key].forEach( permission => {
      toReturn[key].push( rolesArray.includes( permission ) )
    } )
  }
  return toReturn
}

const keycloakInterceptor = keycloak => {
  store.state.parsedToken = keycloak.idTokenParsed
  if ( keycloak.authenticated ) {
    store.state.axios.defaults.headers.common[ "Authorization" ] = `Bearer ${keycloak.idToken}`
    store.state.parsedPermissions = mapPermissions( keycloak.idTokenParsed.realm_access.roles )
  }
}

Vue.use( VueKeyCloak, {
  config: {
    authRealm: "Vqms",
    authUrl: "https://auth.rustamzh.com/auth/",
    authClientId: "vqms",
    logoutRedirectUri: window.location.origin,
  },
  init: {
    onLoad: "check-sso",
  },
  onReady: ( keycloak ) => {
    keycloakInterceptor( keycloak )
    store.state.axios.defaults.params = {}
    store.state.axios.defaults.params["version"] = "1.0"
    new Vue( {
      store,
      router,
      render: createInstance => createInstance( App ),
    } ).$mount( "#app" )
  },
} )

Vue.mixin( {
  methods: {
    mapPermissions,
  },
} )
