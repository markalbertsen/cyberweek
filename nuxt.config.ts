// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  typescript: {
    shim: false,
  },
  ssr: false,
  pages: true,
  css: ["~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {}, // 👈 Tailwind v4 PostCSS plugin
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
});
