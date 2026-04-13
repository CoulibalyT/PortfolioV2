import "./assets/main.css";

import { createApp } from "vue";
import { createHead } from "@unhead/vue/client";

import App from "./App.vue";
import router from "./router";
import i18n from "../config/i18n";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

const app = createApp(App);
const head = createHead();

app.use(head);
app.use(router);
app.use(i18n());

app.mount("#app");
