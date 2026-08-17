<template>
  <div v-if="!authReady" class="auth-loading" />
  <div v-else>
    <header class="header">
      <div class="header-inner">
        <template v-if="pageHeaderOverride">
          <NuxtLink :to="pageHeaderOverride.backTo" class="header-back-link">
            <span class="back-icon-badge">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </span>
            
          </NuxtLink>
          <div class="header-label">
            <span class="header-label-bot">{{ pageHeaderOverride.title }}</span>
          </div>
        </template>
        <template v-else>
          <img src="/img/csu-logo-square1.png" class="logo" alt="CarSU" />
          <div class="header-label">
            <span class="header-label-bot">Caraga State University - Main Campus</span>
            <span class="header-label-top">Human Resource Management Services</span>
          </div>
        </template>
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
const { pageHeaderOverride } = usePageHeader();

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
  color: #ffffff;
  letter-spacing: 0.02em;
}
.header-back-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}
.header-back-link:hover {
  opacity: 0.85;
}
.header-back-link .back-icon-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.header-back-link svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #003300;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
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