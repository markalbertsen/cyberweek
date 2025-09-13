<script>

export default {
  data() {
    return {
      email: "",
      password: "",
      agree: true,
      error: "",
      success: false,
    };
  },
  methods: {
    async submit() {
      this.error = "";
      this.success = false;

      // tiny demo validation
      if (!this.email || !this.password) {
        this.error = "Please fill in all fields.";
        return;
      }
      if (!this.agree) {
        this.error = "Please agree to the terms.";
        return;
      }

      console.log("[register] submit", { email: this.email });
      try {
        await $fetch("/api/register", {
          method: "POST",
          body: { email: this.email, password: this.password },
        });
        this.success = true;
        console.log("[register] success");
      } catch (e) {
        console.error("[register] failed", e);
        this.error =
          (e && e.data && e.data.statusMessage) || "Registration failed";
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
          <h1 class="text-3xl font-bold">Create account</h1>
          <p class="text-gray-500">Register to get access to your dashboard.</p>
        </div>

        <div class="mt-8 space-y-5">
          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700"
              >E-mail</label
            >
            <input
              class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="email"
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
            <p class="text-xs text-gray-500">
              Minimum 8 characters recommended.
            </p>
          </div>

          <!-- Agree -->
          <label
            class="inline-flex items-center gap-2 text-sm text-gray-600 select-none"
          >
            <input
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              v-model="agree"
              type="checkbox"
            />
            I agree to the terms of service
          </label>

          <!-- Submit -->
          <button
            class="w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="submit"
          >
            Create account
          </button>

          <!-- Messages -->
          <p
            v-if="success"
            class="rounded-xl border border-green-200 bg-green-50 p-3 text-green-700"
          >
            Account created.
            <NuxtLink to="/login" class="underline">Sign in</NuxtLink>.
          </p>
          <p
            v-if="error"
            class="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700"
          >
            {{ error }}
          </p>

          <!-- Footer -->
          <p class="text-sm text-gray-500">
            Already a member?
            <NuxtLink to="/login" class="text-blue-600 hover:underline"
              >Sign in</NuxtLink
            >
          </p>
        </div>
      </div>

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
          Create Account
        </div>
        <div
          class="absolute bottom-4 left-4 right-4 text-white/90 text-sm drop-shadow"
        >
          Bcrypt hashing • Prisma + PostgreSQL • JWT auth
        </div>
      </div>
    </div>
  </div>
</template>
