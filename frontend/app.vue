<template>
  <div v-if="!authReady" class="auth-loading" />
  <div v-else>
    <header class="header">
      <div class="header-inner">
        <img src="/img/csu-logo-square1.png" class="logo" alt="CarSU" />
        <div class="header-label">
          <span class="header-label-bot">Caraga State University - Main Campus</span>
          <span class="header-label-top">Human Resource Management Services</span>
        </div>
        <button v-if="isLoggedIn" class="logout-btn" @click="logout">
  Logout
</button>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const { isLoggedIn, logout, authReady, ensureAuthChecked } = useAuth();

onMounted(() => {
  ensureAuthChecked();
});
</script>

<style>
.auth-loading {
  min-height: 100vh;
  background: #f9f7f2;
}

.header {
  background: #003300;
  border-bottom: 4px solid #ffcc00;
  padding: 14px 32px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 20px;
}
.logo {
  height: 46px;
  width: auto;
}
.header-label {
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-left: 2px solid rgba(255, 204, 0, 0.35);
  padding-left: 18px;
  flex: 1;
}
.header-label-top {
  font-size: 11px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}
.header-label-bot {
  font-size: 15px;
  font-weight: 700;
  color: #ffcc00;
  letter-spacing: 0.02em;
}
.logout-btn {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}
.logout-btn:hover {
  background: #ffcc00;
  color: #003300;
}
</style>