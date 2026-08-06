<template>
  <div class="page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb o1"></div>
        <div class="hero-orb o2"></div>
        <div class="hero-orb o3"></div>
        <div class="hero-dots"></div>
      </div>
      <div class="hero-inner">
        <div class="hero-eyebrow">
          <span class="dot"></span>
          <span>Official HRMS Portal — Caraga State University</span>
          <span class="dot"></span>
        </div>
        <h1 class="hero-title">
          <span class="hero-title-lead">LeaD</span>
          <span class="hero-title-sub">Forms Portal</span>
        </h1>
        <p class="hero-desc">
          Submit and manage official Learning &amp; Development forms —
          Individual Development Plans and Workforce Needs Assessments — for
          Caraga State University personnel.
        </p>

        <!-- Clickable Pills -->
        <div class="hero-pills">
          <button
            class="pill pill-gold"
            :class="{ active: activeSection === 'idp' }"
            @click="toggleSection('idp')"
          >
            <span class="pill-icon">
              <svg viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="1"
                  width="10"
                  height="13"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M5 5h6M5 7.5h6M5 10h3.5"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            IDP
          </button>
          <button
            class="pill pill-teal"
            :class="{ active: activeSection === 'edit-idp' }"
            @click="toggleSection('edit-idp')"
          >
            <span class="pill-icon">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 3H4a1.5 1.5 0 00-1.5 1.5v8A1.5 1.5 0 004 14h8a1.5 1.5 0 001.5-1.5V8"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M12.5 2.5l1 1L9 8H8V7l4.5-4.5z"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            Edit IDP
          </button>
          <button
            class="pill pill-gold"
            :class="{ active: activeSection === 'supervisor' }"
            @click="toggleSection('supervisor')"
          >
            <span class="pill-icon">
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M2 14s-.5-5 6-5 6 5 6 5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M11 7l1.5 1.5L15 6"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            Supervisor Review
          </button>
          <button
  class="pill pill-orange"
  :class="{ active: activeSection === 'lna' }"
  @click="toggleSection('lna')"
>
            <span class="pill-icon">
              <svg viewBox="0 0 16 16" fill="none">
                <rect
                  x="1.5"
                  y="4"
                  width="13"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path d="M1.5 7h13" stroke="currentColor" stroke-width="1.2" />
                <path
                  d="M5 7v6M9.5 7v6"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-dasharray="1.5 1.5"
                />
              </svg>
            </span>
            LNA / USWAG
          </button>
          <button
            class="pill pill-green"
            :class="{ active: activeSection === 'dashboard' }"
            @click="toggleSection('dashboard')"
          >
            <span class="pill-icon">
              <svg viewBox="0 0 16 16" fill="none">
                <rect
                  x="1.5"
                  y="8"
                  width="4"
                  height="6"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="1.3"
                />
                <rect
                  x="6"
                  y="5"
                  width="4"
                  height="9"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="1.3"
                />
                <rect
                  x="10.5"
                  y="2"
                  width="4"
                  height="12"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="1.3"
                />
              </svg>
            </span>
            HR Dashboard
          </button>
        </div>
      </div>
    </section>

    <!-- Main -->
    <main class="main">
      <!-- Empty state: no pill selected -->
      <Transition name="fade">
        <div v-if="!activeSection" class="empty-state">
          <div class="empty-icon">↑</div>
          <p class="empty-text">Select a form above to get started.</p>
        </div>
      </Transition>

      <!-- IDP card -->
      <Transition name="slide">
        <div v-if="activeSection === 'idp'" class="section-block">
          <div class="section-head">
            <div class="sh-line"></div>
            <span class="sh-label">Available Forms</span>
            <div class="sh-line"></div>
          </div>
          <div class="grid">
            <NuxtLink to="/idp-form" class="card">
              <div class="card-bar bar-gold"></div>
              <div class="card-icon icon-gold">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect
                    x="6"
                    y="4"
                    width="28"
                    height="34"
                    rx="3"
                    stroke="currentColor"
                    stroke-width="2.2"
                  />
                  <path
                    d="M13 13h14M13 19h14M13 25h9"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="7"
                    fill="currentColor"
                    fill-opacity="0.12"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M27.5 30h5M30 27.5v5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="card-tag tag-gold">For Employees</div>
              <h2 class="card-title">Individual Development Plan</h2>
              <p class="card-desc">
                Document your professional development goals, competency
                targets, and training interventions. Includes supervisor review
                stage.
              </p>
              <div class="card-foot">
                <span class="card-meta">2-stage submission</span>
                <span class="card-cta cta-gold"
                  >Open Form <span class="arr">→</span></span
                >
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Edit IDP card -->
      <Transition name="slide">
        <div v-if="activeSection === 'edit-idp'" class="section-block">
          <div class="section-head">
            <div class="sh-line"></div>
            <span class="sh-label">Available Forms</span>
            <div class="sh-line"></div>
          </div>
          <div class="grid">
            <NuxtLink to="/idp-edit" class="card">
              <div class="card-bar bar-gold"></div>
              <div class="card-icon icon-gold">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect
                    x="6"
                    y="4"
                    width="28"
                    height="34"
                    rx="3"
                    stroke="currentColor"
                    stroke-width="2.2"
                  />
                  <path
                    d="M13 13h14M13 19h14M13 25h9"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M24 30l4-4 3 3-4 4-3-3z"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M28 26l2-2 2 2-2 2-2-2z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="card-tag tag-gold">For Employees</div>
              <h2 class="card-title">Edit Your IDP</h2>
              <p class="card-desc">
                Already submitted your IDP? Retrieve it using your Reference ID
                and CarSU email to make changes before your supervisor completes
                their review.
              </p>
              <div class="card-foot">
                <span class="card-meta">Requires Reference ID</span>
                <span class="card-cta cta-gold"
                  >Edit IDP <span class="arr">→</span></span
                >
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Supervisor Review card -->
      <Transition name="slide">
        <div v-if="activeSection === 'supervisor'" class="section-block">
          <div class="section-head">
            <div class="sh-line"></div>
            <span class="sh-label">For Supervisors</span>
            <div class="sh-line"></div>
          </div>
          <div class="grid">
            <NuxtLink to="/idp-supervisor" class="card">
              <div class="card-bar bar-gold"></div>
              <div class="card-icon icon-gold">
                <svg viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"
                    stroke="currentColor"
                    stroke-width="2.2"
                  />
                  <path
                    d="M4 36s-1-12 16-12 16 12 16 12"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M28 18l3 3 6-6"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="card-tag tag-gold">For Supervisors</div>
              <h2 class="card-title">IDP Supervisor Review</h2>
              <p class="card-desc">
                Review and assess your employee's Individual Development Plan.
                Enter your Reference ID and CarSU email to access the submission
                and complete Section IV.
              </p>
              <div class="card-foot">
                <span class="card-meta">Requires Reference ID</span>
                <span class="card-cta cta-gold"
                  >Review IDP <span class="arr">→</span></span
                >
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- LNA card -->
      <Transition name="slide">
        <div v-if="activeSection === 'lna'" class="section-block">
          <div class="section-head">
            <div class="sh-line"></div>
            <span class="sh-label">Available Forms</span>
            <div class="sh-line"></div>
          </div>
          <div class="grid">
            
            <NuxtLink to="/lna-form" class="card">
              <div class="card-bar bar-gold"></div>
              <div class="card-icon icon-gold">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect
                    x="4"
                    y="10"
                    width="32"
                    height="22"
                    rx="3"
                    stroke="currentColor"
                    stroke-width="2.2"
                  />
                  <path d="M4 16h32" stroke="currentColor" stroke-width="2" />
                  <path
                    d="M13 16v16M22 16v16"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-dasharray="2 2"
                  />
                  <circle
                    cx="30"
                    cy="7"
                    r="4"
                    fill="currentColor"
                    fill-opacity="0.15"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M28.5 7h3M30 5.5v3"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="card-tag tag-gold">For Office Heads</div>
              <h2 class="card-title">USWAG Plan — LNA Tool</h2>
              <p class="card-desc">
                Office-wide Workforce Learning Needs Assessment for identifying
                competency gaps, workforce profiles, and training interventions.
              </p>
              <div class="card-foot">
                <span class="card-meta">Single submission</span>
                <span class="card-cta cta-gold"
                  >Open Form <span class="arr">→</span></span
                >
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Dashboard card -->
      <Transition name="slide">
        <div v-if="activeSection === 'dashboard'" class="section-block">
          <div class="section-head">
            <div class="sh-line"></div>
            <span class="sh-label">HR Staff Access</span>
            <div class="sh-line"></div>
          </div>
          <div class="grid">
            <NuxtLink to="/dashboard" class="card card-dark">
              <div class="card-bar bar-gold"></div>
              <div class="card-icon icon-green">
                <svg viewBox="0 0 40 40" fill="none">
                  <rect
                    x="4"
                    y="20"
                    width="10"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <rect
                    x="15"
                    y="13"
                    width="10"
                    height="21"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <rect
                    x="26"
                    y="6"
                    width="10"
                    height="28"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M6 17l8-7 9 5 9-10"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div class="card-tag tag-gold-light">HR Staff Only</div>
              <h2 class="card-title title-light">LeaD Dashboard</h2>
              <p class="card-desc desc-light">
                View and manage all IDP and LNA submissions, analyze trends with
                charts, access detailed records, and control HR user registry.
              </p>
              <div class="card-foot foot-dark">
                <span class="card-meta meta-light">Requires HR email</span>
                <span class="card-cta cta-gold-light"
                  >Open Dashboard <span class="arr">→</span></span
                >
              </div>
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Help (always visible) -->
      <Transition name="fade">
        <div v-if="activeSection" class="section-block">
          <div class="grid">
            <div class="help-card">
              <div class="help-icon">?</div>
              <h3 class="help-title">Need Help?</h3>
              <p class="help-desc">
                For technical issues or questions about the LeaD system, contact
                the HRMS office directly.
              </p>
              <a href="mailto:hrms@carsu.edu.ph" class="help-link"
                >hrms@carsu.edu.ph</a
              >
              <div class="help-divider"></div>
              <p class="help-note">
                All submissions require a valid
                <strong>@carsu.edu.ph</strong> email address.
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-text">
          <span class="footer-name"
            >Caraga State University — Office of Human Resource Management
            Services</span
          >
          <span class="footer-sub">Ampayon, Butuan City 8600, Philippines</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
definePageMeta({});
const { isHrStaff, isSupervisor, user } = useAuth();


const activeSection = ref(null);

function toggleSection(key) {
  activeSection.value = activeSection.value === key ? null : key;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap");

/* ── TOKENS ──────────────────────────────────────────── */
:root {
  --gold: #ffcc00;
  --orange: #ff9900;
  --green: #137300;
  --dk: #003300;
  --white: #ffffff;
  --grey: #333333;
  --bg: #f9f7f2;
  --border: #e8e3d5;
  --teal: #009999;
  --teal-light: #00cccc;
}

/* ── RESET ───────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
button {
  cursor: pointer;
  font-family: inherit;
}

/* ── PAGE ────────────────────────────────────────────── */
.page {
  min-height: 100vh;
  background: #f9f7f2;
  font-family: "Roboto", sans-serif;
  color: #333;
}

/* ── HERO ────────────────────────────────────────────── */
.hero {
  position: relative;
  background: #003300;
  padding: 18px 32px 40px;
  text-align: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.12;
}
.o1 {
  width: 500px;
  height: 500px;
  background: #ffcc00;
  top: -180px;
  right: -80px;
}
.o2 {
  width: 350px;
  height: 350px;
  background: #ff9900;
  bottom: -120px;
  left: -60px;
}
.o3 {
  width: 200px;
  height: 200px;
  background: #ffcc00;
  top: 30px;
  left: 35%;
}
.hero-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(255, 204, 0, 0.13) 1px,
    transparent 1px
  );
  background-size: 28px 28px;
}

.hero-inner {
  position: relative;
  max-width: 680px;
  margin: auto;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 204, 0, 0.65);
  font-weight: 600;
  margin-bottom: 16px;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffcc00;
  opacity: 0.55;
  display: inline-block;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}
.hero-title-lead {
  font-family: "Roboto", sans-serif;
  font-size: clamp(64px, 12vw, 96px);
  font-weight: 700;
  color: #ffcc00;
  line-height: 1;
  letter-spacing: -0.02em;
}
.hero-title-sub {
  font-size: clamp(14px, 3vw, 22px);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  margin-top: 4px;
}

.hero-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto 22px;
}

/* ── PILLS ───────────────────────────────────────────── */
.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 0;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 18px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border: 1.5px solid transparent;
  background: transparent;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    transform 0.18s ease,
    box-shadow 0.25s ease;
  user-select: none;
}

.pill-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.pill-icon svg {
  width: 14px;
  height: 14px;
}

/* Ripple pseudo-element */
.pill::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 30px;
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.pill:hover::before {
  opacity: 1;
  transform: scale(1);
}
.pill:active {
  transform: scale(0.96);
}
.pill:hover .pill-icon {
  transform: scale(1.15);
}

/* Gold / IDP */
.pill-gold {
  border-color: rgba(255, 204, 0, 0.45);
  color: rgba(255, 204, 0, 0.85);
  background: rgba(255, 204, 0, 0.06);
}
.pill-gold::before {
  background: rgba(255, 204, 0, 0.15);
}
.pill-gold:hover,
.pill-gold.active {
  background: #ffcc00;
  border-color: #ffcc00;
  color: #003300;
  box-shadow:
    0 0 0 3px rgba(255, 204, 0, 0.2),
    0 4px 16px rgba(255, 204, 0, 0.3);
}

/* Teal / Edit IDP → unified gold */
.pill-teal {
  border-color: rgba(255, 204, 0, 0.45);
  color: rgba(255, 204, 0, 0.85);
  background: rgba(255, 204, 0, 0.06);
}
.pill-teal::before {
  background: rgba(255, 204, 0, 0.15);
}
.pill-teal:hover,
.pill-teal.active {
  background: #ffcc00;
  border-color: #ffcc00;
  color: #003300;
  box-shadow:
    0 0 0 3px rgba(255, 204, 0, 0.2),
    0 4px 16px rgba(255, 204, 0, 0.3);
}

/* Orange / LNA → unified gold */
.pill-orange {
  border-color: rgba(255, 204, 0, 0.45);
  color: rgba(255, 204, 0, 0.85);
  background: rgba(255, 204, 0, 0.06);
}
.pill-orange::before {
  background: rgba(255, 204, 0, 0.15);
}
.pill-orange:hover,
.pill-orange.active {
  background: #ffcc00;
  border-color: #ffcc00;
  color: #003300;
  box-shadow:
    0 0 0 3px rgba(255, 204, 0, 0.2),
    0 4px 16px rgba(255, 204, 0, 0.3);
}

/* Green / Dashboard */
.pill-green {
  border-color: rgba(19, 115, 0, 0.5);
  color: rgba(90, 200, 60, 0.9);
  background: rgba(19, 115, 0, 0.1);
}
.pill-green::before {
  background: rgba(19, 115, 0, 0.25);
}
.pill-green:hover,
.pill-green.active {
  background: #137300;
  border-color: #1ea300;
  color: #ffcc00;
  box-shadow:
    0 0 0 3px rgba(19, 115, 0, 0.25),
    0 4px 16px rgba(19, 115, 0, 0.35);
}

/* ── MAIN ────────────────────────────────────────────── */
.main {
  max-width: 1140px;
  margin: 0 auto;
  padding: 36px 24px 80px;
}

/* ── EMPTY STATE ─────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-icon {
  font-size: 28px;
  color: rgba(184, 148, 0, 0.4);
  animation: bounce 1.6s ease-in-out infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
.empty-text {
  font-size: 14px;
  color: #bbb;
  letter-spacing: 0.04em;
}

/* ── SECTION BLOCK ───────────────────────────────────── */
.section-block {
  margin-bottom: 32px;
}

/* ── SLIDE TRANSITION ────────────────────────────────── */
.slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-leave-active {
  transition: all 0.18s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ── FADE TRANSITION ─────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── SECTION HEAD ────────────────────────────────────── */
.section-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.sh-line {
  flex: 1;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #ddd5c0, transparent);
}
.sh-label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: #999;
  white-space: nowrap;
}

/* ── GRID ────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
}

/* ── CARD ────────────────────────────────────────────── */
.card {
  background: #fff;
  border: 1.5px solid #e8e3d5;
  border-radius: 16px;
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
  color: #333;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.09);
}

.card-dark {
  background: #003300;
  border-color: #1a5200;
}
.card-dark:hover {
  border-color: #137300;
}

.card-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
}
.bar-teal {
  background: linear-gradient(90deg, #ffcc00, #ffdd44);
}
.bar-gold {
  background: linear-gradient(90deg, #ffcc00, #ffdd44);
}
.bar-orange {
  background: linear-gradient(90deg, #ffcc00, #ffdd44);
}
.bar-green {
  background: linear-gradient(90deg, #ffcc00, #ffdd44);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-icon svg {
  width: 26px;
  height: 26px;
}
.icon-teal {
  background: #fffbea;
  border: 1.5px solid #ffe566;
  color: #b89400;
}
.icon-gold {
  background: #fffbea;
  border: 1.5px solid #ffe566;
  color: #b89400;
}
.icon-orange {
  background: #fffbea;
  border: 1.5px solid #ffe566;
  color: #b89400;
}
.icon-green {
  background: #fffbea;
  border: 1.5px solid #ffe566;
  color: #b89400;
}

.card-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.tag-teal {
  color: #b89400;
}
.tag-gold {
  color: #b89400;
}
.tag-orange {
  color: #b89400;
}
.tag-green {
  color: #b89400;
}
.tag-gold-light {
  color: #ffcc00;
}

.card-title {
  font-family: "Roboto", sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #003300;
  line-height: 1.3;
}
.title-light {
  color: #ffcc00;
}

.card-desc {
  font-size: 13.5px;
  color: #777;
  line-height: 1.65;
  flex: 1;
}
.desc-light {
  color: rgba(255, 255, 255, 0.55);
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0ece0;
  margin-top: 2px;
}
.foot-dark {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.card-meta {
  font-size: 12px;
  color: #bbb;
  font-weight: 500;
}
.meta-light {
  color: rgba(255, 255, 255, 0.3);
}

.card-cta {
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.2s ease;
}
.cta-teal {
  color: #b89400;
}
.cta-gold {
  color: #b89400;
}
.cta-orange {
  color: #b89400;
}
.cta-green {
  color: #b89400;
}
.cta-gold-light {
  color: #ffcc00;
}
.card:hover .card-cta {
  gap: 8px;
}

.arr {
  transition: transform 0.2s ease;
}
.card:hover .arr {
  transform: translateX(3px);
}

/* ── HELP CARD ───────────────────────────────────────── */
.help-card {
  background: #fff;
  border: 1.5px solid #e8e3d5;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.help-icon {
  width: 42px;
  height: 42px;
  background: #fffbea;
  border: 1.5px solid #ffe566;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #b89400;
}
.help-title {
  font-family: "Roboto", sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #003300;
}
.help-desc {
  font-size: 13.5px;
  color: #777;
  line-height: 1.6;
}
.help-link {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: #137300;
  border-bottom: 1.5px solid rgba(19, 115, 0, 0.3);
  padding-bottom: 2px;
  transition:
    border-color 0.2s,
    color 0.2s;
}
.help-link:hover {
  color: #0a5200;
  border-color: #137300;
}
.help-divider {
  height: 1px;
  background: #f0ece0;
  margin: 2px 0;
}
.help-note {
  font-size: 13px;
  color: #aaa;
  line-height: 1.5;
}
.help-note strong {
  color: #888;
}

/* ── FOOTER ──────────────────────────────────────────── */
.footer {
  background: #003300;
  border-top: 3px solid #ffcc00;
  padding: 18px 32px;
}
.footer-inner {
  max-width: 1140px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}
.footer-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}
.footer-name {
  font-size: 13px;
  font-weight: 700;
  color: #ffcc00;
}
.footer-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.03em;
}

.pill:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.pill:disabled:hover::before {
  opacity: 0;
}
.card-locked {
  cursor: default;
  opacity: 0.85;
}
.card-locked:hover {
  transform: none;
  box-shadow: none;
}

/* ── RESPONSIVE ──────────────────────────────────────── */
@media (max-width: 640px) {
  .hero {
    padding: 14px 18px 32px;
  }
  .main {
    padding: 32px 16px 56px;
  }
  .card,
  .help-card {
    padding: 22px 16px 16px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .footer {
    padding: 14px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .panel-body {
    flex-direction: column;
    align-items: flex-start;
  }
  .panel-cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
