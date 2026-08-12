export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/styles/global.css"],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/img/csu-logo-square1.png" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3001/api",
    },
  },
});