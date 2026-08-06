<template>
  <div class="login-wrap">
    <div class="login-card">
      <img src="/img/csu-logo-square1.png" alt="CarSU" class="login-logo" />
      <h2>Forgot Password</h2>
      <p class="login-sub">
        Enter your CarSU email and we'll send you a link to reset your password.
      </p>

      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="sent" class="success-msg">
        If that email is registered, a reset link has been sent. Please check your inbox.
      </div>

      <template v-if="!sent">
        <div class="field-group">
          <label>CarSU Email <span class="req">*</span></label>
          <div class="email-wrap">
            <input
              v-model="emailPrefix"
              type="text"
              placeholder="yourname"
              @keyup.enter="submit"
            />
            <span class="suffix">@carsu.edu.ph</span>
          </div>
        </div>

        <button class="btn-primary" :disabled="loading" @click="submit">
          {{ loading ? "Sending…" : "Send Reset Link" }}
        </button>
      </template>

      <p class="switch-link">
       <NuxtLink to="/">Back to Home</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const config = useRuntimeConfig();

const emailPrefix = ref("");
const error = ref("");
const loading = ref(false);
const sent = ref(false);

async function submit() {
  error.value = "";
  if (!emailPrefix.value.trim()) {
    error.value = "Please enter your email.";
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailPrefix.value.trim() + "@carsu.edu.ph",
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      error.value = data.message || "Something went wrong. Please try again.";
      return;
    }
    sent.value = true;
  } catch {
    error.value = "Network error. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f4f0;
  padding: 24px;
}
.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(26, 77, 46, 0.12);
  border: 1px solid #d8d4c8;
  text-align: center;
}
.login-logo { width: 64px; margin-bottom: 16px; }
h2 { font-size: 22px; color: #1a4d2e; margin-bottom: 6px; }
.login-sub { font-size: 13px; color: #5a6070; margin-bottom: 28px; }
.error-msg {
  background: #fdf0f0; border: 1px solid #e0a0a0; border-radius: 8px;
  padding: 10px 14px; color: #c0392b; font-size: 13px; margin-bottom: 16px;
}
.success-msg {
  background: #f0f7f2; border: 1px solid #a8d0b4; border-radius: 8px;
  padding: 12px 14px; color: #1a4d2e; font-size: 13px; margin-bottom: 16px; text-align: left;
}
.field-group { text-align: left; margin-bottom: 16px; }
.field-group label {
  display: block; font-size: 11px; font-weight: 700; color: #2d6a3f;
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;
}
.req { color: #c0392b; }
.email-wrap { display: flex; border: 1.5px solid #d8d4c8; border-radius: 8px; overflow: hidden; }
.email-wrap input {
  flex: 1; border: none; padding: 10px 12px; font-size: 14px; outline: none;
  background: #f8f7f4; font-family: inherit;
}
.email-wrap input:focus { background: #fff; }
.suffix {
  padding: 10px 12px; background: #e8ede8; color: #5a6070; font-size: 13px;
  border-left: 1px solid #d8d4c8; white-space: nowrap; display: flex; align-items: center;
}
.btn-primary {
  width: 100%; padding: 13px; background: #1a4d2e; color: #fff; border: none;
  border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer;
  margin-top: 4px; font-family: inherit; transition: background 0.2s;
}
.btn-primary:hover { background: #2d6a3f; }
.btn-primary:disabled { background: #aaa; cursor: not-allowed; }
.switch-link { font-size: 13px; color: #5a6070; margin-top: 20px; }
.switch-link a { color: #1a4d2e; font-weight: 600; text-decoration: none; }
.switch-link a:hover { text-decoration: underline; }
</style>