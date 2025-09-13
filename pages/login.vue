<script>
import { useAuth } from "~/composables/useAuth";

export default {
  data() {
    return {
      email: "",
      password: "",
      remember: true,
      error: "",
    };
  },
  methods: {
    async submit() {
      this.error = "";
      const { login } = useAuth();
      console.log("[login] submit", { email: this.email });
      try {
        await login(this.email, this.password);
        console.log("[login] success → /welcome");
        navigateTo("/welcome");
      } catch (e) {
        console.error("[login] failed", e);
        this.error = (e && e.data && e.data.statusMessage) || "Login failed";
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen bg-blue-600 flex items-center justify-center p-4">
    <!-- Container -->
    <div
      class="w-full max-w-5xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-white"
    >
      <!-- Left: Form -->
      <div class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold">Sign in</h1>
          <p class="text-gray-500">
            Welcome back. Please enter your details to continue.
          </p>
        </div>

        <div class="mt-8 space-y-5">
          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700"
              >E-mail</label
            >
            <input
              v-model="email"
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <input
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between">
            <label
              class="inline-flex items-center gap-2 text-sm text-gray-600 select-none"
            >
              <input
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                v-model="remember"
                type="checkbox"
              />
              Remember me
            </label>
            <NuxtLink
              to="/register"
              class="text-sm text-blue-600 hover:underline"
              >Create account</NuxtLink
            >
          </div>

          <!-- Submit -->
          <button
            class="w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="submit"
          >
            Sign in
          </button>

          <!-- Error -->
          <p
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
          >
            {{ error }}
          </p>

          <!-- Footer link -->
          <p class="text-sm text-gray-500">
            Not a member?
            <NuxtLink to="/register" class="text-blue-600 hover:underline"
              >Register</NuxtLink
            >
          </p>
        </div>
      </div>

      <!-- Right: Visual -->
      <div class="relative hidden lg:block">
        <div
          class="absolute inset-0"
          style="
            background-image: url('/hero.jpg');
            background-size: cover;
            background-position: center;
          "
        ></div>
        <!-- Blue overlay lines for that “tech” feel -->
        <div
          class="absolute inset-0 bg-gradient-to-tr from-blue-700/30 via-blue-500/20 to-transparent mix-blend-multiply"
        ></div>
        <!-- Corner badge -->
        <div
          class="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow"
        >
          Smart Site
        </div>
        <!-- Bottom caption -->
        <div
          class="absolute bottom-4 left-4 right-4 text-white/90 text-sm drop-shadow"
        >
          Secure access • Modern UI • Nuxt + Tailwind
        </div>
      </div>
    </div>
  </div>
</template>
