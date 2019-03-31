import Vue from "vue"
import Vuetify from "vuetify"
import ru from "vuetify/lib/locale/ru"
import colors from "vuetify/es5/util/colors"

import "material-design-icons-iconfont/dist/material-design-icons.css"
import "vuetify/src/stylus/app.styl"
import "typeface-roboto/index.css"

Vue.use( Vuetify, {
  lang: {
    locales: {
      ru,
    },
    current: "ru",
  },
  iconfont: "md",
  options: {
    customProperties: true,
  },
  theme: {
    primary: colors.blue,
    secondary: colors.blue.darken4,
    accent: colors.orange.darken4,
    error: colors.red,
    warning: colors.orange,
    info: colors.teal,
    success: colors.green,
  },
} )
