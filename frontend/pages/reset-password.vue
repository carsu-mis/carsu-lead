<template>
  <div class="login-wrap">
    <div class="login-card">
      <img src="/img/csu-logo-square1.png" alt="CarSU" class="login-logo" />
      <h2>Reset Password</h2>

      <template v-if="!token">
        <p class="login-sub">This reset link is missing or invalid.</p>
        <p class="switch-link">
          <NuxtLink to="/forgot-password">Request a new link</NuxtLink>
        </p>
      </template>

      <template v-else-if="success">
        <div class="success-msg">
          Your password has been updated. You can now sign in with your new password.
        </div>
        <button class="btn-primary" @click="navigateTo('/')">
          Go to Sign In
        </button>
      </template>

      <template v-else>
        <p class="login-sub">Choose a new password for your account.</p>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <div class="field-group">
          <label>New Password <span class="req">*</span></label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="••••••••"
            @keyup.enter="submit"
          />
        </div>

        <div class="field-group">
          <label>Confirm New Password <span class="req">*</span></label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            @keyup.enter="submit"
          />
        </div>

        <button class="btn-primary" :disabled="loading" @click="submit">
          {{ loading ? "Updating…" : "Reset Password" }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false });

const config = useRuntimeConfig();
const route = useRoute();

const token = route.query.token || "";
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);
const success = ref(false);

async function submit() {
  error.value = "";
  if (!newPassword.value || !confirmPassword.value) {
    error.value = "Please fill in both password fields.";
    return;
  }
  if (newPassword.value.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }
  loading.value = true;
  try {
    const res = await fetch(`${config.public.apiBase}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: newPassword.value,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      error.value = data.message || "This link is invalid or has expired.";
      return;
    }
    success.value = true;
  } catch {
    error.value = "Network error. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #f5f4f0; padding: 24px;
}
.login-card {
  background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px;
  width: 100%; box-shadow: 0 8px 40px rgba(26, 77, 46, 0.12); border: 1px solid #d8d4c8;
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
input[type="password"] {
  width: 100%; padding: 10px 14px; border: 1.5px solid #d8d4c8; border-radius: 8px;
  font-size: 14px; background: #f8f7f4; outline: none; font-family: inherit; box-sizing: border-box;
}
input[type="password"]:focus { border-color: #1a4d2e; background: #fff; }
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