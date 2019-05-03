import Vue from "vue"
import Router from "vue-router"
import Main from "../views/Main"
import BusinessDashboard from "../views/BusinessDashboard"
import BusinessSchedule from "../views/BusinessSchedule"
import BusinessEmployees from "../views/BusinessEmployees"
import BusinessCategories from "../views/BusinessCategories"
import ClientAppointments from "../views/ClientAppointments"

Vue.use( Router )

const router = new Router( {
  mode: "history",
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: BusinessDashboard,
    },
    {
      path: "/schedule",
      name: "mySchedule",
      component: BusinessSchedule,
      props: true,
    },
    {
      path: "/schedule/:employeeId",
      name: "otherSchedule",
      component: BusinessSchedule,
      props: true,
    },
    {
      path: "/business_employees",
      name: "employees",
      component: BusinessEmployees,
    },
    {
      path: "/business_categories",
      name: "categories",
      component: BusinessCategories,
    },
    {
      path: "/appointments",
      name: "appointments",
      component: ClientAppointments,
    },
  ],
} )

router.beforeEach( ( to, from, next ) => {
  // if ( !router.app.$keycloak.authenticated ) {
  //   if ( to.path !== "/" ) {
  //     next( "/" )
  //   } else {
  //     next()
  //   }
  // }
  if ( !router.app.$keycloak.authenticated &&
    ( to.path !== "/" && !to.path.match( "/schedule" ) ) ) {
    next( "/" )
  } else {
    if ( router.app.$store ) {
      let name = "VMS"
      switch ( to.name ) {
        case "employees":
          name = "Сотрудники"
          break
        case "categories":
          name = "Услуги"
          break
        case "mySchedule":
        case "otherSchedule":
          name = "Расписание"
          break
        case "appointments":
          name = "Записи"
          break
        case "main":
        default:
          break
      }
      router.app.$store.dispatch( "setWindowName", name )
    }
    next()
  }
} )

export default router
