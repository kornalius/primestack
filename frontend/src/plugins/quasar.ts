import { Quasar, Dialog } from 'quasar'
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import iconSet from 'quasar/icon-set/mdi-v7'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/src/css/index.sass'

const Options = {
  plugins: { // import Quasar plugins and add here
    Dialog,
  },
  iconSet,
  config: {
    // brand: {
    //   // primary: '#e46262',
    //   // ... or all other brand colors
    // },
    // notify: {...}, // default set of options for Notify Quasar plugin
    // loading: {...}, // default set of options for Loading Quasar plugin
    // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  },
}

export {
  Quasar,
  Options,
}
