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
        <div v-if="isLoggedIn" class="account-menu" ref="accountMenuRef">
          <button class="account-btn" @click="accountMenuOpen = !accountMenuOpen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </button>
          <div v-if="accountMenuOpen" class="account-dropdown">
            <div class="account-dropdown-info">
              <div class="account-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
              <div class="account-details">
                <span class="account-name">{{ userDisplayName }}</span>
                <span class="account-role">{{ user?.email }}</span>
              </div>
            </div>
            <button class="account-signout" @click="logout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign-Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";

const { isLoggedIn, logout, authReady, ensureAuthChecked, user } = useAuth();
const { pageHeaderOverride } = usePageHeader();

const accountMenuOpen = ref(false);
const accountMenuRef = ref(null);

const userDisplayName = computed(() => {
  const u = user.value;
  if (!u) return "";
  const name = [u.firstName, u.middleInitial, u.lastName]
    .filter(Boolean)
    .join(" ");
  return name || u.email || "";
});

function handleClickOutside(e) {
  if (accountMenuRef.value && !accountMenuRef.value.contains(e.target)) {
    accountMenuOpen.value = false;
  }
}

onMounted(() => {
  ensureAuthChecked();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
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
.account-menu {
  position: relative;
  flex-shrink: 0;
}
.account-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.account-btn:hover {
  background: #ffcc00;
  color: #003300;
}
.account-btn svg {
  width: 20px;
  height: 20px;
}
.account-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 100;
}
.account-dropdown-info {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
}
.account-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #003300;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.account-avatar svg {
  width: 26px;
  height: 26px;
}
.account-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.account-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.account-role {
  font-size: 13px;
  color: #6b6b6b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.account-signout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 16px 20px;
  background: transparent;
  border: none;
  border-top: 1px solid #ececec;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 700;
  color: #1a1a1a;
  cursor: pointer;
  text-align: left;
}
.account-signout:hover {
  background: #f7f7f7;
}
.account-signout svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>