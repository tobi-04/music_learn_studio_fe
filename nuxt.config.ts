// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "dark",
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },

  components: [
    {
      path: "~/components/atoms",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/molecules",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/organisms",
      pathPrefix: false,
      global: true,
    },
    {
      path: "~/components/templates",
      pathPrefix: false,
      global: true,
    },
  ],
});
