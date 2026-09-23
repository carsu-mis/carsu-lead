export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  css: [
    "~/assets/styles/global.css",
  ],

  head: {
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: "/img/csu-logo-square1.png",
      },
    ],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
  },
});