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
          In accordance with the
          <strong>Data Privacy Act of 2012 (R.A. 10173)</strong>, Caraga State
          University informs you that the personal information collected through
          the <strong>Individual Development Plan (IDP)</strong> form will be
          processed for authorized and official human resource management and
          development purposes.
        </p>
        <p>
          The <strong>Individual Development Plan (IDP)</strong> is the
          University's official tool for guiding employees in mapping out their
          personal and professional growth. It facilitates self-assessment, goal
          setting, and alignment of individual development needs with the
          University's strategic directions. The IDP supports evidence-based
          planning of learning interventions, including competency development,
          academic advancement, and participation in training programs.
        </p>
        <p>Specifically, the information you provide will be used for:</p>
        <ul>
          <li>Assessing individual learning and development needs</li>
          <li>
            Planning and recommending appropriate training and development
            interventions
          </li>
          <li>
            Supporting performance development and career progression
            initiatives
          </li>
          <li>
            Contributing to office-level and institutional Learning and
            Development (LeaD) planning
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
          You have the right to access, correct, or request the deletion of your
          personal data. For any inquiries or concerns, you may contact the
          Human Resource Management Services at
          <strong>hrmslandd@carsu.edu.ph</strong>.
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

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 1 SUCCESS SCREEN                          -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'stage1-success'" class="success-screen">
    <div class="success-icon">✓</div>
    <h2>IDP Successfully Submitted</h2>
    <p>
      Your Individual Development Plan has been received. Your supervisor has
      been notified and has <strong>3 days</strong> to complete their
      assessment.
    </p>
    <div class="ref-id-box">{{ refId }}</div>
    <p>
      Please keep your <strong>Reference ID</strong> for your records. You will
      receive an email confirmation shortly.
    </p>
    <p style="color: #1a6b3c; font-weight: 600; margin-top: 16px">
      📧 A complete copy of your IDP (including your supervisor's assessment)
      will be emailed to you once your supervisor submits their review.
    </p>
    <br />
    <a href="/" class="btn-return">← Return to Home</a>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 2 TOKEN SCREEN                            -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'token'" class="token-screen">
    <h2>Access IDP for Review</h2>
    <p>
      Enter your CarSU email address to verify your identity and load the
      employee's submission.
    </p>
    <input
      v-model="tokenInput"
      type="text"
      placeholder="Token (auto-filled from email link)"
      style="margin-bottom: 12px"
    />
    <input
      v-model="supervisorEmailInput"
      type="email"
      placeholder="Your CarSU email (e.g. name@carsu.edu.ph)"
      style="margin-bottom: 16px"
    />
    <div class="token-error">{{ tokenError }}</div>
    <button class="btn-load" @click="loadByToken">Verify &amp; Load IDP</button>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 2 SUCCESS SCREEN                          -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'stage2-success'" class="success-screen">
    <div class="success-icon">✓</div>
    <h2>Assessment Submitted</h2>
    <p>
      Your assessment for this IDP has been recorded. HRMS has been notified
      that the IDP is now fully complete. Thank you.
    </p>
    <div
      style="
        margin: 16px 0;
        padding: 14px 18px;
        background: rgba(26, 77, 46, 0.07);
        border-left: 4px solid var(--navy);
        border-radius: 8px;
        text-align: left;
      "
    >
      <p style="margin: 0 0 4px; font-weight: 600; color: var(--navy)">
        📧 Employee has been notified
      </p>
      <p style="margin: 0; color: var(--text-light); font-size: 14px">
        A complete copy of the IDP — including your assessment — has been
        automatically emailed to the employee.
      </p>
    </div>
  </div>

  <!-- print area -->
  <div id="printArea" style="display: none"></div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 1: EMPLOYEE FORM                          -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'stage1'" class="container">
    <!-- ── HEADER INFO ── -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-num"></div>
        <div>
          <h3>Personnel Information</h3>
          <p>Basic details and submission purpose</p>
        </div>
      </div>
      <div class="section-body">
        <!-- Campus -->
        <div class="field-group" style="margin-bottom: 20px">
          <label>Campus</label>
          <div class="static-value">CSU Main Campus</div>
        </div>

        <!-- Office Affiliation -->
        <div class="field-group" style="margin-bottom: 20px">
          <label>Pillars <span class="req">*</span></label>
          <select v-model="form.officeAffiliation" style="width: 100%; margin-bottom: 0">
            <option value="">Select…</option>
            <option>OVPAF</option>
            <option>OVPAA</option>
            <option>OVPEO</option>
            <option>OVPSAS</option>
            <option>OVPRDIE</option>
          </select>
        </div>

        <!-- College / Office / Unit -->
        <div class="field-grid field-grid-2" style="margin-bottom: 18px">
          <div class="field-group span-2">
            <label>College / Office / Unit <span class="req">*</span></label>
            <select v-model="form.collegeOfficeUnit" :disabled="!form.officeAffiliation" style="width: 100%; margin-bottom: 0">
              <option value="">Select…</option>
              <option v-for="opt in collegeOfficeUnitOptions" :key="opt" :value="opt">
                {{ opt }}
              </option>
            </select>
          </div>
          <div v-if="isOVPAA && selectedCollegePrograms.length" class="field-group span-2">
            <label>Program / Department</label>
            <select v-model="form.collegeProgram" style="width: 100%; margin-bottom: 0">
              <option value="">Select…</option>
              <option v-for="p in selectedCollegePrograms" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
          </div>
        </div>

        <!-- Name of Personnel -->
        <div class="field-group" style="margin-bottom: 18px">
          <label>Name of Personnel <span class="req">*</span></label>
          <div class="name-grid">
            <div>
              <small class="field-hint">Last Name</small>
              <input
                v-model="form.lastName"
                type="text"
                placeholder="DELA CRUZ"
                @input="form.lastName = form.lastName.toUpperCase()"
              />
            </div>
            <div>
              <small class="field-hint">First Name</small>
              <input
                v-model="form.firstName"
                type="text"
                placeholder="JUAN"
                @input="form.firstName = form.firstName.toUpperCase()"
              />
            </div>
            <div class="mi-col">
              <small class="field-hint">M.I.</small>
              <input
                v-model="form.middleInitial"
                type="text"
                maxlength="1"
                placeholder="A"
                @input="form.middleInitial = form.middleInitial.toUpperCase()"
              />
            </div>
          </div>
        </div>

        <div class="field-grid field-grid-2" style="margin-bottom: 18px">
          <!-- Employee Email -->
          <div class="field-group">
            <label>CarSU Email Address <span class="req">*</span></label>
            <div class="static-value" style="display: flex; align-items: center; padding: 0 14px">
              <input
                v-model="form.employeeEmailPrefix"
                type="text"
                placeholder="juan.delacruz"
                style="border: none; background: transparent; padding: 10px 0; flex: 1"
              />@carsu.edu.ph
            </div>
            <small class="email-hint" :class="emailHints.employee.type">{{
              emailHints.employee.msg
            }}</small>
          </div>

          <!-- Educational Attainment -->
          <div class="field-group span-2">
            <label>Highest Educational Attainment <span class="req">*</span></label>
            <select v-model="form.educAttainment" style="width: 100%; margin-bottom: 0">
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
            <input
              v-model="form.educAttainmentSpec"
              type="text"
              placeholder="Specify degree / program"
              style="margin-top: 8px"
              @input="form.educAttainmentSpec = form.educAttainmentSpec.toUpperCase()"
            />
          </div>

          <!-- Position & Designation -->
          <div class="field-group span-2">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px"
            >
              <div class="field-group">
                <label>Position <span class="req">*</span></label>
                <select v-model="form.currentPosition">
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
              <div class="field-group">
                <label>Designation <span class="req">*</span></label>
                <input
                  v-model="form.designation"
                  type="text"
                  placeholder="Director / N/A"
                  @input="form.designation = form.designation.toUpperCase()"
                />
              </div>
            </div>
          </div>

          <!-- Years in Position -->
          <div class="field-group">
            <label>Years in Position <span class="req">*</span></label>
            <input v-model="form.yearsInPosition" type="number" min="0" placeholder="0" />
          </div>

          <div class="field-group">
            <label>Years in CSU <span class="req">*</span></label>
            <input v-model="form.yearsInCSU" type="number" min="0" placeholder="0" />
          </div>

          <div class="field-group">
            <label>Immediate Supervisor Name <span class="req">*</span></label>
            <input
              v-model="form.supervisorName"
              type="text"
              placeholder="Last name, First name, M.I."
              @input="form.supervisorName = form.supervisorName.toUpperCase()"
            />
            <small class="field-hint"
              >Format: Last name, First name, M.I.</small
            >
          </div>

          <div class="field-group">
            <label>Supervisor CarSU Email <span class="req">*</span></label>
            <div class="static-value" style="display: flex; align-items: center; padding: 0 14px">
              <input
                v-model="form.supervisorEmailPrefix"
                type="text"
                placeholder="supervisor.name"
                style="border: none; background: transparent; padding: 10px 0; flex: 1"
              />@carsu.edu.ph
            </div>
            <small class="email-hint" :class="emailHints.supervisor.type">{{
              emailHints.supervisor.msg
            }}</small>
          </div>

          <!-- Purpose — still editable -->
          <div class="field-group span-2">
            <label>Purpose <span class="req">*</span></label>
            <div class="checkbox-group">
              <label
                v-for="option in purposeOptions"
                :key="option"
                class="checkbox-item"
                :class="{ checked: form.headerPurpose === option }"
              >
                <input
                  type="radio"
                  name="headerPurpose"
                  :value="option"
                  v-model="form.headerPurpose"
                />
                {{ option }}
              </label>
            </div>
            <div
              class="other-specify"
              :class="{ visible: form.headerPurpose === 'Other' }"
            >
              <input
                type="text"
                v-model="form.headerPurposeOther"
                placeholder="Please specify…"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SECTION I: COMPETENCY ASSESSMENT ── -->
    <div class="section-card section-card-collapsible">
      <div class="section-header">
        <div class="section-num">I</div>
        <div>
          <h3>Competency Assessment</h3>
          <p>Identify key competencies to develop</p>
        </div>
        <div v-if="!form.headerPurpose" class="section-locked-badge">
          Complete Section H first
        </div>
      </div>
      <transition name="reveal">
        <div v-if="form.headerPurpose" class="section-body">
          <div class="section-desc">
            Identify key competencies you need to develop based on your current
            or target role. For detailed descriptions and behavioral indicators,
            please refer to the
            <a
              href="https://tinyurl.com/CompetencyManualandModel"
              target="_blank"
              >Competency Manual and Model</a
            >.
          </div>

          <div class="field-group" style="margin-bottom: 20px">
            <label>Purpose <span class="req">*</span></label>
            <div class="checkbox-group">
              <label
                v-for="option in compPurposeOptions"
                :key="option.value"
                class="checkbox-item"
                :class="{ checked: form.compPurpose === option.value }"
              >
                <input
                  type="radio"
                  name="compPurpose"
                  :value="option.value"
                  v-model="form.compPurpose"
                />
                {{ option.label }}
              </label>
            </div>
            <div
              class="other-specify"
              :class="{ visible: form.compPurpose === 'Others' }"
            >
              <input
                type="text"
                v-model="form.compPurposeOther"
                placeholder="Please specify…"
              />
            </div>
          </div>

          <div class="table-wrapper">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th style="min-width: 180px">Target Competency</th>
                  <th style="width: 90px">Current Level</th>
                  <th style="width: 90px">Required Level</th>
                  <th>Suggested LeaD Interventions</th>
                  <th style="width: 90px">Target Timeline</th>
                  <th style="width: 40px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in competencyRows" :key="idx">
                  <td class="row-num-cell">{{ idx + 1 }}</td>
                  <td>
                    <select
                      v-model="row.targetCompetency"
                      style="min-width: 200px"
                      @change="
                        row.competencyGroup = getCompetencyCluster(
                          row.targetCompetency,
                        );
                        row.requiredLevel = getRequiredLevel(
                          row.targetCompetency,
                          form.currentPosition,
                        );
                      "
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
                    <select
                      v-model="row.leadInterventions"
                      style="min-width: 200px"
                    >
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
                          Conferences, Training Programs, Conventions, Seminars,
                          and Cum Paper Presentations
                        </option>
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
                    <button
                      class="btn-remove-row"
                      @click="removeRow(competencyRows, idx)"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-actions">
            <button class="btn-add-row" @click="addCompetencyRow">
              + Add Row
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ── SECTION II: AGAP ── -->
    <div class="section-card section-card-collapsible">
      <div class="section-header">
        <div class="section-num">II</div>
        <div>
          <h3>Academic Growth and Advancement Program (AGAP)</h3>
          <p>Plans for academic advancement</p>
        </div>
        <div v-if="!sectionIComplete" class="section-locked-badge">
          Complete Section I first
        </div>
      </div>
      <transition name="reveal">
        <div v-if="sectionIComplete" class="section-body">
          <div class="section-desc">
            Outline your plans for academic advancement, such as enrolling in
            graduate or certification programs. Ensure alignment with your role
            and CSU's academic goals.
          </div>
          <div class="table-wrapper">
            <table class="dynamic-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th>Degree Program</th>
                  <th style="min-width: 200px">Target HEI</th>
                  <th
                    style="
                      width: 70px;
                      white-space: normal;
                      word-break: break-word;
                      font-size: 10px;
                    "
                  >
                    Mode of Study
                  </th>
                  <th style="min-width: 180px">Target Scholarship Grant</th>
                  <th
                    style="
                      width: 70px;
                      white-space: normal;
                      word-break: break-word;
                      font-size: 10px;
                    "
                  >
                    Intended Year of Enrollment
                  </th>
                  <th style="width: 40px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in agapRows" :key="idx">
                  <td class="row-num-cell">{{ idx + 1 }}</td>
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
                    <input
                      type="text"
                      v-model="row.targetHEI"
                      placeholder="Full name of School"
                      list="hei-suggestions"
                    />
                    <datalist id="hei-suggestions">
                      <option v-for="s in heiSuggestions" :key="s" :value="s" />
                    </datalist>
                    <small
                      class="field-hint"
                      style="
                        color: #c0392b;
                        font-style: italic;
                        margin-top: 3px;
                      "
                    >
                      ⚠ Do not abbreviate.
                    </small>
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
                    <input
                      type="text"
                      v-model="row.scholarshipGrant"
                      placeholder=""
                    />
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
                    <button
                      class="btn-remove-row"
                      @click="removeRow(agapRows, idx)"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-actions">
            <button class="btn-add-row" @click="addAgapRow">+ Add Row</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ── SECTION III: PRO-ACT ── -->
    <div class="section-card section-card-collapsible">
      <div class="section-header">
        <div class="section-num">III</div>
        <div>
          <h3>
            Professional Advancement through Capacity-Building and Trainings
            (Pro-ACT)
          </h3>
          <p>Training and workshop interventions</p>
        </div>
        <div v-if="!sectionIIComplete" class="section-locked-badge">
          Complete Section II first
        </div>
      </div>
      <transition name="reveal">
        <div v-if="sectionIIComplete" class="section-body">
          <div class="section-desc">
            If a training intervention is identified in Part I (Competency
            Assessment), provide more detailed information here.
          </div>
          <div class="table-wrapper">
            <table class="dynamic-table proact-table">
              <thead>
                <tr>
                  <th style="width: 40px">No.</th>
                  <th
                    style="min-width: 200px; background: var(--navy); opacity: 0.92"
                  >
                    Target Competency / Skill
                    <span
                      style="font-size: 10px; font-weight: 400; opacity: 0.8"
                      >(from Section I)</span
                    >
                  </th>
                  <th>Training / LeaD Intervention</th>
                  <th
                    style="
                      width: 180px;
                      white-space: normal;
                      word-break: break-word;
                      font-size: 10px;
                    "
                  >
                      Mode    of  Activity     
                  </th>
                  <th style="min-width: 100px">   Trainer / Provider    </th>
                  <th
                    style="
                      width: 100px;
                      white-space: normal;
                      word-break: break-word;
                      font-size: 10px;
                    "
                  >
                    Target Timeline   
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                <template v-if="filledCompetencies.length === 0">
                  <tr>
                    <td
                      colspan="6"
                      style="
                        text-align: center;
                        color: var(--text-light);
                        font-style: italic;
                        padding: 20px;
                      "
                    >
                      Add competencies in Section I to populate this table.
                    </td>
                  </tr>
                </template>
                <tr
                  v-for="(competency, idx) in filledCompetencies"
                  :key="competency"
                >
                  <td class="row-num-cell">{{ idx + 1 }}</td>
                  <td style="background: rgba(0, 51, 0, 0.04)">
                    <div class="proact-skill-label">{{ competency }}</div>
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
                          Conferences, Training Programs, Conventions, Seminars,
                          and Cum Paper Presentations
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
                      placeholder="e.g. HRMS"
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
            v-if="filledCompetencies.length > 0"
            style="font-size: 13px; color: var(--text-light); margin-top: 10px"
          >
            Rows are auto-generated based on competencies entered in Section I.
          </p>
        </div>
      </transition>
    </div>

    <!-- ── SUBMIT STAGE 1 ── -->
    <transition name="reveal">
      <div v-if="sectionIIIComplete" class="submit-area">
        <p>
          Please review your submission before finalizing. You can go back and
          edit any section if needed.
        </p>
        <button
          class="btn-submit"
          :class="{ 'btn-clicked': clickedButtons['review-stage1'] }"
          :disabled="isSubmitting"
          @click="openReview1"
        >
          Review &amp; Submit
        </button>
      </div>
    </transition>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- REVIEW SCREEN — STAGE 1                         -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'review1'" class="container review-container">
    <div class="review-header-block">
      <div class="review-eyebrow">
        Individual Development Plan (IDP) 2026–2031
      </div>
      <h2 class="review-title">Review Your Submission</h2>
      <p class="review-subtitle">
        Please verify all information below before submitting. Use
        <strong>Go Back &amp; Edit</strong> to make changes.
      </p>
    </div>

    <!-- H: Personnel Information -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">H</span>
        <span class="review-card-title">Personnel Information</span>
      </div>
      <div class="review-card-body">
        <div class="review-grid">
          <div class="review-field">
            <span class="review-label">Campus</span>
            <span class="review-value">CSU Main Campus</span>
          </div>
          <div class="review-field">
            <span class="review-label">Employee Email</span>
            <span class="review-value"
              >{{ form.employeeEmailPrefix }}@carsu.edu.ph</span
            >
          </div>
          <div class="review-field">
            <span class="review-label">Pillars</span>
            <span class="review-value">{{
              form.officeAffiliation || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">College / Office / Unit</span>
            <span class="review-value">{{
              form.collegeOfficeUnit === "__others__"
                ? form.collegeOfficeUnitOther
                : form.collegeOfficeUnit || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Name of Personnel</span>
            <span class="review-value">{{
              [form.lastName, form.firstName, form.middleInitial]
                .filter(Boolean)
                .join(", ") || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Current Position</span>
            <span class="review-value">{{ form.currentPosition || "—" }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Designation</span>
            <span class="review-value">{{ form.designation || "—" }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Educational Attainment</span>
            <span class="review-value"
              >{{ form.educAttainment || "—"
              }}{{
                form.educAttainmentSpec ? " — " + form.educAttainmentSpec : ""
              }}</span
            >
          </div>
          <div class="review-field">
            <span class="review-label">Years in Position</span>
            <span class="review-value">{{ form.yearsInPosition || "—" }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Years in CSU</span>
            <span class="review-value">{{ form.yearsInCSU || "—" }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Supervisor Name</span>
            <span class="review-value">{{ form.supervisorName || "—" }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Supervisor Email</span>
            <span class="review-value"
              >{{ form.supervisorEmailPrefix }}@carsu.edu.ph</span
            >
          </div>
          <div class="review-field">
            <span class="review-label">Purpose</span>
            <span class="review-value">{{
              form.headerPurpose === "Other"
                ? form.headerPurposeOther
                : form.headerPurpose || "—"
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- I: Competency Assessment -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">I</span>
        <span class="review-card-title">Competency Assessment</span>
      </div>
      <div class="review-card-body">
        <div class="review-field" style="margin-bottom: 14px">
          <span class="review-label">Competency Purpose</span>
          <span class="review-value">{{
            form.compPurpose === "Others"
              ? form.compPurposeOther
              : form.compPurpose || "—"
          }}</span>
        </div>
        <div class="review-table-wrap">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 40px">No.</th>
                <th>Target Competency</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>LeaD Interventions</th>
                <th>Target Year</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!competencyRows.length">
                <td
                  colspan="7"
                  style="
                    text-align: center;
                    color: var(--text-light);
                    padding: 16px;
                    font-style: italic;
                  "
                >
                  No entries provided.
                </td>
              </tr>
              <tr v-for="(row, idx) in competencyRows" :key="idx">
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ idx + 1 }}
                </td>
                <td>{{ row.targetCompetency || "—" }}</td>
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

    <!-- II: AGAP -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">II</span>
        <span class="review-card-title"
          >Academic Growth and Advancement Program (AGAP)</span
        >
      </div>
      <div class="review-card-body">
        <div class="review-table-wrap">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 40px">No.</th>
                <th>Degree Program</th>
                <th>Target HEI</th>
                <th>Mode of Study</th>
                <th>Target Scholarship Grant</th>
                <th>Intended Year of Enrollment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!agapRows.length">
                <td
                  colspan="7"
                  style="
                    text-align: center;
                    color: var(--text-light);
                    padding: 16px;
                    font-style: italic;
                  "
                >
                  No entries provided.
                </td>
              </tr>
              <tr v-for="(row, idx) in agapRows" :key="idx">
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ idx + 1 }}
                </td>
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

    <!-- III: Pro-ACT -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">III</span>
        <span class="review-card-title"
          >Professional Advancement through Capacity-Building and Trainings
          (Pro-ACT)</span
        >
      </div>
      <div class="review-card-body">
        <div class="review-table-wrap">
          <table class="review-table">
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
              <tr v-if="!proactRows.length">
                <td
                  colspan="7"
                  style="
                    text-align: center;
                    color: var(--text-light);
                    padding: 16px;
                    font-style: italic;
                  "
                >
                  No entries provided.
                </td>
              </tr>
              <tr v-for="(row, idx) in proactRows" :key="idx">
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ idx + 1 }}
                </td>
                <td>
                  {{
                    row.trainingTitle === "__others__"
                      ? row.trainingTitleOther
                      : row.trainingTitle || "—"
                  }}
                </td>
                <td>{{ row.targetSkill || "—" }}</td>
                <td>{{ row.modeOfActivity || "—" }}</td>
                <td>{{ row.trainerProvider || "—" }}</td>
                <td>{{ row.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
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
          all information is accurate. Your supervisor will be notified
          automatically. This action cannot be undone.
        </p>
      </div>
      <div class="review-submit-actions">
        <button
          class="btn-review-back"
          :class="{ 'btn-clicked': clickedButtons['back-stage1'] }"
          @click="
            markClicked('back-stage1');
            backToStage1();
          "
        >
          ← Go Back &amp; Edit
        </button>
        <button
          class="btn-submit"
          :class="{ 'btn-clicked': clickedButtons['confirm-stage1'] }"
          :disabled="isSubmitting"
          @click="
            markClicked('confirm-stage1');
            submitStage1();
          "
        >
          <span v-if="isSubmitting">Submitting…</span>
          <span v-else>Confirm &amp; Submit IDP</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- STAGE 2: SUPERVISOR REVIEW                      -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'stage2'" class="container">
    <!-- Title bar with ref ID -->
    <div
      style="
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 3px solid var(--navy);
      "
    >
      <h2
        style="
          font-family: &quot;Roboto&quot;, sans-serif;
          font-size: 28px;
          color: var(--navy);
          margin-bottom: 6px;
        "
      >
        Individual Development Plan (IDP)
      </h2>
      <p style="color: var(--text-light); font-size: 14px">
        Supervisor's Review — Read-only view of employee submission. Complete
        Section IV below.
      </p>
      <div
        style="
          margin-top: 12px;
          display: inline-block;
          background: var(--navy);
          color: var(--gold-light);
          font-family: monospace;
          font-size: 16px;
          font-weight: 700;
          padding: 8px 20px;
          border-radius: 8px;
          letter-spacing: 0.08em;
        "
      >
        {{ idpData.refId }}
      </div>
    </div>

    <!-- ── H: PERSONNEL INFO (READ-ONLY) ── -->
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
        <div class="ro-grid ro-grid-2" style="margin-bottom: 16px">
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
            <div class="ro-value">{{ idpData.nameOfPersonnel || "—" }}</div>
          </div>

          <div class="ro-field">
            <div class="ro-label">Current Position / Designation</div>
            <div class="ro-value">{{ idpData.currentPosition || "—" }}</div>
          </div>
          <div class="ro-field">
            <div class="ro-label">Years in Position</div>
            <div class="ro-value">{{ idpData.yearsInPosition || "—" }}</div>
          </div>
          <div class="ro-field">
            <div class="ro-label">Years in CSU</div>
            <div class="ro-value">{{ idpData.yearsInCSU || "—" }}</div>
          </div>
          <div class="ro-field">
            <div class="ro-label">Purpose</div>
            <div class="ro-value">{{ idpData.headerPurpose || "—" }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── I: COMPETENCY (READ-ONLY) ── -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-num">I</div>
        <div><h3>Competency Assessment</h3></div>
        <div class="readonly-badge">Read-only</div>
      </div>
      <div class="section-body">
        <div class="ro-field" style="margin-bottom: 16px">
          <div class="ro-label">Purpose</div>
          <div class="ro-value">{{ idpData.competencyPurpose || "—" }}</div>
        </div>
        <div class="ro-table-wrapper">
          <table class="ro-table">
            <thead>
              <tr>
                <th style="width: 50px">No.</th>
                <th>Target Competency</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Suggested LeaD Interventions</th>
                <th>Resource / Support Needed</th>
                <th>Target Year of Enrollment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!idpData.competencyRows?.length">
                <td colspan="7" class="empty-row-cell">No entries provided.</td>
              </tr>
              <tr v-for="(row, idx) in idpData.competencyRows" :key="idx">
                <td>{{ row.priority || idx + 1 }}</td>
                <td>{{ row.targetCompetency || "—" }}</td>
                <td>{{ row.currentLevel || "—" }}</td>
                <td>{{ row.requiredLevel || "—" }}</td>
                <td>{{ row.leadInterventions || "—" }}</td>
                <td>{{ row.resourceSupport || "—" }}</td>
                <td>{{ row.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── II: AGAP (READ-ONLY) ── -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-num">II</div>
        <div><h3>Academic Growth and Advancement Program (AGAP)</h3></div>
        <div class="readonly-badge">Read-only</div>
      </div>
      <div class="section-body">
        <div class="ro-table-wrapper">
          <table class="ro-table">
            <thead>
              <tr>
                <th style="width: 50px">No.</th>
                <th>Degree Program</th>
                <th>Target HEI</th>
                <th>Mode of Study</th>
                <th>Target Scholarship Grant</th>
                <th>Intended Year of Enrollment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!idpData.agapRows?.length">
                <td colspan="7" class="empty-row-cell">No entries provided.</td>
              </tr>
              <tr v-for="(row, idx) in idpData.agapRows" :key="idx">
                <td>{{ row.priority || idx + 1 }}</td>
                <td>{{ row.degreeProgram || "—" }}</td>
                <td>{{ row.targetHEI || "—" }}</td>
                <td>{{ row.modeOfStudy || "—" }}</td>
                <td>{{ row.sourceOfFunding || "—" }}</td>
                <td>{{ row.scholarshipGrant || "—" }}</td>
                <td>{{ row.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── III: PRO-ACT (READ-ONLY) ── -->
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
        <div class="ro-table-wrapper">
          <table class="ro-table">
            <thead>
              <tr>
                <th style="width: 50px">No.</th>
                <th>Training / Workshop Title</th>
                <th>Target Competency / Skill</th>
                <th>Mode of Activity</th>
                <th>Trainer / Provider</th>
                <th>Target Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!idpData.proactRows?.length">
                <td colspan="7" class="empty-row-cell">No entries provided.</td>
              </tr>
              <tr v-for="(row, idx) in idpData.proactRows" :key="idx">
                <td>{{ row.priority || idx + 1 }}</td>
                <td>{{ row.trainingTitle || "—" }}</td>
                <td>{{ row.targetSkill || "—" }}</td>
                <td>{{ row.modeOfActivity || "—" }}</td>
                <td>{{ row.sourceOfFunding || "—" }}</td>
                <td>{{ row.trainerProvider || "—" }}</td>
                <td>{{ row.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── IV: SUPERVISOR ASSESSMENT (FILLABLE) ── -->
    <div class="section-card">
      <div class="section-header">
        <div class="section-num">IV</div>
        <div>
          <h3>Supervisor's Assessment and Endorsement</h3>
          <p>
            Complete all fields below — this section is for the supervisor only
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
            <!-- 1. Performance Gaps -->
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
                      name="perfGapsYN"
                      value="Yes"
                      v-model="assessment.perfGapsYN"
                    />
                    Yes
                  </label>
                  <label
                    class="checkbox-item"
                    :class="{ checked: assessment.perfGapsYN === 'No' }"
                  >
                    <input
                      type="radio"
                      name="perfGapsYN"
                      value="No"
                      v-model="assessment.perfGapsYN"
                    />
                    No
                  </label>
                </div>
                <div v-if="assessment.perfGapsYN === 'Yes'">
                  <label class="field-label">If Yes, specify:</label>
                  <textarea
                    v-model="assessment.perfGapsSpec"
                    rows="3"
                    placeholder="Describe the performance gaps…"
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
                      name="readinessYN"
                      value="Yes"
                      v-model="assessment.readinessYN"
                    />
                    Yes
                  </label>
                  <label
                    class="checkbox-item"
                    :class="{ checked: assessment.readinessYN === 'No' }"
                  >
                    <input
                      type="radio"
                      name="readinessYN"
                      value="No"
                      v-model="assessment.readinessYN"
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
            <!-- 3. Interventions -->
            <tr>
              <td class="area-label">3. Recommended L&amp;D Interventions</td>
              <td class="guide-q">
                What specific learning and development interventions do you
                recommend for this employee? <em>(Check all applicable)</em>
              </td>
              <td class="response-cell">
                <div class="checkbox-group">
                  <label
                    v-for="opt in interventionOptions"
                    :key="opt"
                    class="checkbox-item"
                    :class="{ checked: assessment.interventions.includes(opt) }"
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
                  class="other-specify"
                  :class="{
                    visible: assessment.interventions.includes('Others'),
                  }"
                >
                  <input
                    type="text"
                    v-model="assessment.interventionOther"
                    placeholder="Specify other intervention…"
                  />
                </div>
              </td>
            </tr>
            <!-- 4. Implementation Period -->
            <tr>
              <td class="area-label">4. Preferred Implementation Period</td>
              <td class="guide-q">
                When should the recommended interventions ideally be
                implemented?
              </td>
              <td class="response-cell">
                <div class="checkbox-group">
                  <label
                    v-for="opt in implOptions"
                    :key="opt"
                    class="checkbox-item"
                    :class="{
                      checked: assessment.implementationPeriod.includes(opt),
                    }"
                  >
                    <input
                      type="checkbox"
                      :value="opt"
                      v-model="assessment.implementationPeriod"
                    />
                    {{ opt }}
                  </label>
                </div>
              </td>
            </tr>
            <!-- 5. Additional Comments -->
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
              >I hereby certify that I have reviewed and assessed the Individual
              Development Plan (IDP) of the concerned personnel and confirm that
              the proposed goals and interventions are aligned with their role,
              performance needs, and the strategic direction of the office.</em
            >
          </p>
          <div class="sup-name">{{ idpData.supervisorName || "—" }}</div>
          <small>Signature over Printed Name of Immediate Supervisor</small>
        </div>
      </div>
    </div>

    <!-- ── SUBMIT STAGE 2 ── -->
    <div class="submit-area">
      <p>
        Please review your assessment before finalizing. You can go back and
        make changes if needed.
      </p>
      <button
        class="btn-submit"
        :class="{ 'btn-clicked': clickedButtons['review-stage2'] }"
        :disabled="isSubmitting"
        @click="openReview2"
      >
        Review &amp; Submit
      </button>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════ -->
  <!-- REVIEW SCREEN — STAGE 2                         -->
  <!-- ═══════════════════════════════════════════════ -->
  <div v-if="stage === 'review2'" class="container review-container">
    <div class="review-header-block">
      <div class="review-eyebrow">
        IDP Supervisor Assessment — Ref: {{ idpData.refId }}
      </div>
      <h2 class="review-title">Review Your Assessment</h2>
      <p class="review-subtitle">
        Please verify your assessment below before submitting. Use
        <strong>Go Back &amp; Edit</strong> to make changes.
      </p>
    </div>

    <!-- Personnel Info (read-only summary) -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">H</span>
        <span class="review-card-title"
          >Personnel Information (Employee-Submitted)</span
        >
      </div>
      <div class="review-card-body">
        <div class="review-grid">
          <div class="review-field">
            <span class="review-label">Name of Personnel</span>
            <span class="review-value">{{
              idpData.nameOfPersonnel || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Office / Unit</span>
            <span class="review-value">{{
              idpData.collegeOfficeUnit || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Current Position</span>
            <span class="review-value">{{
              idpData.currentPosition || "—"
            }}</span>
          </div>
          <div class="review-field">
            <span class="review-label">Purpose</span>
            <span class="review-value">{{ idpData.headerPurpose || "—" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- IV: Supervisor Assessment -->
    <div class="review-card">
      <div class="review-card-header">
        <span class="review-card-num">IV</span>
        <span class="review-card-title"
          >Supervisor's Assessment and Endorsement</span
        >
      </div>
      <div class="review-card-body">
        <div class="review-table-wrap">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 200px">Assessment Area</th>
                <th style="width: 100px; text-align: center">Response</th>
                <th>Details / Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="review-row-label">Observed Performance Gaps</td>
                <td style="text-align: center">
                  <span
                    :class="
                      assessment.perfGapsYN === 'Yes'
                        ? 'review-badge-yes'
                        : 'review-badge-no'
                    "
                    >{{ assessment.perfGapsYN || "—" }}</span
                  >
                </td>
                <td style="white-space: pre-wrap; font-size: 12px">
                  {{ assessment.perfGapsDetails || "—" }}
                </td>
              </tr>
              <tr>
                <td class="review-row-label">Readiness for Advancement</td>
                <td style="text-align: center">
                  <span
                    :class="
                      assessment.readinessYN === 'Yes'
                        ? 'review-badge-yes'
                        : 'review-badge-no'
                    "
                    >{{ assessment.readinessYN || "—" }}</span
                  >
                </td>
                <td style="white-space: pre-wrap; font-size: 12px">
                  {{ assessment.readinessDetails || "—" }}
                </td>
              </tr>
              <tr>
                <td class="review-row-label">Recommended Interventions</td>
                <td colspan="2" style="font-size: 12px">
                  <div
                    v-if="
                      assessment.interventions &&
                      assessment.interventions.length
                    "
                    class="review-tags-row"
                  >
                    <span
                      v-for="iv in assessment.interventions"
                      :key="iv"
                      class="review-intervention-tag"
                      >{{ iv }}</span
                    >
                  </div>
                  <span v-else style="color: var(--text-light)">—</span>
                </td>
              </tr>
              <tr>
                <td class="review-row-label">Implementation Period</td>
                <td colspan="2" style="font-size: 12px">
                  <div
                    v-if="
                      assessment.implementationPeriod &&
                      assessment.implementationPeriod.length
                    "
                    class="review-tags-row"
                  >
                    <span
                      v-for="p in assessment.implementationPeriod"
                      :key="p"
                      class="review-source-tag"
                      >{{ p }}</span
                    >
                  </div>
                  <span v-else style="color: var(--text-light)">—</span>
                </td>
              </tr>
              <tr>
                <td class="review-row-label">Overall Remarks</td>
                <td colspan="2" style="white-space: pre-wrap; font-size: 12px">
                  {{ assessment.overallRemarks || "—" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="review-cert-box" style="margin-top: 20px">
          <p class="review-cert-text">
            I hereby certify that I have reviewed and assessed the Individual
            Development Plan of the concerned personnel and confirm that the
            information provided is accurate.
          </p>
          <div class="review-cert-name">
            {{ idpData.supervisorName || "—" }}
          </div>
          <div class="review-cert-sublabel">
            Signature over Printed Name of Immediate Supervisor
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
          your assessment is complete and accurate. HR will be notified
          immediately. This action cannot be undone.
        </p>
      </div>
      <div class="review-submit-actions">
        <button
          class="btn-review-back"
          :class="{ 'btn-clicked': clickedButtons['back-stage2'] }"
          @click="
            markClicked('back-stage2');
            backToStage2();
          "
        >
          ← Go Back &amp; Edit
        </button>
        <button
          class="btn-submit"
          :class="{ 'btn-clicked': clickedButtons['confirm-stage2'] }"
          :disabled="isSubmitting"
          @click="
            markClicked('confirm-stage2');
            submitStage2();
          "
        >
          <span v-if="isSubmitting">Submitting…</span>
          <span v-else>Confirm &amp; Submit Assessment</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({middleware: ["auth"]});

import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

const { setPageHeader, clearPageHeader } = usePageHeader();
setPageHeader("Individual Development Plan (IDP) 2026-2031", "/");
onUnmounted(() => {
  clearPageHeader();
});

// ── NOTE FOR MIGRATION ──────────────────────────────────────────────────────
// APPS_SCRIPT_URL below is temporary for the current Google Sheets backend.
// When NestJS backend is ready, replace this with your API endpoint, e.g.:
//   const API_URL = '/api/idp'
// and update submitStage1() and submitStage2() to use axios calls instead.
// ────────────────────────────────────────────────────────────────────────────
const config = useRuntimeConfig();
const API = config.public.apiBase; // resolves to http://localhost:3001

// ── Stage control ──────────────────────────────────────────────────────────
// Possible values: 'stage1' | 'token' | 'stage2' | 'stage1-success' | 'stage2-success'
// ── Privacy Modal ──
const showPrivacyModal = ref(true);
const privacyAgreed = ref(false);
function acceptPrivacy() {
  if (privacyAgreed.value) showPrivacyModal.value = false;
}

const stage = ref("stage1");

// ── Loading state ──────────────────────────────────────────────────────────
const isLoading = ref(false);
const isSubmitting = ref(false);
const loadingMsg = ref("Submitting your IDP, please wait…");

// ── Stage 1 form data ──────────────────────────────────────────────────────
const form = reactive({
  campus: "CSU Main Campus",
  officeAffiliation: "",
  collegeOfficeUnit: "",
  collegeOfficeUnitOther: "",
  collegeProgram: "",
  personnelType: "", // "non-teaching" | "teaching"
  lastName: "",
  firstName: "",
  middleInitial: "",
  employeeEmailPrefix: "",
  employeeEmail: "",
  educAttainment: "",
  educAttainmentSpec: "",

  currentPosition: "",
  designation: "",
  yearsInPosition: "",
  yearsInCSU: "",
  supervisorName: "",
  supervisorEmailPrefix: "",
  supervisorEmail: "",
  headerPurpose: "",
  headerPurposeOther: "",
  compPurpose: "",
  compPurposeOther: "",
});

const errors = reactive({});
const emailHints = reactive({
  employee: { msg: "", type: "" },
  supervisor: { msg: "", type: "" },
});

// Dynamic table rows
const competencyRows = ref([
  {
    competencyGroup: "", // auto-set by getCompetencyCluster on selection
    targetCompetency: "",
    currentLevel: "",
    requiredLevel: "",
    leadInterventions: "",
    targetTimeline: "",
  },
]);
const agapRows = ref([
  {
    degreeProgram: "",
    targetHEI: "",
    modeOfStudy: "",
    scholarshipGrant: "",
    targetTimeline: "",
  },
]);
const proactRows = ref([
  {
    trainingTitle: "",
    trainingTitleOther: "",
    targetSkill: "",
    modeOfActivity: "",
    trainerProvider: "",
    targetTimeline: "",
  },
]);

// Stage 1 result
const refId = ref("");

// ── Stage 2 state ──────────────────────────────────────────────────────────
const tokenInput = ref("");
const supervisorEmailInput = ref("");
const tokenError = ref("");
const currentToken = ref("");
const supervisorEmail = ref("");
const idpData = reactive({});

const assessment = reactive({
  perfGapsYN: "",
  perfGapsSpec: "",
  readinessYN: "",
  readinessRemarks: "",
  interventions: [],
  interventionOther: "",
  implementationPeriod: [],
  additionalComments: "",
});

// ── Static options ─────────────────────────────────────────────────────────
const campusOptions = ["CSU Main Campus"];
const officeOptions = ["OVPAF", "OVPAA", "OVPEO", "OVPSAS", "OVPRDIE"];

// Sub-office / college options per office affiliation
// For OVPAA colleges, value is { name, programs: [] }
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

// For OVPAA: colleges with sub-programs
const isOVPAA = computed(() => form.officeAffiliation === "OVPAA");

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
    (c) => typeof c === "object" && c.name === form.collegeOfficeUnit,
  );
  return found ? found.programs : [];
});

// Reset downstream when affiliation changes
watch(
  () => form.officeAffiliation,
  (newOffice) => {
    form.collegeOfficeUnit = "";
    form.collegeOfficeUnitOther = "";
    form.collegeProgram = "";
    form.currentPosition = "";
    // OVPAA: let user pick Teaching or Non-Teaching. All other offices: always non-teaching.
    if (newOffice === "OVPAA") {
      form.personnelType = "";
    } else {
      form.personnelType = "non-teaching";
    }
  },
);

watch(
  () => form.collegeOfficeUnit,
  () => {
    form.collegeProgram = "";
  },
);

// Re-compute required levels on all existing rows when position changes
watch(
  () => form.currentPosition,
  (newPos) => {
    competencyRows.value.forEach((row) => {
      if (row.targetCompetency) {
        row.requiredLevel = getRequiredLevel(row.targetCompetency, newPos);
      }
    });
  },
);

// ── Section completion computed flags ─────────────────────────────────────
const sectionIComplete = computed(() => {
  // Section I (Competency) is "done" once purpose is chosen — rows are optional
  return !!form.compPurpose;
});

const sectionIIComplete = computed(() => {
  // Section II (AGAP) always shows once Section I purpose picked — rows optional
  return sectionIComplete.value;
});

const sectionIIIComplete = computed(() => {
  // Section III (Pro-ACT) always shows once Section II visible — rows optional
  return sectionIIComplete.value;
});

// Competencies actually entered in Section I — drives Pro-ACT table rows
const filledCompetencies = computed(() => {
  const list = competencyRows.value
    .map((r) => r.targetCompetency)
    .filter((c) => c && c.trim());
  // Keep proactRows in sync — grow or shrink as needed
  while (proactRows.value.length < list.length) {
    proactRows.value.push({
      trainingTitle: "",
      trainingTitleOther: "",
      targetSkill: "",
      modeOfActivity: "",
      trainerProvider: "",
      targetTimeline: "",
    });
  }
  // Sync targetSkill on each row
  list.forEach((c, i) => {
    proactRows.value[i].targetSkill = c;
  });
  return list;
});

const purposeOptions = [
  "Initial Assessment",
  "Mid-Year Review",
  "Annual Review",
  "Other",
];
const compPurposeOptions = [
  {
    value: "To meet the competencies of my current position.",
    label: "Meet competencies of current position",
  },
  {
    value: "To increase the level of competencies of the current position.",
    label: "Increase level of current competencies",
  },
  {
    value: "To meet the competencies of the next higher position.",
    label: "Meet competencies of next higher position",
  },
  {
    value: "To acquire new competencies across different functions/positions.",
    label: "Acquire new competencies across functions",
  },
  { value: "Others", label: "Others" },
];
const interventionOptions = [
  "Technical Training",
  "Soft Skills",
  "Leadership Development",
  "Coaching/Mentoring",
  "Academic Advancement",
  "Job Rotation/Cross-training",
  "Others",
];
const implOptions = ["Q1", "Q2", "Q3", "Q4", "Within this year", "Next year"];

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
    if (form.personnelType === "teaching")
      base.push("Faculty Specializing in Environment");
    return base;
  }),
  Leadership: [
    "Developing People",
    "Facilitating Change",
    "Conflict Management",
    "Leading Innovation",
    "Strategic Planning",
    "Leading Others",
    "Decisiveness",
  ],
  Organizational: [
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
  Technical: computed(() => {
    const base = [
      "Research Engagement",
      "Diagnostic Information Gathering",
      "Attention to Details",
      "Written Communication",
      "Oral Communication",
      "Conceptual and Analytical Thinking",
      "Computer Literacy",
      "Planning and Project Management",
      "Logical Reasoning",
    ];
    if (form.personnelType === "teaching") {
      base.push(
        "Language Faculty",
        "IT Faculty",
        "Math and Allied Fields Faculty Members",
      );
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

// Flat computed lists per cluster (reactive to personnelType)
const allCompetencies = computed(() => ({
  Core: getCompetencyOptions("Core"),
  Leadership: getCompetencyOptions("Leadership"),
  Organizational: getCompetencyOptions("Organizational"),
  Technical: getCompetencyOptions("Technical"),
}));

// Which clusters are applicable for the currently selected position
// A cluster is included if ANY competency in it has a non-null required level for that position.
// If no position selected yet, or position is Director, all 4 clusters are shown.
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

// Reverse lookup: competency name → cluster name
function getCompetencyCluster(competency) {
  if (!competency) return "";
  const target = competency.trim().toLowerCase();
  for (const [grp, list] of Object.entries(allCompetencies.value)) {
    if (list.some((c) => c.toLowerCase() === target)) return grp;
  }
  return "";
}

// ── Required Level Lookup ────────────────────────────────────────────────────
// Source: CSU Competency Model (official document)
// Levels: 1 = Basic, 2 = Intermediate, 3 = Advanced, 4 = Expert
// null = no required competency level for that position
//
// COLUMN KEY for admin tables (pages 1-2):
//   AideIII, SecGuard, FarmW, AstI, AstII, AstIII, AstIV,
//   OffI, OffII, OffIII, OffIV, OffV,
//   AideI-U, AideI-C, AideII-U, AideII-C, AideIV-M, AideIV-C, AideIV-D

const LEVEL_LABEL = {
  1: "1 - Basic",
  2: "2 - Intermediate",
  3: "3 - Advanced",
  4: "4 - Expert",
};

// Per-position, per-competency required level table
// Keys match exact dropdown option values
// Source: Official CSU Competency Model Document
// Levels: 1=Basic, 2=Intermediate, 3=Advanced, 4=Expert
// Competency absent from a position = key not present (excluded from dropdown)
// Dropdown options for the Position field — derived from competencyModel's own
// keys so the list can never fall out of sync with the required-level lookup.
const positionOptions = computed(() =>
  Object.keys(competencyModel).sort((a, b) => a.localeCompare(b)),
);

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
// Professors I–III: Developing People = 3 (Advanced)
["Professor I", "Professor II", "Professor III"].forEach((pos) => {
  competencyModel[pos] = { ...professorTemplate, "Developing People": 3 };
});
// Professors IV–VI and University Professor: Developing People = 4 (Expert)
["Professor IV", "Professor V", "Professor VI", "University Professor"].forEach(
  (pos) => {
    competencyModel[pos] = { ...professorTemplate };
  },
);

// ── Position Aliases ─────────────────────────────────────────────────────────
// Maps every dropdown option name → its competencyModel key.
// Positions that share a family but have no distinct document entry are aliased
// to the closest defined relative (same job family, same or nearest salary grade).

// ── Administrative Aide ──────────────────────────────────────────────────────
// Dropdown shows base name only; model splits Utility vs. Clerk variants.
// Aliased to the Clerk variant as the more common administrative role.
competencyModel["Administrative Aide I"] =
  competencyModel["Admin Aide I – Clerk"];
competencyModel["Administrative Aide II"] =
  competencyModel["Admin Aide II – Clerk"];
competencyModel["Administrative Aide III"] =
  competencyModel["Admin Aide III – Clerk"];
competencyModel["Administrative Aide IV"] =
  competencyModel["Admin Aide IV – Clerk"];
// Aide VI: no document entry — same family as Aide IV (Clerk)
competencyModel["Administrative Aide VI"] =
  competencyModel["Admin Aide IV – Clerk"];

// ── Administrative Assistant ─────────────────────────────────────────────────
competencyModel["Administrative Assistant I"] =
  competencyModel["Admin Assistant I"];
competencyModel["Administrative Assistant II"] =
  competencyModel["Admin Assistant II"];
competencyModel["Administrative Assistant III"] =
  competencyModel["Admin Assistant III"];
competencyModel["Administrative Assistant IV"] =
  competencyModel["Admin Assistant IV"];
// Assistant V: no document entry — same family as Assistant IV
competencyModel["Administrative Assistant V"] =
  competencyModel["Admin Assistant IV"];
// Senior Administrative Assistant III: same family as Admin Assistant III
competencyModel["Senior Administrative Assistant III"] =
  competencyModel["Admin Assistant III"];

// ── Administrative Officer ───────────────────────────────────────────────────
competencyModel["Administrative Officer I"] =
  competencyModel["Admin Officer I"];
competencyModel["Administrative Officer II"] =
  competencyModel["Admin Officer II"];
competencyModel["Administrative Officer III"] =
  competencyModel["Admin Officer III"];
competencyModel["Administrative Officer IV"] =
  competencyModel["Admin Officer IV"];
competencyModel["Administrative Officer V"] =
  competencyModel["Admin Officer V"];
// Supervising Administrative Officer: senior individual contributor — same as Admin Officer V
competencyModel["Supervising Administrative Officer"] =
  competencyModel["Admin Officer V"];

// ── Chief Administrative Officer ─────────────────────────────────────────────
// Dropdown uses short label; model uses (CAO) suffix
competencyModel["Chief Administrative Officer"] =
  competencyModel["Chief Administrative Officer (CAO)"];

// ── Accountant ───────────────────────────────────────────────────────────────
// Only Accountant III is in the document; I and II share the same job family
competencyModel["Accountant I"] = competencyModel["Accountant III"];
competencyModel["Accountant II"] = competencyModel["Accountant III"];

// ── Attorney ─────────────────────────────────────────────────────────────────
// Model has Attorney II and III; IV is the next higher — alias to Attorney III
competencyModel["Attorney IV"] = competencyModel["Attorney III"];

// ── Board Secretary ──────────────────────────────────────────────────────────
// Model has Board Secretary V; I is the entry level — alias to Board Secretary V
// (same competency profile, lower experience expected)
competencyModel["Board Secretary I"] = competencyModel["Board Secretary V"];

// ── College Librarian ────────────────────────────────────────────────────────
// Already in model (College Librarian I and III) — no aliases needed

// ── Cook ─────────────────────────────────────────────────────────────────────
// No document entry; similar manual/utility role profile — alias to Admin Aide IV Mechanic
competencyModel["Cook I"] = competencyModel["Admin Aide IV – Mechanic"];
competencyModel["Cook II"] = competencyModel["Admin Aide IV – Mechanic"];

// ── Dentist II ───────────────────────────────────────────────────────────────
// Health professional; alias to Nurse II (same health cluster, closest available)
competencyModel["Dentist II"] = competencyModel["Nurse II"];

// ── Dormitory Manager III ────────────────────────────────────────────────────
// Supervisory service role — alias to Admin Officer III
competencyModel["Dormitory Manager III"] = competencyModel["Admin Officer III"];

// ── Executive Assistant ──────────────────────────────────────────────────────
// Senior support role — alias to Admin Assistant IV
competencyModel["Executive Assistant III"] =
  competencyModel["Admin Assistant IV"];
competencyModel["Executive Assistant IV"] =
  competencyModel["Admin Assistant IV"];

// ── Farm Worker ──────────────────────────────────────────────────────────────
// Model has Farm Worker I; II is the next level — alias to Farm Worker I
competencyModel["Farm Worker II"] = competencyModel["Farm Worker I"];

// ── Food Service Supervisor II ───────────────────────────────────────────────
// Supervisory service role — alias to Admin Officer I
competencyModel["Food Service Supervisor II"] =
  competencyModel["Admin Officer I"];

// ── Guidance ─────────────────────────────────────────────────────────────────
// Guidance Coordinator I: entry-level guidance role — alias to Guidance Counselor III
competencyModel["Guidance Coordinator I"] =
  competencyModel["Guidance Counselor III"];
// Guidance Counselor I: junior counselor — alias to Guidance Counselor III
competencyModel["Guidance Counselor I"] =
  competencyModel["Guidance Counselor III"];

// ── Heavy Equipment Operator I ───────────────────────────────────────────────
// Manual/technical operator — alias to Admin Aide IV Mechanic
competencyModel["Heavy Equipment Operator I"] =
  competencyModel["Admin Aide IV – Mechanic"];

// ── Houseparent II ───────────────────────────────────────────────────────────
// Residential care/service role — alias to Admin Officer I
competencyModel["Houseparent II"] = competencyModel["Admin Officer I"];

// ── Information Officer ──────────────────────────────────────────────────────
// Communication/information professional — alias to Admin Officer I/III/V by level
competencyModel["Information Officer I"] = competencyModel["Admin Officer I"];
competencyModel["Information Officer II"] = competencyModel["Admin Officer II"];
competencyModel["Information Officer III"] =
  competencyModel["Admin Officer III"];

// ── Information Systems Analyst ──────────────────────────────────────────────
// IT analyst role — alias to System Analyst
competencyModel["Information Systems Analyst I"] =
  competencyModel["System Analyst"];
competencyModel["Information Systems Analyst II"] =
  competencyModel["System Analyst"];

// ── Information Technology Officer I ─────────────────────────────────────────
// IT officer — alias to System Analyst
competencyModel["Information Technology Officer I"] =
  competencyModel["System Analyst"];

// ── Internal Auditor ─────────────────────────────────────────────────────────
// Audit professional — alias to Accountant III (same financial/audit cluster)
competencyModel["Internal Auditor I"] = competencyModel["Accountant III"];
competencyModel["Internal Auditor II"] = competencyModel["Accountant III"];
competencyModel["Internal Auditor III"] = competencyModel["Accountant III"];

// ── Legal Assistant ──────────────────────────────────────────────────────────
// Legal support role — alias to Attorney II (same legal cluster, support level)
competencyModel["Legal Assistant II"] = competencyModel["Attorney II"];
competencyModel["Legal Assistant III"] = competencyModel["Attorney II"];

// ── Machinist I ──────────────────────────────────────────────────────────────
// Technical/trades role — alias to Admin Aide IV Mechanic
competencyModel["Machinist I"] = competencyModel["Admin Aide IV – Mechanic"];

// ── Nurse ────────────────────────────────────────────────────────────────────
// Nurse I already in model; Nurse II already in model — no aliases needed

// ── Planning Officer ─────────────────────────────────────────────────────────
// Model has generic "Planning Officer"; I/II/III map to it
competencyModel["Planning Officer I"] = competencyModel["Planning Officer"];
competencyModel["Planning Officer II"] = competencyModel["Planning Officer"];
competencyModel["Planning Officer III"] = competencyModel["Planning Officer"];

// ── Project Development Officer ──────────────────────────────────────────────
// Development/planning professional — alias to Planning Officer
competencyModel["Project Development Officer I"] =
  competencyModel["Planning Officer"];
competencyModel["Project Development Officer II"] =
  competencyModel["Planning Officer"];
competencyModel["Project Development Officer III"] =
  competencyModel["Planning Officer"];

// ── Registrar III ─────────────────────────────────────────────────────────────
// Already in model — no alias needed (matches dropdown name exactly)

// ── School Farm / Farming ────────────────────────────────────────────────────
// Agriculture-related roles — alias to Farm Worker I
competencyModel["School Farm Demonstrator"] = competencyModel["Farm Worker I"];
competencyModel["School Farming Coordinator I"] =
  competencyModel["Farm Worker I"];

// ── SUC President IV ─────────────────────────────────────────────────────────
// Top executive — alias to Chief Administrative Officer (CAO)
competencyModel["SUC President IV"] =
  competencyModel["Chief Administrative Officer (CAO)"];

// ── University Extension ─────────────────────────────────────────────────────
// Extension work — alias to Admin Officer / Planning Officer by level
competencyModel["University Extension Associate I"] =
  competencyModel["Admin Officer I"];
competencyModel["University Extension Specialist I"] =
  competencyModel["Admin Officer I"];
competencyModel["University Extension Specialist II"] =
  competencyModel["Admin Officer II"];
competencyModel["University Extension Specialist III"] =
  competencyModel["Admin Officer III"];
competencyModel["University Extension Specialist IV"] =
  competencyModel["Admin Officer IV"];
competencyModel["University Extension Specialist V"] =
  competencyModel["Admin Officer V"];

// ── University Research ──────────────────────────────────────────────────────
// Research roles — alias to Accountant III / Planning Officer by level
competencyModel["University Research Associate I"] =
  competencyModel["Admin Officer I"];
competencyModel["University Research Associate II"] =
  competencyModel["Admin Officer II"];
competencyModel["University Researcher II"] =
  competencyModel["Admin Officer II"];
competencyModel["University Researcher IV"] =
  competencyModel["Admin Officer IV"];
competencyModel["University Researcher V"] = competencyModel["Admin Officer V"];

// ── Veterinarian II ──────────────────────────────────────────────────────────
// Health/science professional — alias to Physician
competencyModel["Veterinarian II"] = competencyModel["Physician"];

// ── Vocational Placement Coordinator I ───────────────────────────────────────
// Guidance/placement role — alias to Guidance Counselor III
competencyModel["Vocational Placement Coordinator I"] =
  competencyModel["Guidance Counselor III"];

function getRequiredLevel(competency, position) {
  if (!competency || !position) return "";
  const posData = competencyModel[position];
  if (!posData) return "";
  // Case-insensitive match to support free-text input (e.g. "INTEGRITY" → "Integrity")
  const key = Object.keys(posData).find(
    (k) => k.toLowerCase() === competency.trim().toLowerCase(),
  );
  if (!key) return "";
  const lvl = posData[key];
  if (lvl === null || lvl === undefined) return "";
  return LEVEL_LABEL[lvl] || "";
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  fetchSuggestions();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    tokenInput.value = token;
    tokenError.value = "Please enter your CarSU email address to continue.";
    stage.value = "token";
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
function validateEmail(who) {
  if (who === "employee") {
    form.employeeEmail =
      (form.employeeEmailPrefix || "").trim() + "@carsu.edu.ph";
  } else {
    form.supervisorEmail =
      (form.supervisorEmailPrefix || "").trim() + "@carsu.edu.ph";
  }
  const val = who === "employee" ? form.employeeEmail : form.supervisorEmail;
  const hint = emailHints[who];
  const prefix =
    who === "employee" ? form.employeeEmailPrefix : form.supervisorEmailPrefix;
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

function addCompetencyRow() {
  competencyRows.value.push({
    competencyGroup: "",
    targetCompetency: "",
    currentLevel: "",
    requiredLevel: "",
    leadInterventions: "",
    targetTimeline: "",
  });
}
function addAgapRow() {
  agapRows.value.push({
    degreeProgram: "",
    targetHEI: "",
    modeOfStudy: "",
    scholarshipGrant: "",
    targetTimeline: "",
  });
}
function addProactRow() {
  proactRows.value.push({
    trainingTitle: "",
    targetSkill: "",
    modeOfActivity: "",
    trainerProvider: "",
    targetTimeline: "",
  });
}
function removeRow(arr, idx) {
  if (arr.length <= 1) return;
  arr.splice(idx, 1);
}

// ── HEI & Pro-ACT suggestions (shared across users via backend) ────────────
const heiSuggestions = ref([]);
const proactSuggestions = ref([]);

async function fetchSuggestions() {
  try {
    const [heiRes, proactRes] = await Promise.all([
      fetch(`${API}/idp/suggestions/hei`),
      fetch(`${API}/idp/suggestions/proact`),
    ]);
    if (heiRes.ok) heiSuggestions.value = await heiRes.json();
    if (proactRes.ok) proactSuggestions.value = await proactRes.json();
  } catch {
    // Suggestions are optional; fail silently
  }
}

function onHeiInput(val) {
  // Persist new suggestion to backend on blur (handled via @change or blur)
}

function onProactInput(val) {
  // Persist new suggestion to backend on blur (handled via @change or blur)
}

async function saveSuggestion(type, value) {
  if (!value || !value.trim()) return;
  try {
    await fetch(`${API}/idp/suggestions/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: value.trim() }),
    });
    if (type === "hei" && !heiSuggestions.value.includes(value.trim())) {
      heiSuggestions.value.push(value.trim());
      heiSuggestions.value.sort();
    }
    if (type === "proact" && !proactSuggestions.value.includes(value.trim())) {
      proactSuggestions.value.push(value.trim());
      proactSuggestions.value.sort();
    }
  } catch {
    // Fail silently
  }
}

// ── Stage 1 validation ─────────────────────────────────────────────────────
function validateStage1() {
  let ok = true;
  // Only validate fields the user still fills in manually
  const required = ["yearsInPosition", "yearsInCSU", "supervisorName"];
  required.forEach((field) => {
    if (!form[field]?.toString().trim()) {
      errors[field] = true;
      ok = false;
    } else delete errors[field];
  });

  // Email prefix comes from profile, but still build the full email
  form.employeeEmail =
    (form.employeeEmailPrefix || "").trim() + "@carsu.edu.ph";
  form.supervisorEmail =
    (form.supervisorEmailPrefix || "").trim() + "@carsu.edu.ph";

  if (!validateEmail("employee")) ok = false;
  if (!validateEmail("supervisor")) ok = false;

  if (!form.officeAffiliation) {
    alert("Office affiliation is required.");
    ok = false;
  }
  if (!form.currentPosition) {
    alert("Current position is required.");
    ok = false;
  }
  if (!form.headerPurpose) {
    alert("Please select a Purpose.");
    ok = false;
  }
  if (!form.compPurpose) {
    alert("Please select a Competency Assessment Purpose.");
    ok = false;
  }
  return ok;
}

// ── Review/confirmation helpers ────────────────────────────────────────────
const clickedButtons = reactive({});
function markClicked(id) {
  clickedButtons[id] = true;
}

function openReview1() {
  if (!validateStage1()) return;
  markClicked("review-stage1");
  stage.value = "review1";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToStage1() {
  delete clickedButtons["review-stage1"];
  stage.value = "stage1";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openReview2() {
  markClicked("review-stage2");
  stage.value = "review2";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToStage2() {
  delete clickedButtons["review-stage2"];
  stage.value = "stage2";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Stage 1 submit ─────────────────────────────────────────────────────────
async function submitStage1() {
  if (!validateStage1()) return;

  let headerPurpose = form.headerPurpose;
  if (headerPurpose === "Other")
    headerPurpose = form.headerPurposeOther || "Other";

  let compPurpose = form.compPurpose;
  if (compPurpose === "Others") compPurpose = form.compPurposeOther || "Others";

  const payload = {
    action: "submitStage1",
    employeeEmail: form.employeeEmail,
    campus: "CSU Main Campus",
    officeAffiliation: form.officeAffiliation,
    collegeOfficeUnit:
      form.collegeOfficeUnit === "__others__"
        ? form.collegeOfficeUnitOther || "Others"
        : form.collegeOfficeUnit,
    nameOfPersonnel: [form.lastName, form.firstName, form.middleInitial]
      .filter(Boolean)
      .join(", "),
    lastName: form.lastName,
    firstName: form.firstName,
    middleInitial: form.middleInitial,
    educAttainment: form.educAttainment,
    educAttainmentSpec: form.educAttainmentSpec,
    currentPosition: form.currentPosition,
    designation: form.designation,
    yearsInPosition: form.yearsInPosition,
    yearsInCSU: form.yearsInCSU,
    supervisorName: form.supervisorName,
    supervisorEmail: form.supervisorEmail,
    headerPurpose,
    competencyPurpose: compPurpose,
    competencyRows: competencyRows.value.map((r, i) => ({
      priority: i + 1,
      ...r,
    })),
    agapRows: agapRows.value.map((r, i) => ({ priority: i + 1, ...r })),
    proactRows: proactRows.value.map((r, i) => ({
      priority: i + 1,
      ...r,
      trainingTitle:
        r.trainingTitle === "__others__"
          ? r.trainingTitleOther || "Others"
          : r.trainingTitle,
    })),
  };

  isLoading.value = true;
  loadingMsg.value = "Submitting your IDP, please wait…";
  isSubmitting.value = true;

  try {
    const res = await fetch(`${API}/idp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errText = await res.text();
      alert("Submission failed (" + res.status + "): " + errText);
      return;
    }
    const data = await res.json();
    if (data.refId) {
      refId.value = data.refId;

      // Save suggestions only on successful submission
      agapRows.value.forEach((row) => {
        if (row.targetHEI?.trim()) saveSuggestion("hei", row.targetHEI);
      });
      proactRows.value.forEach((row) => {
        if (row.trainingTitle?.trim())
          saveSuggestion("proact", row.trainingTitle);
      });

      stage.value = "stage1-success";
    } else {
      alert("Submission failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert(
      "Network error: " +
        err.message +
        "\n\nMake sure the backend is running on " +
        API,
    );
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
}

// ── Stage 2: load by token ─────────────────────────────────────────────────
function loadByToken() {
  if (!tokenInput.value.trim()) {
    alert("Please enter your token.");
    return;
  }
  if (!supervisorEmailInput.value.trim()) {
    alert("Please enter your CarSU email address.");
    return;
  }
  supervisorEmail.value = supervisorEmailInput.value.trim();
  currentToken.value = tokenInput.value.trim();
  tokenError.value = "";
  loadSubmission(currentToken.value);
}

async function loadSubmission(token) {
  if (!supervisorEmail.value) {
    tokenError.value = "Please enter your CarSU email address to continue.";
    stage.value = "token";
    return;
  }
  isLoading.value = true;
  loadingMsg.value = "Loading IDP submission…";

  try {
    // Token verification: new API endpoint
    const res = await fetch(`${API}/idp/by-token/${token}`); // ← fix this
    const data = await res.json();
    console.log("LOAD SUBMISSION DATA:", JSON.stringify(data, null, 2));

    if (data.refId) {
      idpData.value = data;
      stage.value = "stage2";
    } else {
      alert("Token not found.");
      stage.value = "token";
    }
  } catch {
    alert("Network error. Please try again.");
  } finally {
    isLoading.value = false;
  }
}

// ── Stage 2 submit ─────────────────────────────────────────────────────────
async function submitStage2() {
  if (!assessment.perfGapsYN) {
    alert("Please indicate if there are performance gaps.");
    return;
  }
  if (!assessment.readinessYN) {
    alert("Please indicate readiness for advancement.");
    return;
  }

  let interventions = [...assessment.interventions];
  if (interventions.includes("Others")) {
    interventions = interventions.filter((v) => v !== "Others");
    if (assessment.interventionOther.trim())
      interventions.push("Others: " + assessment.interventionOther.trim());
  }

  isLoading.value = true;
  loadingMsg.value = "Submitting your assessment…";
  isSubmitting.value = true;

  try {
    // Supervisor submit: new API endpoint
    const res = await fetch(`${API}/idp/${idpData.value.refId}/supervisor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assessment),
    });
    const data = await res.json();
    if (data.success) {
      stage.value = "stage2-success";
    } else {
      alert("Submission failed: " + data.error);
    }
  } catch {
    alert("Network error. Please try again.");
  } finally {
    isLoading.value = false;
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");
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
/* ── CSS Variables ── */
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
  --readonly-bg: #f0ede8;
  --shadow: 0 4px 24px rgba(26, 77, 46, 0.1);
  --shadow-sm: 0 2px 8px rgba(26, 77, 46, 0.07);
}

/* ── Base ── */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Header ── */
.site-header {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid var(--navy);
}
.header-inner {
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.header-img {
  width: auto;
  max-width: 700px;
  height: auto;
  display: block;
  object-fit: contain;
}

/* ── Page Nav ── */
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
  font-family: "Roboto", sans-serif;
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
  opacity: 0.8;
  transition:
    transform 0.2s,
    opacity 0.2s;
}
.page-nav a.back-link:hover svg {
  transform: translateX(-3px);
  opacity: 1;
}
.page-nav .nav-sep {
  color: rgba(255, 255, 255, 0.25);
  font-size: 13px;
  margin: 0 10px;
  user-select: none;
}
.page-nav .nav-current {
  font-size: 12.5px;
  color: var(--gold);
  font-weight: 600;
  font-family: "Roboto", sans-serif;
  letter-spacing: 0.03em;
}

/* ── Container ── */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 28px 40px 80px;
}

/* ── Form title ── */
.form-title-block {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 32px;
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
}

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
  padding: 40px 44px;
}
.readonly-badge {
  margin-left: auto;
  background: rgba(245, 195, 0, 0.2);
  color: var(--gold-light);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── Form fields ── */
.field-grid {
  display: grid;
  gap: 24px;
}
.field-grid-2 {
  grid-template-columns: 1fr 1fr;
}
.field-grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
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
label .req {
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
select {
  width: 220px;
  min-width: 160px;
  max-width: 100%;
  font-size: 15px;
  cursor: pointer;
  margin-bottom: 12px;
}
input:focus,
select:focus,
textarea:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(26, 77, 46, 0.08);
  background: var(--white);
}
input.error,
select.error {
  border-color: var(--error);
}
input.valid {
  border-color: var(--success);
}
textarea {
  resize: vertical;
  min-height: 80px;
}

/* ── Email hint ── */
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

/* ── Checkbox groups ── */
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
.checkbox-item:hover {
  border-color: var(--navy);
  background: var(--white);
}
.checkbox-item input[type="checkbox"],
.checkbox-item input[type="radio"] {
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

/* ── Other specify ── */
.other-specify {
  margin-top: 10px;
  display: none;
}
.other-specify.visible {
  display: block;
}

/* ── Dynamic tables ── */
.table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}
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
.proact-table td input,
.proact-table td select,
.proact-table td textarea {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 0;
}
.priority-num {
  width: 36px;
  text-align: center;
  font-weight: 600;
  color: var(--navy);
  background: rgba(245, 195, 0, 0.15);
  border-color: var(--gold);
}
.table-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
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
.section-desc a {
  color: var(--navy);
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
  transition:
    background 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(26, 77, 46, 0.2);
}
.btn-submit:hover {
  background: var(--navy-mid);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(26, 77, 46, 0.25);
}
.btn-submit:active {
  transform: translateY(0);
}
.btn-submit:disabled {
  background: #aaa;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* ── Loading overlay ── */
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.overlay p {
  color: var(--white);
  font-size: 15px;
}

/* ── Success screen ── */
.success-screen {
  max-width: 560px;
  margin: 80px auto;
  text-align: center;
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: var(--shadow);
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
.btn-return {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  padding: 11px 24px;
  background: rgba(26, 77, 46, 0.08);
  color: var(--navy);
  border: 1.5px solid rgba(26, 77, 46, 0.2);
  border-radius: 9px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-return:hover {
  background: var(--navy);
  color: #fff;
}

/* ── Token screen ── */
.token-screen {
  max-width: 480px;
  margin: 80px auto;
  background: var(--white);
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}
.token-screen h2 {
  font-family: "Roboto", sans-serif;
  font-size: 24px;
  color: var(--navy);
  margin-bottom: 10px;
}
.token-screen p {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 24px;
}
.btn-load {
  width: 100%;
  padding: 13px;
  background: var(--navy);
  color: var(--white);
  border: none;
  border-radius: 10px;
  font-family: "Roboto", sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-load:hover {
  background: var(--navy-mid);
}
.token-error {
  color: var(--error);
  font-size: 13px;
  margin-top: 10px;
}

/* ── Read-only fields (Stage 2) ── */
.ro-grid {
  display: grid;
  gap: 16px;
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
.ro-table-wrapper {
  overflow-x: auto;
  margin-top: 16px;
}
.ro-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  min-width: 600px;
}
.ro-table thead tr {
  background: var(--navy-mid);
}
.ro-table thead th {
  padding: 10px 12px;
  color: var(--white);
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
.empty-row-cell {
  text-align: center;
  color: var(--text-light);
  font-style: italic;
}

/* ── Assessment table (Stage 2) ── */
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
  color: var(--white);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}
.area-label {
  font-weight: 600;
  color: var(--navy-mid);
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
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--navy-mid);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Certification block ── */
.cert-block {
  background: rgba(245, 195, 0, 0.08);
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

/* ── Section locked badge ── */
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

/* ── Pro-ACT pre-filled skill label ── */
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

/* ── Row number cell ── */
.row-num-cell {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  vertical-align: middle;
}

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

/* ── Static value display ── */
.static-value {
  background: var(--readonly-bg);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text);
  font-weight: 600;
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

/* ── Designation toggle ── */
.designation-toggle {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Name grid ── */
.name-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 90px;
  gap: 12px;
  align-items: start;
}
.name-grid input {
  width: 100%;
}
.field-hint {
  display: block;
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* ── Email prefix widget ── */
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
  padding: 10px 12px 10px 0;
  font-size: 13px;
  color: var(--text-light);
  white-space: nowrap;
  font-weight: 500;
  background: transparent;
  border-left: 1.5px solid var(--border);
  padding-left: 10px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .container {
    padding: 24px 16px 60px;
  }
  .field-grid-2,
  .field-grid-3 {
    grid-template-columns: 1fr;
  }
  .field-group.span-2 {
    grid-column: span 1;
  }
  .section-body {
    padding: 24px 20px;
  }
  .header-inner {
    padding: 8px 16px;
  }
  .page-nav {
    padding: 0 16px;
  }
  .page-nav .nav-current,
  .page-nav .nav-sep {
    display: none;
  }
  .ro-grid-2 {
    grid-template-columns: 1fr;
  }
  .ro-field.span-2 {
    grid-column: span 1;
  }
  .token-screen {
    margin: 40px 16px;
    padding: 32px 20px;
  }
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

/* ══════════════════════════════════════════════════
   REVIEW SCREENS (Stage 1 & Stage 2)
   ══════════════════════════════════════════════════ */
.review-container {
  padding-top: 40px;
  padding-bottom: 80px;
}
.review-header-block {
  text-align: center;
  margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 3px solid #1a4d2e;
}
.review-eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: #c8a800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}
.review-title {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  color: #1a4d2e;
  margin-bottom: 8px;
}
.review-subtitle {
  font-size: 14px;
  color: #5a6070;
}
.review-card {
  background: #fff;
  border: 1px solid #d8d4c8;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(26, 77, 46, 0.07);
  margin-bottom: 24px;
  overflow: hidden;
}
.review-card-header {
  background: #2d6a3f;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.review-card-num {
  background: #f5c300;
  color: #1a4d2e;
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
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  flex: 1;
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
  color: #5a6070;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.review-value {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
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
  border: 1px solid #d8d4c8;
  border-radius: 8px;
  overflow: hidden;
}
.review-table thead tr {
  background: #2d6a3f;
}
.review-table thead th {
  padding: 9px 12px;
  color: #fff;
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
  border-bottom: 1px solid #d8d4c8;
}
.review-table tbody tr:nth-child(even) {
  background: #faf9f6;
}
.review-table tbody td {
  padding: 8px 12px;
  vertical-align: middle;
  border-right: 1px solid #d8d4c8;
}
.review-table tbody td:last-child {
  border-right: none;
}
.review-row-label {
  font-weight: 600;
  color: #2d6a3f;
  background: rgba(26, 77, 46, 0.03) !important;
  white-space: nowrap;
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
  color: #1a4d2e;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
.review-intervention-tag {
  display: inline-block;
  background: rgba(26, 77, 46, 0.08);
  border: 1px solid rgba(26, 77, 46, 0.2);
  color: #1a4d2e;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  margin: 2px 3px 2px 0;
}
.review-cert-box {
  background: rgba(201, 168, 76, 0.08);
  border: 1.5px solid #f5c300;
  border-radius: 10px;
  padding: 20px 24px;
}
.review-cert-text {
  font-size: 13px;
  color: #5a6070;
  font-style: italic;
  margin-bottom: 14px;
  line-height: 1.6;
}
.review-cert-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a4d2e;
  letter-spacing: 0.03em;
  border-bottom: 2px solid #1a4d2e;
  display: inline-block;
  padding-bottom: 2px;
  margin-bottom: 4px;
}
.review-cert-sublabel {
  font-size: 11px;
  color: #5a6070;
}
.review-submit-area {
  background: #fff;
  border: 1px solid #d8d4c8;
  border-radius: 12px;
  padding: 28px 36px;
  box-shadow: 0 2px 8px rgba(26, 77, 46, 0.07);
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
  color: #1a1a2e;
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
  border: 1.5px solid #d8d4c8;
  border-radius: 10px;
  color: #5a6070;
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
  border-color: #1a4d2e;
  color: #1a4d2e;
}
.btn-review-back:active {
  background: #fdf9e3;
  border-color: #e0c84a;
  color: #1a4d2e;
}
</style>