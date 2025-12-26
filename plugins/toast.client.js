import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    position: "top-center",
    timeout: 1500,
    hideProgressBar: true,
    closeButton: false,
    pauseOnHover: false,
    draggable: false,
  });
});
