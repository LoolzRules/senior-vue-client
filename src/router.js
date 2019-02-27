import Vue from "vue"
import Router from "vue-router"
import Main from "./views/Main"
import BusinessSchedule from "./views/BusinessSchedule"
import BusinessEmployees from "./views/BusinessEmployees"
import BusinessCategories from "./views/BusinessCategories"

Vue.use( Router )

const router = new Router( {
  mode: "history",
  routes: [
    {
      path: "/",
      component: Main,
    },
    {
      path: "/schedule",
      component: BusinessSchedule,
      props: true,
    },
    {
      path: "/schedule/:employeeId",
      component: BusinessSchedule,
      props: true,
    },
    {
      path: "/business_employees",
      component: BusinessEmployees,
    },
    {
      path: "/business_categories",
      component: BusinessCategories,
    },
  ],
} )

// router.beforeEach( ( to, from, next ) => {
//   if ( !router.app.$keycloak.authenticated ) {
//     if ( to.path !== "/" ) {
//       next( "/" )
//     } else {
//       next()
//     }
//   } else {
//     if ( from.name === null && to.path === "/" ) {
//       next( "/home" )
//     } else {
//       next()
//     }
//   }
// } )

export default router
