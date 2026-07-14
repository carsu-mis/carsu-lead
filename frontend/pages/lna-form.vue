<template>
  <div>
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
            In accordance with the
            <strong>Data Privacy Act of 2012 (R.A. 10173)</strong>, Caraga State
            University informs you that the personal information collected
            through the University's official Learning Needs Assessment (LNA)
            tool, will be processed for authorized and official human resource
            management and development purposes.
          </p>
          <p>
            The
            <strong
              >USWAG Plan (Unified System for Workforce Assessment and Growth
              Plan)</strong
            >
            is used to conduct office-level Learning Needs Assessment (LNA). It
            aims to identify capacity gaps, align learning priorities with
            institutional goals, and support evidence-based planning of Learning
            and Development (LeaD) interventions across all units. The results
            of this assessment will guide the formulation of the University's
            strategic and responsive LeaD programs.
          </p>
          <p>Specifically, the information you provide will be used for:</p>
          <ul>
            <li>
              Conducting office-level assessment of learning and development
              needs
            </li>
            <li>
              Identifying competency gaps and organizational capacity
              requirements
            </li>
            <li>Planning, prioritizing, and implementing LeaD interventions</li>
            <li>
              Supporting monitoring, evaluation, and reporting requirements
            </li>
            <li>
              Serving as basis for institutional Learning and Development (LeaD)
              planning and program formulation
            </li>
          </ul>
          <p>
            All personal data will be stored securely and accessed only by
            authorized personnel from the
            <strong
              >Human Resource Management Services (Learning and
              Development)</strong
            >. Your information will not be disclosed to third parties without
            your consent, except when required by law or applicable regulations.
          </p>
          <p>
            You have the right to access, correct, or request the deletion of
            your personal data. For any inquiries or concerns, you may contact
            the Human Resource Management Services (HRMS) at
            <strong>yjbarcial@carsu.edu.ph</strong>.
          </p>
          <label class="privacy-checkbox">
            <input type="checkbox" v-model="privacyAgreed" />
            <span
              >I have read and understood this notice, and I consent to the
              collection and processing of my personal data.</span
            >
          </label>
        </div>
        <div class="privacy-footer">
          <NuxtLink to="/" class="btn-privacy-decline">Decline</NuxtLink>
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

    <!-- Loading Overlay -->
    <div v-if="isSubmitting" class="overlay active">
      <div class="spinner"></div>
      <p>Submitting your LNA, please wait…</p>
    </div>

    <!-- Page Nav -->
    <div class="page-nav">
      <NuxtLink to="/" class="back-link">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Home
      </NuxtLink>
      <span class="nav-sep">/</span>
      <span class="nav-current">USWAG Plan (LNA Tool)</span>
    </div>

    <!-- Success Screen -->
    <div v-if="screen === 'success'" class="success-screen active">
      <div class="success-icon">&#10003;</div>
      <h2>LNA Successfully Submitted</h2>
      <p>
        The USWAG PLAN for your office has been received. HRMS has been notified
        and will process your submission accordingly.
      </p>
      <div class="ref-id-box">{{ refId }}</div>
      <p>
        Please keep your <strong>Reference ID</strong> for your records. A
        confirmation email has been sent to your address.
      </p>
    </div>

    <!-- Main Form -->
    <div v-if="screen === 'form'" class="container">
      <div class="form-title-block">
        <span class="eyebrow">HRMS — Learning &amp; Development</span>
        <h2>USWAG PLAN</h2>
        <h3>Unified System for Workforce Assessment and Growth Plan</h3>
        <p>CSU's Learning Needs Assessment (LNA) Tool</p>
      </div>

      <!-- HEADER INFO — always visible -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">H</div>
          <div>
            <h3>Office Information</h3>
            <p>Basic details about your office and the submitter</p>
          </div>
          <div v-if="sectionDone.header" class="section-done-badge">
            ✓ Complete
          </div>
        </div>
        <div class="section-body">
          <!-- Profile auto-fill notice -->
          <div
            style="
              background: #f0f7f3;
              border-left: 3px solid #1a4d2e;
              padding: 10px 16px;
              border-radius: 0 8px 8px 0;
              font-size: 13px;
              color: #2d6a3f;
              margin-bottom: 20px;
            "
          >
            Office information is auto-filled from your profile and cannot be
            edited here.
            <a
              href="/profile"
              style="color: #1a4d2e; font-weight: 700; margin-left: 4px"
              >Edit in Profile Settings →</a
            >
          </div>

          <!-- Submitter Email — locked -->
          <div class="field-grid field-grid-2" style="margin-bottom: 18px">
            <div class="field-group span-2">
              <label>Your CarSU Email Address</label>
              <div class="static-value">
                {{ form.submitterEmailPrefix }}@carsu.edu.ph
              </div>
            </div>
          </div>

          <!-- Campus — locked -->
          <div class="field-group" style="margin-bottom: 20px">
            <label>Campus</label>
            <div class="static-value">CSU Main Campus</div>
          </div>

          <!-- Office Affiliation — locked -->
          <div class="field-group" style="margin-bottom: 20px">
            <label>Office Affiliation</label>
            <div class="static-value">{{ form.officeAffiliation || "—" }}</div>
          </div>

          <div class="field-grid field-grid-2" style="margin-bottom: 18px">
            <!-- Unit / Office / College — locked -->
            <div class="field-group span-2">
              <label>Name of Unit / Office / College</label>
              <div class="static-value">
                {{ form.unitOfficeCollege || "—" }}
              </div>
            </div>

            <!-- Program — locked if present -->
            <div v-if="form.collegeProgram" class="field-group span-2">
              <label>Program / Department</label>
              <div class="static-value">{{ form.collegeProgram }}</div>
            </div>

            <!-- Head of Unit — locked -->
            <div class="field-group span-2">
              <label>Head of Unit/Office/College</label>
              <div class="static-value">{{ form.raterFullName || "—" }}</div>
            </div>

            <!-- Position — locked -->
            <div class="field-group">
              <label>Position</label>
              <div class="static-value">{{ form.position || "—" }}</div>
            </div>

            <!-- Designation — locked -->
            <div class="field-group">
              <label>Designation</label>
              <div class="static-value">{{ form.designation || "—" }}</div>
            </div>

            <!-- Year Covered — still editable -->
            <div class="field-group">
              <label>Year Covered <span class="req">*</span></label>
              <select v-model="form.yearCovered">
                <option value="">Select year…</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
                <option>2029</option>
                <option>2030</option>
                <option>2031</option>
              </select>
            </div>

            <!-- Total Personnel — still editable -->
            <div class="field-group">
              <label
                >Total Personnel in Your Office
                <span class="req">*</span></label
              >
              <input
                type="number"
                v-model="form.totalPersonnel"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <!-- Purpose — still editable -->
          <div class="field-group">
            <label>Purpose <span class="req">*</span></label>
            <div class="checkbox-group">
              <label
                v-for="p in purposeOptions"
                :key="p"
                class="checkbox-item"
                :class="{ checked: form.purpose === p }"
              >
                <input
                  type="radio"
                  name="purpose"
                  :value="p"
                  v-model="form.purpose"
                />
                {{ p }}
              </label>
            </div>
            <div
              v-if="form.purpose === 'Other'"
              class="other-specify visible"
              style="margin-top: 10px"
            >
              <input
                type="text"
                v-model="form.purposeOther"
                placeholder="Please specify..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION I: WORKFORCE PROFILE -->
      <div class="section-card section-card-collapsible">
        <div class="section-header">
          <div class="section-num">I</div>
          <div>
            <h3>
              Workforce Profile by Employment Classification and Position Level
            </h3>
            <p>
              Indicate number of personnel per classification per position level
            </p>
          </div>
          <div v-if="!sectionDone.header" class="section-locked-badge">
            Complete Section H first
          </div>
          <div v-else-if="sectionDone.workforce" class="section-done-badge">
            ✓ Complete
          </div>
        </div>
        <transition name="reveal">
          <div v-if="sectionDone.header" class="section-body">
            <p class="section-desc">
              Indicate the number of personnel per employment classification
              under each position level within your office. Refer to
              <a
                href="https://drive.google.com/file/d/1V1YBawTYCJFLZEJEJwMvslaXnGi7WErg/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                ><strong>Annex A</strong></a
              >
              for descriptions and sample positions. Hover over a position level
              name to see its description and sample positions.
            </p>
            <div class="table-wrapper">
              <table class="data-table workforce-table">
                <thead>
                  <tr>
                    <th style="min-width: 200px; text-align: left">
                      Position Level
                    </th>
                    <th v-for="t in employmentTypes" :key="t">{{ t }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="level in visiblePositionLevels" :key="level.key">
                    <td class="row-label">
                      <div
                        class="level-tooltip-wrap"
                        @mouseenter="showTooltip($event, level.key)"
                        @mouseleave="hideTooltip"
                      >
                        {{ level.label }}
                        <span class="level-tooltip-icon">?</span>
                      </div>
                    </td>
                    <td v-for="t in employmentTypeKeys" :key="t">
                      <input
                        type="number"
                        min="0"
                        v-model.number="workforce[level.key][t]"
                        style="text-align: center; width: 60px"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>

      <!-- SECTION II: COMPETENCY MAPPING -->
      <div class="section-card section-card-collapsible">
        <div class="section-header">
          <div class="section-num">II</div>
          <div>
            <h3>Competency Mapping and Assessment</h3>
            <p>Assess current competency levels across all position levels</p>
          </div>
          <div v-if="!sectionDone.workforce" class="section-locked-badge">
            Complete Section I first
          </div>
          <div v-else-if="sectionDone.competency" class="section-done-badge">
            ✓ Complete
          </div>
        </div>
        <transition name="reveal">
          <div v-if="sectionDone.workforce" class="section-body">
            <div class="section-desc">
              Using the rating scale below, identify the highest competency
              level (CL: 1-4) and percentage (%) of personnel demonstrating it.
              Write
              <strong>N/A</strong> if the competency does not apply. For
              detailed descriptions, refer to the
              <a
                href="https://tinyurl.com/CompetencyManualandModel"
                target="_blank"
                >Competency Manual and Model</a
              >.
              <div style="margin-top: 14px">
                <p><i>Rating Scale:</i></p>
                <div class="rating-scale-tables">
                  <table class="rating-scale-table">
                    <thead>
                      <tr>
                        <th colspan="3">Competency Level (CL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="rating-num">4</td>
                        <td class="rating-label">Expert</td>
                        <td class="rating-desc">
                          Consistently demonstrates competency at a high level;
                          able to mentor others; applies the skill in complex or
                          unfamiliar situations.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">3</td>
                        <td class="rating-label">Advanced</td>
                        <td class="rating-desc">
                          Competency applies in most situations, works
                          independently, and meets expectations.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">2</td>
                        <td class="rating-label">Intermediate</td>
                        <td class="rating-desc">
                          Demonstrates the competency occasionally or with
                          guidance; still building consistency.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">1</td>
                        <td class="rating-label">Basic</td>
                        <td class="rating-desc">
                          Limited or no demonstration of the competency requires
                          training or close supervision.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="rating-scale-table">
                    <thead>
                      <tr>
                        <th colspan="3">
                          Percentage (%) of Personnel Demonstrating the
                          Competency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="rating-num">A</td>
                        <td class="rating-label">76% – 100%</td>
                        <td class="rating-desc">
                          Majority consistently demonstrate the competency with
                          minimal support.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">B</td>
                        <td class="rating-label">51% – 75%</td>
                        <td class="rating-desc">
                          More than half demonstrate the competency adequately.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">C</td>
                        <td class="rating-label">26% – 50%</td>
                        <td class="rating-desc">
                          Less than half demonstrate the competency; needs
                          development.
                        </td>
                      </tr>
                      <tr>
                        <td class="rating-num">D</td>
                        <td class="rating-label">25% &amp; Below</td>
                        <td class="rating-desc">
                          Very few or none demonstrate the competency; priority
                          gap.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Position Level Tabs -->
            <div class="comp-tabs">
              <button
                v-for="lv in visibleCompLevelHeaders"
                :key="lv"
                class="comp-tab"
                :class="{ active: activeCompTab === lv }"
                @click="activeCompTab = lv"
              >
                {{ lv }}
              </button>
            </div>

            <!-- Tab Content -->
            <div v-for="(lvKey, lvIdx) in visibleCompLevelKeys" :key="lvKey">
              <div v-show="activeCompTab === visibleCompLevelHeaders[lvIdx]">
                <div
                  v-for="cluster in competencyClusters"
                  :key="cluster.key"
                  class="comp-table-wrap"
                >
                  <div class="comp-cluster-label">
                    {{ cluster.name }} Competencies
                    <span class="cluster-badge">{{ cluster.badge }}</span>
                  </div>
                  <p class="comp-note" style="padding: 8px 0 4px">
                    {{ clusterLevelNote[cluster.key]?.[lvKey] || cluster.note }}
                  </p>
                  <p class="comp-caption" style="padding: 0 0 10px">
                    Assess the competencies of
                    <strong>{{ levelFormalLabel[lvKey] }}</strong> employees
                    within each cluster by selecting the appropriate entries in
                    the respective columns.
                  </p>
                  <div class="table-wrapper">
                    <table class="data-table comp-page-table">
                      <thead>
                        <tr>
                          <th style="min-width: 200px">Competency</th>
                          <th style="width: 180px; text-align: center">
                            Competency Level (CL)
                          </th>
                          <th style="width: 180px; text-align: center">
                            Percentage (%)
                          </th>
                          <th style="min-width: 200px">
                            Basis / Key Observations
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(comp, idx) in cluster.competencies"
                          :key="comp"
                        >
                          <td class="row-label">{{ comp }}</td>
                          <td>
                            <select
                              v-model="
                                competencyData[cluster.key][idx][lvKey + '_cl']
                              "
                              class="comp-select"
                              :class="{
                                'comp-select-error':
                                  compValidated &&
                                  !(
                                    competencyData[cluster.key][idx][
                                      lvKey + '_cl'
                                    ] || ''
                                  ).trim(),
                              }"
                            >
                              <option
                                v-for="o in clOptions"
                                :key="o"
                                :value="o"
                              >
                                {{ o || "---" }}
                              </option>
                            </select>
                            <span
                              v-if="
                                compValidated &&
                                !(
                                  competencyData[cluster.key][idx][
                                    lvKey + '_cl'
                                  ] || ''
                                ).trim()
                              "
                              class="comp-field-error"
                              >Required</span
                            >
                          </td>
                          <td>
                            <select
                              v-model="
                                competencyData[cluster.key][idx][lvKey + '_pct']
                              "
                              class="comp-select"
                              :class="{
                                'comp-select-error':
                                  compValidated &&
                                  !(
                                    competencyData[cluster.key][idx][
                                      lvKey + '_pct'
                                    ] || ''
                                  ).trim(),
                              }"
                            >
                              <option
                                v-for="o in pctOptions"
                                :key="o"
                                :value="o"
                              >
                                {{ o || "---" }}
                              </option>
                            </select>
                            <span
                              v-if="
                                compValidated &&
                                !(
                                  competencyData[cluster.key][idx][
                                    lvKey + '_pct'
                                  ] || ''
                                ).trim()
                              "
                              class="comp-field-error"
                              >Required</span
                            >
                          </td>
                          <td>
                            <textarea
                              rows="2"
                              v-model="
                                competencyData[cluster.key][idx].observations
                              "
                              placeholder="Observations..."
                            ></textarea>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Prev / Next navigation -->
                <div class="comp-tab-nav">
                  <button
                    class="btn-tab-nav"
                    :disabled="lvIdx === 0"
                    @click="activeCompTab = visibleCompLevelHeaders[lvIdx - 1]"
                  >
                    ← Previous
                  </button>
                  <span class="comp-tab-page"
                    >{{ lvIdx + 1 }} / {{ visibleCompLevelKeys.length }}</span
                  >
                  <button
                    class="btn-tab-nav"
                    :disabled="lvIdx === visibleCompLevelKeys.length - 1"
                    @click="
                      compValidated = true;
                      activeCompTab = visibleCompLevelHeaders[lvIdx + 1];
                    "
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            <hr class="subsection-divider" />
            <h4
              style="
                font-family: &quot;Roboto&quot;, sans-serif;
                color: var(--navy);
                margin-bottom: 12px;
                font-size: 16px;
              "
            >
              Competency Cluster Summary
            </h4>
            <div
              v-for="lvSummary in activeClusterSummary"
              :key="lvSummary.levelKey"
              style="margin-bottom: 32px"
            >
              <h5 class="cluster-summary-level-label">
                {{ lvSummary.levelLabel }}
              </h5>
              <p class="comp-caption" style="margin-bottom: 10px">
                Assess the competencies of
                <strong>{{ lvSummary.levelLabel }}</strong> employees within
                each cluster by selecting the appropriate entries in the
                respective columns.
              </p>
              <div class="table-wrapper">
                <table class="data-table cluster-summary-table">
                  <thead>
                    <tr>
                      <th>Competency Cluster</th>
                      <th>Strongest Competency</th>
                      <th>Weakest Competency</th>
                      <th style="width: 160px">Intervention Needed?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in lvSummary.rows" :key="c.cluster">
                      <td class="row-label">{{ c.cluster }}</td>
                      <td>
                        <select v-model="c.strongest">
                          <option value="">Select competency…</option>
                          <option
                            v-for="comp in clusterCompetencyMap[c.cluster]"
                            :key="'s-' + lvSummary.levelKey + comp"
                            :value="comp"
                          >
                            {{ comp }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <select v-model="c.weakest">
                          <option value="">Select competency…</option>
                          <option
                            v-for="comp in clusterCompetencyMap[c.cluster]"
                            :key="'w-' + lvSummary.levelKey + comp"
                            :value="comp"
                          >
                            {{ comp }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <select v-model="c.interventionNeeded">
                          <option value="">---</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- SECTION III: OTHER LeaD DATA SOURCES -->
      <div class="section-card section-card-collapsible">
        <div class="section-header">
          <div class="section-num">III</div>
          <div>
            <h3>Other LeaD Data Sources</h3>
            <p>Data sources used to identify additional learning needs</p>
          </div>
          <div v-if="!sectionDone.competency" class="section-locked-badge">
            Complete Section II first
          </div>
          <div v-else-if="sectionDone.dataSources" class="section-done-badge">
            ✓ Complete
          </div>
        </div>
        <transition name="reveal">
          <div v-if="sectionDone.competency" class="section-body">
            <p class="section-desc">
              In addition to the competency assessment, indicate the data
              sources your office used to identify additional learning needs.
              You may also summarize insights or gaps surfaced from these
              sources.
            </p>

            <h4 class="subsec-label">A. Data Source Checklist</h4>
            <div class="source-checklist">
              <label
                v-for="src in dataSources"
                :key="src.value"
                class="source-item"
                :class="{ checked: form.selectedSources.includes(src.value) }"
              >
                <input
                  type="checkbox"
                  :value="src.value"
                  v-model="form.selectedSources"
                />
                {{ src.label }}
              </label>
            </div>
            <div
              v-if="form.selectedSources.includes('Others')"
              style="margin-top: 10px"
            >
              <input
                type="text"
                v-model="form.othersSourceText"
                placeholder="Please specify other data sources..."
              />
            </div>

            <hr class="subsection-divider" />

            <h4 class="subsec-label">
              B. Summary of Key Insights or Gaps Identified
            </h4>
            <div
              v-if="insightRows.length === 0"
              style="
                padding: 16px;
                color: var(--text-light);
                font-size: 13px;
                font-style: italic;
              "
            >
              Select at least one data source above to populate this table.
            </div>
            <div v-else class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 40px">No.</th>
                    <th style="min-width: 200px">Data Source</th>
                    <th>Identified Competency Gap / Issue</th>
                    <th>Relevant Personnel / Function</th>
                    <th style="min-width: 300px">Recommended Intervention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in insightRows" :key="row.dataSource">
                    <td
                      style="
                        text-align: center;
                        color: var(--text-light);
                        font-weight: 600;
                      "
                    >
                      {{ idx + 1 }}
                    </td>
                    <td
                      class="row-label"
                      style="font-size: 13px; white-space: normal"
                    >
                      {{ row.dataSource }}
                    </td>
                    <td>
                      <div class="gap-inputs-wrapper">
                        <div
                          v-for="(gap, gIdx) in row.gaps"
                          :key="gIdx"
                          class="gap-input-row"
                        >
                          <textarea
                            rows="2"
                            :value="gap"
                            @input="row.gaps[gIdx] = $event.target.value"
                            :placeholder="
                              gIdx === 0
                                ? 'Identified gap or issue...'
                                : 'Additional gap or issue...'
                            "
                          ></textarea>
                          <button
                            v-if="row.gaps.length > 1"
                            type="button"
                            class="gap-remove-btn"
                            @click="row.gaps.splice(gIdx, 1)"
                            title="Remove this gap"
                          >
                            ×
                          </button>
                        </div>
                        <button
                          type="button"
                          class="gap-add-btn"
                          @click="row.gaps.push('')"
                        >
                          + Add Issue
                        </button>
                      </div>
                    </td>
                    <td>
                      <div class="personnel-checks">
                        <label
                          v-for="opt in personnelLevelOptions"
                          :key="opt"
                          class="personnel-check-item"
                          :class="{ checked: row.personnel.includes(opt) }"
                        >
                          <input
                            type="checkbox"
                            :value="opt"
                            v-model="row.personnel"
                          />
                          {{ opt }}
                        </label>
                      </div>
                    </td>

                    <!-- ══ UPDATED: INTERVENTION TAG DROPDOWN (portal) ══ -->
                    <td>
                      <div class="intervention-dropdown">
                        <!-- Tags displayed ABOVE the trigger -->
                        <div
                          v-if="
                            row.interventions && row.interventions.length > 0
                          "
                          class="intervention-tags"
                        >
                          <span
                            v-for="tag in row.interventions"
                            :key="tag"
                            class="intervention-tag"
                          >
                            {{ tag }}
                            <button
                              type="button"
                              class="tag-remove"
                              @click.stop="
                                row.interventions.splice(
                                  row.interventions.indexOf(tag),
                                  1,
                                )
                              "
                            >
                              ×
                            </button>
                          </span>
                        </div>

                        <!-- Trigger button -->
                        <div
                          class="intervention-trigger intervention-trigger-portal"
                          :class="{
                            open:
                              interventionPortal.visible &&
                              interventionPortal.rowIndex === idx,
                          }"
                          @click.stop="openInterventionPortal($event, idx)"
                        >
                          <span class="intervention-placeholder">
                            {{
                              row.interventions && row.interventions.length > 0
                                ? "Add more interventions…"
                                : "Select interventions…"
                            }}
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            class="intervention-chevron"
                            :class="{
                              rotated:
                                interventionPortal.visible &&
                                interventionPortal.rowIndex === idx,
                            }"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <!-- ══ END INTERVENTION TAG DROPDOWN ══ -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>

      <!-- SECTION IV: PRO-ACT -->
      <div class="section-card section-card-collapsible">
        <div class="section-header">
          <div class="section-num">IV</div>
          <div>
            <h3>
              Professional Advancement through Capacity-Building and Trainings
              (Pro-ACT)
            </h3>
            <p>Recommended training interventions based on identified gaps</p>
          </div>
          <div v-if="!sectionDone.dataSources" class="section-locked-badge">
            Complete Section III first
          </div>
          <div v-else-if="sectionDone.proact" class="section-done-badge">
            ✓ Complete
          </div>
        </div>
        <transition name="reveal">
          <div v-if="sectionDone.dataSources" class="section-body">
            <div class="section-desc">
              Based on the competency gaps and learning needs identified in
              Sections II and III, specify the recommended training or LeaD
              interventions for your office. Rows are auto-generated from
              identified gaps. You may also add additional rows manually.
            </div>
            <div class="table-wrapper">
              <table class="dynamic-table">
                <thead>
                  <tr>
                    <th style="width: 40px">No.</th>
                    <th style="background: var(--navy); opacity: 0.92">
                      Identified Gap / Intervention Need
                      <span
                        style="font-size: 10px; font-weight: 400; opacity: 0.8"
                      >
                        (from Sections II &amp; III)
                      </span>
                    </th>
                    <th>Training / LeaD Intervention</th>
                    <th style="width: 110px">Mode of Activity</th>
                    <th>Trainer / Provider</th>
                    <th style="width: 90px">Target Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-if="filledGaps.length === 0 && proactRows.length === 0"
                  >
                    <tr>
                      <td
                        colspan="7"
                        style="
                          text-align: center;
                          color: var(--text-light);
                          font-style: italic;
                          padding: 20px;
                        "
                      >
                        Identify gaps in Sections II and III to auto-populate
                        this table, or add rows manually.
                      </td>
                    </tr>
                  </template>
                  <!-- Auto-generated rows from gaps -->
                  <tr v-for="(gap, idx) in filledGaps" :key="'gap-' + idx">
                    <td class="row-num-cell">{{ idx + 1 }}</td>
                    <td style="background: rgba(0, 51, 0, 0.04)">
                      <div class="proact-skill-label">{{ gap }}</div>
                    </td>
                    <td>
                      <select v-model="proactRows[idx].trainingTitle">
                        <option value="">Select…</option>
                        <optgroup label="On-the-Job Learning">
                          <option>Observation / Demonstration</option>
                          <option>Delegation</option>
                          <option>Coaching</option>
                          <option>Mentoring</option>
                          <option>Deployment</option>
                          <option>Job Rotation / Assignment</option>
                          <option>Detail and Secondment</option>
                          <option>Reading</option>
                          <option>Flexible Learning</option>
                          <option>Brainstorming / Group Discussion</option>
                          <option>Experiential Learning</option>
                        </optgroup>
                        <optgroup label="Off-the-Job Learning">
                          <option>Special Short Courses and Lectures</option>
                          <option>
                            Conferences, Training Programs, Conventions,
                            Seminars, and Cum Paper Presentations
                          </option>
                          <option>Pursue Higher Education</option>
                        </optgroup>
                        <option value="__others__">Others / Specify</option>
                      </select>
                      <input
                        v-if="proactRows[idx].trainingTitle === '__others__'"
                        type="text"
                        v-model="proactRows[idx].trainingTitleOther"
                        placeholder="Please specify…"
                        style="margin-top: 6px"
                      />
                    </td>
                    <td>
                      <select v-model="proactRows[idx].modeOfActivity">
                        <option value="">Select…</option>
                        <option>Face-to-face</option>
                        <option>Online</option>
                        <option>Blended</option>
                        <option>On-the-job</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        v-model="proactRows[idx].trainerProvider"
                        placeholder="Optional"
                      />
                    </td>
                    <td>
                      <select v-model="proactRows[idx].targetTimeline">
                        <option value="">Select…</option>
                        <option>2026</option>
                        <option>2027</option>
                        <option>2028</option>
                        <option>2029</option>
                        <option>2030</option>
                        <option>2031</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              v-if="filledGaps.length > 0"
              style="
                font-size: 13px;
                color: var(--text-light);
                margin-top: 10px;
              "
            >
              Rows are auto-generated based on gaps identified in Sections II
              &amp; III.
            </p>
          </div>
        </transition>
      </div>

      <!-- CERTIFICATION -->
      <div class="section-card section-card-collapsible">
        <div class="section-header">
          <div class="section-num">V</div>
          <div>
            <h3>Certification</h3>
            <p>Rater / Head of Office declaration</p>
          </div>
          <div v-if="!sectionDone.proact" class="section-locked-badge">
            Complete Section IV first
          </div>
        </div>
        <transition name="reveal">
          <div v-if="sectionDone.proact" class="section-body">
            <div class="certification-box">
              <p>
                I hereby certify that the information provided in this Learning
                Needs Assessment is accurate and based on actual observation,
                data, and evidence gathered from the office.
              </p>
              <div class="field-group">
                <label>Full Name of Rater / Head of Office</label>
                <div
                  class="static-value"
                  style="
                    max-width: 400px;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                  "
                >
                  {{ form.raterFullName || "—" }}
                </div>
                <small class="field-hint" style="margin-top: 6px">
                  Auto-filled from Head of Unit/Office/College in Office
                  Information. Update the name fields above to change this.
                </small>
              </div>
              <small
                style="
                  font-size: 11px;
                  color: var(--text-light);
                  display: block;
                  margin-top: 8px;
                "
              >
                Signature over Printed Name of Rater/Head of Office
              </small>
            </div>
          </div>
        </transition>
      </div>

      <!-- SUBMIT -->
      <transition name="reveal">
        <div v-if="sectionDone.certification" class="submit-area">
          <p>
            Please review your submission before finalizing. You can go back and
            edit any section if needed.
          </p>
          <button
            class="btn-submit"
            :class="{ 'btn-clicked': clickedButtons['review-submit'] }"
            :disabled="isSubmitting"
            @click="openReview"
          >
            Review &amp; Submit
          </button>
        </div>
      </transition>
    </div>
    <!-- ═══════════════════════════════════════════════ -->
    <!-- REVIEW & CONFIRM SCREEN                         -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="screen === 'review'" class="container review-container">
      <div class="review-header-block">
        <div class="review-eyebrow">USWAG PLAN — Learning Needs Assessment</div>
        <h2 class="review-title">Review Your Submission</h2>
        <p class="review-subtitle">
          Please verify all information below before submitting. Use the
          <strong>Edit</strong> buttons to go back and make changes.
        </p>
      </div>

      <!-- H: Office Information -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">H</span>
          <span class="review-card-title">Office Information</span>
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div class="review-grid">
            <div class="review-field">
              <span class="review-label">Email</span>
              <span class="review-value"
                >{{ form.submitterEmailPrefix }}@carsu.edu.ph</span
              >
            </div>
            <div class="review-field">
              <span class="review-label">Campus</span>
              <span class="review-value">CSU Main Campus</span>
            </div>
            <div class="review-field">
              <span class="review-label">Office Affiliation</span>
              <span class="review-value">{{ form.officeAffiliation }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Unit / Office / College</span>
              <span class="review-value">{{ reviewOfficeDisplay }}</span>
            </div>
            <div v-if="form.collegeProgram" class="review-field">
              <span class="review-label">Program / Department</span>
              <span class="review-value">{{ form.collegeProgram }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Head of Unit / Office / College</span>
              <span class="review-value">{{ form.raterFullName || "—" }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Position</span>
              <span class="review-value">{{ reviewPositionDisplay }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Designation</span>
              <span class="review-value">{{ form.designation || "N/A" }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Year Covered</span>
              <span class="review-value">{{ form.yearCovered }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Total Personnel</span>
              <span class="review-value">{{ form.totalPersonnel }}</span>
            </div>
            <div class="review-field">
              <span class="review-label">Purpose</span>
              <span class="review-value">{{
                form.purpose === "Other" ? form.purposeOther : form.purpose
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- I: Workforce Profile -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">I</span>
          <span class="review-card-title"
            >Workforce Profile by Employment Classification and Position
            Level</span
          >
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div class="review-table-wrap">
            <table class="review-table">
              <thead>
                <tr>
                  <th>Position Level</th>
                  <th v-for="t in employmentTypes" :key="t">{{ t }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lv in visiblePositionLevels" :key="lv.key">
                  <td class="review-row-label">{{ lv.label }}</td>
                  <td
                    v-for="t in employmentTypeKeys"
                    :key="t"
                    style="text-align: center"
                  >
                    {{ workforce[lv.key][t] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- II: Competency Summary -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">II</span>
          <span class="review-card-title"
            >Competency Mapping — Cluster Summary</span
          >
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div
            v-for="lvSummary in activeClusterSummary"
            :key="lvSummary.levelKey"
            style="margin-bottom: 24px"
          >
            <div class="review-level-label">{{ lvSummary.levelLabel }}</div>
            <div class="review-table-wrap">
              <table class="review-table">
                <thead>
                  <tr>
                    <th>Competency Cluster</th>
                    <th>Strongest Competency</th>
                    <th>Weakest Competency</th>
                    <th>Intervention Needed?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in lvSummary.rows" :key="c.cluster">
                    <td class="review-row-label">{{ c.cluster }}</td>
                    <td>{{ c.strongest || "—" }}</td>
                    <td>{{ c.weakest || "—" }}</td>
                    <td style="text-align: center">
                      <span
                        :class="
                          c.interventionNeeded === 'Yes'
                            ? 'review-badge-yes'
                            : 'review-badge-no'
                        "
                      >
                        {{ c.interventionNeeded || "—" }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- III: Data Sources & Key Insights -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">III</span>
          <span class="review-card-title">Data Sources &amp; Key Insights</span>
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div class="review-field" style="margin-bottom: 16px">
            <span class="review-label">Selected Data Sources</span>
            <div class="review-tags-row">
              <span
                v-for="src in form.selectedSources"
                :key="src"
                class="review-source-tag"
                >{{
                  src === "Others"
                    ? form.othersSourceText
                      ? "Others: " + form.othersSourceText
                      : "Others"
                    : src
                }}</span
              >
            </div>
          </div>
          <div v-if="insightRows.length > 0" class="review-table-wrap">
            <table class="review-table">
              <thead>
                <tr>
                  <th style="width: 36px">No.</th>
                  <th>Data Source</th>
                  <th>Identified Gap / Issue</th>
                  <th>Relevant Personnel</th>
                  <th>Recommended Interventions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in insightRows" :key="row.dataSource">
                  <td
                    style="
                      text-align: center;
                      color: var(--text-light);
                      font-weight: 600;
                    "
                  >
                    {{ idx + 1 }}
                  </td>
                  <td
                    class="review-row-label"
                    style="white-space: normal; font-size: 12px"
                  >
                    {{ row.dataSource }}
                  </td>
                  <td style="font-size: 12px">
                    <div
                      v-if="row.gaps && row.gaps.filter((g) => g.trim()).length"
                    >
                      <div
                        v-for="(g, gi) in row.gaps.filter((g) => g.trim())"
                        :key="gi"
                        style="margin-bottom: 4px"
                      >
                        <span
                          v-if="row.gaps.filter((g) => g.trim()).length > 1"
                          style="
                            font-weight: 600;
                            color: var(--text-light);
                            font-size: 11px;
                          "
                          >{{ gi + 1 }}. </span
                        >{{ g }}
                      </div>
                    </div>
                    <span v-else style="color: var(--text-light)">—</span>
                  </td>
                  <td style="font-size: 12px">
                    <div v-if="row.personnel && row.personnel.length">
                      <span
                        v-for="p in row.personnel"
                        :key="p"
                        class="review-personnel-tag"
                        >{{ p }}</span
                      >
                    </div>
                    <span v-else style="color: var(--text-light)">—</span>
                  </td>
                  <td style="font-size: 12px">
                    <div v-if="row.interventions && row.interventions.length">
                      <span
                        v-for="iv in row.interventions"
                        :key="iv"
                        class="review-intervention-tag"
                        >{{ iv }}</span
                      >
                    </div>
                    <span v-else style="color: var(--text-light)">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- IV: Pro-ACT -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">IV</span>
          <span class="review-card-title"
            >Professional Advancement through Capacity-Building and Trainings
            (Pro-ACT)</span
          >
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div
            v-if="allProactRows.length === 0"
            style="
              color: var(--text-light);
              font-style: italic;
              font-size: 13px;
            "
          >
            No training interventions specified.
          </div>
          <div v-else class="review-table-wrap">
            <table class="review-table">
              <thead>
                <tr>
                  <th style="width: 36px">No.</th>
                  <th>Identified Gap / Skill</th>
                  <th>Training / LeaD Intervention</th>
                  <th>Mode</th>
                  <th>Trainer / Provider</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in allProactRows" :key="idx">
                  <td
                    style="
                      text-align: center;
                      color: var(--text-light);
                      font-weight: 600;
                    "
                  >
                    {{ idx + 1 }}
                  </td>
                  <td
                    class="review-row-label"
                    style="white-space: normal; font-size: 12px"
                  >
                    {{ row.targetSkill || "—" }}
                  </td>
                  <td style="font-size: 12px">
                    {{
                      row.trainingTitle === "__others__"
                        ? row.trainingTitleOther
                        : row.trainingTitle || "—"
                    }}
                  </td>
                  <td style="font-size: 12px">
                    {{ row.modeOfActivity || "—" }}
                  </td>
                  <td style="font-size: 12px">
                    {{ row.trainerProvider || "—" }}
                  </td>
                  <td style="font-size: 12px">
                    {{ row.targetTimeline || "—" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- V: Certification -->
      <div class="review-card">
        <div class="review-card-header">
          <span class="review-card-num">V</span>
          <span class="review-card-title">Certification</span>
          <button class="btn-review-edit" @click="backToForm()">Edit</button>
        </div>
        <div class="review-card-body">
          <div class="review-cert-box">
            <p class="review-cert-text">
              I hereby certify that the information provided in this Learning
              Needs Assessment is accurate and based on actual observation,
              data, and evidence gathered from the office.
            </p>
            <div class="review-cert-name">{{ form.raterFullName || "—" }}</div>
            <div class="review-cert-sublabel">
              Signature over Printed Name of Rater / Head of Office
            </div>
          </div>
        </div>
      </div>

      <!-- Final Submission Action -->
      <div class="review-submit-area">
        <div class="review-submit-notice">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="review-notice-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>
            By clicking <strong>Confirm &amp; Submit</strong>, you certify that
            all information is accurate and based on actual office data. This
            action cannot be undone. HRMS will be notified immediately upon
            submission.
          </p>
        </div>
        <div class="review-submit-actions">
          <button
            class="btn-review-back"
            :class="{ 'btn-clicked': clickedButtons['back-edit'] }"
            @click="
              markClicked('back-edit');
              backToForm();
            "
          >
            ← Go Back &amp; Edit
          </button>
          <button
            class="btn-submit"
            :class="{ 'btn-clicked': clickedButtons['confirm-submit'] }"
            :disabled="isSubmitting"
            @click="
              markClicked('confirm-submit');
              submitForm();
            "
          >
            <span v-if="isSubmitting">Submitting…</span>
            <span v-else>Confirm &amp; Submit LNA</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ══ LEVEL TOOLTIP PORTAL (fixed, outside scroll) ══ -->
    <Teleport to="body">
      <div
        v-if="tooltipPortal.visible && tooltipPortal.levelKey"
        class="level-tooltip-portal"
        :style="{ left: tooltipPortal.x + 'px', top: tooltipPortal.y + 'px' }"
      >
        <div class="tooltip-desc">
          {{ positionLevelInfo[tooltipPortal.levelKey].description }}
        </div>
        <div class="tooltip-samples-label">Sample Positions:</div>
        <ul class="tooltip-samples">
          <li
            v-for="s in positionLevelInfo[tooltipPortal.levelKey].samples"
            :key="s"
          >
            {{ s }}
          </li>
        </ul>
      </div>
    </Teleport>

    <!-- ══ INTERVENTION DROPDOWN PORTAL (fixed, outside scroll) ══ -->
    <Teleport to="body">
      <div
        v-if="
          interventionPortal.visible && interventionPortal.rowIndex !== null
        "
        id="intervention-portal"
        class="intervention-menu-portal"
        :style="{
          left: interventionPortal.x + 'px',
          top: interventionPortal.y + 'px',
        }"
        @click.stop
      >
        <div class="intervention-group-label">On-the-Job Learning</div>
        <label
          v-for="opt in interventionOptionsOJT"
          :key="opt"
          class="intervention-option"
          :class="{
            checked:
              insightRows[interventionPortal.rowIndex]?.interventions?.includes(
                opt,
              ),
          }"
          @click.stop
        >
          <input
            type="checkbox"
            :value="opt"
            v-model="insightRows[interventionPortal.rowIndex].interventions"
          />
          {{ opt }}
        </label>
        <div class="intervention-group-label">Off-the-Job Learning</div>
        <label
          v-for="opt in interventionOptionsOffJT"
          :key="opt"
          class="intervention-option"
          :class="{
            checked:
              insightRows[interventionPortal.rowIndex]?.interventions?.includes(
                opt,
              ),
          }"
          @click.stop
        >
          <input
            type="checkbox"
            :value="opt"
            v-model="insightRows[interventionPortal.rowIndex].interventions"
          />
          {{ opt }}
        </label>
        <div class="intervention-close-row">
          <button
            type="button"
            class="intervention-done-btn"
            @click="closeInterventionPortal"
          >
            Done
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({ middleware: ['auth'] });

import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";

const { user } = useAuth();
const isSupervisor = computed(() => user.value?.isSupervisor);

const config = useRuntimeConfig();
const API = config.public.apiBase;

// ── Privacy Modal ──
const showPrivacyModal = ref(true);
const privacyAgreed = ref(false);
function acceptPrivacy() {
  if (privacyAgreed.value) showPrivacyModal.value = false;
}

const screen = ref("form");
const isSubmitting = ref(false);
const refId = ref("");

// ── EMAIL HINT STATE ──
const emailHint = reactive({ msg: "", type: "" });

// ── CONSTANTS ──
const officeOptions = [
  "OVPAF",
  "OVPAA",
  "OVPEO",
  "OVPRDIE",
  "OVPSAS",
  "Campus Director",
];

const purposeOptions = [
  "Initial Assessment",
  "Mid-Year Review",
  "Annual Review",
  "Other",
];

const employmentTypes = [
  "Permanent",
  "Temporary",
  "Contractual",
  "Casual",
  "Coterminus",
  "COS",
  "Job Order",
  "Others",
];
const employmentTypeKeys = [
  "permanent",
  "temporary",
  "contractual",
  "casual",
  "coterminus",
  "cos",
  "jobOrder",
  "others",
];

const positionLevels = [
  { key: "first", label: "First Level Positions" },
  { key: "secondNonSup", label: "Second Level (Non-Supervisory)" },
  { key: "secondSup", label: "Second Level (Supervisory)" },
  { key: "third", label: "Third Level Positions" },
  { key: "faculty", label: "Faculty Positions" },
];

// ── POSITION LEVEL TOOLTIP INFO ──
const positionLevelInfo = {
  first: {
    description:
      "Positions that involve performance of clerical, trade, crafts, custodial, or other support services. These roles are often operational in nature and focus on routine tasks that support higher-level functions.",
    samples: [
      "Administrative Aide",
      "Clerk",
      "Utility Worker",
      "Security Guard",
      "Driver",
      "Maintenance Worker",
      "Machine Operator",
      "and other related positions",
    ],
  },
  secondNonSup: {
    description:
      "Positions that involve professional, technical, or administrative tasks. Their work requires applying specialized knowledge or skills to accomplish assignments, often independently or under general supervision, without direct responsibility for managing others.",
    samples: [
      "Administrative Officer I-III",
      "Human Resource Management Officer",
      "Planning Officer",
      "Information Technology Officer",
      "Librarian",
      "Legal Assistant",
      "Accountant",
      "Budget Officer",
      "Engineer",
      "Architect",
      "Nurse",
      "Procurement Officer",
      "Supply Officer",
      "Guidance Counselor",
      "and other related positions",
    ],
  },
  secondSup: {
    description:
      "Positions that combine technical or professional tasks with supervisory responsibilities. Oversee the work of a team or section, ensuring that operational goals are met and quality standards are maintained.",
    samples: [
      "Division Chief",
      "Office Director",
      "Office Head",
      "Administrative Officer IV-V",
      "Senior Officer",
      "Lead Engineer/Architect",
      "and other related positions",
    ],
  },
  third: {
    description:
      "Positions involving high-level management, leadership, and policy-making duties. Responsible for setting strategic directions, making decisions that affect the entire institution or major units, and representing the organization in external engagements.",
    samples: [
      "University President",
      "Vice President",
      "Campus Director",
      "College Dean",
      "Chief Administrative Officer",
      "and other related positions",
    ],
  },
  faculty: {
    description:
      "Positions dedicated to academic instruction, research, extension services, and community engagement. Involved in delivering lectures, developing curricula, conducting research studies, and contributing to knowledge advancement.",
    samples: [
      "Instructor I-III",
      "Assistant Professor I-IV",
      "Associate Professor I-V",
      "Professor I-VI",
      "University Professor",
      "and other related positions",
    ],
  },
};

const compLevelHeaders = [
  "1st Level",
  "2nd level (Non-Supervisory)",
  "2nd level (Supervisory)",
  "3rd Level",
  "Faculty",
];
const compLevelKeys = [
  "first",
  "secondNonSup",
  "secondSup",
  "third",
  "faculty",
];

const activeCompTab = ref("1st Level");
const compValidated = ref(false);

const clOptions = [
  "",
  "N/A",
  "1 - Basic",
  "2 - Intermediate",
  "3 - Advanced",
  "4 - Expert",
];
const pctOptions = [
  "",
  "N/A",
  "A - 76%-100%",
  "B - 51%-75%",
  "C - 26%-50%",
  "D - 25% & below",
];

const COMPETENCIES = {
  core: [
    "Integrity",
    "Accountability",
    "Scientific & Technological Excellence",
    "Delivering Service Excellence",
    "Environmental Consciousness",
    "Building Partnership",
  ],
  leadership: [
    "Developing People",
    "Facilitating Change",
    "Conflict Management",
    "Leading Innovation",
    "Strategic Planning",
    "Leading Others",
    "Decisiveness",
  ],
  org: [
    "Teamwork",
    "Commitment to Learning",
    "Customer Focus",
    "Adaptability and Flexibility",
    "Critical Thinking",
    "Effective Communication",
    "Valuing Diversity",
    "Self-Awareness and Confidence",
    "Stress Tolerance",
    "Resource Management",
    "Knowledge Management",
    "Initiative",
    "Result Orientation",
    "Community Engagement",
    "Organizational Commitment",
    "Planning and Organizing",
    "Emotional and Psychological Maturity",
    "Safety and Risk Management",
    "Interpersonal Effectiveness",
  ],
  technical: [
    "Research Engagement",
    "Diagnostic Information Gathering",
    "Attention to Details",
    "Written Communication",
    "Oral Communication",
    "Conceptual and Analytical Thinking",
    "Computer Literacy",
    "Planning and Project Management",
    "Logical Reasoning",
  ],
};

const clusterCompetencyMap = {
  Core: COMPETENCIES.core,
  Leadership: COMPETENCIES.leadership,
  Organizational: COMPETENCIES.org,
  Technical: COMPETENCIES.technical,
};

const competencyClusters = [
  {
    key: "core",
    name: "Core",
    badge: "Core",
    note: "Foundational attributes expected of all personnel regardless of position.",
    competencies: COMPETENCIES.core,
  },
  {
    key: "leadership",
    name: "Leadership",
    badge: "Leadership",
    note: "Skills and behaviors required to effectively lead individuals, teams, and units.",
    competencies: COMPETENCIES.leadership,
  },
  {
    key: "org",
    name: "Organizational",
    badge: "Organizational",
    note: "Collective attributes that define the institution's way of working.",
    competencies: COMPETENCIES.org,
  },
  {
    key: "technical",
    name: "Technical",
    badge: "Technical",
    note: "Job-specific knowledge, skills, and abilities for effective role performance.",
    competencies: COMPETENCIES.technical,
  },
];

const dataSources = [
  {
    value: "Individual Development Plan (IDP)",
    label: "Individual Development Plan (IDP)",
  },
  {
    value: "Training Evaluation Results",
    label: "Training Evaluation Results",
  },
  {
    value: "HR Records (Coaching logs, leave patterns, discipline)",
    label: "HR Records",
  },
  { value: "IPCR/OPCR/DPCR Reviews", label: "IPCR/OPCR/DPCR Reviews" },
  {
    value: "Audit or Accreditation Results (ISO, AACCUP, etc.)",
    label: "Audit / Accreditation Results",
  },
  {
    value: "Strategic Plan or SPMS Review",
    label: "Strategic Plan / SPMS Review",
  },
  {
    value: "Focus Group Discussion (FGD)",
    label: "Focus Group Discussion (FGD)",
  },
  {
    value: "Client/Stakeholder Feedback",
    label: "Client/Stakeholder Feedback",
  },
  { value: "Risk Assessment", label: "Risk Assessment" },
  { value: "Interview", label: "Interview" },
  { value: "Questionnaire", label: "Questionnaire" },
  { value: "Test", label: "Test" },
  { value: "Others", label: "Others" },
];

// ── INTERVENTION OPTIONS ──
const interventionOptionsOJT = [
  "Observation / Demonstration",
  "Delegation",
  "Coaching",
  "Mentoring",
  "Deployment",
  "Job Rotation / Assignment",
  "Detail and Secondment",
  "Reading",
  "Flexible Learning",
  "Brainstorming / Group Discussion",
  "Experiential Learning",
];

const interventionOptionsOffJT = [
  "Special Short Courses and Lectures",
  "Conferences, Training Programs, Conventions, Seminars, and Cum Paper Presentations",
  "Pursue Higher Education",
];

// ── OFFICE/UNIT MAP ──
const subOfficeMap = {
  OVPAF: [
    "Business & Resource Management Office",
    "Corporate Enterprise Development Office",
    "Division for Administration Services",
    "Division for Campus Facility, Safety & Security Services",
    "Division for Financial Management Services",
    "Division for Resource Generation and Entrepreneurial Services",
    "Disaster Risk Reduction and Management Office",
    "Engineering & Construction Office",
    "General Services Office",
    "Human Resource Management Services",
    "Office of the Campus Safety & Security",
    "Procurement Office",
    "Records Management Office",
    "Supply and Property Management Office",
    "University Accounting Office",
    "University Budget Office",
    "University Cashiering Office",
    "University Press",
  ],
  OVPAA: [
    {
      name: "College of Agricultural and Agri-Industries (CAA)",
      programs: ["BS in Agriculture"],
    },
    {
      name: "College of Computing and Information Sciences (CCIS)",
      programs: [
        "BS in Computer Science",
        "BS in Information System",
        "BS in Information Technology",
      ],
    },
    {
      name: "College of Engineering and Geo-Sciences (CEGS)",
      programs: [
        "BS in Agricultural and Biosystems Engineering",
        "BS in Civil Engineering",
        "BS in Electronics Engineering",
        "BS in Geodetic Engineering",
        "BS in Geology",
        "BS in Mining Engineering",
      ],
    },
    {
      name: "College of Forestry and Environmental Sciences (CoFES)",
      programs: [
        "BS in Agroforestry",
        "BS in Environmental Science",
        "BS in Forestry",
      ],
    },
    {
      name: "College of Humanities and Social Sciences (CHaSS)",
      programs: [
        "Bachelor of Arts in Sociology",
        "Bachelor of Science in Psychology",
        "Bachelor of Science in Social Work",
      ],
    },
    {
      name: "College of Mathematics and Natural Sciences (CMNS)",
      programs: [
        "BS in Applied Mathematics",
        "BS in Biology",
        "BS in Chemistry",
        "BS in Marine Biology",
        "BS in Mathematics",
        "BS in Physics",
      ],
    },
    { name: "National Service Training Program (NSTP)", programs: [] },
    { name: "Office of Curriculum & Instruction Development", programs: [] },
    { name: "Office of Student Internship Programs", programs: [] },
    { name: "Office of the University Librarian", programs: [] },
    { name: "Office of the University Registrar", programs: [] },
    { name: "Professional Schools", programs: [] },
  ],
  OVPEO: [
    "Alumni Relations Office",
    "Division for Information & Public Affairs",
    "Division for Strategic Foresight and Management",
    "Management Information System",
    "Office of Internationalization and Global Engagements",
    "Office of Strategic Foresight and Futures Thinking",
    "Office of the Planning & Quality Management Services",
    "Project Management Office",
    "Public Information & Communication Office",
  ],
  OVPRDIE: [
    "Extension Services Office",
    "RDIE Publication Management Office",
    "Research & Development and Innovation Services",
    "Technology Business Incubator Office",
    "Technology Transfer & Licensing Office",
  ],
  OVPSAS: [
    "Office of the Admission & Scholarship",
    "Office of the Counselling & Career Services",
    "Office of the Student Leadership & Development",
    "Office of the Student Welfare & Engagements",
    "University Center for Culture & Arts",
    "University Center for Health & Wellness",
    "University Center for Sports & Recreation",
  ],
  "Campus Director": [
    "Alumni Relations Office",
    "Business and Resource Management Unit",
    "Campus Accounting Office",
    "Campus Budget Office",
    "Campus Cashiering Office",
    "Campus Press",
    "Corporate Enterprise Development Unit",
    "Counselling & Career Services Office",
    "Disaster Risk Reduction and Management Office",
    "Engineering & Construction Office",
    "Extension Services Office",
    "General Services Office",
    "Human Resource Management Services",
    "Management Information System",
    "National Service Training Program (NSTP)",
    "Office of Admission & Scholarship",
    "Office of Curriculum & Instruction Development",
    "Office of Internationalization and Global Engagement",
    "Office of Student Internship Programs",
    "Office of Student Leadership & Development",
    "Office of Student Welfare & Engagements",
    "Office of the Campus Librarian",
    "Office of the Campus Registrar",
    "Office of the Campus Safety & Security",
    "Office of the Planning & Quality Management Services",
    "Procurement Office",
    "Professional Schools",
    "Project Management Office",
    "Public Information & Communication Office",
    "RDIE Publication Management Office",
    "Records Management Office",
    "Research and Development and Innovation Services",
    "Supply and Property Management Office",
    "Technology Business Incubator Office",
    "Technology Transfer & Licensing Office",
    "University Center for Culture & Arts",
    "University Center for Health & Wellness",
    "University Center for Sports & Recreation",
  ],
};

// ── FORM STATE ──
const form = reactive({
  submitterEmailPrefix: "",
  submitterEmail: "",
  officeAffiliation: "",
  unitOfficeCollege: "",
  unitOfficeCollegeOther: "",
  collegeProgram: "",
  headLastName: "",
  headFirstName: "",
  headMiddleInitial: "",
  position: "",
  positionOther: "",
  designation: "",
  designationMode: "",
  yearCovered: "",
  totalPersonnel: "",
  purpose: "",
  purposeOther: "",
  selectedSources: [],
  othersSourceText: "",
  raterFullName: "",
});

// ── AUTO-CAPITALIZE ──
function autoCapitalize(field, event) {
  const input = event.target;
  const upped = input.value.toUpperCase();
  form[field] = upped;
  const pos = input.selectionStart;
  nextTick(() => {
    input.setSelectionRange(pos, pos);
  });
}

// ── COMPUTED ──
const isOVPAA = computed(() => form.officeAffiliation === "OVPAA");

const headOfUnitFull = computed(() => {
  const first = form.headFirstName.trim();
  const mi = form.headMiddleInitial.trim();
  const last = form.headLastName.trim();
  // Format: First Name, Middle Initial., Last Name
  return [first, mi ? mi + "." : "", last].filter(Boolean).join(" ");
});

// Auto-sync raterFullName whenever head of unit name fields change
watch(
  headOfUnitFull,
  (val) => {
    form.raterFullName = val;
  },
  { immediate: true },
);

const positionOptions = computed(() => {
  if (form.officeAffiliation === "OVPAA") {
    const unit = (form.unitOfficeCollege || "").toLowerCase().trim();
    if (!unit) return ["Dean", "Chairperson", "Director"];
    if (unit.startsWith("college of") || unit === "professional schools")
      return ["Dean", "Chairperson"];
    return ["Director"];
  }
  if (["OVPAF", "OVPEO", "OVPRDIE", "OVPSAS"].includes(form.officeAffiliation))
    return [
      "Chief Administrative Officer",
      "Supervising Administrative Officer",
    ];
  return [];
});

watch(positionOptions, (newOpts) => {
  if (!newOpts.includes(form.position)) {
    form.position = newOpts.length === 1 ? newOpts[0] : "";
  }
});

const visiblePositionLevels = computed(() =>
  positionLevels.filter(
    (lv) => lv.key !== "faculty" || form.officeAffiliation === "OVPAA",
  ),
);

watch(
  () => form.officeAffiliation,
  () => {
    form.unitOfficeCollege = "";
    form.collegeProgram = "";
    form.position = "";
    form.designation = "";
    form.designationMode = "";
  },
);

watch(
  () => form.unitOfficeCollege,
  () => {
    form.collegeProgram = "";
    form.position = "";
    form.designation = "";
    form.designationMode = "";
  },
);

// ── PROGRESSIVE DISCLOSURE ──
const sectionDone = computed(() => {
  const emailOk = /^[a-zA-Z0-9._%+\-]+$/.test(
    (form.submitterEmailPrefix || "").trim(),
  );
  const programRequired =
    isOVPAA.value && selectedCollegePrograms.value.length > 0;
  const designationOk =
    form.designationMode === "na" ||
    (form.designationMode === "specify" && form.designation.trim());

  const header = !!(
    emailOk &&
    form.officeAffiliation &&
    form.unitOfficeCollege &&
    (!programRequired || form.collegeProgram) &&
    form.headLastName.trim() &&
    form.headFirstName.trim() &&
    form.position &&
    designationOk &&
    form.yearCovered &&
    form.totalPersonnel !== "" &&
    form.totalPersonnel !== null &&
    form.purpose &&
    (form.purpose !== "Other" || form.purposeOther.trim())
  );

  const workforceDone = true;

  // Use the reactive computed ref instead of re-computing locally
  const activeLvKeys = activeCompLevelKeys.value;

  // If no position levels have any personnel, skip competency validation entirely
  const hasAnyPersonnel = activeLvKeys.length > 0;

  const clDataFilled =
    !hasAnyPersonnel ||
    Object.entries(competencyData).every(([, rows]) =>
      rows.every((row) =>
        activeLvKeys.every(
          (k) =>
            (row[k + "_cl"] || "").trim() !== "" &&
            (row[k + "_pct"] || "").trim() !== "",
        ),
      ),
    );

  // Cluster summary: only require completion for levels that actually have personnel
  const clusterSummaryDone =
    !hasAnyPersonnel ||
    (activeClusterSummary.value.length > 0 &&
      activeClusterSummary.value.every(({ rows }) =>
        rows.every((c) => c.strongest && c.weakest && c.interventionNeeded),
      ));

  const competency = clusterSummaryDone && clDataFilled;
  const dataSourcesDone = form.selectedSources.length > 0;
  const proactDone = dataSourcesDone;
  const certification = !!form.raterFullName.trim();

  return {
    header,
    workforce: workforceDone,
    competency,
    dataSources: dataSourcesDone,
    proact: proactDone,
    certification,
  };
});

const collegeOfficeUnitOptions = computed(() => {
  const list = subOfficeMap[form.officeAffiliation] || [];
  if (isOVPAA.value)
    return list.map((c) => (typeof c === "string" ? c : c.name));
  return list;
});

const selectedCollegePrograms = computed(() => {
  if (!isOVPAA.value) return [];
  const colleges = subOfficeMap["OVPAA"] || [];
  const found = colleges.find(
    (c) => typeof c === "object" && c.name === form.unitOfficeCollege,
  );
  return found ? found.programs : [];
});

// ── WORKFORCE ──
const workforce = reactive(
  Object.fromEntries(
    positionLevels.map((lv) => [
      lv.key,
      Object.fromEntries(employmentTypeKeys.map((t) => [t, 0])),
    ]),
  ),
);

const activeCompLevelKeys = computed(() => {
  const affiliation = form?.officeAffiliation ?? "";
  const baseKeys =
    affiliation === "OVPAA"
      ? compLevelKeys
      : compLevelKeys.filter((k) => k !== "faculty");
  return baseKeys.filter((k) => {
    const row = workforce?.[k];
    if (!row) return false;
    return employmentTypeKeys.some((t) => Number(row[t]) > 0);
  });
});

const visibleCompLevelKeys = computed(() => activeCompLevelKeys.value);
const visibleCompLevelHeaders = computed(() =>
  activeCompLevelKeys.value.map(
    (k) => compLevelHeaders[compLevelKeys.indexOf(k)],
  ),
);

watch(visibleCompLevelHeaders, (newHeaders) => {
  if (newHeaders.length > 0 && !newHeaders.includes(activeCompTab.value)) {
    activeCompTab.value = newHeaders[0];
  }
});

const makeCompRow = (comp) => ({
  competency: comp,
  ...Object.fromEntries(
    compLevelKeys.flatMap((lv) => [
      [lv + "_cl", ""],
      [lv + "_pct", ""],
    ]),
  ),
  observations: "",
});

const competencyData = reactive(
  Object.fromEntries(
    Object.entries(COMPETENCIES).map(([key, comps]) => [
      key,
      comps.map(makeCompRow),
    ]),
  ),
);

const makeClusterSummaryRows = () => [
  { cluster: "Core", strongest: "", weakest: "", interventionNeeded: "" },
  { cluster: "Leadership", strongest: "", weakest: "", interventionNeeded: "" },
  {
    cluster: "Organizational",
    strongest: "",
    weakest: "",
    interventionNeeded: "",
  },
  { cluster: "Technical", strongest: "", weakest: "", interventionNeeded: "" },
];

const clusterSummaryByLevel = reactive(
  Object.fromEntries(compLevelKeys.map((k) => [k, makeClusterSummaryRows()])),
);

const activeClusterSummary = computed(() =>
  activeCompLevelKeys.value.map((k) => ({
    levelKey: k,
    levelLabel: levelFormalLabel[k],
    rows: clusterSummaryByLevel[k],
  })),
);

const levelFormalLabel = {
  first: "First Level Positions",
  secondNonSup: "Second Level (Non-Supervisory) Positions",
  secondSup: "Second Level (Supervisory) Positions",
  third: "Third Level Positions",
  faculty: "Faculty Positions",
};

const clusterLevelNote = {
  core: {
    first:
      "Foundational attributes expected of all personnel regardless of position. These apply to First Level Positions.",
    secondNonSup:
      "Foundational attributes expected of all personnel regardless of position. These apply to Second Level (Non-Supervisory) Positions.",
    secondSup:
      "Foundational attributes expected of all personnel regardless of position. These apply to Second Level (Supervisory) Positions.",
    third:
      "Foundational attributes expected of all personnel regardless of position. These apply to Third Level Positions.",
    faculty:
      "Foundational attributes expected of all personnel regardless of position. These apply to Faculty Positions.",
  },
  leadership: {
    first:
      "Skills and behaviors required to effectively lead individuals, teams, and units. Assessed for First Level Positions.",
    secondNonSup:
      "Skills and behaviors required to effectively lead individuals, teams, and units. Assessed for Second Level (Non-Supervisory) Positions.",
    secondSup:
      "Skills and behaviors required to effectively lead individuals, teams, and units. Assessed for Second Level (Supervisory) Positions.",
    third:
      "Skills and behaviors required to effectively lead individuals, teams, and units. Assessed for Third Level Positions.",
    faculty:
      "Skills and behaviors required to effectively lead individuals, teams, and units. Assessed for Faculty Positions.",
  },
  org: {
    first:
      "Collective attributes that define the institution's way of working. Assessed for First Level Positions.",
    secondNonSup:
      "Collective attributes that define the institution's way of working. Assessed for Second Level (Non-Supervisory) Positions.",
    secondSup:
      "Collective attributes that define the institution's way of working. Assessed for Second Level (Supervisory) Positions.",
    third:
      "Collective attributes that define the institution's way of working. Assessed for Third Level Positions.",
    faculty:
      "Collective attributes that define the institution's way of working. Assessed for Faculty Positions.",
  },
  technical: {
    first:
      "Job-specific knowledge, skills, and abilities for effective role performance. Assessed for First Level Positions.",
    secondNonSup:
      "Job-specific knowledge, skills, and abilities for effective role performance. Assessed for Second Level (Non-Supervisory) Positions.",
    secondSup:
      "Job-specific knowledge, skills, and abilities for effective role performance. Assessed for Second Level (Supervisory) Positions.",
    third:
      "Job-specific knowledge, skills, and abilities for effective role performance. Assessed for Third Level Positions.",
    faculty:
      "Job-specific knowledge, skills, and abilities for effective role performance. Assessed for Faculty Positions.",
  },
};

const personnelLevelOptions = [
  "First Level Positions",
  "Second Level (Supervisory)",
  "Second Level (Non-Supervisory)",
  "Third Level Positions",
  "Faculty Positions",
];

const insightRows = reactive([]);

// ── PRO-ACT (Section IV) ──────────────────────────────────────────────────────
// Auto-generated rows — one per identified gap (from cluster summary + insight rows)
const proactRows = ref([]);

// Collect unique, non-empty gap/intervention texts from Sections II & III
const filledGaps = computed(() => {
  const gaps = new Set();
  // From cluster summary "Intervention Needed" fields (where answer is "Yes")
  activeClusterSummary.value.forEach(({ rows }) => {
    rows.forEach((r) => {
      if (r.interventionNeeded === "Yes" && r.weakest?.trim()) {
        gaps.add(r.weakest.trim());
      }
    });
  });
  // From Section III insight rows (identified gaps)
  insightRows.forEach((r) => {
    if (Array.isArray(r.gaps)) {
      r.gaps.forEach((g) => {
        if (g?.trim()) gaps.add(g.trim());
      });
    } else if (r.gap?.trim()) {
      gaps.add(r.gap.trim());
    }
  });
  return [...gaps];
});

// Keep proactRows in sync with filledGaps
watch(
  filledGaps,
  (list) => {
    while (proactRows.value.length < list.length) {
      proactRows.value.push({
        targetSkill: "",
        trainingTitle: "",
        trainingTitleOther: "",
        modeOfActivity: "",
        trainerProvider: "",
        targetTimeline: "",
      });
    }
    proactRows.value.length = list.length;
    list.forEach((gap, i) => {
      proactRows.value[i].targetSkill = gap;
    });
  },
  { immediate: true },
);

// Combined view for review screen & payload
const allProactRows = computed(() =>
  proactRows.value.map((r, i) => ({
    targetSkill: filledGaps.value[i] || r.targetSkill,
    trainingTitle: r.trainingTitle,
    trainingTitleOther: r.trainingTitleOther,
    modeOfActivity: r.modeOfActivity,
    trainerProvider: r.trainerProvider,
    targetTimeline: r.targetTimeline,
  })),
);
// ─────────────────────────────────────────────────────────────────────────────

watch(
  () => [...form.selectedSources],
  (newSources) => {
    const resolvedSources = newSources.map((val) => {
      if (val === "Others") {
        return form.othersSourceText.trim()
          ? "Others: " + form.othersSourceText.trim()
          : "Others";
      }
      return val;
    });
    for (let i = insightRows.length - 1; i >= 0; i--) {
      const row = insightRows[i];
      const isOthers = row.dataSource.startsWith("Others");
      const stillPresent = isOthers
        ? newSources.includes("Others")
        : newSources.includes(row.dataSource);
      if (!stillPresent) insightRows.splice(i, 1);
    }
    resolvedSources.forEach((src) => {
      const exists = insightRows.some(
        (r) =>
          r.dataSource === src ||
          (src.startsWith("Others") && r.dataSource.startsWith("Others")),
      );
      if (!exists)
        insightRows.push({
          dataSource: src,
          gaps: [""],
          personnel: [],
          interventions: [],
          _interventionOpen: false,
        });
    });
  },
  { deep: true },
);

watch(
  () => form.othersSourceText,
  (val) => {
    const idx = insightRows.findIndex((r) => r.dataSource.startsWith("Others"));
    if (idx !== -1) {
      insightRows[idx].dataSource = val.trim()
        ? "Others: " + val.trim()
        : "Others";
    }
  },
);

// ── METHODS ──
function validateEmail() {
  const prefix = (form.submitterEmailPrefix || "").trim();
  form.submitterEmail = prefix + "@carsu.edu.ph";
  if (!prefix) {
    emailHint.msg = "";
    emailHint.type = "";
    return false;
  }
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(prefix)) {
    emailHint.msg = "Invalid characters in email prefix.";
    emailHint.type = "error";
    return false;
  }
  emailHint.msg = "✓ Valid CarSU email";
  emailHint.type = "success";
  return true;
}

function validate() {
  const requiredFields = [
    ["yearCovered", "Year Covered"],
    ["totalPersonnel", "Total Personnel in Your Office"],
  ];
  for (const [field] of requiredFields) {
    if (!String(form[field] || "").trim()) {
      alert("Please fill in all required fields.");
      return false;
    }
  }
  if (!form.officeAffiliation) {
    alert("Office affiliation missing. Please update your profile.");
    return false;
  }
  if (!form.unitOfficeCollege) {
    alert("Office/unit missing. Please update your profile.");
    return false;
  }
  if (!form.position) {
    alert("Position missing. Please update your profile.");
    return false;
  }
  if (!form.raterFullName?.trim()) {
    alert("Head of Unit name missing. Please update your profile.");
    return false;
  }
  if (!form.purpose) {
    alert("Please select a Purpose.");
    return false;
  }
  form.submitterEmail =
    (form.submitterEmailPrefix || "").trim() + "@carsu.edu.ph";
  return true;
}

// ── REVIEW SCREEN ──
const reviewOfficeDisplay = computed(() => {
  if (form.unitOfficeCollege === "__others__")
    return form.unitOfficeCollegeOther || "—";
  return form.unitOfficeCollege || "—";
});

const reviewPositionDisplay = computed(() => {
  if (form.position === "__others__") return form.positionOther || "—";
  return form.position || "—";
});

// Tracks which buttons have been clicked (for persistent pale-yellow state)
const clickedButtons = reactive({});

function markClicked(id) {
  clickedButtons[id] = true;
}

function openReview() {
  if (!validate()) return;
  markClicked("review-submit");
  screen.value = "review";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToForm() {
  delete clickedButtons["review-submit"];
  screen.value = "form";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function submitForm() {
  if (!validate()) return;
  isSubmitting.value = true;

  let purpose =
    form.purpose === "Other" ? form.purposeOther || "Other" : form.purpose;
  let selectedSources = [...form.selectedSources];
  if (selectedSources.includes("Others")) {
    selectedSources = selectedSources.filter((v) => v !== "Others");
    if (form.othersSourceText.trim())
      selectedSources.push("Others: " + form.othersSourceText.trim());
  }

  const { user } = useAuth();
  const payload = {
    userId: user.value?.id,
    submitterEmail: form.submitterEmail,
    campus: "CSU Main Campus",
    officeAffiliation: form.officeAffiliation,
    office:
      form.unitOfficeCollege === "__others__"
        ? (form.unitOfficeCollegeOther || "Others").trim()
        : form.unitOfficeCollege.trim(),
    collegeProgram: form.collegeProgram.trim(),
    headOfUnit: headOfUnitFull.value,
    position:
      form.position === "__others__"
        ? (form.positionOther || "Others").trim()
        : form.position.trim(),
    designation: form.designation.trim(),
    yearCovered: form.yearCovered.trim(),
    totalPersonnel: form.totalPersonnel,
    purpose,
    workforceProfile: workforce,
    coreCompetencies: competencyData.core,
    leadershipComps: competencyData.leadership,
    orgComps: competencyData.org,
    technicalComps: competencyData.technical,
    clusterSummaryRaw: Object.fromEntries(
      activeCompLevelKeys.value.map((k) => [k, clusterSummaryByLevel[k]]),
    ),
    dataSourcesRaw: selectedSources,
    dataSourceInsights: insightRows.map((r) => ({
      dataSource: r.dataSource,
      gap: Array.isArray(r.gaps)
        ? r.gaps.filter((g) => g.trim()).join("\n")
        : r.gaps || "",
      personnel: Array.isArray(r.personnel)
        ? r.personnel.join(", ")
        : r.personnel,
      interventions: Array.isArray(r.interventions)
        ? r.interventions.join("; ")
        : r.interventions,
    })),
    proactRows: allProactRows.value.map((r) => ({
      targetSkill: r.targetSkill,
      trainingTitle:
        r.trainingTitle === "__others__"
          ? r.trainingTitleOther || "Others"
          : r.trainingTitle,
      modeOfActivity: r.modeOfActivity,
      trainerProvider: r.trainerProvider,
      targetTimeline: r.targetTimeline,
    })),
  };

  try {
    const res = await fetch(`${API}/lna`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.refId) {
      refId.value = data.refId;
      screen.value = "success";
    } else {
      alert("Submission failed: " + (data.error || "Unknown error"));
    }
  } catch {
    alert("Network error. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
}

// ── LEVEL TOOLTIP PORTAL ──
const tooltipPortal = reactive({
  visible: false,
  x: 0,
  y: 0,
  levelKey: null,
});

function showTooltip(event, levelKey) {
  const rect = event.currentTarget.getBoundingClientRect();
  tooltipPortal.visible = true;
  tooltipPortal.levelKey = levelKey;

  const TOOLTIP_WIDTH = 360;
  const TOOLTIP_EST_HEIGHT = 320; // generous estimate so it never clips
  const GAP = 8;
  const VIEWPORT_W = window.innerWidth;
  const VIEWPORT_H = window.innerHeight;

  // Horizontal: prefer left-aligned to trigger, clamp so it never overflows right edge
  let x = rect.left;
  if (x + TOOLTIP_WIDTH > VIEWPORT_W - 12) {
    x = VIEWPORT_W - TOOLTIP_WIDTH - 12;
  }
  if (x < 8) x = 8;

  // Vertical: open below if there's room, otherwise flip above
  let y;
  const spaceBelow = VIEWPORT_H - rect.bottom - GAP;
  const spaceAbove = rect.top - GAP;
  if (spaceBelow >= TOOLTIP_EST_HEIGHT || spaceBelow >= spaceAbove) {
    // enough room below — or more room below than above
    y = rect.bottom + GAP;
  } else {
    // flip above: anchor bottom of tooltip to top of trigger
    y = rect.top - GAP - TOOLTIP_EST_HEIGHT;
    if (y < 8) y = 8;
  }

  tooltipPortal.x = x;
  tooltipPortal.y = y;
}

function hideTooltip() {
  tooltipPortal.visible = false;
  tooltipPortal.levelKey = null;
}

// ── INTERVENTION PORTAL ──
const interventionPortal = reactive({
  visible: false,
  x: 0,
  y: 0,
  rowIndex: null,
});

function openInterventionPortal(event, idx) {
  const rect = event.currentTarget.getBoundingClientRect();
  insightRows.forEach((r) => (r._interventionOpen = false));
  if (interventionPortal.visible && interventionPortal.rowIndex === idx) {
    closeInterventionPortal();
    return;
  }

  const MENU_WIDTH = 340;
  const MENU_EST_HEIGHT = 520; // covers all OJT + OffJT options with no scroll
  const GAP = 6;
  const VIEWPORT_W = window.innerWidth;
  const VIEWPORT_H = window.innerHeight;

  // Horizontal: align to trigger left, clamp to viewport
  let x = rect.left;
  if (x + MENU_WIDTH > VIEWPORT_W - 12) {
    x = VIEWPORT_W - MENU_WIDTH - 12;
  }
  if (x < 8) x = 8;

  // Vertical: prefer opening upward (above the trigger) since table rows are near bottom
  const spaceAbove = rect.top - GAP;
  const spaceBelow = VIEWPORT_H - rect.bottom - GAP;

  let y;
  if (spaceAbove >= MENU_EST_HEIGHT) {
    // open above — bottom of menu sits at top of trigger
    y = rect.top - MENU_EST_HEIGHT - GAP;
  } else if (spaceBelow >= MENU_EST_HEIGHT) {
    // open below only if there's genuinely enough space
    y = rect.bottom + GAP;
  } else {
    // not enough space either way — anchor to top of viewport with a small margin
    y = Math.max(8, rect.top - MENU_EST_HEIGHT - GAP);
  }

  interventionPortal.visible = true;
  interventionPortal.rowIndex = idx;
  interventionPortal.x = x;
  interventionPortal.y = y;
}

function closeInterventionPortal() {
  interventionPortal.visible = false;
  interventionPortal.rowIndex = null;
}

onMounted(async () => {
  // ── Auto-fill from user profile ──────────────────────────────────
  if (user.value) {
    form.submitterEmailPrefix =
      user.value.email?.replace("@carsu.edu.ph", "") || "";
    form.officeAffiliation = user.value.officeAffiliation || "";
    await nextTick();
    form.unitOfficeCollege = user.value.collegeOfficeUnit || "";
    form.collegeProgram = user.value.collegeProgram || "";
    await nextTick();
    form.position = user.value.currentPosition || "";

    // ── Fix designation ──────────────────────────────────────
    form.designation = user.value.designation || "";
    form.designationMode =
      user.value.designation === "N/A"
        ? "na"
        : user.value.designation
          ? "specify"
          : "na"; // ← default to 'na' so it's never empty

    // ── Head of Unit = Supervisor = Rater (same person) ───────
    // Prefer the structured supervisor fields from the person's profile
    // (set on the Profile page), since they're reliable and not string-parsed.
    // Fall back to a previously-saved headOfUnit string only if no
    // supervisor info exists yet.
   form.headFirstName = user.value.firstName || "";
form.headLastName = user.value.lastName || "";
form.headMiddleInitial = user.value.middleInitial || "";
  }

  document.addEventListener("click", (e) => {
    if (interventionPortal.visible) {
      const portal = document.getElementById("intervention-portal");
      const triggers = document.querySelectorAll(
        ".intervention-trigger-portal",
      );
      let clickedInside = portal && portal.contains(e.target);
      triggers.forEach((t) => {
        if (t.contains(e.target)) clickedInside = true;
      });
      if (!clickedInside) closeInterventionPortal();
    }
  });
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap");

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
  cursor: pointer;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;
}
.btn-privacy-decline:hover {
  background: #f5f5f0;
  border-color: #aaa;
  color: #444;
}
.btn-privacy-decline:active {
  background: #fdf9e3;
  border-color: #e0c84a;
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
  transition:
    background 0.18s,
    transform 0.1s;
}
.btn-privacy-agree:not(:disabled):hover {
  background: #2d6a3f;
  transform: translateY(-1px);
}
.btn-privacy-agree:not(:disabled):active {
  background: #fdf9e3;
  color: #1a4d2e;
  transform: none;
}
.btn-privacy-agree:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

:root {
  --navy: #1a4d2e;
  --navy-mid: #2d6a3f;
  --gold: #f5c300;
  --gold-light: #ffd740;
  --cream: #faf8f4;
  --white: #ffffff;
  --text: #1a1a2e;
  --text-light: #5a6070;
  --border: #d8d4c8;
  --error: #c0392b;
  --success: #1a6b3c;
  --input-bg: #f8f7f4;
  --shadow: 0 4px 24px rgba(26, 77, 46, 0.1);
  --shadow-sm: 0 2px 8px rgba(26, 77, 46, 0.07);
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-nav {
  background: var(--navy);
  padding: 0 28px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.page-nav a.back-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color 0.2s;
  position: relative;
}
.page-nav a.back-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.page-nav a.back-link:hover {
  color: #fff;
}
.page-nav a.back-link:hover::after {
  transform: scaleX(1);
}
.page-nav a.back-link svg {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
  flex-shrink: 0;
  opacity: 0.8;
}
.page-nav a.back-link:hover svg {
  transform: translateX(-3px);
  opacity: 1;
}
.nav-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
  margin: 0 10px;
  user-select: none;
}
.nav-current {
  font-size: 12.5px;
  color: var(--gold);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 48px 40px 80px;
}

.form-title-block {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 3px solid var(--navy);
}
.form-title-block .eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 10px;
}
.form-title-block h2 {
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  color: var(--navy);
  margin-bottom: 4px;
}
.form-title-block h3 {
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  color: var(--text-light);
  font-weight: 600;
  font-style: italic;
  margin-bottom: 8px;
}
.form-title-block p {
  color: var(--text-light);
  font-size: 14px;
}

.section-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 28px;
  overflow: hidden;
  border: 1px solid var(--border);
  animation: fadeUp 0.4s ease both;
}
.section-header {
  background: var(--navy);
  padding: 16px 28px;
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
  color: var(--white);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.section-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 1px;
}
.section-body {
  padding: 36px;
}

.field-grid {
  display: grid;
  gap: 18px;
}
.field-grid-2 {
  grid-template-columns: 1fr 1fr;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-group.span-2 {
  grid-column: span 2;
}

label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.req {
  color: var(--error);
  margin-left: 2px;
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: var(--text);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(26, 77, 46, 0.08);
  background: var(--white);
}
input.error {
  border-color: var(--error);
}
textarea {
  resize: vertical;
  min-height: 72px;
}

/* ── Email prefix ── */
.email-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  overflow: hidden;
  transition: border-color 0.2s;
}
.email-prefix-wrapper:focus-within {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(26, 77, 46, 0.08);
  background: var(--white);
}
.email-prefix-wrapper.error {
  border-color: var(--error);
}
.email-prefix-wrapper.valid {
  border-color: var(--success);
}
.email-prefix-input {
  flex: 1;
  border: none !important;
  background: transparent !important;
  border-radius: 0 !important;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--text);
  outline: none;
  box-shadow: none !important;
}
.email-suffix {
  padding: 10px 12px 10px 10px;
  font-size: 13px;
  color: var(--text-light);
  white-space: nowrap;
  font-weight: 500;
  background: transparent;
  border-left: 1.5px solid var(--border);
}
.email-hint {
  font-size: 12px;
  margin-top: 2px;
  min-height: 16px;
  display: block;
}
.email-hint.error {
  color: var(--error);
}
.email-hint.success {
  color: var(--success);
}

/* ── Name row ── */
.name-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.name-sub {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.name-sub-mi {
  flex: 0 0 80px;
}
.name-sub-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Designation toggle ── */
.designation-toggle {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  transition: all 0.18s;
  font-size: 13px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  color: var(--text);
}
.checkbox-item:hover {
  border-color: var(--navy);
  background: var(--white);
}
.checkbox-item:active {
  background: #fdf9e3;
  border-color: #e0c84a;
}
.checkbox-item input {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: var(--navy);
  cursor: pointer;
}
.checkbox-item.checked {
  border-color: #c8a800;
  background: #fffbe6;
}

.other-specify {
  margin-top: 10px;
  display: none;
}
.other-specify.visible {
  display: block;
}

.section-desc {
  background: rgba(245, 195, 0, 0.1);
  border-left: 3px solid var(--gold);
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.6;
}
.section-desc a {
  color: var(--navy);
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 8px;
}
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
}
.data-table thead tr {
  background: var(--navy-mid);
}
.data-table thead th {
  padding: 10px 12px;
  color: var(--white);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}
.data-table thead th:last-child {
  border-right: none;
}
.data-table tbody tr {
  border-bottom: 1px solid var(--border);
}
.data-table tbody tr:nth-child(even) {
  background: #faf9f6;
}
.data-table tbody td {
  padding: 8px 10px;
  vertical-align: middle;
  border-right: 1px solid var(--border);
}
.data-table tbody td:last-child {
  border-right: none;
}
.data-table td input,
.data-table td select,
.data-table td textarea {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
}
.data-table td textarea {
  min-height: 56px;
}
.row-label {
  font-weight: 600;
  color: var(--navy-mid);
  background: rgba(26, 77, 46, 0.03) !important;
  white-space: nowrap;
}

/* ── Dynamic table (Pro-ACT) — mirrors IDP style ── */
.dynamic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 700px;
}
.dynamic-table thead tr {
  background: var(--navy-mid);
}
.dynamic-table thead th {
  padding: 10px 12px;
  color: var(--white);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}
.dynamic-table thead th:last-child {
  border-right: none;
}
.dynamic-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.dynamic-table tbody tr:hover {
  background: #f5f4f0;
}
.dynamic-table tbody td {
  padding: 8px 10px;
  vertical-align: top;
  border-right: 1px solid var(--border);
}
.dynamic-table tbody td:last-child {
  border-right: none;
  text-align: center;
}
.dynamic-table td input,
.dynamic-table td select,
.dynamic-table td textarea {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
}

/* ── Row number cell ── */
.row-num-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  vertical-align: middle;
}

/* ── Add / Remove row buttons ── */
.btn-add-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--navy);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: "Roboto", sans-serif;
}
.btn-add-row:hover {
  background: var(--navy-mid);
}
.btn-remove-row {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--error);
  padding: 4px;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1;
  transition: background 0.15s;
}
.btn-remove-row:hover {
  background: rgba(192, 57, 43, 0.08);
}

.workforce-table th,
.workforce-table td {
  text-align: center;
}
.workforce-table td:first-child {
  text-align: left;
}

/* ── Position level tooltip ── */
.level-tooltip-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: default;
}
.level-tooltip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--navy-mid);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  cursor: help;
}
.level-tooltip-box {
  display: none;
  position: absolute;
  left: 0;
  top: calc(100% + 8px);
  z-index: 200;
  width: 340px;
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(26, 77, 46, 0.15);
  padding: 14px 16px;
  font-weight: 400;
  color: var(--text);
  white-space: normal;
  text-transform: none;
  letter-spacing: 0;
}
.level-tooltip-wrap:hover .level-tooltip-box {
  display: block;
}
.tooltip-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 10px;
}
.tooltip-samples-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
.tooltip-samples {
  padding-left: 16px;
  margin: 0;
}
.tooltip-samples li {
  font-size: 12px;
  color: var(--text);
  line-height: 1.7;
}

.comp-table-wrap {
  margin-bottom: 32px;
}
.comp-cluster-label {
  background: var(--navy);
  color: var(--white);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cluster-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(245, 195, 0, 0.2);
  border: 1px solid rgba(245, 195, 0, 0.4);
  color: var(--gold-light);
  padding: 3px 10px;
  border-radius: 20px;
}
.comp-note {
  font-size: 12px;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 8px;
}
.cluster-summary-table thead th:first-child {
  width: 140px;
}

.source-checklist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}
.source-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  color: var(--text);
}
.source-item:hover {
  border-color: var(--navy);
  background: var(--white);
}
.source-item:active {
  background: #fdf9e3;
  border-color: #e0c84a;
}
.source-item input {
  accent-color: var(--navy);
  cursor: pointer;
  flex-shrink: 0;
  width: auto;
  padding: 0;
  border: none;
  background: none;
}
.source-item.checked {
  border-color: #c8a800;
  background: #fffbe6;
}

.certification-box {
  background: rgba(201, 168, 76, 0.08);
  border: 1.5px solid var(--gold);
  border-radius: 10px;
  padding: 24px 28px;
  margin-top: 8px;
}
.certification-box p {
  font-size: 13px;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 16px;
}

.submit-area {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 36px;
  text-align: center;
  box-shadow: var(--shadow-sm);
}
.submit-area p {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 18px;
}
.btn-submit {
  padding: 14px 48px;
  background: var(--navy);
  color: var(--white);
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition:
    background 0.18s,
    transform 0.15s,
    box-shadow 0.18s,
    color 0.18s;
  box-shadow: 0 4px 16px rgba(26, 77, 46, 0.2);
}
.btn-submit:hover:not(:disabled) {
  background: var(--navy-mid);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26, 77, 46, 0.25);
}
.btn-submit:active:not(:disabled) {
  background: #fdf9e3;
  color: #1a4d2e;
  transform: none;
  box-shadow: 0 2px 8px rgba(26, 77, 46, 0.15);
}
.btn-submit:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(13, 27, 62, 0.6);
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
.overlay p {
  color: var(--white);
  font-size: 15px;
}

.success-screen {
  display: none;
  max-width: 560px;
  margin: 80px auto;
  text-align: center;
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.success-screen.active {
  display: block;
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
.success-screen h2 {
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: var(--navy);
  margin-bottom: 12px;
}
.success-screen p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 20px;
}
.ref-id-box {
  background: var(--navy);
  color: #fff;
  font-family: monospace;
  font-size: 22px;
  font-weight: 700;
  padding: 16px 24px;
  border-radius: 10px;
  letter-spacing: 0.1em;
  margin: 16px 0 24px;
}

.subsection-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 28px 0;
}
.subsec-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.static-value {
  background: #f0ede8;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
}

@media (max-width: 640px) {
  .container {
    padding: 24px 16px 60px;
  }
  .field-grid-2 {
    grid-template-columns: 1fr;
  }
  .field-group.span-2 {
    grid-column: span 1;
  }
  .section-body {
    padding: 24px 20px;
  }
  .page-nav {
    padding: 0 16px;
  }
  .nav-current,
  .nav-sep {
    display: none;
  }
  .source-checklist {
    grid-template-columns: 1fr 1fr;
  }
  .name-row {
    flex-direction: column;
  }
  .name-sub-mi {
    flex: unset;
    width: 100%;
  }
  .level-tooltip-box {
    width: 260px;
  }
}

/* ── Competency tabs ── */
.comp-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 12px;
}
.comp-tab {
  padding: 8px 18px;
  border: 1.5px solid var(--border);
  border-radius: 8px 8px 0 0;
  background: var(--input-bg);
  color: var(--text-light);
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.02em;
}
.comp-tab:hover {
  border-color: var(--navy);
  color: var(--navy);
  background: var(--white);
}
.comp-tab:active {
  background: #fdf9e3;
  border-color: #e0c84a;
  color: #1a4d2e;
}
.comp-tab.active {
  background: var(--navy);
  color: var(--white);
  border-color: var(--navy);
}

.comp-tab-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 14px 0 4px;
  border-top: 1px solid var(--border);
}
.btn-tab-nav {
  padding: 8px 20px;
  background: var(--navy);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s,
    color 0.18s;
}
.btn-tab-nav:hover:not(:disabled) {
  background: var(--navy-mid);
}
.btn-tab-nav:active:not(:disabled) {
  background: #fdf9e3;
  color: #1a4d2e;
}
.btn-tab-nav:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.comp-tab-page {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
}

.comp-page-table .comp-select {
  width: 100%;
  min-width: 160px;
  font-size: 13px;
}

/* ── Reveal transition ── */
.reveal-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Badges ── */
.section-done-badge {
  margin-left: auto;
  background: rgba(26, 107, 60, 0.15);
  color: #1a6b3c;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.section-card-collapsible .section-header {
  flex-wrap: wrap;
}
.section-locked-badge {
  margin-left: auto;
  background: #f0ece0;
  color: var(--text-light);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
  white-space: nowrap;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Competency validation ── */
.comp-select-error {
  border-color: var(--error, #c0392b) !important;
  background: rgba(192, 57, 43, 0.04) !important;
}
.comp-field-error {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--error, #c0392b);
  margin-top: 3px;
  letter-spacing: 0.03em;
}
.comp-caption {
  font-size: 12px;
  color: var(--text-light, #5a6070);
  font-style: italic;
  line-height: 1.5;
}

.cluster-summary-level-label {
  font-family: "Roboto", sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 6px;
  padding: 6px 10px;
  background: rgba(26, 77, 46, 0.07);
  border-left: 3px solid var(--navy);
  border-radius: 0 4px 4px 0;
}

/* ── Personnel checkboxes ── */
.personnel-checks {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 220px;
}
.personnel-check-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 9px;
  border: 1.5px solid var(--border, #d8d4c8);
  border-radius: 6px;
  background: var(--input-bg, #f8f7f3);
  font-size: 12px;
  font-weight: 500;
  color: var(--text, #1a1a2e);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.personnel-check-item:hover {
  border-color: var(--navy, #1a4d2e);
  background: var(--white, #fff);
}
.personnel-check-item:active {
  background: #fdf9e3;
  border-color: #e0c84a;
}
.personnel-check-item.checked {
  border-color: #c8a800;
  background: #fffbe6;
}
.personnel-check-item input[type="checkbox"] {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: var(--navy, #1a4d2e);
  cursor: pointer;
  flex-shrink: 0;
}

/* ── Rating Scale Tables ── */
.rating-scale-tables {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 5px;
}
.rating-scale-table {
  flex: 1;
  min-width: 200px;
  border-collapse: collapse;
  font-size: 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.rating-scale-table thead th {
  background: var(--navy-mid);
  color: var(--white);
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 5px 10px;
  text-align: center;
}
.rating-scale-table tbody tr {
  border-bottom: 1px solid var(--border);
}
.rating-scale-table tbody tr:last-child {
  border-bottom: none;
}
.rating-scale-table tbody tr:nth-child(even) {
  background: #faf9f6;
}
.rating-num {
  width: 36px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  color: var(--white);
  background: var(--navy) !important;
  padding: 5px 10px;
}
.rating-label {
  width: 110px;
  font-weight: 600;
  color: var(--navy-mid);
  padding: 8px 10px;
  white-space: nowrap;
  border-right: 1px solid var(--border);
}
.rating-desc {
  padding: 8px 12px;
  color: var(--text);
  line-height: 1;
}

/* ══════════════════════════════════════════════════
   INTERVENTION TAG DROPDOWN — UPDATED
   ══════════════════════════════════════════════════ */

.intervention-dropdown {
  position: relative;
  min-width: 260px;
}

/* Tags sit ABOVE the trigger */
.intervention-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 7px;
}

.intervention-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(26, 77, 46, 0.1);
  border: 1px solid rgba(26, 77, 46, 0.3);
  color: var(--navy);
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px 3px 10px;
  border-radius: 20px;
  line-height: 1.4;
  transition: background 0.15s;
}

.intervention-tag:hover {
  background: rgba(26, 77, 46, 0.15);
}

.tag-remove {
  background: none;
  border: none;
  color: var(--navy);
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.45;
  transition: opacity 0.15s;
  margin-left: 2px;
}

.tag-remove:hover {
  opacity: 1;
}

/* Trigger button */
.intervention-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 11px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg);
  cursor: pointer;
  font-size: 13px;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
  user-select: none;
}

.intervention-trigger:hover,
.intervention-dropdown.open .intervention-trigger {
  border-color: var(--navy);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(26, 77, 46, 0.07);
}

.intervention-placeholder {
  color: var(--text-light);
  font-style: italic;
  font-size: 12.5px;
}

.intervention-chevron {
  width: 14px;
  height: 14px;
  stroke: var(--text-light);
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
}

.intervention-chevron.rotated {
  transform: rotate(180deg);
}

/* Full panel — NO max-height, NO overflow-y, all options fully visible */
.intervention-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 500;
  background: var(--white);
  border: 1.5px solid var(--navy);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(26, 77, 46, 0.18);
  min-width: 300px;
  /* intentionally no max-height or overflow */
}

.intervention-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--gold-light);
  background: transparent;
  padding: 7px 14px;
}

.intervention-group-label:first-child {
  border-radius: 0;
  margin-top: 0;
}

.intervention-option {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 400;
  color: var(--text);
  text-transform: none;
  letter-spacing: 0;
  cursor: pointer;
  transition: background 0.13s;
  line-height: 1.45;
  border-bottom: 1px solid rgba(216, 212, 200, 0.4);
}

.intervention-option:last-of-type {
  border-bottom: none;
}

.intervention-option:hover {
  background: rgba(26, 77, 46, 0.06);
}

.intervention-option.checked {
  background: rgba(26, 77, 46, 0.09);
  color: var(--navy);
  font-weight: 600;
}

.intervention-option input[type="checkbox"] {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: var(--navy);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Done button row at bottom of panel */
.intervention-close-row {
  padding: 9px 14px 10px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border);
  background: #faf9f6;
  border-radius: 0 0 10px 10px;
}

.intervention-done-btn {
  padding: 6px 20px;
  background: var(--navy);
  color: var(--white);
  border: none;
  border-radius: 7px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition:
    background 0.18s,
    transform 0.1s,
    color 0.18s;
}

.intervention-done-btn:hover {
  background: var(--navy-mid);
  transform: translateY(-1px);
}

.intervention-done-btn:active {
  background: #fdf9e3;
  color: #1a4d2e;
  transform: none;
}

/* ── Tooltip portal (fixed, outside any scroll) ── */
.level-tooltip-portal {
  position: fixed;
  z-index: 9999;
  width: 340px;
  background: #fff;
  border: 1.5px solid var(--border, #d8d4c8);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(26, 77, 46, 0.15);
  padding: 14px 16px;
  font-weight: 400;
  color: var(--text, #333);
  pointer-events: none;
}

/* ── Intervention menu portal (fixed, outside scroll) ── */
.intervention-menu-portal {
  position: fixed;
  z-index: 9999;
  background: var(--white, #fff);
  border: 1.5px solid var(--navy, #1a4d2e);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(26, 77, 46, 0.18);
  min-width: 300px;
}
</style>

<!-- Global styles for Teleport portals (must be non-scoped to apply outside component root) -->
<style>
/* ── Level tooltip portal ── */
.level-tooltip-portal {
  position: fixed;
  z-index: 9999;
  width: 360px;
  background: #fff;
  border: 1.5px solid #d8d4c8;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(26, 77, 46, 0.18);
  padding: 14px 16px;
  font-weight: 400;
  color: #1a1a2e;
  pointer-events: none;
  font-family: "Roboto", sans-serif;
  font-size: 13px;
}
.level-tooltip-portal .tooltip-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #5a6070;
  margin-bottom: 10px;
}
.level-tooltip-portal .tooltip-samples-label {
  font-size: 11px;
  font-weight: 700;
  color: #1a4d2e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
.level-tooltip-portal .tooltip-samples {
  padding-left: 16px;
  margin: 0;
}
.level-tooltip-portal .tooltip-samples li {
  font-size: 12px;
  color: #1a1a2e;
  line-height: 1.7;
}

/* ── Persistent pale-yellow after click ── */
.btn-clicked,
.btn-clicked:hover,
.btn-clicked:focus {
  background: #fdf9e3 !important;
  color: #1a4d2e !important;
  border-color: #e0c84a !important;
  box-shadow: 0 2px 8px rgba(224, 200, 74, 0.3) !important;
  transform: none !important;
}

/* ── Intervention portal option active state ── */
.intervention-option:active {
  background: #fdf9e3 !important;
}

/* ══════════════════════════════════════════════════
   REVIEW SCREEN
   ══════════════════════════════════════════════════ */
.review-container {
  padding-top: 40px;
  padding-bottom: 80px;
}
.review-header-block {
  text-align: center;
  margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 3px solid var(--navy);
}
.review-eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}
.review-title {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  color: var(--navy);
  margin-bottom: 8px;
}
.review-subtitle {
  font-size: 14px;
  color: var(--text-light);
}
.review-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
  overflow: hidden;
}
.review-card-header {
  background: var(--navy);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.review-card-num {
  background: var(--gold);
  color: var(--navy);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}
.review-card-title {
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  flex: 1;
}
.btn-review-edit {
  margin-left: auto;
  padding: 5px 16px;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 7px;
  color: var(--white);
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;
  flex-shrink: 0;
}
.btn-review-edit:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.85);
}
.btn-review-edit:active {
  background: #fdf9e3;
  border-color: #e0c84a;
  color: #1a4d2e;
}
.review-card-body {
  padding: 24px 28px;
}
.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.review-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.review-label {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.review-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
.review-table-wrap {
  overflow-x: auto;
  margin-top: 4px;
}
.review-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.review-table thead tr {
  background: var(--navy-mid);
}
.review-table thead th {
  padding: 9px 12px;
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}
.review-table thead th:last-child {
  border-right: none;
}
.review-table tbody tr {
  border-bottom: 1px solid var(--border);
}
.review-table tbody tr:nth-child(even) {
  background: #faf9f6;
}
.review-table tbody td {
  padding: 8px 12px;
  vertical-align: middle;
  border-right: 1px solid var(--border);
}
.review-table tbody td:last-child {
  border-right: none;
}
.review-row-label {
  font-weight: 600;
  color: var(--navy-mid);
  background: rgba(26, 77, 46, 0.03) !important;
  white-space: nowrap;
}
.review-level-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--navy);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  padding: 5px 10px;
  background: rgba(26, 77, 46, 0.07);
  border-left: 3px solid var(--navy);
  border-radius: 0 4px 4px 0;
}
.review-badge-yes {
  background: rgba(26, 107, 60, 0.12);
  color: #1a6b3c;
  font-weight: 700;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
}
.review-badge-no {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
  font-weight: 700;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  display: inline-block;
}
.review-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.review-source-tag {
  background: rgba(26, 77, 46, 0.08);
  border: 1px solid rgba(26, 77, 46, 0.2);
  color: var(--navy);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
.review-personnel-tag {
  display: inline-block;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin: 2px 3px 2px 0;
}
.review-intervention-tag {
  display: inline-block;
  background: rgba(26, 77, 46, 0.08);
  border: 1px solid rgba(26, 77, 46, 0.2);
  color: var(--navy);
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin: 2px 3px 2px 0;
}
.review-cert-box {
  background: rgba(201, 168, 76, 0.08);
  border: 1.5px solid var(--gold);
  border-radius: 10px;
  padding: 20px 24px;
}
.review-cert-text {
  font-size: 13px;
  color: var(--text-light);
  font-style: italic;
  margin-bottom: 14px;
  line-height: 1.6;
}
.review-cert-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: 0.03em;
  border-bottom: 2px solid var(--navy);
  display: inline-block;
  padding-bottom: 2px;
  margin-bottom: 4px;
}
.review-cert-sublabel {
  font-size: 11px;
  color: var(--text-light);
}
.review-submit-area {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px 36px;
  box-shadow: var(--shadow-sm);
  margin-top: 8px;
}
.review-submit-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(245, 195, 0, 0.1);
  border: 1px solid rgba(245, 195, 0, 0.4);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 24px;
}
.review-notice-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #c89b00;
  margin-top: 2px;
}
.review-submit-notice p {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
}
.review-submit-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}
.btn-review-back {
  padding: 12px 28px;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  color: var(--text-light);
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;
}
.btn-review-back:hover {
  background: #f5f3ee;
  border-color: var(--navy);
  color: var(--navy);
}
.btn-review-back:active {
  background: #fdf9e3;
  border-color: #e0c84a;
  color: #1a4d2e;
}

.intervention-menu-portal {
  position: fixed;
  z-index: 9999;
  background: #ffffff;
  border: 1.5px solid #1a4d2e;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(26, 77, 46, 0.18);
  min-width: 340px;
  max-height: none;
  overflow: visible;
  font-family: "Roboto", sans-serif;
}
.intervention-menu-portal .intervention-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #ffd740;
  background: #1a4d2e;
  padding: 7px 14px;
}
.intervention-menu-portal .intervention-group-label:first-child {
  border-radius: 10px 10px 0 0;
}
.intervention-menu-portal .intervention-option {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 400;
  color: #1a1a2e;
  cursor: pointer;
  transition: background 0.13s;
  line-height: 1.45;
  border-bottom: 1px solid rgba(216, 212, 200, 0.4);
}
.intervention-menu-portal .intervention-option:hover {
  background: rgba(26, 77, 46, 0.06);
}
.intervention-menu-portal .intervention-option.checked {
  background: #fffbe6;
  color: #7a6000;
  font-weight: 600;
}
.intervention-menu-portal .intervention-option input[type="checkbox"] {
  width: auto;
  padding: 0;
  border: none;
  background: none;
  accent-color: #1a4d2e;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}
.intervention-menu-portal .intervention-close-row {
  padding: 9px 14px 10px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #d8d4c8;
  background: #faf9f6;
  border-radius: 0 0 10px 10px;
}
.intervention-menu-portal .intervention-done-btn {
  padding: 6px 20px;
  background: #1a4d2e;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition:
    background 0.18s,
    transform 0.1s,
    color 0.18s;
}
.intervention-menu-portal .intervention-done-btn:hover {
  background: #2d6a3f;
  transform: translateY(-1px);
}
.intervention-menu-portal .intervention-done-btn:active {
  background: #fdf9e3;
  color: #1a4d2e;
  transform: none;
}

/* ── Multi-gap inputs ── */
.gap-inputs-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.gap-input-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
}
.gap-input-row textarea {
  flex: 1;
  min-width: 0;
}
.gap-remove-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 4px;
  padding: 0;
  background: rgba(192, 57, 43, 0.08);
  border: 1px solid rgba(192, 57, 43, 0.3);
  border-radius: 50%;
  color: #c0392b;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.gap-remove-btn:hover {
  background: rgba(192, 57, 43, 0.18);
  border-color: #c0392b;
}
.gap-add-btn {
  align-self: flex-start;
  padding: 4px 10px;
  background: rgba(26, 77, 46, 0.07);
  border: 1px dashed rgba(26, 77, 46, 0.4);
  border-radius: 6px;
  color: var(--navy);
  font-family: "Roboto", sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.gap-add-btn:hover {
  background: rgba(26, 77, 46, 0.14);
  border-color: var(--navy);
}

.proact-skill-label {
  background: rgba(0, 51, 0, 0.07);
  border: 1.5px solid rgba(0, 51, 0, 0.25);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--navy);
  font-weight: 600;
  min-width: 160px;
}
</style>