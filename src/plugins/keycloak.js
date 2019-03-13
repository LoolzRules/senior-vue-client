import Keycloak from "keycloak-js"

export default {
  install: ( Vue, options ) => {
    const keycloak = Keycloak( options )

    const watch = new Vue( {
      data() {
        return {
          init: keycloak.init,
          ready: false,
          authenticated: false,
          tokenParsed: null,
          token: null,
          refreshToken: null,
          logout: () => {
          },
          login: null,
          register: null,
          createLoginUrl: null,
          createLogoutUrl: null,
        }
      },
    } )

    keycloak.onReady = function( authenticated ) {
      updateWatchVariables( authenticated )
      watch.ready = true
    }
    keycloak.onAuthSuccess = () => {
      // Check token validity every 10 seconds (10 000 ms) and, if necessary, update the token.
      // Refresh token if it's valid for less then 60 seconds
      const minute = 60
      const tenSeconds = 10000
      const updateTokenInterval = setInterval( _ => keycloak.updateToken( minute )
        .success( refreshed => {
          if ( refreshed ) {
            window.localStorage.setItem( "keycloakToken", keycloak.token )
            window.localStorage.setItem( "keycloakRefreshToken", keycloak.refreshToken )
          }
        } )
        .error( _ => {
          window.localStorage.removeItem( "keycloakToken" )
          window.localStorage.removeItem( "keycloakRefreshToken" )
          keycloak.clearToken()
        } ), tenSeconds )

      watch.logout = _ => {
        clearInterval( updateTokenInterval )
        window.localStorage.removeItem( "keycloakToken" )
        window.localStorage.removeItem( "keycloakRefreshToken" )
        keycloak.logout( {
          "redirectUri": window.location.origin,
        } )
      }
    }
    keycloak.onAuthRefreshSuccess = () => {
      updateWatchVariables( true )
    }
    keycloak.onAuthRefreshError = () => {
      console.error( "Error while trying to refresh the token" )
    }
    keycloak.onAuthError = ( errorData ) => {
      console.error( "Error during authentication: " + JSON.stringify( errorData ) )
    }

    const updateWatchVariables = ( isAuthenticated = false ) => {
      watch.authenticated = isAuthenticated
      watch.login = keycloak.login
      watch.register = keycloak.register
      watch.createLoginUrl = keycloak.createLoginUrl
      watch.createLogoutUrl = keycloak.createLogoutUrl
      if ( isAuthenticated ) {
        watch.token = keycloak.token
        watch.tokenParsed = keycloak.tokenParsed
        watch.refreshToken = keycloak.refreshToken
      }
    }

    Vue.prototype.$keycloak = watch
  },
}
