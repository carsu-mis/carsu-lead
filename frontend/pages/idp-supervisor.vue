<template>
  <!-- ═══════════════════════════════════════════════ -->
  <!-- DATA PRIVACY NOTICE MODAL                       -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="showPrivacyModal" class="privacy-overlay">
    <div class="privacy-modal">
      <div class="privacy-header">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <h2>Data Privacy Notice</h2>
      </div>
      <div class="privacy-body">
        <p>
          In compliance with the
          <strong>Data Privacy Act of 2012 (R.A. 10173)</strong>, Caraga State
          University informs you that as a <strong>Supervisor</strong>, you are
          accessing an employee's
          <strong>Individual Development Plan (IDP)</strong>
          for the purpose of conducting an official performance and development
          assessment.
        </p>
        <ul>
          <li>
            The employee's personal and professional information shown here is
            confidential
          </li>
          <li>
            Access is strictly limited to your role as the designated reviewing
            supervisor
          </li>
          <li>
            Your assessment will be recorded and shared with the employee and HR
          </li>
          <li>
            Unauthorized sharing or reproduction of this data is prohibited
          </li>
        </ul>
        <p>
          By continuing, you acknowledge your responsibility to handle this
          information with confidentiality and in accordance with the
          <strong>Data Privacy Act of 2012 (R.A. 10173)</strong> and its
          implementing rules and regulations.
        </p>
        <p>
          For data privacy concerns, contact the Caraga State University HRMS at
          <strong>hrmslandd@carsu.edu.ph</strong>.
        </p>
        <label class="privacy-checkbox">
          <input type="checkbox" v-model="privacyAgreed" />
          <span
            >I understand and agree to handle the employee's data with
            confidentiality as required by the Data Privacy Act of 2012.</span
          >
        </label>
      </div>
      <div class="privacy-footer">
        <a href="/" class="btn-privacy-decline">Decline</a>
        <button
          class="btn-privacy-agree"
          :disabled="!privacyAgreed"
          @click="acceptPrivacy"
        >
          Agree &amp; Continue
        </button>
      </div>
    </div>
  </div>

  <!-- Loading overlay -->
  <div class="overlay" :class="{ active: isLoading }">
    <div class="spinner"></div>
    <p>{{ loadingMsg }}</p>
  </div>

  <!-- ── TOKEN / VERIFY SCREEN ── -->
  <div v-if="screen === 'token'" class="token-wrap">
    <div class="token-card">
      <div class="token-logo">
        <img src="/img/csu-logo-square1.png" alt="CarSU" />
      </div>
      <h2>Supervisor IDP Review</h2>
      <p>
        Enter your reference ID and CarSU email to load the employee's
        submission for review.
      </p>
      <div class="field-group">
        <label>Reference ID <span class="req">*</span></label>
        <span class="token-guidance"
          >Reference ID was sent to your CarSU email</span
        >
        <div class="email-prefix-wrapper" :class="{ error: tokenError }">
          <span
            class="email-suffix"
            style="border-left: none; border-right: 1px solid var(--border)"
            >IDP-</span
          >
          <input
            type="text"
            v-model="tokenInputSuffix"
            class="email-prefix-input"
            placeholder="2026-000001"
          />
        </div>
      </div>
      <div class="field-group">
        <label>CarSU Email Address <span class="req">*</span></label>
        <div class="email-prefix-wrapper" :class="{ error: emailError }">
          <input
            type="text"
            v-model="supervisorEmailPrefix"
            class="email-prefix-input"
            placeholder="yourname"
          />
          <span class="email-suffix">@carsu.edu.ph</span>
        </div>
      </div>

      <p v-if="tokenError" class="token-error">{{ tokenError }}</p>
      <button class="btn-load" @click="loadByToken" :disabled="isLoading">
        Verify &amp; Load IDP
      </button>
    </div>
  </div>

  <!-- ── MAIN REVIEW SCREEN ── -->
  <div v-if="screen === 'review'">
    <div class="container">
      <!-- Title -->
      <div class="page-title">
        <h2>Individual Development Plan (IDP) 2026-2031</h2>
        <p>
          Supervisor's Review — Read-only view of employee submission. Complete
          Section IV below.
        </p>
        <div class="ref-badge">{{ idpData.refId }}</div>
      </div>

      <!-- ══ SECTION H: Personnel Info (read-only) ══ -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num"></div>
          <div>
            <h3>Personnel Information</h3>
            <p>Employee-submitted details</p>
          </div>
          <div class="readonly-badge">Read-only</div>
        </div>
        <div class="section-body">
          <div class="ro-grid ro-grid-2">
            <div class="ro-field">
              <div class="ro-label">Campus</div>
              <div class="ro-value">{{ idpData.campus || "—" }}</div>
            </div>
            <div class="ro-field">
              <div class="ro-label">Pillars</div>
              <div class="ro-value">{{ idpData.officeAffiliation || "—" }}</div>
            </div>
            <div class="ro-field span-2">
              <div class="ro-label">College / Office / Unit</div>
              <div class="ro-value">{{ idpData.collegeOfficeUnit || "—" }}</div>
            </div>
            <div class="ro-field">
              <div class="ro-label">Name of Personnel</div>
              <div class="ro-value">
                {{
                  idpData.nameOfPersonnel
                    ? idpData.nameOfPersonnel.toUpperCase()
                    : "—"
                }}
              </div>
            </div>
            <div class="ro-field">
              <div class="ro-label">Highest Educational Attainment</div>
              <div class="ro-value">
                {{ idpData.educAttainment || "—"
                }}{{
                  idpData.educAttainmentSpec
                    ? " — " + idpData.educAttainmentSpec
                    : ""
                }}
              </div>
            </div>
            <div class="ro-field">
              <div class="ro-label">Current Position / Designation</div>
              <div class="ro-value">{{ idpData.currentPosition || "—" }}</div>
            </div>

            <div class="ro-field">
              <div class="ro-label">Years in Position</div>
              <div class="ro-value">{{ idpData.yearsInPosition ?? "—" }}</div>
            </div>
            <div class="ro-field">
              <div class="ro-label">Years in CSU</div>
              <div class="ro-value">{{ idpData.yearsInCSU ?? "—" }}</div>
            </div>
            <div class="ro-field span-2">
              <div class="ro-label">Purpose</div>
              <div class="ro-value">{{ idpData.headerPurpose || "—" }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ SECTION I: Competency Assessment (read-only) ══ -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">I</div>
          <div><h3>Competency Assessment</h3></div>
          <div class="readonly-badge">Read-only</div>
        </div>
        <div class="section-body">
          <div class="ro-field" style="margin-bottom: 16px">
            <div class="ro-label">Assessment Purpose</div>
            <div class="ro-value">{{ idpData.competencyPurpose || "—" }}</div>
          </div>
          <div class="table-wrapper">
            <table class="ro-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th>Target Competency</th>
                  <th>Cluster</th>
                  <th>Current Level</th>
                  <th>Required Level</th>
                  <th>Suggested LeaD Interventions</th>
                  <th>Target Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!competencyRows.length" class="empty-row">
                  <td colspan="7">No entries provided.</td>
                </tr>
                <tr v-for="(row, i) in competencyRows" :key="i">
                  <td class="tc">{{ i + 1 }}</td>
                  <td>{{ row.targetCompetency || "—" }}</td>
                  <td>
                    <span
                      class="cluster-badge"
                      :class="clusterClass(row.competencyGroup)"
                      >{{ row.competencyGroup || "—" }}</span
                    >
                  </td>
                  <td>{{ row.currentLevel || "—" }}</td>
                  <td>{{ row.requiredLevel || "—" }}</td>
                  <td>{{ row.leadInterventions || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ══ SECTION II: AGAP (read-only) ══ -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">II</div>
          <div><h3>Academic Growth and Advancement Program (AGAP)</h3></div>
          <div class="readonly-badge">Read-only</div>
        </div>
        <div class="section-body">
          <div class="table-wrapper">
            <table class="ro-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th>Degree Program</th>
                  <th>Target HEI</th>
                  <th>Mode of Study</th>
                  <th>Target Scholarship Grant</th>
                  <th>Target Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!agapRows.length" class="empty-row">
                  <td colspan="6">No entries provided.</td>
                </tr>
                <tr v-for="(row, i) in agapRows" :key="i">
                  <td class="tc">{{ i + 1 }}</td>
                  <td>{{ row.degreeProgram || "—" }}</td>
                  <td>{{ row.targetHEI || "—" }}</td>
                  <td>{{ row.modeOfStudy || "—" }}</td>
                  <td>{{ row.scholarshipGrant || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ══ SECTION III: Pro-ACT (read-only) ══ -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">III</div>
          <div>
            <h3>
              Professional Advancement through Capacity-Building and Trainings
              (Pro-ACT)
            </h3>
          </div>
          <div class="readonly-badge">Read-only</div>
        </div>
        <div class="section-body">
          <div class="table-wrapper">
            <table class="ro-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th>Target Competency / Skill</th>
                  <th>Training / LeaD Intervention</th>
                  <th>Mode of Activity</th>
                  <th>Trainer / Provider</th>
                  <th>Target Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!proactRows.length" class="empty-row">
                  <td colspan="6">No entries provided.</td>
                </tr>
                <tr v-for="(row, i) in proactRows" :key="i">
                  <td class="tc">{{ i + 1 }}</td>
                  <td>{{ row.targetSkill || "—" }}</td>
                  <td>{{ row.trainingTitle || "—" }}</td>
                  <td>{{ row.modeOfActivity || "—" }}</td>
                  <td>{{ row.trainerProvider || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ══ SECTION IV: Supervisor Assessment (fillable) ══ -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">IV</div>
          <div>
            <h3>Supervisor's Assessment and Endorsement</h3>
            <p>
              Complete all fields below — this section is for the supervisor
              only
            </p>
          </div>
        </div>
        <div class="section-body">
          <table class="assessment-table">
            <thead>
              <tr>
                <th style="width: 180px">Assessment Area</th>
                <th style="width: 240px">Guide Question</th>
                <th>Supervisor's Response</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. Performance gaps -->
              <tr>
                <td class="area-label">1. Observed Performance Gaps</td>
                <td class="guide-q">
                  Are there any gaps in the employee's current performance that
                  may be addressed through training, coaching, or mentoring?
                </td>
                <td class="response-cell">
                  <div class="checkbox-group" style="margin-bottom: 12px">
                    <label
                      class="checkbox-item"
                      :class="{ checked: assessment.perfGapsYN === 'Yes' }"
                    >
                      <input
                        type="radio"
                        v-model="assessment.perfGapsYN"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label
                      class="checkbox-item"
                      :class="{ checked: assessment.perfGapsYN === 'No' }"
                    >
                      <input
                        type="radio"
                        v-model="assessment.perfGapsYN"
                        value="No"
                      />
                      No
                    </label>
                  </div>
                  <div style="margin-top: 8px">
                    <label class="field-label">Remarks:</label>
                    <textarea
                      v-model="assessment.perfGapsSpec"
                      rows="3"
                      placeholder="Describe observed performance gaps, or leave blank if none…"
                    ></textarea>
                  </div>
                </td>
              </tr>
              <!-- 2. Readiness -->
              <tr>
                <td class="area-label">2. Readiness for Advancement</td>
                <td class="guide-q">
                  Based on your observation, is the employee ready for higher
                  responsibilities or academic growth (e.g., scholarship,
                  promotion readiness)?
                </td>
                <td class="response-cell">
                  <div class="checkbox-group" style="margin-bottom: 12px">
                    <label
                      class="checkbox-item"
                      :class="{ checked: assessment.readinessYN === 'Yes' }"
                    >
                      <input
                        type="radio"
                        v-model="assessment.readinessYN"
                        value="Yes"
                      />
                      Yes
                    </label>
                    <label
                      class="checkbox-item"
                      :class="{ checked: assessment.readinessYN === 'No' }"
                    >
                      <input
                        type="radio"
                        v-model="assessment.readinessYN"
                        value="No"
                      />
                      No
                    </label>
                  </div>
                  <label class="field-label">Remarks:</label>
                  <textarea
                    v-model="assessment.readinessRemarks"
                    rows="3"
                    placeholder="Your remarks on readiness…"
                  ></textarea>
                </td>
              </tr>
              <!-- 3. Recommended interventions -->
              <tr>
                <td class="area-label">3. Recommended L&amp;D Interventions</td>
                <td class="guide-q">
                  What specific learning and development interventions do you
                  recommend? <em>(Check all applicable)</em>
                </td>
                <td class="response-cell">
                  <div class="checkbox-group">
                    <label
                      v-for="opt in interventionOptions"
                      :key="opt"
                      class="checkbox-item"
                      :class="{
                        checked: assessment.interventions.includes(opt),
                      }"
                    >
                      <input
                        type="checkbox"
                        :value="opt"
                        v-model="assessment.interventions"
                      />
                      {{ opt }}
                    </label>
                  </div>
                  <div
                    v-if="assessment.interventions.includes('Others')"
                    style="margin-top: 10px"
                  >
                    <input
                      type="text"
                      v-model="assessment.interventionOther"
                      placeholder="Specify other intervention…"
                    />
                  </div>
                </td>
              </tr>
              <!-- 4. Implementation period -->
              <tr>
                <td class="area-label">4. Preferred Implementation Period</td>
                <td class="guide-q">
                  When should the recommended interventions ideally be
                  implemented? Select a year first, then the quarter or period.
                </td>
                <td class="response-cell">
                  <!-- Year dropdown -->
                  <div
                    style="
                      margin-bottom: 12px;
                      display: flex;
                      align-items: center;
                      gap: 10px;
                    "
                  >
                    <small
                      class="impl-hint"
                      style="margin-bottom: 0; white-space: nowrap"
                      >Year</small
                    >
                    <select
                      v-model="assessment.implYear"
                      style="width: auto; min-width: 120px; margin-bottom: 0"
                    >
                      <option value="">Select year…</option>
                      <option v-for="yr in yearOptions" :key="yr" :value="yr">
                        {{ yr }}
                      </option>
                    </select>
                  </div>
                  <!-- Quarter / period — single select via radio -->
                  <small class="impl-hint">Quarter / Period</small>
                  <div class="checkbox-group">
                    <label
                      v-for="opt in periodOptions"
                      :key="opt"
                      class="checkbox-item"
                      :class="{
                        checked: assessment.implementationPeriod === opt,
                      }"
                    >
                      <input
                        type="radio"
                        name="implPeriod"
                        :value="opt"
                        v-model="assessment.implementationPeriod"
                      />
                      {{ opt }}
                    </label>
                  </div>
                </td>
              </tr>
              <!-- 5. Additional comments -->
              <tr>
                <td class="area-label">
                  5. Additional Comments or Development Notes
                </td>
                <td class="guide-q">
                  Any other suggestions or remarks to support the employee's
                  development plan?
                </td>
                <td class="response-cell">
                  <textarea
                    v-model="assessment.additionalComments"
                    rows="4"
                    placeholder="Your additional comments or development notes…"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Certification block -->
          <div class="cert-block">
            <p>
              <em
                >I hereby certify that I have reviewed and assessed the
                Individual Development Plan (IDP) of the concerned personnel and
                confirm that the proposed goals and interventions are aligned
                with their role, performance needs, and the strategic direction
                of the office.</em
              >
            </p>
            <div class="sup-name">
              {{
                idpData.supervisorName
                  ? idpData.supervisorName.toUpperCase()
                  : "—"
              }}
            </div>
            <small>Signature over Printed Name of Immediate Supervisor</small>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="submit-area">
        <p>
          By submitting, you confirm that your assessment is complete and
          accurate. HR will be notified immediately.
        </p>
        <button
          class="btn-submit"
          @click="submitAssessment"
          :disabled="isLoading"
        >
          Submit Assessment
        </button>
      </div>
    </div>
  </div>

  <!-- ── SUCCESS SCREEN ── -->
  <div v-if="screen === 'success'" class="success-wrap">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h2>Assessment Submitted</h2>
      <p>
        Your assessment for this IDP has been recorded. HRMS has been notified
        that the IDP is now fully complete.
      </p>
      <div class="notif-note">
        <strong>📧 Employee has been notified</strong>
        <span>A confirmation has been sent to the employee's CarSU email.</span>
      </div>
      <a href="/" class="btn-home">← Back to Home</a>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ["supervisor"] });

import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const { setPageHeader, clearPageHeader } = usePageHeader();
setPageHeader("IDP Supervisor Review", "/");
onUnmounted(() => {
  clearPageHeader();
});

const config = useRuntimeConfig();
const API = config.public.apiBase;
const route = useRoute();

// ── State ──────────────────────────────────────────────────────────────────
// ── Privacy Modal ──
const showPrivacyModal = ref(false);
const privacyAgreed = ref(false);
function acceptPrivacy() {
  if (privacyAgreed.value) {
    showPrivacyModal.value = false;
    screen.value = "review";
  }
}

const screen = ref("token"); // 'token' | 'review' | 'success'
const isLoading = ref(false);
const loadingMsg = ref("Loading…");

const tokenInput = ref("");
const tokenInputSuffix = ref("");
const supervisorEmailPrefix = ref("");
const tokenError = ref("");
const emailError = ref(false);

const idpData = ref({});
const competencyRows = computed(() => {
  try {
    return JSON.parse(idpData.value.competencyRowsJson || "[]");
  } catch {
    return [];
  }
});
const agapRows = computed(() => {
  try {
    return JSON.parse(idpData.value.agapRowsJson || "[]");
  } catch {
    return [];
  }
});
const proactRows = computed(() => {
  try {
    return JSON.parse(idpData.value.proactRowsJson || "[]");
  } catch {
    return [];
  }
});

const assessment = reactive({
  perfGapsYN: "",
  perfGapsSpec: "",
  readinessYN: "",
  readinessRemarks: "",
  interventions: [],
  interventionOther: "",
  implementationPeriod: "",
  implYear: "",
  additionalComments: "",
});

const interventionOptions = [
  "Technical Training",
  "Soft Skills",
  "Leadership Development",
  "Coaching / Mentoring",
  "Academic Advancement",
  "Job Rotation / Cross-training",
  "Others",
];
const periodOptions = ["Q1", "Q2", "Q3", "Q4"];
const yearOptions = ["2026", "2027", "2028", "2029", "2030", "2031"];

// ── On mount: check URL for ref param ─────────────────────────────────────
onMounted(() => {
  const ref = route.query.ref;
  if (ref) {
    tokenInput.value = ref;
    tokenInputSuffix.value = ref.startsWith("IDP-") ? ref.slice(4) : ref;
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
function clusterClass(group) {
  const map = {
    Core: "cluster-core",
    Leadership: "cluster-leadership",
    Organizational: "cluster-org",
    Technical: "cluster-tech",
  };
  return map[group] || "";
}

// ── Load by token ──────────────────────────────────────────────────────────
async function loadByToken() {
  tokenError.value = "";
  emailError.value = false;

  const suffix = tokenInputSuffix.value.trim();
  tokenInput.value = suffix ? `IDP-${suffix}` : "";
  const token = tokenInput.value;
  const email = supervisorEmailPrefix.value.trim() + "@carsu.edu.ph";

  if (!token) {
    tokenError.value = "Please enter the Reference ID.";
    return;
  }
  if (!supervisorEmailPrefix.value.trim()) {
    emailError.value = true;
    tokenError.value = "Please enter your CarSU email.";
    return;
  }

  isLoading.value = true;
  loadingMsg.value = "Loading IDP submission…";

  try {
    const res = await fetch(`${API}/idp/${token}`);
    if (!res.ok) {
      tokenError.value = "IDP not found. Please check your Reference ID.";
      return;
    }

    const data = await res.json();

    // Verify the supervisor email matches
    if (
      data.supervisorEmail &&
      data.supervisorEmail.toLowerCase() !== email.toLowerCase()
    ) {
      tokenError.value =
        "Email does not match the supervisor on record for this IDP.";
      return;
    }
    if (data.status === "COMPLETE") {
      tokenError.value = "This IDP has already been reviewed and submitted.";
      return;
    }

    idpData.value = data;
    showPrivacyModal.value = true;
  } catch (err) {
    tokenError.value = "Network error: " + err.message;
  } finally {
    isLoading.value = false;
  }
}

// ── Submit assessment ──────────────────────────────────────────────────────
async function submitAssessment() {
  if (!assessment.perfGapsYN) {
    alert("Please indicate if there are performance gaps.");
    return;
  }
  if (!assessment.readinessYN) {
    alert("Please indicate readiness for advancement.");
    return;
  }

  let interventions = [...assessment.interventions];
  if (interventions.includes("Others") && assessment.interventionOther.trim()) {
    interventions = interventions.filter((v) => v !== "Others");
    interventions.push("Others: " + assessment.interventionOther.trim());
  }

  const payload = {
    supervisorAssessment: JSON.stringify({
      perfGapsYN: assessment.perfGapsYN,
      perfGapsSpec: assessment.perfGapsSpec,
      readinessYN: assessment.readinessYN,
      readinessRemarks: assessment.readinessRemarks,
      interventions,
      implYear: assessment.implYear,
      implementationPeriod: assessment.implementationPeriod,
      additionalComments: assessment.additionalComments,
    }),
    supervisorSignedAt: new Date().toISOString(),
  };

  isLoading.value = true;
  loadingMsg.value = "Submitting your assessment…";

  try {
    const res = await fetch(`${API}/idp/${idpData.value.refId}/supervisor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      alert("Submission failed: " + err);
      return;
    }
    screen.value = "success";
  } catch (err) {
    alert("Network error: " + err.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");

* {
  font-family: "Roboto", sans-serif;
}

/* ── Privacy Modal ── */
.privacy-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}
.privacy-modal {
  background: #fff;
  border-radius: 14px;
  max-width: 560px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.privacy-header {
  background: var(--navy, #1a4d2e);
  color: #fff;
  padding: 24px 28px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.privacy-header svg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: #a8d5b5;
}
.privacy-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}
.privacy-body {
  padding: 24px 28px;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.65;
  max-height: 55vh;
  overflow-y: auto;
}
.privacy-body p {
  margin: 0 0 12px;
}
.privacy-body ul {
  margin: 0 0 12px;
  padding-left: 20px;
}
.privacy-body ul li {
  margin-bottom: 4px;
}
.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  padding: 14px;
  background: #f0f7f3;
  border: 1.5px solid #b6d9c3;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a4d2e;
}
.privacy-checkbox input[type="checkbox"] {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--navy, #1a4d2e);
  cursor: pointer;
}
.privacy-footer {
  padding: 16px 28px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-privacy-decline {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  background: #fff;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.btn-privacy-agree {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: var(--navy, #1a4d2e);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-privacy-agree:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
/* ── CSS variables ── */
:root {
  --navy: #003300;
  --navy-mid: #1a5c1a;
  --gold: #ffcc00;
  --gold-light: #ffd740;
  --cream: #f9f8f4;
  --white: #ffffff;
  --text: #1a1a2e;
  --text-light: #5a6070;
  --border: #d8d4c8;
  --error: #c0392b;
  --input-bg: #f8f7f4;
  --readonly-bg: #f0ede8;
}

/* ── Overlay ── */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 0, 0.65);
  z-index: 999;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
}
.overlay.active {
  display: flex;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.overlay p {
  color: #fff;
  font-size: 15px;
}

/* ── Token screen ── */
.token-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 24px;
}
.token-card {
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0, 51, 0, 0.12);
  border: 1px solid var(--border);
}
.token-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.token-logo img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.token-card h2 {
  font-family: "Roboto", sans-serif;
  font-size: 22px;
  color: var(--navy);
  text-align: center;
  margin-bottom: 8px;
}
.token-card > p {
  color: var(--text-light);
  font-size: 13px;
  text-align: center;
  margin-bottom: 24px;
}
.token-error {
  color: var(--error);
  font-size: 13px;
  margin-bottom: 12px;
  text-align: center;
}
.btn-load {
  width: 100%;
  padding: 13px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.2s;
}
.btn-load:hover {
  background: var(--navy-mid);
}
.btn-load:disabled {
  background: #aaa;
  cursor: not-allowed;
}

/* ── Page nav ── */
.page-nav {
  background: var(--navy);
  padding: 0 28px;
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 500;
  transition: color 0.2s;
}
.back-link:hover {
  color: #fff;
}
.back-link svg {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.nav-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
  margin: 0 10px;
}
.nav-current {
  font-size: 12.5px;
  color: var(--gold);
  font-weight: 600;
}

/* ── Container ── */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 28px 40px 80px;
}

/* ── Page title ── */
.page-title {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 3px solid var(--navy);
}
.page-title h2 {
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  color: var(--navy);
  margin-bottom: 6px;
}
.page-title p {
  color: var(--text-light);
  font-size: 14px;
}
.ref-badge {
  display: inline-block;
  margin-top: 12px;
  background: var(--navy);
  color: var(--gold-light);
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 8px;
  letter-spacing: 0.08em;
}

/* ── Section cards ── */
.section-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 51, 0, 0.07);
  margin-bottom: 28px;
  overflow: hidden;
  border: 1px solid var(--border);
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.section-header {
  background: var(--navy);
  padding: 18px 36px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-num {
  background: var(--gold);
  color: var(--navy);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}
.section-header h3 {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
.section-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 1px;
}
.readonly-badge {
  margin-left: auto;
  background: rgba(255, 204, 0, 0.2);
  color: var(--gold-light);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.section-body {
  padding: 40px 44px;
}

/* ── Read-only grid ── */
.ro-grid {
  display: grid;
  gap: 22px;
}
.ro-grid-2 {
  grid-template-columns: 1fr 1fr;
}
.ro-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ro-field.span-2 {
  grid-column: span 2;
}
.ro-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.ro-value {
  background: var(--readonly-bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text);
  min-height: 40px;
}

/* ── Tables ── */
.table-wrapper {
  overflow-x: auto;
  margin-top: 8px;
}
.ro-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 600px;
}
.ro-table thead tr {
  background: var(--navy-mid, #1a5c1a);
}
.ro-table thead th {
  padding: 10px 12px;
  color: #fff;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.ro-table thead th:last-child {
  border-right: none;
}
.ro-table tbody tr {
  border-bottom: 1px solid var(--border);
}
.ro-table tbody tr:nth-child(even) {
  background: #f9f8f5;
}
.ro-table tbody td {
  padding: 10px 12px;
  vertical-align: top;
  border-right: 1px solid var(--border);
  font-size: 13px;
}
.ro-table tbody td:last-child {
  border-right: none;
}
.empty-row td {
  text-align: center;
  color: var(--text-light);
  font-style: italic;
}
.tc {
  text-align: center;
  font-weight: 600;
  color: var(--text-light);
}

/* ── Cluster badges ── */
.cluster-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.cluster-core {
  background: #e8f4e8;
  color: #2d7a2d;
}
.cluster-leadership {
  background: #e8eef8;
  color: #1a4080;
}
.cluster-org {
  background: #f8f0e8;
  color: #8b5e1a;
}
.cluster-tech {
  background: #f0e8f8;
  color: #6b1a8b;
}

/* ── Section IV form ── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.field-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid, #1a5c1a);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid, #1a5c1a);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.req {
  color: var(--error);
  margin-left: 2px;
}

/* Token guidance label */
.token-guidance {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: #888;
  margin-top: -2px;
}

/* Email widget */
.email-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--input-bg);
}
.email-prefix-wrapper.error {
  border-color: var(--error);
}
.email-prefix-input {
  flex: 1;
  border: none !important;
  background: transparent !important;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.email-suffix {
  padding: 10px 14px;
  background: #e8ede8;
  color: var(--text-light);
  font-size: 13px;
  border-left: 1px solid var(--border);
  white-space: nowrap;
}

/* ── Reference ID prefix widget ── */
.ref-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--input-bg);
}
.ref-prefix-wrapper.err {
  border-color: var(--error);
}
.ref-prefix-wrapper:focus-within {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(0, 51, 0, 0.08);
}
.ref-prefix {
  padding: 10px 12px;
  background: #e8ede8;
  color: var(--navy-mid, #1a5c1a);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  border-right: 1px solid var(--border);
  user-select: none;
  letter-spacing: 0.03em;
}
.ref-prefix-input {
  flex: 1;
  border: none !important;
  background: transparent !important;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  font-family: "Roboto", sans-serif;
  color: var(--text);
}

input[type="text"],
input[type="email"],
textarea,
select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}
input:focus,
textarea:focus,
select:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(0, 51, 0, 0.08);
  background: var(--white);
}
textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  transition: all 0.2s;
  font-size: 13px;
}
.checkbox-item:hover {
  border-color: var(--navy);
  background: var(--white);
}
.checkbox-item.checked {
  border-color: var(--navy);
  background: rgba(0, 51, 0, 0.05);
}
.checkbox-item input[type="radio"],
.checkbox-item input[type="checkbox"] {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: var(--navy);
  cursor: pointer;
}

/* Assessment table */
.assessment-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
.assessment-table th,
.assessment-table td {
  border: 1.5px solid var(--border);
  padding: 14px 16px;
  vertical-align: top;
}
.assessment-table thead th {
  background: var(--navy);
  color: #fff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}
.area-label {
  font-weight: 600;
  color: #1a5c1a;
  font-size: 13px;
  min-width: 160px;
}
.guide-q {
  color: var(--text-light);
  font-size: 13px;
  min-width: 220px;
}
.response-cell {
  min-width: 260px;
}

/* Cert block */
.cert-block {
  background: rgba(255, 204, 0, 0.08);
  border: 1.5px solid var(--gold);
  border-radius: 10px;
  padding: 20px 24px;
  margin-top: 24px;
}
.cert-block p {
  font-size: 13px;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 16px;
}
.sup-name {
  font-weight: 600;
  color: var(--navy);
  font-size: 16px;
  padding: 12px 0;
  border-bottom: 2px solid var(--navy);
  display: inline-block;
  min-width: 300px;
  font-family: "Roboto", sans-serif;
}
.cert-block small {
  font-size: 11px;
  color: var(--text-light);
  display: block;
  margin-top: 4px;
}

/* Submit area */
.submit-area {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 36px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 51, 0, 0.07);
}
.submit-area p {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 18px;
}
.btn-submit {
  padding: 14px 48px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0, 51, 0, 0.2);
}
.btn-submit:hover {
  background: #1a5c1a;
  transform: translateY(-1px);
}
.btn-submit:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
}

/* Success */
.success-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 24px;
}
.success-card {
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 51, 0, 0.12);
  border: 1px solid var(--border);
}
.success-icon {
  width: 72px;
  height: 72px;
  background: rgba(26, 107, 60, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 24px;
}
.success-card h2 {
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: var(--navy);
  margin-bottom: 12px;
}
.success-card > p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 20px;
}
.notif-note {
  background: rgba(0, 51, 0, 0.06);
  border-left: 4px solid var(--navy);
  border-radius: 8px;
  padding: 14px 18px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.notif-note strong {
  color: var(--navy);
  font-size: 14px;
}
.notif-note span {
  color: var(--text-light);
  font-size: 13px;
}

.btn-home {
  display: inline-block;
  margin-top: 24px;
  padding: 11px 28px;
  background: var(--navy);
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-home:hover {
  background: #1a5c1a;
  transform: translateY(-1px);
}

/* ── Implementation period step ── */
.impl-hint {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-light);
  margin-bottom: 6px;
}
.impl-locked {
  font-size: 13px;
  color: var(--text-light);
  font-style: italic;
  padding: 8px 0;
}

@media (max-width: 640px) {
  .container {
    padding: 24px 16px 60px;
  }
  .ro-grid-2 {
    grid-template-columns: 1fr;
  }
  .ro-field.span-2 {
    grid-column: span 1;
  }
  .section-body {
    padding: 24px 20px;
  }
  .token-card {
    padding: 32px 20px;
  }
}
</style>