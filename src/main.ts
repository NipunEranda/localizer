import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { store, key } from "./store";

import Modal from "./components/modals/Modal.vue";
import ActionModal from "./components/modals/ActionModal.vue";
import Alert from "./components/Alert.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faHome,
  faBars,
  faChartLine,
  faUsers,
  faGear,
  faCircleUser,
  faPowerOff,
  faTrash,
  faNetworkWired,
  faDisplay,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faHome,
  faBars,
  faChartLine,
  faUsers,
  faGear,
  faCircleUser,
  faPowerOff,
  faTrash,
  faNetworkWired,
  faDisplay
);

createApp(App)
  .use(router)
  .use(store, key)
  .component("fai", FontAwesomeIcon)
  .component("modal", Modal)
  .component("action-modal", ActionModal)
  .component("alert", Alert)
  .mount("#app");
