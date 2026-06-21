import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'

// 深色監控風主題
export default createVuetify({
  theme: {
    defaultTheme: 'nvrDark',
    themes: {
      nvrDark: {
        dark: true,
        colors: {
          background: '#0f1115',
          surface: '#181b21',
          primary: '#22b8cf',
          secondary: '#5c6370',
          error: '#ff5252',
          success: '#4caf50',
        },
      },
    },
  },
  defaults: {
    VCard: { rounded: 'lg' },
    VBtn: { rounded: 'md' },
  },
})
