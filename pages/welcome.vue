<script>
import { useAuth } from "~/composables/useAuth";
import { decodeJwt } from "jose";

export default {
  data() {
    return {
      me: null,
      tokenInfo: null,
      recentUsers: [],
      error: "",
      prompt: "",
      aiReply: "",
      loadingAI: false,
      messages: [
        { role: "system", content: "Du er en hjelpsom assistent for appen." },
      ],
    };
  },

  async mounted() {
    const { user, token, logout } = useAuth();
    this.me = user.value;

    console.log("[welcome] mounted, user:", this.me);

    if (token.value) {
      try {
        const payload = decodeJwt(token.value);
        const now = Date.now() / 1000;
        const secondsLeft = payload.exp
          ? Math.max(0, Math.floor(payload.exp - now))
          : null;
        this.tokenInfo = {
          exp: payload.exp
            ? new Date(payload.exp * 1000).toLocaleString()
            : "n/a",
          secondsLeft,
        };
        console.log("[welcome] token exp:", this.tokenInfo);
      } catch (e) {
        console.warn("[welcome] failed to decode token", e);
      }
    }

    try {
      const headers = token.value
        ? { Authorization: `Bearer ${token.value}` }
        : {};
      const res = await $fetch("/api/users", { headers });
      this.recentUsers = res.users || [];
      console.log("[welcome] recent users:", this.recentUsers);
    } catch (e) {
      console.error("[welcome] failed to load recent users", e);
      this.error =
        (e && e.data && e.data.statusMessage) || "Failed to load data";
      if (e && e.status === 401) {
        const { logout } = useAuth();
        logout();
        return navigateTo("/login");
      }
    }
  },

  methods: {
    logoutNow() {
      const { logout } = useAuth();
      logout();
      navigateTo("/login");
    },

    clearChat() {
      this.messages = [
        { role: "system", content: "Du er en hjelpsom assistent for appen." },
      ];
      this.aiReply = "";
      this.error = "";
    },

    async askAI() {
      if (!this.prompt || this.loadingAI) return;
      this.loadingAI = true;
      this.error = "";

      // Guard i tilfelle noe har nullstilt state
      if (!Array.isArray(this.messages)) {
        this.messages = [
          { role: "system", content: "Du er en hjelpsom assistent for appen." },
        ];
      }

      // 1) legg til brukerens melding
      this.messages.push({ role: "user", content: this.prompt });

      try {
        const res = await fetch("/api/ai/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: this.messages }),
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        this.aiReply = "";
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });

          // parse SSE-linjer
          let nl;
          while ((nl = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.startsWith("data: ")) {
              const raw = line.slice(6); // bevar alle mellomrom
              const ctrl = raw.trim(); // bruk trim KUN for kontrollmeldinger

              if (ctrl === "[DONE]") {
                this.messages.push({
                  role: "assistant",
                  content: this.aiReply,
                });
                this.prompt = "";
                this.aiReply = "";
                return;
              }

              this.aiReply += raw; // append råtekst med mellomrom
            }
          }
        }
      } catch (e) {
        console.error("SSE error:", e);
        this.error = e?.message || "Klarte ikke å lese strøm";
        // valgfritt: rull tilbake brukerens siste melding hvis feil
        // this.messages.pop();
      } finally {
        this.loadingAI = false;
      }
    },
  },
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6 overflow-x-hidden">
    <h1 class="text-3xl font-bold">Welcome 🎉</h1>

    <div v-if="me" class="rounded-xl border p-4 bg-white/80 space-y-1">
      <p>
        You are logged in as <strong>{{ me.email }}</strong>
      </p>
      <p v-if="tokenInfo">
        Token expires: <strong>{{ tokenInfo.exp }}</strong>
        <span
          v-if="tokenInfo.secondsLeft !== null"
          class="text-sm text-gray-500"
        >
          (in ~{{ tokenInfo.secondsLeft }}s)
        </span>
      </p>
    </div>

    <div
      v-if="error"
      class="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200"
    >
      {{ error }}
    </div>

    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Recent users (last 5)</h2>
      <ul class="divide-y rounded-xl border bg-white/80">
        <li
          v-for="u in recentUsers"
          :key="u.id"
          class="p-3 flex items-center justify-between"
        >
          <span>{{ u.email }}</span>
          <time class="text-sm text-gray-500">{{
            new Date(u.createdAt).toLocaleString()
          }}</time>
        </li>
      </ul>
      <p v-if="!recentUsers.length" class="text-gray-500">No users yet.</p>
    </section>

    <!-- AI test -->
    <section class="space-y-3 rounded-xl border p-4 bg-white/80">
      <h2 class="text-xl font-semibold">AI test</h2>

      <!-- chat-liste -->
      <ul class="space-y-2">
        <li
          v-for="(m, i) in messages"
          :key="i"
          :class="m.role === 'user' ? 'text-right' : 'text-left'"
        >
          <div
            class="inline-block rounded-2xl px-3 py-2 whitespace-pre-wrap break-words max-w-full"
            :class="
              m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100'
            "
          >
            {{ m.content }}
          </div>
        </li>

        <!-- pågående stream -->
        <li v-if="aiReply" class="text-left">
          <div
            class="inline-block rounded-2xl px-3 py-2 whitespace-pre-wrap break-words bg-gray-100 max-w-full"
          >
            {{ aiReply }}
          </div>
        </li>
      </ul>

      <!-- input -->
      <div class="flex gap-2">
        <textarea
          v-model="prompt"
          rows="2"
          @keydown.enter.exact.prevent="askAI"
          class="flex-1 border rounded p-2"
          placeholder="Skriv en melding…"
        ></textarea>

        <button
          class="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-50"
          :disabled="loadingAI || !prompt"
          @click="askAI"
        >
          {{ loadingAI ? "Tenker…" : "Send" }}
        </button>

        <button class="px-3 py-2 rounded border" @click="clearChat">Tøm</button>
      </div>
    </section>
  </div>
</template>
