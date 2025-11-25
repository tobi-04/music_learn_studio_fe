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

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:6888",
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "http://localhost:6888",
    },
  },

  // Route rules to prevent hydration mismatch
  routeRules: {
    "/admin/**": { ssr: false },
    "/auth/**": { ssr: false },
    "/student/**": { ssr: false },
  },

  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "dark",
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
