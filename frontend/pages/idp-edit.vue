<template>
  <div>
    <!-- ── STAGE 1: IDENTITY LOOKUP ─────────────────────────────────────── -->
    <div v-if="stage === 'lookup'" class="token-wrap">
      <div class="token-card">
        <div class="token-logo">
          <img src="/img/csu-logo-square1.png" alt="CarSU" />
        </div>
        <h2>Edit Your IDP</h2>
        <p>
          Enter your Reference ID and CarSU email to retrieve your submission.
          You can only edit your IDP while your supervisor has not yet completed
          their review.
        </p>
        <div class="field-group">
          <label>Reference ID <span class="req">*</span></label>
          <span class="token-guidance">Your Reference ID was sent to your CarSU email</span>
          <div class="email-prefix-wrapper" :class="{ error: lookupError }">
            <span class="email-suffix" style="border-left:none; border-right:1px solid var(--border);">IDP-</span>
            <input
              type="text"
              v-model="lookupRefIdSuffix"
              class="email-prefix-input"
              placeholder="1718000000000"
              @keydown.enter="doLookup"
            />
          </div>
        </div>
        <div class="field-group">
          <label>CarSU Email Address <span class="req">*</span></label>
          <div class="email-prefix-wrapper" :class="{ error: lookupError }">
            <input
              type="text"
              v-model="lookupEmailPrefix"
              class="email-prefix-input"
              placeholder="yourname"
              @keydown.enter="doLookup"
            />
            <span class="email-suffix">@carsu.edu.ph</span>
          </div>
        </div>
        <p v-if="lookupError" class="token-error">{{ lookupError }}</p>
        <button class="btn-load" :disabled="lookupLoading" @click="doLookup">
          {{ lookupLoading ? "Checking..." : "Retrieve My IDP" }}
        </button>
      </div>
    </div>

    <!-- ── STAGE 2: LOCKED ───────────────────────────────────────────────── -->
    <div v-else-if="stage === 'locked'" class="token-wrap">
      <div class="locked-card">
        <div class="locked-icon">🔒</div>
        <h2>IDP Locked</h2>
        <p>
          Your supervisor has already completed their review of
          <strong>{{ lookupRefId }}</strong
          >. No further edits can be made.
        </p>
        <p style="font-size: 13px; color: var(--text-light); margin-top: 8px">
          If you believe this is an error, please contact the HR office
          directly.
        </p>
        <button class="btn-secondary" @click="stage = 'lookup'">← Back</button>
      </div>
    </div>

    <!-- ── STAGE 2: EDIT FORM ────────────────────────────────────────────── -->
    <div v-else-if="stage === 'form'" class="container">

      <!-- Title block -->
      <div class="form-title-block">
        <h2>Edit Your Individual Development Plan</h2>
        <p>Update your information below. Saving will re-notify your supervisor.</p>
        <div class="edit-ref-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editing {{ lookupRefId }}
        </div>
      </div>

      <!-- ── SECTION H: EMPLOYEE INFORMATION ─────────────────────────────── -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">H</div>
          <div>
            <h3>Personnel Information</h3>
            <p>Basic details and submission purpose</p>
          </div>
          <button class="btn-cancel-edit" @click="cancelEdit">Cancel Edit</button>
        </div>
        <div class="section-body">

          <!-- Campus static -->
          <div class="field-group" style="margin-bottom: 20px">
            <label>Campus</label>
            <div class="static-value">CSU Main Campus</div>
          </div>

          <!-- Office Affiliation -->
          <div class="field-group" style="margin-bottom: 20px">
            <label>Pillars <span class="req">*</span></label>
            <div class="checkbox-group">
              <label v-for="opt in officeOptions" :key="opt" class="checkbox-item" :class="{ checked: form.officeAffiliation === opt }">
                <input type="radio" name="officeAffiliationEdit" :value="opt" v-model="form.officeAffiliation" @change="form.collegeOfficeUnit = ''; form.collegeProgram = ''" />
                {{ opt }}
              </label>
            </div>
          </div>

          <!-- College / Office / Unit -->
          <div class="field-grid field-grid-2" style="margin-bottom: 18px">
            <div class="field-group span-2">
              <label>College / Office / Unit <span class="req">*</span></label>
              <select v-if="form.officeAffiliation" v-model="form.collegeOfficeUnit" :class="{ error: errors.collegeOfficeUnit }">
                <option value="">Select office / unit…</option>
                <template v-if="form.officeAffiliation === 'OVPAA'">
                  <option v-for="c in subOfficeMap.OVPAA" :key="c.name" :value="c.name">{{ c.name }}</option>
                </template>
                <template v-else>
                  <option v-for="u in subOfficeMap[form.officeAffiliation] || []" :key="u" :value="u">{{ u }}</option>
                </template>
              </select>
              <input v-else type="text" v-model="form.collegeOfficeUnit" :class="{ error: errors.collegeOfficeUnit }" placeholder="Select an office affiliation first" disabled />
            </div>
            <!-- Program selector — only for OVPAA colleges with programs -->
            <div v-if="form.officeAffiliation === 'OVPAA' && selectedCollegePrograms.length > 0" class="field-group span-2" style="margin-top: 4px">
              <label>Program / Department <span class="req">*</span></label>
              <select v-model="form.collegeProgram" :class="{ error: errors.collegeProgram }">
                <option value="">Select program…</option>
                <option v-for="p in selectedCollegePrograms" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>

          <!-- Name of Personnel -->
          <div class="field-group" style="margin-bottom: 18px">
            <label>Name of Personnel <span class="req">*</span></label>
            <div class="name-grid">
              <div>
                <small class="field-hint">Last Name</small>
                <input type="text" v-model="form.lastName" :class="{ error: errors.lastName }" placeholder="DELA CRUZ" @input="form.lastName = form.lastName.toUpperCase()" />
              </div>
              <div>
                <small class="field-hint">First Name</small>
                <input type="text" v-model="form.firstName" :class="{ error: errors.firstName }" placeholder="JUAN" @input="form.firstName = form.firstName.toUpperCase()" />
              </div>
              <div class="mi-col">
                <small class="field-hint">M.I.</small>
                <input type="text" v-model="form.middleInitial" :class="{ error: errors.middleInitial }" placeholder="A" maxlength="3" @input="form.middleInitial = form.middleInitial.toUpperCase()" />
              </div>
            </div>
          </div>

          <div class="field-grid field-grid-2" style="margin-bottom: 18px">
            <!-- CarSU Email (read-only, displayed as prefix widget) -->
            <div class="field-group span-2">
              <label>CarSU Email</label>
              <div class="email-prefix-wrapper disabled">
                <input
                  type="text"
                  :value="form.employeeEmailPrefix"
                  class="email-prefix-input"
                  disabled
                />
                <span class="email-suffix">@carsu.edu.ph</span>
              </div>
              <small class="field-hint">Email cannot be changed</small>
            </div>

            <!-- Highest Educational Attainment -->
            <div class="field-group span-2">
              <label>Highest Educational Attainment <span class="req">*</span></label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px">
                <select v-model="form.educAttainment" :class="{ error: errors.educAttainment }">
                  <option value="">Select…</option>
                  <option>Elementary/Primary School Graduate</option>
                  <option>High School/Secondary Graduate</option>
                  <option>Vocational or Technical Course</option>
                  <option>College Undergraduate</option>
                  <option>Bachelor's Degree</option>
                  <option>Post-Baccalaureate Certificate</option>
                  <option>Master's Degree</option>
                  <option>Post-Master's Certificate</option>
                  <option>Doctorate Degree (Ph.D. / Ed.D. / etc.)</option>
                  <option>Post-Doctoral</option>
                  <option>Other</option>
                </select>
                <input type="text" v-model="form.educAttainmentSpec" :class="{ error: errors.educAttainmentSpec }" placeholder="Specify degree / program (e.g. BS COMPUTER SCIENCE)" @input="form.educAttainmentSpec = form.educAttainmentSpec.toUpperCase()" />
              </div>
            </div>

            <!-- Position & Designation -->
            <div class="field-group span-2">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: start">
                <div class="field-group">
                  <label>Position <span class="req">*</span></label>
                  <select
                    v-model="form.currentPosition"
                    :class="{ error: errors.currentPosition }"
                  >
                    <option value="">Select position…</option>
                    <option
                      v-for="pos in positionOptions"
                      :key="pos"
                      :value="pos"
                    >
                      {{ pos }}
                    </option>
                  </select>
                </div>
                <!-- Designation toggle -->
                <div class="field-group">
                  <label>Designation <span class="req">*</span></label>
                  <div class="designation-toggle">
                    <label class="checkbox-item" :class="{ checked: form.designationMode === 'na' }">
                      <input type="radio" name="designationModeEdit" value="na" v-model="form.designationMode" @change="form.designation = 'N/A'" />
                      N/A
                    </label>
                    <label class="checkbox-item" :class="{ checked: form.designationMode === 'specify' }">
                      <input type="radio" name="designationModeEdit" value="specify" v-model="form.designationMode" @change="form.designation = ''" />
                      Specify
                    </label>
                  </div>
                  <input v-if="form.designationMode === 'specify'" type="text" v-model="form.designation" placeholder="e.g. OIC Director, Acting Dean…" style="margin-top: 6px" @input="form.designation = form.designation.toUpperCase()" />
                </div>
              </div>
            </div>

            <!-- Years in Position -->
            <div class="field-group">
              <label>Years in Position <span class="req">*</span></label>
              <input type="number" v-model="form.yearsInPosition" :class="{ error: errors.yearsInPosition }" min="0" placeholder="0" />
            </div>

            <!-- Years in CSU -->
            <div class="field-group">
              <label>Years in CSU <span class="req">*</span></label>
              <input type="number" v-model="form.yearsInCSU" :class="{ error: errors.yearsInCSU }" min="0" placeholder="0" />
            </div>

            <!-- Supervisor Name -->
            <div class="field-group">
              <label>Immediate Supervisor Name <span class="req">*</span></label>
              <input type="text" v-model="form.supervisorName" :class="{ error: errors.supervisorName }" placeholder="e.g. DELA CRUZ, JUAN D." @input="form.supervisorName = form.supervisorName.toUpperCase()" />
              <small class="field-hint">Format: Last name, First name, M.I.</small>
            </div>

            <!-- Supervisor Email -->
            <div class="field-group">
              <label>Supervisor CarSU Email <span class="req">*</span></label>
              <div
                class="email-prefix-wrapper"
                :class="{
                  error: emailHints.supervisor.type === 'error',
                  valid: emailHints.supervisor.type === 'success',
                }"
              >
                <input
                  type="text"
                  v-model="form.supervisorEmailPrefix"
                  class="email-prefix-input"
                  placeholder="supervisor"
                  @blur="validateEditEmail('supervisor')"
                />
                <span class="email-suffix">@carsu.edu.ph</span>
              </div>
              <small class="email-hint" :class="emailHints.supervisor.type">{{ emailHints.supervisor.msg }}</small>
            </div>

            <!-- Purpose -->
            <div class="field-group span-2">
              <label>IDP Purpose <span class="req">*</span></label>
              <div class="checkbox-group">
                <label v-for="opt in purposeOptions" :key="opt" class="checkbox-item" :class="{ checked: form.headerPurpose === opt }">
                  <input type="radio" name="headerPurposeEdit" :value="opt" v-model="form.headerPurpose" />
                  {{ opt }}
                </label>
              </div>
              <div class="other-specify" :class="{ visible: form.headerPurpose === 'Other' }">
                <input type="text" v-model="form.headerPurposeOther" placeholder="Please specify…" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── SECTION I: COMPETENCY ASSESSMENT ─────────────────────────────── -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">I</div>
          <div>
            <h3>Competency Assessment</h3>
            <p>Identify key competencies to develop</p>
          </div>
        </div>
        <div class="section-body">
          <div class="section-desc">
            Update competencies you need to develop based on your current or target role.
            For detailed descriptions and behavioral indicators, please refer to the
            <a href="https://tinyurl.com/CompetencyManualandModel" target="_blank">Competency Manual and Model</a>.
          </div>

          <!-- Competency Purpose -->
          <div class="field-group" style="margin-bottom: 20px">
            <label>Competency Assessment Purpose <span class="req">*</span></label>
            <div class="checkbox-group">
              <label v-for="opt in compPurposeOptions" :key="opt.value" class="checkbox-item" :class="{ checked: form.compPurpose === opt.value }">
                <input type="radio" name="compPurposeEdit" :value="opt.value" v-model="form.compPurpose" />
                {{ opt.label }}
              </label>
            </div>
            <div class="other-specify" :class="{ visible: form.compPurpose === 'Others' }">
              <input type="text" v-model="form.compPurposeOther" placeholder="Please specify…" />
            </div>
          </div>

          <div class="table-wrapper">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th style="min-width: 180px">Target Competency</th>
                  <th style="width: 150px">Current Level</th>
                  <th style="width: 150px">Required Level</th>
                  <th>Suggested LeaD Interventions</th>
                  <th style="width: 120px">Target Timeline</th>
                  <th style="width: 40px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!form.competencyRows.length">
                  <td colspan="7" style="text-align: center; color: var(--text-light); font-style: italic; padding: 20px">No competency entries. Add a row below.</td>
                </tr>
                <tr v-for="(row, i) in form.competencyRows" :key="i">
                  <td class="row-num-cell">{{ i + 1 }}</td>
                  <td>
                    <select
                      v-model="row.targetCompetency"
                      style="min-width: 200px"
                      @change="row.competencyGroup = getCompetencyCluster(row.targetCompetency); row.requiredLevel = getRequiredLevel(row.targetCompetency, form.currentPosition)"
                    >
                      <option value="">Select competency…</option>
                      <optgroup
                        v-for="cluster in availableClusters"
                        :key="cluster"
                        :label="cluster"
                      >
                        <option
                          v-for="comp in allCompetencies[cluster]"
                          :key="comp"
                          :value="comp"
                        >
                          {{ comp }}
                        </option>
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="row.currentLevel"
                      placeholder="e.g. 2 - Intermediate"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      v-model="row.requiredLevel"
                      placeholder="e.g. 3 - Advanced"
                    />
                  </td>
                  <td>
                    <select v-model="row.leadInterventions" style="min-width: 200px">
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
                        <option>Conferences, Training Programs, Conventions, Seminars, and Cum Paper Presentations</option>
                        <option>Pursue Higher Education</option>
                      </optgroup>
                    </select>
                  </td>
                  <td>
                    <select v-model="row.targetTimeline">
                      <option value="">Select…</option>
                      <option>2026-2027</option>
                      <option>2027-2028</option>
                      <option>2028-2029</option>
                      <option>2029-2030</option>
                      <option>2030-2031</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-remove-row" @click="form.competencyRows.splice(i, 1)" title="Remove row">×</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-actions">
            <button class="btn-add-row" @click="form.competencyRows.push({ targetCompetency: '', competencyGroup: '', currentLevel: '', requiredLevel: '', leadInterventions: '', targetTimeline: '' })">+ Add Row</button>
          </div>
        </div>
      </div>

      <!-- ── SECTION II: AGAP ──────────────────────────────────────────────── -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">II</div>
          <div>
            <h3>Academic Growth and Advancement Program (AGAP)</h3>
            <p>Plans for academic advancement</p>
          </div>
        </div>
        <div class="section-body">
          <div class="section-desc">
            Outline your plans for academic advancement, such as enrolling in graduate or certification programs.
          </div>
          <div class="table-wrapper">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th>Degree Program</th>
                  <th style="min-width: 200px">Target HEI</th>
                  <th style="width: 120px">Mode of Study</th>
                  <th style="min-width: 180px">Target Scholarship Grant</th>
                  <th style="width: 130px">Intended Year of Enrollment</th>
                  <th style="width: 40px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!form.agapRows.length">
                  <td colspan="7" style="text-align: center; color: var(--text-light); font-style: italic; padding: 20px">No AGAP entries. Add a row below.</td>
                </tr>
                <tr v-for="(row, i) in form.agapRows" :key="i">
                  <td class="row-num-cell">{{ i + 1 }}</td>
                  <td>
                    <select v-model="row.degreeProgram">
                      <option value="">Select…</option>
                      <option>Post-Baccalaureate Certificate</option>
                      <option>Master's Degree</option>
                      <option>Post-Master's Certificate</option>
                      <option>Doctorate Degree (Ph.D. / Ed.D. / etc.)</option>
                      <option>Post-Doctoral</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" v-model="row.targetHEI" placeholder="Full name of School" list="hei-suggestions-edit" />
                    <datalist id="hei-suggestions-edit">
                      <option v-for="s in heiSuggestions" :key="s" :value="s" />
                    </datalist>
                  </td>
                  <td>
                    <select v-model="row.modeOfStudy">
                      <option value="">Select…</option>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Online</option>
                      <option>Blended</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" v-model="row.scholarshipGrant" placeholder="Scholarship / grant name" />
                  </td>
                  <td>
                    <select v-model="row.targetTimeline">
                      <option value="">Select…</option>
                      <option>2026</option>
                      <option>2027</option>
                      <option>2028</option>
                      <option>2029</option>
                      <option>2030</option>
                      <option>2031</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-remove-row" @click="form.agapRows.splice(i, 1)" title="Remove row">×</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-actions">
            <button class="btn-add-row" @click="form.agapRows.push({ degreeProgram: '', targetHEI: '', modeOfStudy: '', scholarshipGrant: '', targetTimeline: '' })">+ Add Row</button>
          </div>
        </div>
      </div>

      <!-- ── SECTION III: PRO-ACT ──────────────────────────────────────────── -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-num">III</div>
          <div>
            <h3>Professional Advancement through Capacity-Building and Trainings (Pro-ACT)</h3>
            <p>Training and workshop interventions</p>
          </div>
        </div>
        <div class="section-body">
          <div class="section-desc">
            If a training intervention is identified in Section I (Competency Assessment), provide more detailed information here.
          </div>
          <div class="table-wrapper">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th style="min-width: 160px">Target Competency / Skill</th>
                  <th>Training / LeaD Intervention</th>
                  <th style="width: 130px">Mode of Activity</th>
                  <th>Trainer / Provider</th>
                  <th style="width: 130px">Intended Year of Enrollment</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="filledCompetencies.length === 0">
                  <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-light); font-style: italic; padding: 20px">
                      Add competencies in Section I to populate this table.
                    </td>
                  </tr>
                </template>
                <tr v-for="(competency, idx) in filledCompetencies" :key="competency">
                  <td class="row-num-cell">{{ idx + 1 }}</td>
                  <td style="background: rgba(0, 51, 0, 0.04)">
                    <div class="proact-skill-label">{{ competency }}</div>
                  </td>
                  <td>
                    <input type="text" v-model="form.proactRows[idx].trainingTitle" placeholder="Enter training or intervention title" list="proact-suggestions-edit" />
                    <datalist id="proact-suggestions-edit">
                      <option v-for="s in proactSuggestions" :key="s" :value="s" />
                    </datalist>
                  </td>
                  <td>
                    <select v-model="form.proactRows[idx].modeOfActivity">
                      <option value="">Select…</option>
                      <option>Face-to-face</option>
                      <option>Online</option>
                      <option>Blended</option>
                      <option>On-the-job</option>
                    </select>
                  </td>
                  <td>
                    <input type="text" v-model="form.proactRows[idx].trainerProvider" placeholder="Optional" />
                  </td>
                  <td>
                    <select v-model="form.proactRows[idx].targetTimeline">
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
          <p v-if="filledCompetencies.length > 0" style="font-size: 13px; color: var(--text-light); margin-top: 10px">
            Rows are auto-generated based on competencies entered in Section I.
          </p>
        </div>
      </div>

      <!-- ── SUBMIT AREA ────────────────────────────────────────────────────── -->
      <div class="submit-area">
        <p>By saving, you confirm all information is accurate. Your supervisor will be re-notified automatically.</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
          <button class="btn-secondary" @click="cancelEdit">Cancel</button>
          <button class="btn-submit" :disabled="submitLoading" @click="doSubmitEdit">
            {{ submitLoading ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── STAGE 3: SUCCESS ──────────────────────────────────────────────── -->
    <div v-else-if="stage === 'success'" class="token-wrap">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h2>IDP Updated Successfully</h2>
        <p>
          Your changes to <strong>{{ lookupRefId }}</strong> have been saved.
          Your supervisor has been notified by email and will review the updated
          version.
        </p>
        <div class="ref-box">{{ lookupRefId }}</div>
        <p style="font-size: 13px; color: var(--text-light)">
          You may continue editing until your supervisor completes their review.
        </p>
        <div class="success-actions">
          <button class="btn-secondary" @click="resetAndEdit">
            Edit Again
          </button>
          <NuxtLink to="/" class="btn-primary-link">Back to Home</NuxtLink>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
definePageMeta({ ssr: false });
import { ref, reactive, computed, watch, onUnmounted } from "vue";

const { setPageHeader, clearPageHeader } = usePageHeader();
setPageHeader("Edit IDP", "/");
onUnmounted(() => {
  clearPageHeader();
});

const config = useRuntimeConfig();
const API = config.public.apiBase;

// ── State ───────────────────────────────────────────────────────────────────
const stage = ref("lookup"); // 'lookup' | 'form' | 'locked' | 'success'
const lookupRefId = ref("");
const lookupRefIdSuffix = ref("");
const lookupEmail = ref("");
const lookupEmailPrefix = ref("");
const lookupError = ref("");
const lookupLoading = ref(false);
const submitLoading = ref(false);

const heiSuggestions = ref([]);
const proactSuggestions = ref([]);

const form = reactive({
  // Header
  lastName: "",
  firstName: "",
  middleInitial: "",
  employeeEmailPrefix: "", // editable prefix portion
  employeeEmail: "",       // full email (assembled)
  datePrepared: "", // kept for populateForm compatibility, not shown in UI
  officeAffiliation: "",
  collegeOfficeUnit: "",
  collegeProgram: "",
  personnelType: "",
  currentPosition: "",
  designation: "",
  educAttainment: "",
  educAttainmentSpec: "",
  yearsInPosition: "",
  yearsInCSU: "",
  supervisorName: "",
  supervisorEmailPrefix: "", // editable prefix portion
  supervisorEmail: "",       // full email (assembled)
  headerPurpose: "",
  headerPurposeOther: "",
  compPurpose: "",           // matches idp-form.vue field name
  compPurposeOther: "",
  designationMode: "na",
  // Sections
  competencyRows: [],
  agapRows: [],
  proactRows: [],
});

const emailHints = reactive({
  employee: { msg: "", type: "" },
  supervisor: { msg: "", type: "" },
});

const errors = reactive({});

// ── Options (matching idp-form.vue) ────────────────────────────────────────
const officeOptions = [
  "OVPAF",
  "OVPAA",
  "OVPEO",
  "OVPSAS",
  "OVPRDIE",
];

const purposeOptions = [
  "Initial Assessment",
  "Mid-Year Review",
  "Annual Review",
  "Other",
];

const compPurposeOptions = [
  { value: "To meet the competencies of my current position.", label: "Meet competencies of current position" },
  { value: "To increase the level of competencies of the current position.", label: "Increase level of current competencies" },
  { value: "To meet the competencies of the next higher position.", label: "Meet competencies of next higher position" },
  { value: "To acquire new competencies across different functions/positions.", label: "Acquire new competencies across functions" },
  { value: "Others", label: "Others" },
];

// ── Sub-office map (same as idp-form.vue) ──────────────────────────────────
const subOfficeMap = {
  OVPAF: [
    "Business & Resource Management Office",
    "Corporate Enterprise Development Office",
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
    { name: "College of Agricultural and Agri-Industries (CAA)", programs: ["BS in Agriculture"] },
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
      name: "College of Forestry and Environmental Sciences (COFES)",
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
    "Management Information System",
    "Office of Internationalization and Global Engagements",
    "Office of Strategic Foresight and Futures Thinking",
    "Office of the Planning & Quality Management Services",
    "Project Management Office",
    "Public Information & Communication Office",
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
  OVPRDIE: [
    "Extension Services Office",
    "RDIE Publication Management Office",
    "Research & Development and Innovation Services",
    "Technology Business Incubator Office",
    "Technology Transfer & Licensing Office",
  ],
};

// ── Competency Model ───────────────────────────────────────────────────────
// Dropdown options for the Position field — derived from competencyModel's own
// keys so the list can never fall out of sync with the required-level lookup.
const positionOptions = computed(() => Object.keys(competencyModel));

const competencyModel = {
  // ── ADMIN AIDE I – Utility ──────────────────────────────────────────
  "Admin Aide I – Utility": {
    Integrity: 1,
    Accountability: 1,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 1,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 1,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE I – Clerk ────────────────────────────────────────────
  "Admin Aide I – Clerk": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE II – Utility ─────────────────────────────────────────
  "Admin Aide II – Utility": {
    Integrity: 1,
    Accountability: 1,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 1,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 1,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE II – Clerk ───────────────────────────────────────────
  "Admin Aide II – Clerk": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE III – Clerk ──────────────────────────────────────────
  "Admin Aide III – Clerk": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE IV – Mechanic ────────────────────────────────────────
  "Admin Aide IV – Mechanic": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 1,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE IV – Clerk ───────────────────────────────────────────
  "Admin Aide IV – Clerk": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN AIDE IV – Driver ──────────────────────────────────────────
  "Admin Aide IV – Driver": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 3,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 2,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── SECURITY GUARD I ────────────────────────────────────────────────
  "Security Guard I": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 3,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 2,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── FARM WORKER I ───────────────────────────────────────────────────
  "Farm Worker I": {
    Integrity: 1,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 1,
    "Environmental Consciousness": 2,
    "Building Partnership": 1,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 1,
    "Adaptability and Flexibility": 1,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 1,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 1,
    "Oral Communication": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN ASSISTANT I ───────────────────────────────────────────────
  "Admin Assistant I": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN ASSISTANT II ──────────────────────────────────────────────
  "Admin Assistant II": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN ASSISTANT III ─────────────────────────────────────────────
  "Admin Assistant III": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN ASSISTANT IV ──────────────────────────────────────────────
  "Admin Assistant IV": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 1,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 1,
    "Valuing Diversity": 1,
    "Self-Awareness and Confidence": 1,
    "Stress Tolerance": 1,
    "Resource Management": 1,
    "Knowledge Management": 1,
    Initiative: 1,
    "Result Orientation": 1,
    "Organizational Commitment": 1,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 1,
    "Safety and Risk Management": 1,
    "Interpersonal Effectiveness": 1,
    "Attention to Details": 1,
    "Written Communication": 1,
    "Oral Communication": 1,
    "Computer Literacy": 1,
    "Logical Reasoning": 1,
  },
  // ── ADMIN OFFICER I ─────────────────────────────────────────────────
  "Admin Officer I": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    Teamwork: 3,
    "Commitment to Learning": 2,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 2,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  // ── ADMIN OFFICER II ────────────────────────────────────────────────
  "Admin Officer II": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    Teamwork: 3,
    "Commitment to Learning": 2,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 2,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  // ── ADMIN OFFICER III ───────────────────────────────────────────────
  "Admin Officer III": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 2,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  // ── ADMIN OFFICER IV ────────────────────────────────────────────────
  "Admin Officer IV": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 3,
    "Knowledge Management": 3,
    Initiative: 3,
    "Result Orientation": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Attention to Details": 3,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Computer Literacy": 2,
    "Logical Reasoning": 3,
  },
  // ── ADMIN OFFICER V ─────────────────────────────────────────────────
  "Admin Officer V": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 4,
    "Building Partnership": 4,
    "Developing People": 4,
    "Facilitating Change": 4,
    "Conflict Management": 4,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 4,
    Decisiveness: 4,
    "Critical Thinking": 4,
    Teamwork: 4,
    "Commitment to Learning": 4,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 4,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },

  // ════════════════════════════════════════════════════════════════════
  // PROFESSIONAL / SPECIALIZED ADMIN
  // ════════════════════════════════════════════════════════════════════
  "Accountant III": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 1,
    "Strategic Planning": 1,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 3,
    Teamwork: 4,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "College Librarian I": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 3,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 3,
    "Knowledge Management": 3,
    Initiative: 3,
    "Result Orientation": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Attention to Details": 3,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Computer Literacy": 2,
    "Logical Reasoning": 3,
  },
  "College Librarian III": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Nurse I": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 2,
    Teamwork: 1,
    "Commitment to Learning": 1,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  "Nurse II": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  "Chief Administrative Officer (CAO)": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 4,
    "Building Partnership": 4,
    "Developing People": 4,
    "Facilitating Change": 4,
    "Conflict Management": 4,
    "Leading Innovation": 4,
    "Strategic Planning": 4,
    "Leading Others": 4,
    Decisiveness: 4,
    "Critical Thinking": 4,
    Teamwork: 4,
    "Commitment to Learning": 4,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 4,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Board Secretary V": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 4,
    Teamwork: 4,
    "Commitment to Learning": 3,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Guidance Counselor III": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 4,
    Teamwork: 4,
    "Commitment to Learning": 3,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Programmer II": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 2,
    Teamwork: 2,
    "Commitment to Learning": 1,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 4,
    "Logical Reasoning": 2,
  },
  "Database Administrator": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 4,
    "Logical Reasoning": 2,
  },
  "System Analyst": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Critical Thinking": 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 4,
    "Logical Reasoning": 2,
  },
  "Planning Officer": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 3,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 4,
    Teamwork: 4,
    "Commitment to Learning": 4,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 4,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Registrar III": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Developing People": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    "Critical Thinking": 3,
    Teamwork: 4,
    "Commitment to Learning": 3,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Attorney II": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Facilitating Change": 4,
    "Conflict Management": 4,
    "Strategic Planning": 4,
    Decisiveness: 4,
    "Critical Thinking": 4,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Attorney III": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 2,
    "Building Partnership": 3,
    "Facilitating Change": 4,
    "Conflict Management": 4,
    "Strategic Planning": 4,
    Decisiveness: 4,
    "Critical Thinking": 4,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  Physician: {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    "Developing People": 4,
    "Facilitating Change": 4,
    "Conflict Management": 4,
    "Leading Innovation": 4,
    "Strategic Planning": 4,
    Decisiveness: 4,
    "Critical Thinking": 4,
    Teamwork: 2,
    "Commitment to Learning": 3,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 2,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 4,
    "Knowledge Management": 4,
    Initiative: 4,
    "Result Orientation": 4,
    "Organizational Commitment": 4,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 4,
    "Interpersonal Effectiveness": 4,
    "Attention to Details": 4,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Computer Literacy": 2,
    "Logical Reasoning": 4,
  },
  "Procurement Officer": {
    Integrity: 4,
    Accountability: 4,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 4,
    "Environmental Consciousness": 2,
    "Building Partnership": 2,
    Teamwork: 4,
    "Commitment to Learning": 3,
    "Customer Focus": 4,
    "Adaptability and Flexibility": 4,
    "Effective Communication": 2,
    "Valuing Diversity": 2,
    "Self-Awareness and Confidence": 2,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 2,
    Initiative: 2,
    "Result Orientation": 2,
    "Organizational Commitment": 2,
    "Planning and Organizing": 2,
    "Emotional and Psychological Maturity": 2,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Computer Literacy": 2,
    "Logical Reasoning": 2,
  },
  // ── DIRECTOR ────────────────────────────────────────────────────────
  // No preset required levels — Director can input their own required level.
  // All 4 clusters are available (empty model = availableClusters shows all).
  Director: {},

  // ════════════════════════════════════════════════════════════════════
  // FACULTY (Pages 5-8)
  // ════════════════════════════════════════════════════════════════════
  "Instructor I": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 1,
    "Leading Innovation": 1,
    "Strategic Planning": 2,
    "Leading Others": 1,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 1,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Language Faculty": 3,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 3,
    "Planning and Project Management": null,
    "Logical Reasoning": 2,
    "Math and Allied Fields Faculty Members": 3,
  },
  "Instructor II": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 1,
    "Leading Innovation": 1,
    "Strategic Planning": 2,
    "Leading Others": 1,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 1,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Language Faculty": 3,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 3,
    "Planning and Project Management": null,
    "Logical Reasoning": 2,
    "Math and Allied Fields Faculty Members": 3,
  },
  "Instructor III": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 1,
    "Leading Innovation": 1,
    "Strategic Planning": 2,
    "Leading Others": 1,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 1,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 2,
    "Oral Communication": 2,
    "Language Faculty": 3,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 3,
    "Planning and Project Management": null,
    "Logical Reasoning": 2,
    "Math and Allied Fields Faculty Members": 3,
  },
  "Assistant Professor I": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 2,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 1,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Assistant Professor II": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 2,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 2,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 1,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Assistant Professor III": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 2,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 2,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Assistant Professor IV": {
    Integrity: 2,
    Accountability: 2,
    "Scientific and Technological Excellence": 2,
    "Delivering Service Excellence": 2,
    "Environmental Consciousness": 2,
    "Faculty Specializing in Environment": 3,
    "Building Partnership": 2,
    "Facilitating Change": 2,
    "Conflict Management": 2,
    "Leading Innovation": 2,
    "Strategic Planning": 2,
    "Leading Others": 2,
    Decisiveness: 2,
    Teamwork: 2,
    "Commitment to Learning": 2,
    "Customer Focus": 2,
    "Adaptability and Flexibility": 3,
    "Critical Thinking": 2,
    "Effective Communication": 3,
    "Valuing Diversity": 3,
    "Self-Awareness and Confidence": 3,
    "Stress Tolerance": 3,
    "Resource Management": 2,
    "Knowledge Management": 3,
    Initiative: 2,
    "Result Orientation": 2,
    "Community Engagement": 1,
    "Organizational Commitment": 2,
    "Planning and Organizing": 3,
    "Emotional and Psychological Maturity": 3,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 2,
    "Research Engagement": 2,
    "Diagnostic Information Gathering": 2,
    "Attention to Details": 2,
    "Written Communication": 3,
    "Oral Communication": 3,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 2,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 2,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Associate Professor I": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 3,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Faculty Specializing in Environment": 4,
    "Building Partnership": 3,
    "Facilitating Change": 3,
    "Conflict Management": 3,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 3,
    Decisiveness: 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 4,
    "Critical Thinking": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 3,
    "Knowledge Management": 4,
    Initiative: 3,
    "Result Orientation": 3,
    "Community Engagement": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Research Engagement": 3,
    "Diagnostic Information Gathering": 3,
    "Attention to Details": 3,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 3,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 3,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Associate Professor II": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 3,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Faculty Specializing in Environment": 4,
    "Building Partnership": 3,
    "Facilitating Change": 3,
    "Conflict Management": 3,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 3,
    Decisiveness: 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 4,
    "Critical Thinking": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 3,
    "Knowledge Management": 4,
    Initiative: 3,
    "Result Orientation": 3,
    "Community Engagement": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Research Engagement": 3,
    "Diagnostic Information Gathering": 3,
    "Attention to Details": 3,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 3,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 3,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Associate Professor III": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 3,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Faculty Specializing in Environment": 4,
    "Building Partnership": 3,
    "Developing People": 3,
    "Facilitating Change": 3,
    "Conflict Management": 3,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 3,
    Decisiveness: 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 4,
    "Critical Thinking": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 3,
    "Knowledge Management": 4,
    Initiative: 3,
    "Result Orientation": 3,
    "Community Engagement": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Research Engagement": 3,
    "Diagnostic Information Gathering": 3,
    "Attention to Details": 3,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 3,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 3,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Associate Professor IV": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 3,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Faculty Specializing in Environment": 4,
    "Building Partnership": 3,
    "Facilitating Change": 3,
    "Conflict Management": 3,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 3,
    Decisiveness: 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 4,
    "Critical Thinking": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 3,
    "Knowledge Management": 4,
    Initiative: 3,
    "Result Orientation": 3,
    "Community Engagement": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Research Engagement": 3,
    "Diagnostic Information Gathering": 3,
    "Attention to Details": 3,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 3,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 3,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  "Associate Professor V": {
    Integrity: 3,
    Accountability: 3,
    "Scientific and Technological Excellence": 3,
    "Delivering Service Excellence": 3,
    "Environmental Consciousness": 3,
    "Faculty Specializing in Environment": 4,
    "Building Partnership": 3,
    "Facilitating Change": 3,
    "Conflict Management": 3,
    "Leading Innovation": 3,
    "Strategic Planning": 3,
    "Leading Others": 3,
    Decisiveness: 3,
    Teamwork: 3,
    "Commitment to Learning": 3,
    "Customer Focus": 3,
    "Adaptability and Flexibility": 4,
    "Critical Thinking": 3,
    "Effective Communication": 4,
    "Valuing Diversity": 4,
    "Self-Awareness and Confidence": 4,
    "Stress Tolerance": 4,
    "Resource Management": 3,
    "Knowledge Management": 4,
    Initiative: 3,
    "Result Orientation": 3,
    "Community Engagement": 3,
    "Organizational Commitment": 3,
    "Planning and Organizing": 4,
    "Emotional and Psychological Maturity": 4,
    "Safety and Risk Management": 3,
    "Interpersonal Effectiveness": 3,
    "Research Engagement": 3,
    "Diagnostic Information Gathering": 3,
    "Attention to Details": 3,
    "Written Communication": 4,
    "Oral Communication": 4,
    "Language Faculty": 4,
    "Conceptual and Analytical Thinking": 3,
    "Computer Literacy": 2,
    "IT Faculty": 4,
    "Planning and Project Management": 3,
    "Logical Reasoning": 3,
    "Math and Allied Fields Faculty Members": 4,
  },
  // Associate Professor VI: document lists "NONE" — no required competency levels defined
  "Associate Professor VI": {},
};

// Professor I-VI and University Professor all share the same base values
// except: Professors I-III have Developing People=3, Professors IV-VI and UP have Developing People=4
const professorTemplate = {
  Integrity: 4,
  Accountability: 4,
  "Scientific and Technological Excellence": 4,
  "Delivering Service Excellence": 4,
  "Environmental Consciousness": 4,
  "Faculty Specializing in Environment": 4,
  "Building Partnership": 4,
  "Developing People": 4,
  "Facilitating Change": 4,
  "Conflict Management": 4,
  "Leading Innovation": 4,
  "Strategic Planning": 4,
  "Leading Others": 4,
  Decisiveness: 4,
  Teamwork: 4,
  "Commitment to Learning": 4,
  "Customer Focus": 4,
  "Adaptability and Flexibility": 4,
  "Critical Thinking": 4,
  "Effective Communication": 4,
  "Valuing Diversity": 4,
  "Self-Awareness and Confidence": 4,
  "Stress Tolerance": 4,
  "Resource Management": 4,
  "Knowledge Management": 4,
  Initiative: 4,
  "Result Orientation": 4,
  "Community Engagement": 4,
  "Organizational Commitment": 4,
  "Planning and Organizing": 4,
  "Emotional and Psychological Maturity": 4,
  "Safety and Risk Management": 4,
  "Interpersonal Effectiveness": 4,
  "Research Engagement": 4,
  "Diagnostic Information Gathering": 4,
  "Attention to Details": 4,
  "Written Communication": 4,
  "Oral Communication": 4,
  "Language Faculty": 4,
  "Conceptual and Analytical Thinking": 4,
  "Computer Literacy": 2,
  "IT Faculty": 4,
  "Planning and Project Management": 4,
  "Logical Reasoning": 3,
  "Math and Allied Fields Faculty Members": 4,
};

// ── Computed helpers ────────────────────────────────────────────────────────
const isOVPAA = computed(() => form.officeAffiliation === "OVPAA");

const selectedCollegePrograms = computed(() => {
  if (!isOVPAA.value) return [];
  const colleges = subOfficeMap["OVPAA"] || [];
  const found = colleges.find((c) => typeof c === "object" && c.name === form.collegeOfficeUnit);
  return found ? found.programs : [];
});

// Re-compute required levels when position changes
watch(
  () => form.currentPosition,
  (newPos) => {
    form.competencyRows.forEach((row) => {
      if (row.targetCompetency) {
        row.requiredLevel = getRequiredLevel(row.targetCompetency, newPos);
      }
    });
  },
);

// ── Competency lists ────────────────────────────────────────────────────────
const competencyData = {
  Core: computed(() => {
    const base = [
      "Integrity",
      "Accountability",
      "Scientific and Technological Excellence",
      "Delivering Service Excellence",
      "Environmental Consciousness",
      "Building Partnership",
    ];
    if (form.personnelType === "teaching") base.push("Faculty Specializing in Environment");
    return base;
  }),
  Leadership: [
    "Developing People", "Facilitating Change", "Conflict Management",
    "Leading Innovation", "Strategic Planning", "Leading Others", "Decisiveness",
  ],
  Organizational: [
    "Teamwork", "Commitment to Learning", "Customer Focus", "Adaptability and Flexibility",
    "Critical Thinking", "Effective Communication", "Valuing Diversity",
    "Self-Awareness and Confidence", "Stress Tolerance", "Resource Management",
    "Knowledge Management", "Initiative", "Result Orientation", "Community Engagement",
    "Organizational Commitment", "Planning and Organizing", "Emotional and Psychological Maturity",
    "Safety and Risk Management", "Interpersonal Effectiveness",
  ],
  Technical: computed(() => {
    const base = [
      "Research Engagement", "Diagnostic Information Gathering", "Attention to Details",
      "Written Communication", "Oral Communication", "Conceptual and Analytical Thinking",
      "Computer Literacy", "Planning and Project Management", "Logical Reasoning",
    ];
    if (form.personnelType === "teaching") {
      base.push("Language Faculty", "IT Faculty", "Math and Allied Fields Faculty Members");
    }
    return base;
  }),
};

function getCompetencyOptions(group) {
  if (!group) return [];
  const v = competencyData[group];
  if (!v) return [];
  return typeof v.value !== "undefined" ? v.value : v;
}

const allCompetencies = computed(() => ({
  Core: getCompetencyOptions("Core"),
  Leadership: getCompetencyOptions("Leadership"),
  Organizational: getCompetencyOptions("Organizational"),
  Technical: getCompetencyOptions("Technical"),
}));

const availableClusters = computed(() => {
  const allClusters = ["Core", "Leadership", "Organizational", "Technical"];
  const pos = form.currentPosition;
  if (!pos || pos === "Director") return allClusters;
  const posData = competencyModel[pos];
  if (!posData || Object.keys(posData).length === 0) return allClusters;
  return allClusters.filter((cluster) => {
    const list = allCompetencies.value[cluster] || [];
    return list.some((c) => posData[c] !== undefined && posData[c] !== null);
  });
});

// Competencies actually entered in Section I — drives Pro-ACT (Section III) rows
const filledCompetencies = computed(() => {
  const list = form.competencyRows
    .map((r) => r.targetCompetency)
    .filter((c) => c && c.trim());
  // Keep proactRows in sync — grow or shrink as needed
  while (form.proactRows.length < list.length) {
    form.proactRows.push({
      targetSkill: "",
      trainingTitle: "",
      modeOfActivity: "",
      trainerProvider: "",
      targetTimeline: "",
    });
  }
  // Sync targetSkill on each row
  list.forEach((c, i) => {
    form.proactRows[i].targetSkill = c;
  });
  return list;
});

function getCompetencyCluster(competency) {
  if (!competency) return "";
  for (const [grp, list] of Object.entries(allCompetencies.value)) {
    if (list.includes(competency)) return grp;
  }
  return "";
}

const LEVEL_LABEL = { 1: "1 - Basic", 2: "2 - Intermediate", 3: "3 - Advanced", 4: "4 - Expert" };

function getRequiredLevel(competency, position) {
  if (!competency || !position) return "";
  const posData = competencyModel[position];
  if (!posData) return "";
  const lvl = posData[competency];
  if (lvl === null || lvl === undefined) return "";
  return LEVEL_LABEL[lvl] || "";
}

// ── Competency Model Aliases ────────────────────────────────────────────────
// Administrative Aide — map dropdown names to keyed model entries
competencyModel["Administrative Aide I"]   = competencyModel["Admin Aide I – Clerk"];
competencyModel["Administrative Aide II"]  = competencyModel["Admin Aide II – Clerk"];
competencyModel["Administrative Aide III"] = competencyModel["Admin Aide III – Clerk"];
competencyModel["Administrative Aide IV"]  = competencyModel["Admin Aide IV – Clerk"];
competencyModel["Administrative Aide VI"]  = competencyModel["Admin Aide IV – Clerk"];

// Administrative Assistant
competencyModel["Administrative Assistant I"]   = competencyModel["Admin Assistant I"];
competencyModel["Administrative Assistant II"]  = competencyModel["Admin Assistant II"];
competencyModel["Administrative Assistant III"] = competencyModel["Admin Assistant III"];
competencyModel["Administrative Assistant IV"]  = competencyModel["Admin Assistant IV"];
competencyModel["Administrative Assistant V"]   = competencyModel["Admin Assistant IV"];
competencyModel["Senior Administrative Assistant III"] = competencyModel["Admin Assistant III"];

// Administrative Officer
competencyModel["Administrative Officer I"]   = competencyModel["Admin Officer I"];
competencyModel["Administrative Officer II"]  = competencyModel["Admin Officer II"];
competencyModel["Administrative Officer III"] = competencyModel["Admin Officer III"];
competencyModel["Administrative Officer IV"]  = competencyModel["Admin Officer IV"];
competencyModel["Administrative Officer V"]   = competencyModel["Admin Officer V"];
competencyModel["Supervising Administrative Officer"] = competencyModel["Admin Officer V"];

// Chief Administrative Officer
competencyModel["Chief Administrative Officer"] = competencyModel["Chief Administrative Officer (CAO)"];

// Accountant — I and II share the same competency profile as Accountant III
competencyModel["Accountant I"]  = competencyModel["Accountant III"];
competencyModel["Accountant II"] = competencyModel["Accountant III"];

// Attorney
competencyModel["Attorney IV"] = competencyModel["Attorney III"];

// Board Secretary
competencyModel["Board Secretary I"] = competencyModel["Board Secretary V"];

// Cook
competencyModel["Cook I"]  = competencyModel["Admin Aide IV – Mechanic"];
competencyModel["Cook II"] = competencyModel["Admin Aide IV – Mechanic"];

// Dentist
competencyModel["Dentist II"] = competencyModel["Nurse II"];

// Dormitory Manager
competencyModel["Dormitory Manager III"] = competencyModel["Admin Officer III"];

// Executive Assistant
competencyModel["Executive Assistant III"] = competencyModel["Admin Assistant IV"];
competencyModel["Executive Assistant IV"]  = competencyModel["Admin Assistant IV"];

// Farm Worker
competencyModel["Farm Worker II"] = competencyModel["Farm Worker I"];

// Food Service Supervisor
competencyModel["Food Service Supervisor II"] = competencyModel["Admin Officer I"];

// Guidance
competencyModel["Guidance Coordinator I"] = competencyModel["Guidance Counselor III"];
competencyModel["Guidance Counselor I"]   = competencyModel["Guidance Counselor III"];

// Heavy Equipment Operator
competencyModel["Heavy Equipment Operator I"] = competencyModel["Admin Aide IV – Mechanic"];

// Houseparent
competencyModel["Houseparent II"] = competencyModel["Admin Officer I"];

// Information Officer
competencyModel["Information Officer I"]   = competencyModel["Admin Officer I"];
competencyModel["Information Officer II"]  = competencyModel["Admin Officer II"];
competencyModel["Information Officer III"] = competencyModel["Admin Officer III"];

// Information Systems Analyst
competencyModel["Information Systems Analyst I"]  = competencyModel["System Analyst"];
competencyModel["Information Systems Analyst II"] = competencyModel["System Analyst"];

// Information Technology Officer
competencyModel["Information Technology Officer I"] = competencyModel["System Analyst"];

// Internal Auditor — same financial/audit cluster as Accountant III
competencyModel["Internal Auditor I"]   = competencyModel["Accountant III"];
competencyModel["Internal Auditor II"]  = competencyModel["Accountant III"];
competencyModel["Internal Auditor III"] = competencyModel["Accountant III"];

// Legal Assistant
competencyModel["Legal Assistant II"]  = competencyModel["Attorney II"];
competencyModel["Legal Assistant III"] = competencyModel["Attorney II"];

// Machinist
competencyModel["Machinist I"] = competencyModel["Admin Aide IV – Mechanic"];

// Planning Officer
competencyModel["Planning Officer I"]   = competencyModel["Planning Officer"];
competencyModel["Planning Officer II"]  = competencyModel["Planning Officer"];
competencyModel["Planning Officer III"] = competencyModel["Planning Officer"];

// Project Development Officer
competencyModel["Project Development Officer I"]   = competencyModel["Planning Officer"];
competencyModel["Project Development Officer II"]  = competencyModel["Planning Officer"];
competencyModel["Project Development Officer III"] = competencyModel["Planning Officer"];

// School Farm / Farming
competencyModel["School Farm Demonstrator"]     = competencyModel["Farm Worker I"];
competencyModel["School Farming Coordinator I"] = competencyModel["Farm Worker I"];

// SUC President IV — alias to Chief Administrative Officer (CAO)
competencyModel["SUC President IV"] = competencyModel["Chief Administrative Officer (CAO)"];

// University Extension
competencyModel["University Extension Associate I"]    = competencyModel["Admin Officer I"];
competencyModel["University Extension Specialist I"]   = competencyModel["Admin Officer I"];
competencyModel["University Extension Specialist II"]  = competencyModel["Admin Officer II"];
competencyModel["University Extension Specialist III"] = competencyModel["Admin Officer III"];
competencyModel["University Extension Specialist IV"]  = competencyModel["Admin Officer IV"];
competencyModel["University Extension Specialist V"]   = competencyModel["Admin Officer V"];

// University Research
competencyModel["University Research Associate I"]  = competencyModel["Admin Officer I"];
competencyModel["University Research Associate II"] = competencyModel["Admin Officer II"];
competencyModel["University Researcher II"]         = competencyModel["Admin Officer II"];
competencyModel["University Researcher IV"]         = competencyModel["Admin Officer IV"];
competencyModel["University Researcher V"]          = competencyModel["Admin Officer V"];

// Veterinarian
competencyModel["Veterinarian II"] = competencyModel["Physician"];

// Vocational Placement Coordinator
competencyModel["Vocational Placement Coordinator I"] = competencyModel["Guidance Counselor III"];

// ── Lookup ──────────────────────────────────────────────────────────────────
async function doLookup() {
  lookupError.value = "";
  const suffix = lookupRefIdSuffix.value.trim().toUpperCase();
  lookupRefId.value = suffix ? `IDP-${suffix}` : '';
  const refId = lookupRefId.value;
  const emailPrefix = lookupEmailPrefix.value.trim().toLowerCase();
  const email = emailPrefix + "@carsu.edu.ph";
  lookupEmail.value = email; // keep in sync for PATCH payload

  if (!refId) {
    lookupError.value = "Please enter your Reference ID.";
    return;
  }
  if (!emailPrefix) {
    lookupError.value = "Please enter your CarSU email address.";
    return;
  }

  lookupLoading.value = true;
  try {
    const res = await fetch(
      `${API}/idp/${encodeURIComponent(refId)}/edit-check?email=${encodeURIComponent(email)}`,
    );
    if (res.status === 403) {
      const data = await res.json();
      // Distinguish locked vs wrong email by message content
      if (data.message && data.message.toLowerCase().includes("reviewed")) {
        stage.value = "locked";
      } else {
        lookupError.value = data.message || "Access denied.";
      }
      return;
    }
    if (res.status === 404) {
      lookupError.value =
        "No IDP found with that Reference ID. Please check and try again.";
      return;
    }
    if (!res.ok) {
      lookupError.value = "Something went wrong. Please try again.";
      return;
    }

    const record = await res.json();
    populateForm(record);

    // Fetch suggestions in parallel
    fetchSuggestions();

    lookupRefId.value = refId;
    stage.value = "form";
  } catch {
    lookupError.value =
      "Network error. Please check your connection and try again.";
  } finally {
    lookupLoading.value = false;
  }
}

function populateForm(record) {
  form.lastName = record.lastName || "";
  form.firstName = record.firstName || "";
  form.middleInitial = record.middleInitial || "";
  // Populate full email and extract prefix for the UI widget
  form.employeeEmail = record.employeeEmail || "";
  form.employeeEmailPrefix = (record.employeeEmail || "").replace(/@carsu\.edu\.ph$/i, "");
  form.datePrepared = record.datePrepared || "";
  form.officeAffiliation = record.officeAffiliation || "";
  form.collegeOfficeUnit = record.collegeOfficeUnit || "";
  form.collegeProgram = record.collegeProgram || "";
  form.personnelType = record.personnelType || "";
  form.currentPosition = record.currentPosition || "";
  form.designation = record.designation || "";
  form.educAttainment = record.educAttainment || "";
  form.educAttainmentSpec = record.educAttainmentSpec || "";
  form.yearsInPosition = record.yearsInPosition ?? "";
  form.yearsInCSU = record.yearsInCSU ?? "";
  form.supervisorName = record.supervisorName || "";
  form.supervisorEmail = record.supervisorEmail || "";
  form.supervisorEmailPrefix = (record.supervisorEmail || "").replace(/@carsu\.edu\.ph$/i, "");
  form.headerPurpose = record.headerPurpose || "";
  form.headerPurposeOther = record.headerPurposeOther || "";
  // Support both field names from backend (competencyPurpose or compPurpose)
  form.compPurpose = record.compPurpose || record.competencyPurpose || "";
  form.compPurposeOther = record.compPurposeOther || "";
  form.designationMode = record.designation === "N/A" || !record.designation ? "na" : "specify";

  // Set email hint states
  if (form.employeeEmailPrefix) emailHints.employee = { msg: "✓ Valid CarSU email", type: "success" };
  if (form.supervisorEmailPrefix) emailHints.supervisor = { msg: "✓ Valid CarSU email", type: "success" };

  try {
    form.competencyRows = JSON.parse(record.competencyRowsJson || "[]");
  } catch {
    form.competencyRows = [];
  }
  try {
    form.agapRows = JSON.parse(record.agapRowsJson || "[]");
  } catch {
    form.agapRows = [];
  }
  try {
    form.proactRows = JSON.parse(record.proactRowsJson || "[]");
  } catch {
    form.proactRows = [];
  }
}

// ── Suggestions ─────────────────────────────────────────────────────────────
async function fetchSuggestions() {
  try {
    const [heiRes, proactRes] = await Promise.all([
      fetch(`${API}/idp/suggestions/hei`),
      fetch(`${API}/idp/suggestions/proact`),
    ]);
    if (heiRes.ok) heiSuggestions.value = await heiRes.json();
    if (proactRes.ok) proactSuggestions.value = await proactRes.json();
  } catch {
    /* suggestions are optional */
  }
}

// ── Email validation helper (edit form) ──────────────────────────────────────
function validateEditEmail(who) {
  const prefix = who === "employee" ? form.employeeEmailPrefix : form.supervisorEmailPrefix;
  const hint = emailHints[who];
  if (who === "employee") {
    form.employeeEmail = (prefix || "").trim() + "@carsu.edu.ph";
  } else {
    form.supervisorEmail = (prefix || "").trim() + "@carsu.edu.ph";
  }
  if (!prefix || !prefix.trim()) {
    hint.msg = "";
    hint.type = "";
    return false;
  }
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(prefix.trim())) {
    hint.msg = "Invalid characters in email prefix.";
    hint.type = "error";
    return false;
  }
  hint.msg = "✓ Valid CarSU email";
  hint.type = "success";
  return true;
}

// ── Submit edit ──────────────────────────────────────────────────────────────
async function doSubmitEdit() {
  // Assemble full emails from prefixes before submitting
  form.employeeEmail = (form.employeeEmailPrefix || "").trim() + "@carsu.edu.ph";
  form.supervisorEmail = (form.supervisorEmailPrefix || "").trim() + "@carsu.edu.ph";
  submitLoading.value = true;
  try {
    // Compose the full name string the supervisor view reads directly
    const nameOfPersonnel = [form.lastName, form.firstName, form.middleInitial]
      .filter(Boolean)
      .join(", ");

    const payload = {
      email: lookupEmail.value.trim().toLowerCase(),
      ...form,
      // Composed / static fields the supervisor page reads directly
      nameOfPersonnel,
      campus: "CSU Main Campus",
      // Send competencyPurpose under both names the backend may use
      compPurpose: form.compPurpose,
      competencyPurpose: form.compPurpose,
      // Pass parsed arrays — backend will re-stringify as *RowsJson
      competencyRows: form.competencyRows,
      agapRows: form.agapRows,
      proactRows: form.proactRows,
    };

    const res = await fetch(
      `${API}/idp/${encodeURIComponent(lookupRefId.value.trim().toUpperCase())}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (res.status === 403) {
      const data = await res.json();
      if (data.message && data.message.toLowerCase().includes("reviewed")) {
        stage.value = "locked";
      } else {
        alert(data.message || "Access denied.");
      }
      return;
    }
    if (!res.ok) {
      alert("Failed to save changes. Please try again.");
      return;
    }

    stage.value = "success";
  } catch {
    alert("Network error. Please check your connection and try again.");
  } finally {
    submitLoading.value = false;
  }
}

function cancelEdit() {
  stage.value = "lookup";
  lookupEmailPrefix.value = "";
  // Clear loaded form data so no stale content lingers behind the lookup card
  Object.assign(form, {
    lastName: "", firstName: "", middleInitial: "",
    employeeEmailPrefix: "", employeeEmail: "",
    datePrepared: "", officeAffiliation: "", collegeOfficeUnit: "",
    collegeProgram: "", personnelType: "", currentPosition: "",
    designation: "", educAttainment: "", educAttainmentSpec: "",
    yearsInPosition: "", yearsInCSU: "", supervisorName: "",
    supervisorEmailPrefix: "", supervisorEmail: "",
    headerPurpose: "", headerPurposeOther: "",
    compPurpose: "", compPurposeOther: "",
    designationMode: "na",
    competencyRows: [], agapRows: [], proactRows: [],
  });
  Object.assign(emailHints, {
    employee: { msg: "", type: "" },
    supervisor: { msg: "", type: "" },
  });
}

function resetAndEdit() {
  stage.value = "lookup";
  // Re-trigger lookup immediately with same credentials
  doLookup();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");

/* ── CSS Variables ── */
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
  --success: #1a6b3c;
  --input-bg: #ffffff;
  --readonly-bg: #f0ede8;
  --shadow: 0 4px 24px rgba(0, 51, 0, 0.1);
  --shadow-sm: 0 2px 8px rgba(0, 51, 0, 0.07);
  --shadow-lg: 0 8px 40px rgba(0, 51, 0, 0.12);
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}

/* ── Page Nav ── */
.page-nav {
  background: var(--navy);
  padding: 0 28px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.back-link {
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
.back-link::after {
  content: '';
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
.back-link:hover { color: #fff; }
.back-link:hover::after { transform: scaleX(1); }
.back-link svg {
  width: 13px; height: 13px;
  stroke: currentColor; fill: none;
  stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
  opacity: 0.8; transition: transform 0.2s, opacity 0.2s;
}
.back-link:hover svg { transform: translateX(-3px); opacity: 1; }
.nav-sep { color: rgba(255,255,255,0.25); font-size: 13px; margin: 0 10px; }
.nav-current { font-size: 12.5px; color: var(--gold); font-weight: 600; letter-spacing: 0.03em; }

/* ── Container ── */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 32px 80px;
}

/* ── Form title block ── */
.form-title-block {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--gold);
}
.form-title-block h2 {
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  color: var(--navy);
  margin-bottom: 6px;
}
.form-title-block p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 14px;
}
.edit-ref-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--navy);
  color: var(--gold-light);
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 8px;
  letter-spacing: 0.07em;
}
.edit-ref-badge svg { stroke: var(--gold); flex-shrink: 0; }

/* ── Section card ── */
.section-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 28px;
  overflow: hidden;
  border: 1px solid var(--border);
  animation: fadeUp 0.4s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
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
.section-header h3 { color: var(--white); font-size: 15px; font-weight: 600; letter-spacing: 0.03em; }
.section-header p { color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 1px; }
.section-body { padding: 34px 40px; }

/* ── Section desc ── */
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

/* ── Form fields ── */
.field-grid { display: grid; gap: 24px; }
.field-grid-2 { grid-template-columns: 1fr 1fr; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group.span-2 { grid-column: span 2; }
label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
label .req { color: var(--error); margin-left: 2px; }
.req { color: var(--error); }
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
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
select {
  min-width: 160px;
  max-width: 100%;
  cursor: pointer;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(0, 51, 0, 0.08);
  background: var(--white);
}
input.error, select.error { border-color: var(--error); }
.field-hint {
  display: block;
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
  font-weight: 500;
  letter-spacing: 0.03em;
}
.input-disabled {
  background: var(--readonly-bg) !important;
  color: var(--text-light) !important;
  cursor: not-allowed;
}
.static-value {
  background: var(--readonly-bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
}

/* ── Name grid ── */
.name-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 90px;
  gap: 12px;
  align-items: start;
}
.name-grid input { width: 100%; }
.mi-col { max-width: 90px; }

/* ── Checkbox / radio pill groups ── */
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
  transition: all 0.2s;
  font-size: 13px;
}
.checkbox-item:hover { border-color: var(--navy); background: var(--white); }
.checkbox-item input[type="radio"],
.checkbox-item input[type="checkbox"] {
  width: auto; padding: 0; border: none; background: none;
  accent-color: var(--navy); cursor: pointer;
}
.checkbox-item.checked {
  border-color: var(--navy);
  background: rgba(0, 51, 0, 0.05);
}

/* ── Designation toggle ── */
.designation-toggle {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

/* ── Other specify ── */
.other-specify { margin-top: 10px; display: none; }
.other-specify.visible { display: block; }

/* ── Required level badge ── */
.required-level-badge {
  background: var(--navy);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  text-align: center;
  white-space: nowrap;
}
.required-level-empty {
  font-size: 11px;
  color: var(--text-light);
  font-style: italic;
  text-align: center;
}

/* ── Dynamic tables ── */
.table-wrapper { overflow-x: auto; margin-top: 16px; }
.dynamic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 700px;
}
.dynamic-table thead tr { background: var(--navy-mid); }
.dynamic-table thead th {
  padding: 10px 12px;
  color: var(--white);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
  border-right: 1px solid rgba(255,255,255,0.1);
}
.dynamic-table thead th:last-child { border-right: none; }
.dynamic-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.dynamic-table tbody tr:hover { background: #f5f4f0; }
.dynamic-table tbody td {
  padding: 8px 10px;
  vertical-align: top;
  border-right: 1px solid var(--border);
}
.dynamic-table tbody td:last-child { border-right: none; text-align: center; }
.dynamic-table td input,
.dynamic-table td select,
.dynamic-table td textarea {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 6px;
}
.table-actions { display: flex; gap: 10px; margin-top: 12px; }
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
.btn-add-row:hover { background: var(--navy-mid); }
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
.btn-remove-row:hover { background: rgba(192, 57, 43, 0.08); }
.row-num-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  vertical-align: middle;
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

/* ── Submit area ── */
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
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(0,51,0,0.2);
}
.btn-submit:hover { background: var(--navy-mid); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,51,0,0.25); }
.btn-submit:disabled { background: #aaa; cursor: not-allowed; transform: none; box-shadow: none; }

/* ── Centered cards (lookup, locked, success) ── */
.token-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  padding: 24px;
}
.token-card, .locked-card, .success-card {
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  max-width: 460px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0, 51, 0, 0.12);
  border: 1px solid var(--border);
}
.locked-card { border-color: #f5c6c2; }
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
.token-guidance {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: #888;
  margin-top: -2px;
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
  font-family: "Roboto", sans-serif;
}
.btn-load:hover { background: var(--navy-mid); }
.btn-load:disabled { background: #aaa; cursor: not-allowed; }
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.field-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.req { color: var(--error); margin-left: 2px; }
.email-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--input-bg);
}
.email-prefix-wrapper.error { border-color: var(--error); }
.email-prefix-input {
  flex: 1;
  border: none !important;
  background: transparent !important;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  font-family: "Roboto", sans-serif;
  color: var(--text);
}
.email-suffix {
  padding: 10px 14px;
  background: #e8ede8;
  color: var(--text-light);
  font-size: 13px;
  border-left: 1px solid var(--border);
  white-space: nowrap;
}
.locked-icon { width: 68px; height: 68px; background: rgba(192,57,43,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 34px; margin: 0 auto 18px; }
.locked-card h2 { font-family: "Roboto", sans-serif; font-size: 22px; color: var(--error); margin-bottom: 8px; text-align: center; }
.locked-card > p { font-size: 13px; color: var(--text-light); line-height: 1.6; text-align: center; margin-bottom: 6px; }
.success-icon { font-size: 48px; margin-bottom: 16px; text-align: center; }
.success-card h2 { font-family: "Roboto", sans-serif; font-size: 22px; color: var(--navy); margin-bottom: 8px; text-align: center; }
.success-card > p { font-size: 13px; color: var(--text-light); line-height: 1.6; text-align: center; margin-bottom: 6px; }
.ref-box {
  font-family: monospace; font-size: 20px; font-weight: 700; color: var(--navy);
  background: rgba(0,51,0,0.06); border: 1px solid rgba(0,51,0,0.15);
  border-radius: 8px; padding: 10px 20px; display: inline-block; margin: 16px 0;
}
.success-actions { display: flex; gap: 12px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }

.btn-primary-link {
  padding: 11px 24px; background: var(--navy); color: #fff;
  border-radius: 9px; font-family: inherit; font-size: 13px; font-weight: 600;
  text-decoration: none; display: inline-block; transition: background 0.2s;
}
.btn-primary-link:hover { background: var(--navy-mid); }
.btn-secondary {
  padding: 11px 24px; background: var(--white); color: var(--navy);
  border: 1.5px solid var(--border); border-radius: 9px;
  font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--navy); }
.btn-cancel-edit {
  margin-left: auto;
  padding: 7px 16px;
  background: none;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 7px;
  font-family: inherit; font-size: 12px; font-weight: 600;
  color: rgba(255,255,255,0.75);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-cancel-edit:hover { border-color: var(--error); color: #ffaaaa; background: rgba(192,57,43,0.1); }

/* ── Other specify ── */
.other-specify {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.2s;
  opacity: 0;
  margin-top: 0;
}
.other-specify.visible {
  max-height: 80px;
  opacity: 1;
  margin-top: 8px;
}
.other-specify input {
  width: 100%;
}

/* ── Disabled input ── */
.input-disabled {
  background: var(--readonly-bg, #f0ede8) !important;
  color: var(--text-light) !important;
  cursor: not-allowed;
}

/* ── Email prefix widget ── */
.email-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--input-bg, #ffffff);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.email-prefix-wrapper:focus-within {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(0,51,0,0.08);
  background: #fff;
}
.email-prefix-wrapper.error { border-color: var(--error); }
.email-prefix-wrapper.valid { border-color: var(--success, #1a6b3c); }
.email-prefix-wrapper.disabled {
  background: var(--readonly-bg, #f0ede8);
  opacity: 0.8;
}
.email-prefix-input {
  flex: 1;
  border: none !important;
  background: transparent !important;
  padding: 10px 12px !important;
  outline: none !important;
  box-shadow: none !important;
  font-size: 14px;
  color: var(--text);
  font-family: "Roboto", sans-serif;
  min-width: 0;
}
.email-prefix-input:disabled { color: var(--text-light, #5a6070); cursor: not-allowed; }
.email-suffix {
  padding: 10px 12px;
  background: #e8ede8;
  color: var(--text-light);
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  border-left: 1.5px solid var(--border);
  user-select: none;
}
.email-hint {
  font-size: 12px;
  margin-top: 2px;
  min-height: 16px;
  display: block;
}
.email-hint.error { color: var(--error); }
.email-hint.success { color: var(--success, #1a6b3c); }

/* ── Reference ID prefix widget ── */
.ref-prefix-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--input-bg, #ffffff);
}
.ref-prefix-wrapper.err { border-color: var(--error); }
.ref-prefix-wrapper:focus-within { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,51,0,0.08); }
.ref-prefix {
  padding: 10px 12px;
  background: rgba(0,51,0,0.07);
  color: var(--navy-mid, #2d6a3f);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  border-right: 1.5px solid var(--border);
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
  font-family: inherit;
  color: var(--text);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .container { padding: 28px 20px 60px; }
  .section-body { padding: 20px 18px; }
  .field-grid-2 { grid-template-columns: 1fr; }
  .field-group.span-2 { grid-column: span 1; }
}
@media (max-width: 768px) {
  .container { padding: 20px 14px 60px; }
  .section-body { padding: 16px 14px; }
  .field-grid-2 { grid-template-columns: 1fr; }
  .field-group.span-2 { grid-column: span 1; }
  .page-nav { padding: 0 14px; }
  .page-nav .nav-current, .page-nav .nav-sep { display: none; }
  .name-grid { grid-template-columns: 1fr 1fr; }
  .mi-col { max-width: 100%; }
  .section-header { flex-wrap: wrap; gap: 8px; padding: 12px 14px; }
  .btn-cancel-edit { margin-left: 0; width: 100%; text-align: center; }
  .form-title-block { padding-bottom: 16px; margin-bottom: 20px; }
  .form-title-block h2 { font-size: 19px; }
  .edit-ref-badge { font-size: 11px; }
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .dynamic-table { min-width: 600px; }
  .submit-area { padding: 20px 14px; }
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 480px) {
  .token-card, .locked-card, .success-card { padding: 28px 16px; }
  .name-grid { grid-template-columns: 1fr; }
  .mi-col { max-width: 100%; }
  .checkbox-group { gap: 6px; }
  .checkbox-item { font-size: 12px; padding: 6px 10px; }
  .section-header { padding: 10px 12px; }
  .section-body { padding: 14px 12px; }
}
</style>