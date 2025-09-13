<script>
import { useAuth } from "~/composables/useAuth";

export default {
  computed: {
    isAuth() {
      return useAuth().isAuthenticated.value;
    },
    me() {
      return useAuth().user.value;
    },
  },
};
</script>

<template>
  <div class="min-h-screen bg-blue-600 flex items-center justify-center p-4">
    <!-- Shell -->
    <div
      class="w-full max-w-5xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white"
    >
      <!-- Left: Copy + CTAs -->
      <div class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
        <div class="space-y-3">
          <p class="text-sm font-semibold text-blue-600">Welcome</p>
          <h1 class="text-3xl sm:text-4xl font-bold leading-tight">
            Smart Site Access
          </h1>
          <p class="text-gray-600">
            Secure, modern authentication demo built with Nuxt, Prisma,
            PostgreSQL & Tailwind.
          </p>
        </div>

        <!-- Quick feature bullets -->
        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start gap-3">
            <span class="mt-1">🔐</span>
            <span
              ><strong>Hashed passwords</strong> with bcrypt, verified on
              login.</span
            >
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1">🎫</span>
            <span
              ><strong>JWT auth</strong> stored client-side for this demo.</span
            >
          </li>
          <li class="flex items-start gap-3">
            <span class="mt-1">🧭</span>
            <span
              >Route guard on <code>/welcome</code> with global
              middleware.</span
            >
          </li>
        </ul>

        <!-- CTAs -->
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            v-if="!isAuth"
            to="/login"
            class="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >Sign in</NuxtLink
          >

          <NuxtLink
            v-if="!isAuth"
            to="/register"
            class="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition"
            >Create account</NuxtLink
          >

          <NuxtLink
            v-if="isAuth"
            to="/welcome"
            class="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >Go to dashboard</NuxtLink
          >

          <span v-if="isAuth" class="text-sm text-gray-500 self-center">
            Signed in as <strong>{{ me?.email }}</strong>
          </span>
        </div>
      </div>

      <!-- Right: Visual (same look as login) -->
      <div class="relative hidden lg:block">
        <div
          class="absolute inset-0"
          style="
            background-image: url('/hero.jpg');
            background-size: cover;
            background-position: center;
          "
        ></div>
        <div
          class="absolute inset-0 bg-gradient-to-tr from-blue-700/30 via-blue-500/20 to-transparent mix-blend-multiply"
        ></div>
        <div
          class="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow"
        >
          Nuxt + Tailwind
        </div>
        <div
          class="absolute bottom-4 left-4 right-4 text-white/90 text-sm drop-shadow"
        >
          File-based routing • Protected pages • Prisma + PostgreSQL
        </div>
      </div>
    </div>
  </div>
</template>
