<template>
  <div>
    <!-- Page Nav -->
    <div class="page-nav">
      <NuxtLink to="/" class="back-link">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Home
      </NuxtLink>
      <span class="nav-sep">/</span>
      <span class="nav-current">LeaD DASHBOARD</span>
    </div>

    <!-- DASHBOARD -->
    <div class="dash-wrap">
      <div class="dash-head">
        <div class="dash-head-left">
          <h1>LeaD Dashboard</h1>
          <p>{{ lastUpdated }}</p>
        </div>
        <button
          class="btn-refresh"
          :class="{ spinning: dataLoading }"
          @click="loadDashboard"
        >
          <svg viewBox="0 0 24 24">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
          </svg>
          Refresh
        </button>
      </div>

      <!-- MAIN TABS -->
      <div class="tab-bar">
        <button
          class="tab-btn"
          v-for="tab in tabs"
          :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- ── OVERVIEW ── -->
      <div v-if="activeTab === 'overview'" class="tab-panel ov-panel">
        <!-- ══ ROW 1: Key Metric Cards ══ -->
        <div class="ov-metrics-row">
          <!-- IDP Total -->
          <div
            class="ov-metric-card ov-mc-navy"
            @click="toggleOv('idp-all')"
            :class="{ active: ovActive === 'idp-all' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">{{ idps.length }}</div>
              <div class="ov-mc-label">Total IDPs</div>
              <div class="ov-mc-sub">Individual development plans</div>
            </div>
          </div>
          <!-- IDP Pending -->
          <div
            class="ov-metric-card ov-mc-amber"
            @click="toggleOv('idp-pending')"
            :class="{ active: ovActive === 'idp-pending' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">{{ ovCounts.idpPending }}</div>
              <div class="ov-mc-label">Awaiting Supervisor</div>
              <div class="ov-mc-sub">Pending Stage 2 review</div>
            </div>
          </div>
          <!-- IDP Completed -->
          <div
            class="ov-metric-card ov-mc-green"
            @click="toggleOv('idp-complete')"
            :class="{ active: ovActive === 'idp-complete' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">{{ ovCounts.idpComplete }}</div>
              <div class="ov-mc-label">IDPs Completed</div>
              <div class="ov-mc-sub">Supervisor-reviewed</div>
            </div>
          </div>
          <!-- LNA Total -->
          <div
            class="ov-metric-card ov-mc-blue"
            @click="toggleOv('lna-all')"
            :class="{ active: ovActive === 'lna-all' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">{{ lnas.length }}</div>
              <div class="ov-mc-label">Total LNAs</div>
              <div class="ov-mc-sub">Office-level assessments</div>
            </div>
          </div>
          <!-- Offices Covered -->
           <div
            class="ov-metric-card ov-mc-slate"
            @click="toggleOv('lna-offices')"
            :class="{ active: ovActive === 'lna-offices' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">{{ ovCounts.lnaOffices }}</div>
              <div class="ov-mc-label">Offices Covered</div>
              <div class="ov-mc-sub">Unique units submitted</div>
            </div>
          </div>
          <!-- LNA Workforce -->
          <div
            class="ov-metric-card ov-mc-teal"
            @click="toggleOv('lna-workforce')"
            :class="{ active: ovActive === 'lna-workforce' }"
          >
            <div class="ov-mc-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              </svg>
            </div>
            <div class="ov-mc-body">
              <div class="ov-mc-num">
                {{ lnaTotalWorkforce.toLocaleString() }}
              </div>
              <div class="ov-mc-label">Workforce Headcount</div>
              <div class="ov-mc-sub">Across all LNA offices</div>
            </div>
          </div>
        </div>

        <!-- Drill-down table (clicking metric cards) -->
        <transition name="adv-slide">
          <div v-if="ovActive" class="ov-drill">
            <div class="ov-drill-header">
              <span class="ov-drill-title">{{ ovDrillTitle }}</span>
              <button class="btn-ov-close" @click="ovActive = null">
                ✕ Close
              </button>
            </div>
            <!-- IDP drill -->
            <div
              v-if="ovActive.startsWith('idp')"
              class="tbl-wrap"
              style="border-radius: 0; border: none; box-shadow: none"
            >
              <table class="dtbl">
                <thead>
                  <tr>
                    <th
                      v-for="(col, i) in ovIdpCols"
                      :key="col"
                      :class="{
                        'th-sortable': i > 0,
                        'th-sorted': sortState.ovIdp.col === i,
                      }"
                      @click="
                        i > 0 &&
                        (sortState.ovIdp.col === i
                          ? (sortState.ovIdp.asc = !sortState.ovIdp.asc)
                          : ((sortState.ovIdp.col = i),
                            (sortState.ovIdp.asc = true)))
                      "
                    >
                      {{ col
                      }}<span v-if="i > 0" class="sort-ind">{{
                        sortState.ovIdp.col === i
                          ? sortState.ovIdp.asc
                            ? " ↑"
                            : " ↓"
                          : " ↕"
                      }}</span>
                    </th>
                    <th class="th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!ovDrillRows.length" class="empty-row">
                    <td colspan="9">No records found.</td>
                  </tr>
                  <tr v-for="r in ovDrillRows" :key="r.refId">
                    <td>
                      <code class="ref-code">{{ r.refId || "—" }}</code>
                    </td>
                    <td>
                      <strong>{{ r.employeeName || "—" }}</strong
                      ><br /><span class="sub-text">{{ r.email || "" }}</span>
                    </td>
                    <td>{{ r.position || "—" }}</td>
                    <td>{{ r.office || "—" }}</td>
                    <td>{{ r.yearCovered || "—" }}</td>
                    <td>
                      <span :class="statusBadgeClass(r.status)">{{
                        statusBadgeLabel(r.status)
                      }}</span>
                    </td>
                    <td class="date-cell">{{ fmtDateTime(r.submittedAt) }}</td>
                    <td class="date-cell">
                      {{
                        r.status === "COMPLETE"
                          ? fmtDateTime(r.supervisorSignedAt)
                          : "—"
                      }}
                    </td>
                    <td>
                      <button class="btn-view" @click="viewIDP(r.refId)">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
           <!-- LNA drill (raw submissions) -->
            <div
              v-if="ovActive === 'lna-all'"
              class="tbl-wrap"
              style="border-radius: 0; border: none; box-shadow: none"
            >
              <table class="dtbl">
                <thead>
                  <tr>
                    <th
                      v-for="(col, i) in ovLnaCols"
                      :key="col"
                      :class="{
                        'th-sortable': i > 0,
                        'th-sorted': sortState.ovLna.col === i,
                      }"
                      @click="
                        i > 0 &&
                        (sortState.ovLna.col === i
                          ? (sortState.ovLna.asc = !sortState.ovLna.asc)
                          : ((sortState.ovLna.col = i),
                            (sortState.ovLna.asc = true)))
                      "
                    >
                      {{ col
                      }}<span v-if="i > 0" class="sort-ind">{{
                        sortState.ovLna.col === i
                          ? sortState.ovLna.asc
                            ? " ↑"
                            : " ↓"
                          : " ↕"
                      }}</span>
                    </th>
                    <th class="th-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!ovDrillRows.length" class="empty-row">
                    <td colspan="8">No records found.</td>
                  </tr>
                  <tr v-for="r in ovDrillRows" :key="r.refId">
                    <td>
                      <code class="ref-code">{{ r.refId || "—" }}</code>
                    </td>
                    <td>{{ r.office || "—" }}</td>
                    <td>{{ r.headOfUnit || "—" }}</td>
                    <td>{{ r.yearCovered || "—" }}</td>
                    <td>{{ r.purpose || "—" }}</td>
                    <td style="text-align: center">
                      {{ r.totalPersonnel ?? "—" }}
                    </td>
                    <td class="date-cell">{{ fmtDateTime(r.submittedAt) }}</td>
                    <td>
                      <button class="btn-view" @click="viewLNA(r.refId)">
                        View
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- LNA drill (aggregated by office) -->
            <div
              v-if="ovActive === 'lna-offices' || ovActive === 'lna-workforce'"
              class="tbl-wrap"
              style="border-radius: 0; border: none; box-shadow: none"
            >
              <table class="dtbl">
                <thead>
                  <tr>
                    <th
                      v-for="(col, i) in ovLnaOfficeCols"
                      :key="col"
                      class="th-sortable"
                      :class="{ 'th-sorted': sortState.ovLnaOffice.col === i }"
                      @click="
                        sortState.ovLnaOffice.col === i
                          ? (sortState.ovLnaOffice.asc = !sortState.ovLnaOffice.asc)
                          : ((sortState.ovLnaOffice.col = i),
                            (sortState.ovLnaOffice.asc = true))
                      "
                    >
                      {{ col
                      }}<span class="sort-ind">{{
                        sortState.ovLnaOffice.col === i
                          ? sortState.ovLnaOffice.asc
                            ? " ↑"
                            : " ↓"
                          : " ↕"
                      }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!ovDrillRows.length" class="empty-row">
                    <td colspan="4">No records found.</td>
                  </tr>
                  <tr v-for="r in ovDrillRows" :key="r.office">
                    <td>{{ r.office }}</td>
                    <td style="text-align: center">{{ r.count }}</td>
                    <td style="text-align: center">
                      {{ r.totalPersonnel.toLocaleString() }}
                    </td>
                    <td class="date-cell">{{ fmtDateTime(r.submittedAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </transition>

        <!-- ══ ROW 2: IDP Completion + Supervisor Insights ══ -->
        <div class="ov-grid-2">
          <!-- IDP Completion Ring + Position breakdown -->
          <div class="ov-card">
            <div class="ov-card-title">IDP Completion Overview</div>
            <div class="ov-completion-wrap">
              <!-- Ring -->
              <div class="ov-ring-wrap">
                <svg class="ov-ring" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--border)"
                    stroke-width="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--navy)"
                    stroke-width="10"
                    stroke-dasharray="251.2"
                    :stroke-dashoffset="
                      251.2 - (251.2 * idpCompletionRate) / 100
                    "
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)"
                    style="transition: stroke-dashoffset 0.6s ease"
                  />
                  <text
                    x="50"
                    y="54"
                    text-anchor="middle"
                    font-size="18"
                    font-weight="700"
                    fill="var(--navy)"
                    font-family="Roboto, sans-serif"
                  >
                    {{ idpCompletionRate }}%
                  </text>
                </svg>
                <div class="ov-ring-label">Completion<br />Rate</div>
              </div>
              <div class="ov-completion-details">
                <div class="ov-detail-row">
                  <span class="ov-dot ov-dot-green"></span>
                  <span class="ov-detail-label">Completed</span>
                  <span class="ov-detail-val">{{ ovCounts.idpComplete }}</span>
                </div>
                <div class="ov-detail-row">
                  <span class="ov-dot ov-dot-amber"></span>
                  <span class="ov-detail-label">Pending</span>
                  <span class="ov-detail-val">{{ ovCounts.idpPending }}</span>
                </div>
                <div class="ov-detail-row">
                  <span class="ov-dot ov-dot-slate"></span>
                  <span class="ov-detail-label">Total</span>
                  <span class="ov-detail-val">{{ idps.length }}</span>
                </div>
                <div class="ov-divider"></div>
                <div class="ov-detail-row">
                  <span class="ov-detail-label" style="color: var(--text-light)"
                    >Avg Years in Position</span
                  >
                  <span class="ov-detail-val">{{ insights[0].value }}</span>
                </div>
                <div class="ov-detail-row">
                  <span class="ov-detail-label" style="color: var(--text-light)"
                    >Supervisors w/ Pending</span
                  >
                  <span class="ov-detail-val">{{ insights[2].value }}</span>
                </div>
              </div>
            </div>
            <!-- IDP by Position mini bar chart -->
            <div v-if="idpByPosition.length" style="margin-top: 14px">
              <div class="ov-mini-title">Submissions by Position</div>
              <div class="ov-bar-list">
                <div
                  v-for="[label, count] in idpByPosition"
                  :key="label"
                  class="ov-bar-row"
                >
                  <div class="ov-bar-label">{{ label }}</div>
                  <div class="ov-bar-track">
                    <div
                      class="ov-bar-fill ov-bar-navy"
                      :style="{
                        width: (count / maxOf(idpByPosition)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div class="ov-bar-count">{{ count }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Supervisor Assessment Summary -->
          <div class="ov-card">
            <div class="ov-card-title">Supervisor Assessment (Section IV)</div>
            <div v-if="ovCounts.idpComplete === 0" class="ov-empty-note">
              No completed IDPs yet — supervisor assessments will appear here.
            </div>
            <div v-else>
              <!-- Perf Gaps -->
              <div class="ov-sub-section">
                <div class="ov-sub-label">Performance Gaps Identified</div>
                <div class="ov-pill-row">
                  <span class="ov-pill ov-pill-red"
                    >⚠ {{ supervisorPerfGaps.hasGap }} have gaps</span
                  >
                  <span class="ov-pill ov-pill-green"
                    >✓ {{ supervisorPerfGaps.noGap }} no gaps</span
                  >
                  <span class="ov-pill ov-pill-grey"
                    >⏳ {{ supervisorPerfGaps.pending }} pending</span
                  >
                </div>
              </div>
              <!-- Readiness -->
              <div class="ov-sub-section">
                <div class="ov-sub-label">Ready for Advancement</div>
                <div class="ov-pill-row">
                  <span class="ov-pill ov-pill-green"
                    >✓ {{ supervisorReadiness.ready }} ready</span
                  >
                  <span class="ov-pill ov-pill-red"
                    >✗ {{ supervisorReadiness.notReady }} not ready</span
                  >
                  <span class="ov-pill ov-pill-grey"
                    >⏳ {{ supervisorReadiness.noData }} no data</span
                  >
                </div>
              </div>
              <!-- Top recommended interventions -->
              <div class="ov-sub-section" v-if="topSupInterventions.length">
                <div class="ov-sub-label">Top Recommended Interventions</div>
                <div class="ov-bar-list">
                  <div
                    v-for="[label, count] in topSupInterventions"
                    :key="label"
                    class="ov-bar-row"
                  >
                    <div class="ov-bar-label">{{ label }}</div>
                    <div class="ov-bar-track">
                      <div
                        class="ov-bar-fill ov-bar-blue"
                        :style="{
                          width:
                            (count / maxOf(topSupInterventions)) * 100 + '%',
                        }"
                      ></div>
                    </div>
                    <div class="ov-bar-count">{{ count }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ ROW 3: Competency Gaps + LNA Intervention Flags ══ -->
        <div class="ov-grid-2">
          <!-- Top IDP Competency Gaps -->
          <div class="ov-card">
            <div class="ov-card-title">
              Top Competency Gaps
              <span class="ov-card-badge">IDP Section I</span>
            </div>
            <div class="ov-card-sub">
              Competencies where Required Level > Current Level
            </div>
            <div v-if="!topIdpGaps.length" class="ov-empty-note">
              No competency gap data yet.
            </div>
            <div v-else class="ov-bar-list" style="margin-top: 10px">
              <div
                v-for="([label, count], i) in topIdpGaps"
                :key="label"
                class="ov-bar-row"
              >
                <div class="ov-bar-rank">{{ i + 1 }}</div>
                <div class="ov-bar-label">{{ label }}</div>
                <div class="ov-bar-track">
                  <div
                    class="ov-bar-fill ov-bar-red"
                    :style="{ width: (count / maxOf(topIdpGaps)) * 100 + '%' }"
                  ></div>
                </div>
                <div class="ov-bar-count">{{ count }}</div>
              </div>
            </div>
          </div>

          <!-- LNA: Competency Flags -->
          <div class="ov-card">
            <div class="ov-card-title">
              LNA Competency Landscape
              <span class="ov-card-badge">LNA Section II</span>
            </div>
            <div class="ov-grid-inner-2" style="margin-bottom: 12px">
              <div class="ov-mini-stat">
                <div class="ov-mini-num ov-num-red">
                  {{ ovCounts.lnaFlagged }}
                </div>
                <div class="ov-mini-label">
                  Offices Flagging<br />Intervention
                </div>
              </div>
              <div class="ov-mini-stat">
                <div class="ov-mini-num ov-num-navy">
                  {{ lnas.length - ovCounts.lnaFlagged }}
                </div>
                <div class="ov-mini-label">Offices No<br />Urgent Need</div>
              </div>
            </div>
            <!-- Clusters needing intervention -->
            <div
              v-if="lnaInterventionClusters.length"
              style="margin-bottom: 14px"
            >
              <div class="ov-mini-title">Clusters Flagged for Intervention</div>
              <div class="ov-bar-list">
                <div
                  v-for="[label, count] in lnaInterventionClusters"
                  :key="label"
                  class="ov-bar-row"
                >
                  <div class="ov-bar-label">{{ label }}</div>
                  <div class="ov-bar-track">
                    <div
                      class="ov-bar-fill ov-bar-amber"
                      :style="{
                        width:
                          (count / maxOf(lnaInterventionClusters)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div class="ov-bar-count">{{ count }}</div>
                </div>
              </div>
            </div>
            <!-- Strongest / Weakest side by side -->
            <div class="ov-grid-inner-2">
              <div>
                <div class="ov-mini-title ov-title-green">
                  Most Cited Strongest
                </div>
                <div
                  v-for="[label, count] in lnaStrongestCompetencies"
                  :key="label"
                  class="ov-tag-row"
                >
                  <span class="ov-tag-label">{{ label }}</span
                  ><span class="ov-tag-count ov-tag-green">{{ count }}</span>
                </div>
                <div
                  v-if="!lnaStrongestCompetencies.length"
                  class="ov-empty-note"
                  style="font-size: 11px"
                >
                  —
                </div>
              </div>
              <div>
                <div class="ov-mini-title ov-title-red">Most Cited Weakest</div>
                <div
                  v-for="[label, count] in lnaWeakestCompetencies"
                  :key="label"
                  class="ov-tag-row"
                >
                  <span class="ov-tag-label">{{ label }}</span
                  ><span class="ov-tag-count ov-tag-red">{{ count }}</span>
                </div>
                <div
                  v-if="!lnaWeakestCompetencies.length"
                  class="ov-empty-note"
                  style="font-size: 11px"
                >
                  —
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ══ ROW 4: AGAP + Pro-ACT + Workforce ══ -->
        <div class="ov-grid-3">
          <!-- AGAP breakdown -->
          <div class="ov-card">
            <div class="ov-card-title">
              AGAP Plans <span class="ov-card-badge">IDP Section II</span>
            </div>
            <div class="ov-mini-stat" style="margin-bottom: 12px">
              <div class="ov-mini-num ov-num-navy">
                {{ idps.reduce((s, r) => s + (r._agapRows || []).length, 0) }}
              </div>
              <div class="ov-mini-label">
                Total AGAP entries across all IDPs
              </div>
            </div>
            <div v-if="agapModeBreakdown.length">
              <div class="ov-mini-title">Mode of Study</div>
              <div class="ov-bar-list">
                <div
                  v-for="[label, count] in agapModeBreakdown"
                  :key="label"
                  class="ov-bar-row"
                >
                  <div class="ov-bar-label">{{ label }}</div>
                  <div class="ov-bar-track">
                    <div
                      class="ov-bar-fill ov-bar-teal"
                      :style="{
                        width: (count / maxOf(agapModeBreakdown)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div class="ov-bar-count">{{ count }}</div>
                </div>
              </div>
            </div>
            <div v-if="agapDegreeBreakdown.length" style="margin-top: 10px">
              <div class="ov-mini-title">Top Degree Programs</div>
              <div
                v-for="[label, count] in agapDegreeBreakdown"
                :key="label"
                class="ov-tag-row"
              >
                <span class="ov-tag-label">{{ label }}</span
                ><span class="ov-tag-count ov-tag-blue">{{ count }}</span>
              </div>
            </div>
            <div
              v-if="!agapModeBreakdown.length && !agapDegreeBreakdown.length"
              class="ov-empty-note"
            >
              No AGAP data yet.
            </div>
          </div>

          <!-- Pro-ACT breakdown -->
          <div class="ov-card">
            <div class="ov-card-title">
              Pro-ACT Plans <span class="ov-card-badge">IDP Section III</span>
            </div>
            <div class="ov-mini-stat" style="margin-bottom: 12px">
              <div class="ov-mini-num ov-num-navy">
                {{ idps.reduce((s, r) => s + (r._proactRows || []).length, 0) }}
              </div>
              <div class="ov-mini-label">
                Total Pro-ACT entries across all IDPs
              </div>
            </div>
            <div v-if="proactModeBreakdown.length">
              <div class="ov-mini-title">Mode of Activity</div>
              <div class="ov-bar-list">
                <div
                  v-for="[label, count] in proactModeBreakdown"
                  :key="label"
                  class="ov-bar-row"
                >
                  <div class="ov-bar-label">{{ label }}</div>
                  <div class="ov-bar-track">
                    <div
                      class="ov-bar-fill ov-bar-navy"
                      :style="{
                        width: (count / maxOf(proactModeBreakdown)) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div class="ov-bar-count">{{ count }}</div>
                </div>
              </div>
            </div>
            <div v-if="!proactModeBreakdown.length" class="ov-empty-note">
              No Pro-ACT data yet.
            </div>
          </div>

          <!-- Workforce profile summary -->
          <div class="ov-card">
            <div class="ov-card-title">
              Workforce Profile <span class="ov-card-badge">LNA Section I</span>
            </div>
            <div class="ov-mini-stat" style="margin-bottom: 12px">
              <div class="ov-mini-num ov-num-navy">
                {{ lnaTotalWorkforce.toLocaleString() }}
              </div>
              <div class="ov-mini-label">
                Total headcount across all LNA submissions
              </div>
            </div>
            <div class="ov-mini-title">Employment Type Breakdown</div>
            <div class="ov-bar-list">
              <template
                v-for="key in [
                  'permanent',
                  'temporary',
                  'contractual',
                  'casual',
                  'coterminus',
                  'cos',
                  'jobOrder',
                  'others',
                ]"
                :key="key"
              >
                <div v-if="lnaEmploymentBreakdown[key] > 0" class="ov-bar-row">
                  <div class="ov-bar-label" style="text-transform: capitalize">
                    {{
                      key === "jobOrder"
                        ? "Job Order"
                        : key === "cos"
                          ? "COS"
                          : key.charAt(0).toUpperCase() + key.slice(1)
                    }}
                  </div>
                  <div class="ov-bar-track">
                    <div
                      class="ov-bar-fill ov-bar-slate"
                      :style="{
                        width:
                          (lnaEmploymentBreakdown[key] /
                            (lnaTotalWorkforce || 1)) *
                            100 +
                          '%',
                      }"
                    ></div>
                  </div>
                  <div class="ov-bar-count">
                    {{ lnaEmploymentBreakdown[key] }}
                  </div>
                </div>
              </template>
            </div>
            <div v-if="lnaTotalWorkforce === 0" class="ov-empty-note">
              No workforce data yet.
            </div>
          </div>
        </div>

        <!-- ══ ROW 5: Recent Activity ══ -->
        <div class="ov-card" style="margin-top: 4px">
          <div class="ov-card-title">Recent Activity</div>
          <div class="ov-card-sub">
            Latest submissions across IDP and LNA (most recent 10)
          </div>
          <div v-if="!recentActivity.length" class="ov-empty-note">
            No submissions yet.
          </div>
          <div v-else class="ov-activity-list">
            <div
              v-for="r in recentActivity"
              :key="r.refId"
              class="ov-activity-row"
            >
              <div
                class="ov-activity-type"
                :class="r.type === 'IDP' ? 'ov-type-idp' : 'ov-type-lna'"
              >
                {{ r.type }}
              </div>
              <div class="ov-activity-info">
                <div class="ov-activity-name">{{ r.label }}</div>
                <div class="ov-activity-meta">
                  <span>{{ r.office }}</span>
                  <span v-if="r.type === 'IDP'"> · {{ r.position }}</span>
                  <span> · {{ r.yearCovered }}</span>
                </div>
              </div>
              <div class="ov-activity-right">
                <span
                  v-if="r.type === 'IDP'"
                  :class="statusBadgeClass(r.status)"
                  >{{ statusBadgeLabel(r.status) }}</span
                >
                <span v-else class="badge badge-grey">Submitted</span>
                <div class="ov-activity-date">
                  {{ fmtDateTime(r.submittedAt) }}
                </div>
              </div>
              <button
                class="btn-view"
                style="margin-left: 8px"
                @click="r.type === 'IDP' ? viewIDP(r.refId) : viewLNA(r.refId)"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── IDP SUBMISSIONS ── -->
      <div v-if="activeTab === 'idp'" class="tab-panel">
        <!-- sub-tabs -->
        <div class="sub-tab-bar">
          <button
            class="sub-tab-btn"
            v-for="st in idpSubTabs"
            :key="st.key"
            :class="{ active: idpSubTab === st.key }"
            @click="idpSubTab = st.key"
          >
            {{ st.icon }} {{ st.label }}
          </button>
        </div>

        <!-- shared filters -->
        <div class="filter-bar">
          <input
            type="text"
            v-model="idpSearch"
            placeholder="🔍  Search name, office, email..."
          />
          <select v-model="idpStatusFilter">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETE">Completed</option>
          </select>
          <select v-model="idpYearFilter">
            <option value="">All Years</option>
            <option v-for="y in idpYears" :key="y">{{ y }}</option>
          </select>
          <button
            class="btn-adv-filter"
            :class="{ active: showAdvFilters }"
            @click="showAdvFilters = !showAdvFilters"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="13"
              height="13"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filters
            <span
              v-if="
                idpSubTab === 'list' && (idpOfficeFilter || idpPositionFilter)
              "
              class="adv-badge"
              >{{
                [idpOfficeFilter, idpPositionFilter].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                idpSubTab === 'competency' &&
                (idpCompClusterFilter ||
                  idpCompTargetCompFilter ||
                  idpCompCurrentLvlFilter ||
                  idpCompRequiredLvlFilter ||
                  idpCompInterventionFilter ||
                  idpCompTimelineFilter ||
                  idpCompGapFilter)
              "
              class="adv-badge"
              >{{
                [
                  idpCompClusterFilter,
                  idpCompTargetCompFilter,
                  idpCompCurrentLvlFilter,
                  idpCompRequiredLvlFilter,
                  idpCompInterventionFilter,
                  idpCompTimelineFilter,
                  idpCompGapFilter,
                ].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                idpSubTab === 'agap' &&
                (idpAgapDegreeFilter ||
                  idpAgapHeiFilter ||
                  idpAgapModeFilter ||
                  idpAgapScholarshipFilter ||
                  idpAgapTimelineFilter)
              "
              class="adv-badge"
              >{{
                [
                  idpAgapDegreeFilter,
                  idpAgapHeiFilter,
                  idpAgapModeFilter,
                  idpAgapScholarshipFilter,
                  idpAgapTimelineFilter,
                ].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                idpSubTab === 'proact' &&
                (idpProactTitleFilter ||
                  idpProactSkillFilter ||
                  idpProactModeFilter ||
                  idpProactProviderFilter ||
                  idpProactTimelineFilter)
              "
              class="adv-badge"
              >{{
                [
                  idpProactTitleFilter,
                  idpProactSkillFilter,
                  idpProactModeFilter,
                  idpProactProviderFilter,
                  idpProactTimelineFilter,
                ].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                idpSubTab === 'supervisor' &&
                (idpSupPerfGapsFilter ||
                  idpSupReadinessFilter ||
                  idpSupInterventionFilter ||
                  idpSupImplYearFilter ||
                  idpSupImplPeriodFilter)
              "
              class="adv-badge"
              >{{
                [
                  idpSupPerfGapsFilter,
                  idpSupReadinessFilter,
                  idpSupInterventionFilter,
                  idpSupImplYearFilter,
                  idpSupImplPeriodFilter,
                ].filter(Boolean).length
              }}</span
            >
          </button>
          <span class="result-count"
            >{{ filteredIDPs.length }} record{{
              filteredIDPs.length !== 1 ? "s" : ""
            }}</span
          >
        </div>

        <!-- ── ADVANCED FILTER PANEL ── -->
        <transition name="adv-slide">
          <div v-if="showAdvFilters" class="adv-filter-panel">
            <!-- ALL SUBMISSIONS advanced filters -->
            <template v-if="idpSubTab === 'list'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Office / Unit</label>
                  <select v-model="idpOfficeFilter" class="adv-select">
                    <option value="">All Offices</option>
                    <option v-for="o in idpOffices" :key="o" :value="o">
                      {{ o }}
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Position</label>
                  <select v-model="idpPositionFilter" class="adv-select">
                    <option value="">All Positions</option>
                    <option v-for="p in idpPositions" :key="p" :value="p">
                      {{ p }}
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpOfficeFilter = '';
                    idpPositionFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="idpOfficeFilter || idpPositionFilter"
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredIDPs.length }}</span>
                employee{{ filteredIDPs.length !== 1 ? "s" : "" }} match this
                filter
              </div>
            </template>

            <!-- COMPETENCY advanced filters -->
            <template v-if="idpSubTab === 'competency'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Cluster</label>
                  <select v-model="idpCompClusterFilter" class="adv-select">
                    <option value="">All Clusters</option>
                    <option
                      v-for="o in compClusterOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} <template v-if="o.c">({{ o.c }})</template>
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Target Competency</label>
                  <select v-model="idpCompTargetCompFilter" class="adv-select">
                    <option value="">All Competencies</option>
                    <option
                      v-for="o in compTargetCompOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Current Level</label>
                  <select v-model="idpCompCurrentLvlFilter" class="adv-select">
                    <option value="">Any</option>
                    <option
                      v-for="o in compCurrentLvlOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Required Level</label>
                  <select v-model="idpCompRequiredLvlFilter" class="adv-select">
                    <option value="">Any</option>
                    <option
                      v-for="o in compRequiredLvlOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpCompClusterFilter = '';
                    idpCompTargetCompFilter = '';
                    idpCompCurrentLvlFilter = '';
                    idpCompRequiredLvlFilter = '';
                    idpCompInterventionFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Suggested Intervention</label>
                  <select
                    v-model="idpCompInterventionFilter"
                    class="adv-select"
                  >
                    <option value="">All</option>
                    <option
                      v-for="o in compInterventionOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Target Timeline</label>
                  <select v-model="idpCompTimelineFilter" class="adv-select">
                    <option value="">All Timelines</option>
                    <option
                      v-for="o in compTimelineOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Has Gap?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: idpCompGapFilter === '' }"
                      @click="idpCompGapFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle adv-toggle-red"
                      :class="{ active: idpCompGapFilter === 'Yes' }"
                      @click="
                        idpCompGapFilter =
                          idpCompGapFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle adv-toggle-green"
                      :class="{ active: idpCompGapFilter === 'No' }"
                      @click="
                        idpCompGapFilter = idpCompGapFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpCompTimelineFilter = '';
                    idpCompGapFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  idpCompClusterFilter ||
                  idpCompTargetCompFilter ||
                  idpCompCurrentLvlFilter ||
                  idpCompRequiredLvlFilter ||
                  idpCompInterventionFilter ||
                  idpCompTimelineFilter ||
                  idpCompGapFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{
                  filteredCompetencyRows.length
                }}</span>
                entr{{ filteredCompetencyRows.length !== 1 ? "ies" : "y" }}
                match &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredCompetencyRows.map((r) => r.refId)).size
                }}</span>
                unique employee{{
                  new Set(filteredCompetencyRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>

            <!-- AGAP advanced filters -->
            <template v-if="idpSubTab === 'agap'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Degree Program</label>
                  <select v-model="idpAgapDegreeFilter" class="adv-select">
                    <option value="">All Programs</option>
                    <option
                      v-for="o in agapDegreeOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Target HEI</label>
                  <select v-model="idpAgapHeiFilter" class="adv-select">
                    <option value="">All HEIs</option>
                    <option v-for="o in agapHeiOptions" :key="o.v" :value="o.v">
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Mode of Study</label>
                  <select v-model="idpAgapModeFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in agapModeOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Scholarship / Grant</label>
                  <select v-model="idpAgapScholarshipFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in agapScholarshipOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpAgapDegreeFilter = '';
                    idpAgapHeiFilter = '';
                    idpAgapModeFilter = '';
                    idpAgapScholarshipFilter = '';
                    idpAgapTimelineFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Target Timeline</label>
                  <select v-model="idpAgapTimelineFilter" class="adv-select">
                    <option value="">All Timelines</option>
                    <option
                      v-for="o in agapTimelineOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="idpAgapTimelineFilter = ''"
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  idpAgapDegreeFilter ||
                  idpAgapHeiFilter ||
                  idpAgapModeFilter ||
                  idpAgapScholarshipFilter ||
                  idpAgapTimelineFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredAgapRows.length }}</span>
                entr{{ filteredAgapRows.length !== 1 ? "ies" : "y" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredAgapRows.map((r) => r.refId)).size
                }}</span>
                unique employee{{
                  new Set(filteredAgapRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>

            <!-- PRO-ACT advanced filters -->
            <template v-if="idpSubTab === 'proact'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Training Title</label>
                  <select v-model="idpProactTitleFilter" class="adv-select">
                    <option value="">All Titles</option>
                    <option
                      v-for="o in proactTitleOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Target Competency / Skill</label>
                  <select v-model="idpProactSkillFilter" class="adv-select">
                    <option value="">All Skills</option>
                    <option
                      v-for="o in proactSkillOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Mode of Activity</label>
                  <select v-model="idpProactModeFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in proactModeOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Trainer / Provider</label>
                  <select v-model="idpProactProviderFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in proactProviderOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpProactTitleFilter = '';
                    idpProactSkillFilter = '';
                    idpProactModeFilter = '';
                    idpProactProviderFilter = '';
                    idpProactTimelineFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Target Timeline</label>
                  <select v-model="idpProactTimelineFilter" class="adv-select">
                    <option value="">All Timelines</option>
                    <option
                      v-for="o in proactTimelineOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="idpProactTimelineFilter = ''"
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  idpProactTitleFilter ||
                  idpProactSkillFilter ||
                  idpProactModeFilter ||
                  idpProactProviderFilter ||
                  idpProactTimelineFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredProactRows.length }}</span>
                entr{{ filteredProactRows.length !== 1 ? "ies" : "y" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredProactRows.map((r) => r.refId)).size
                }}</span>
                unique employee{{
                  new Set(filteredProactRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>

            <!-- SUPERVISOR advanced filters -->
            <template v-if="idpSubTab === 'supervisor'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Performance Gaps?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: idpSupPerfGapsFilter === '' }"
                      @click="idpSupPerfGapsFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle adv-toggle-red"
                      :class="{ active: idpSupPerfGapsFilter === 'Yes' }"
                      @click="
                        idpSupPerfGapsFilter =
                          idpSupPerfGapsFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle adv-toggle-green"
                      :class="{ active: idpSupPerfGapsFilter === 'No' }"
                      @click="
                        idpSupPerfGapsFilter =
                          idpSupPerfGapsFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Ready for Advancement?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: idpSupReadinessFilter === '' }"
                      @click="idpSupReadinessFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle adv-toggle-green"
                      :class="{ active: idpSupReadinessFilter === 'Yes' }"
                      @click="
                        idpSupReadinessFilter =
                          idpSupReadinessFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle adv-toggle-red"
                      :class="{ active: idpSupReadinessFilter === 'No' }"
                      @click="
                        idpSupReadinessFilter =
                          idpSupReadinessFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Recommended Intervention</label>
                  <select v-model="idpSupInterventionFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in supInterventionOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Impl. Year</label>
                  <select v-model="idpSupImplYearFilter" class="adv-select">
                    <option value="">Any</option>
                    <option
                      v-for="o in supImplYearOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Impl. Period</label>
                  <select v-model="idpSupImplPeriodFilter" class="adv-select">
                    <option value="">Any</option>
                    <option
                      v-for="o in supImplPeriodOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    idpSupPerfGapsFilter = '';
                    idpSupReadinessFilter = '';
                    idpSupInterventionFilter = '';
                    idpSupImplYearFilter = '';
                    idpSupImplPeriodFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  idpSupPerfGapsFilter ||
                  idpSupReadinessFilter ||
                  idpSupInterventionFilter ||
                  idpSupImplYearFilter ||
                  idpSupImplPeriodFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredSupRows.length }}</span>
                employee{{ filteredSupRows.length !== 1 ? "s" : "" }} match this
                filter
              </div>
            </template>
          </div>
        </transition>

        <!-- ALL SUBMISSIONS -->
        <div v-if="idpSubTab === 'list'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th
                  v-for="(col, i) in idpCols"
                  :key="col"
                  :class="{
                    'th-sortable': i > 0,
                    'th-sorted': sortState.idp.col === i,
                  }"
                  @click="i > 0 && sortTable('idp', i)"
                >
                  {{ col }}
                  <span v-if="i > 0" class="sort-ind">{{
                    sortIndicator("idp", i)
                  }}</span>
                </th>
                <th class="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredIDPs.length" class="empty-row">
                <td colspan="9">No records found.</td>
              </tr>
              <tr v-for="r in filteredIDPs" :key="r.refId">
                <td>
                  <code class="ref-code">{{ r.refId || "—" }}</code>
                </td>
                <td>
                  <strong>{{ r.employeeName || "—" }}</strong
                  ><br /><span class="sub-text">{{ r.email || "" }}</span>
                </td>
                <td>{{ r.position || "—" }}</td>
                <td>{{ r.office || "—" }}</td>
                <td>{{ r.yearCovered || "—" }}</td>
                <td class="date-cell">{{ fmtDateTime(r.submittedAt) }}</td>
                <td>
                  <span :class="statusBadgeClass(r.status)">{{
                    statusBadgeLabel(r.status)
                  }}</span>
                </td>
                <td class="date-cell">
                  {{
                    r.status === "COMPLETE"
                      ? fmtDateTime(r.supervisorSignedAt)
                      : "—"
                  }}
                </td>
                <td>
                  <button class="btn-view" @click="viewIDP(r.refId)">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TOP COMPETENCY GAPS — shown on Section I sub-tab -->
        <div
          v-if="idpSubTab === 'competency'"
          class="chart-card"
          style="margin-bottom: 16px"
        >
          <h4>Top Competency Gaps</h4>
          <p class="chart-sub">
            Most frequently cited in IDP Section I (Required &gt; Current)
          </p>
          <div v-if="topCompetencyGaps.length" style="margin-top: 10px">
            <div
              v-for="(g, i) in topCompetencyGaps"
              :key="g.label"
              style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 7px;
                font-size: 12px;
              "
            >
              <span
                style="
                  width: 18px;
                  height: 18px;
                  background: var(--navy);
                  color: #fff;
                  border-radius: 50%;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 9px;
                  font-weight: 700;
                  flex-shrink: 0;
                "
                >{{ i + 1 }}</span
              >
              <span style="width: 200px; flex-shrink: 0">{{ g.label }}</span>
              <div
                style="
                  flex: 1;
                  background: #eee;
                  border-radius: 4px;
                  height: 7px;
                  overflow: hidden;
                "
              >
                <div
                  :style="{
                    width: (g.count / topCompetencyGaps[0].count) * 100 + '%',
                    height: '100%',
                    background: 'var(--navy)',
                    borderRadius: '4px',
                  }"
                ></div>
              </div>
              <span
                style="
                  width: 24px;
                  text-align: right;
                  font-weight: 700;
                  color: var(--navy);
                "
                >{{ g.count }}</span
              >
            </div>
          </div>
          <p
            v-else
            style="font-size: 13px; color: var(--text-light); margin-top: 8px"
          >
            No competency data yet.
          </p>
        </div>
        <!-- SECTION I: COMPETENCY ASSESSMENT -->
        <div v-if="idpSubTab === 'competency'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Year</th>
                <th>#</th>
                <th>Target Competency</th>
                <th>Cluster</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Suggested Intervention</th>
                <th>Target Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!idpCompetencyRows.length" class="empty-row">
                <td colspan="12">No competency data found.</td>
              </tr>
              <tr v-for="r in idpCompetencyRows" :key="r._key">
                <td>
                  <code class="ref-code">{{ r.refId }}</code>
                </td>
                <td>
                  <strong>{{ r.name }}</strong
                  ><br /><span class="sub-text">{{ r.email }}</span>
                </td>
                <td>{{ r.position }}</td>
                <td>{{ r.office }}</td>
                <td>{{ r.year }}</td>
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ r.priority }}
                </td>
                <td>
                  <strong>{{ r.targetCompetency || "—" }}</strong>
                </td>
                <td>
                  <span class="badge badge-grey">{{
                    r.competencyGroup || "—"
                  }}</span>
                </td>
                <td style="text-align: center">
                  <span class="level-badge level-cur">{{
                    r.currentLevel || "—"
                  }}</span>
                </td>
                <td style="text-align: center">
                  <span class="level-badge level-req">{{
                    r.requiredLevel || "—"
                  }}</span>
                </td>
                <td>{{ r.leadInterventions || "—" }}</td>
                <td class="date-cell">{{ r.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION II: AGAP -->
        <div v-if="idpSubTab === 'agap'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Year</th>
                <th>#</th>
                <th>Degree Program</th>
                <th>Target HEI</th>
                <th>Mode of Study</th>
                <th>Scholarship / Grant</th>
                <th>Target Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!idpAgapRows.length" class="empty-row">
                <td colspan="11">No AGAP data found.</td>
              </tr>
              <tr v-for="r in idpAgapRows" :key="r._key">
                <td>
                  <code class="ref-code">{{ r.refId }}</code>
                </td>
                <td>
                  <strong>{{ r.name }}</strong>
                </td>
                <td>{{ r.position }}</td>
                <td>{{ r.office }}</td>
                <td>{{ r.year }}</td>
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ r.priority }}
                </td>
                <td>{{ r.degreeProgram || "—" }}</td>
                <td>{{ r.targetHEI || "—" }}</td>
                <td>{{ r.modeOfStudy || "—" }}</td>
                <td>{{ r.scholarshipGrant || "—" }}</td>
                <td class="date-cell">{{ r.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION III: PRO-ACT -->
        <div v-if="idpSubTab === 'proact'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Year</th>
                <th>#</th>
                <th>Training / Workshop Title</th>
                <th>Target Competency / Skill</th>
                <th>Mode of Activity</th>
                <th>Trainer / Provider</th>
                <th>Target Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredProactRows.length" class="empty-row">
                <td colspan="11">No Pro-ACT data found.</td>
              </tr>
              <tr v-for="r in filteredProactRows" :key="r._key">
                <td>
                  <code class="ref-code">{{ r.refId }}</code>
                </td>
                <td>
                  <strong>{{ r.name }}</strong>
                </td>
                <td>{{ r.position }}</td>
                <td>{{ r.office }}</td>
                <td>{{ r.year }}</td>
                <td
                  style="
                    text-align: center;
                    color: var(--text-light);
                    font-weight: 600;
                  "
                >
                  {{ r.priority }}
                </td>
                <td>{{ r.trainingTitle || "—" }}</td>
                <td>{{ r.targetSkill || "—" }}</td>
                <td>{{ r.modeOfActivity || "—" }}</td>
                <td>{{ r.trainerProvider || "—" }}</td>
                <td class="date-cell">{{ r.targetTimeline || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION IV: SUPERVISOR ASSESSMENT -->
        <div v-if="idpSubTab === 'supervisor'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Employee</th>
                <th>Supervisor</th>
                <th>Office</th>
                <th>Year</th>
                <th>Status</th>
                <th>Performance Gaps?</th>
                <th>Gap Description</th>
                <th>Ready for Advancement?</th>
                <th>Readiness Remarks</th>
                <th>Recommended Interventions</th>
                <th>Implementation Period</th>
                <th>Additional Comments</th>
                <th>Review Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredSupRows.length" class="empty-row">
                <td colspan="14">No records found.</td>
              </tr>
              <tr v-for="r in filteredSupRows" :key="r.refId">
                <td>
                  <code class="ref-code">{{ r.refId }}</code>
                </td>
                <td>
                  <strong>{{ r.employeeName || "—" }}</strong>
                </td>
                <td>
                  {{ r.supervisorName || "—" }}<br /><span class="sub-text">{{
                    r.supervisorEmail || ""
                  }}</span>
                </td>
                <td>{{ r.office || "—" }}</td>
                <td>{{ r.yearCovered || "—" }}</td>
                <td>
                  <span :class="statusBadgeClass(r.status)">{{
                    statusBadgeLabel(r.status)
                  }}</span>
                </td>
                <template v-if="r.status === 'COMPLETE' && r._assessment">
                  <td style="text-align: center">
                    <span
                      :class="
                        r._assessment.perfGapsYN === 'Yes'
                          ? 'badge badge-red'
                          : 'badge badge-green'
                      "
                      >{{ r._assessment.perfGapsYN || "—" }}</span
                    >
                  </td>
                  <td class="cell-wrap">
                    {{ r._assessment.perfGapsSpec || "—" }}
                  </td>
                  <td style="text-align: center">
                    <span
                      :class="
                        r._assessment.readinessYN === 'Yes'
                          ? 'badge badge-green'
                          : 'badge badge-gold'
                      "
                      >{{ r._assessment.readinessYN || "—" }}</span
                    >
                  </td>
                  <td class="cell-wrap">
                    {{ r._assessment.readinessRemarks || "—" }}
                  </td>
                  <td style="font-size: 12px">
                    {{
                      Array.isArray(r._assessment.interventions)
                        ? r._assessment.interventions.join(", ")
                        : r._assessment.interventions || "—"
                    }}
                  </td>
                  <td>
                    {{ r._assessment.implYear || "" }}
                    {{ r._assessment.implementationPeriod || "—" }}
                  </td>
                  <td class="cell-wrap">
                    {{ r._assessment.additionalComments || "—" }}
                  </td>
                  <td class="date-cell">{{ fmtDate(r.supervisorSignedAt) }}</td>
                </template>
                <template v-else>
                  <td
                    colspan="8"
                    style="
                      text-align: center;
                      font-style: italic;
                      color: var(--text-light);
                      font-size: 12px;
                    "
                  >
                    Awaiting supervisor assessment
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── LNA SUBMISSIONS ── -->
      <div v-if="activeTab === 'lna'" class="tab-panel">
        <!-- sub-tabs -->
        <div class="sub-tab-bar">
          <button
            class="sub-tab-btn"
            v-for="st in lnaSubTabs"
            :key="st.key"
            :class="{ active: lnaSubTab === st.key }"
            @click="lnaSubTab = st.key"
          >
            {{ st.icon }} {{ st.label }}
          </button>
        </div>

        <!-- shared filters -->
        <div class="filter-bar">
          <input
            type="text"
            v-model="lnaSearch"
            placeholder="🔍  Search office, head, email..."
          />
          <select v-model="lnaYearFilter">
            <option value="">All Years</option>
            <option v-for="y in lnaYears" :key="y">{{ y }}</option>
          </select>
          <button
            class="btn-adv-filter"
            :class="{ active: showLnaAdvFilters }"
            @click="showLnaAdvFilters = !showLnaAdvFilters"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="13"
              height="13"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filters
            <span
              v-if="
                lnaSubTab === 'list' && (lnaPurposeFilter || lnaOfficeFilter)
              "
              class="adv-badge"
              >{{
                [lnaPurposeFilter, lnaOfficeFilter].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                lnaSubTab === 'workforce' &&
                (lnaWfLevelFilter || lnaWfHasTypeFilter || lnaWfCountFilter)
              "
              class="adv-badge"
              >{{
                [lnaWfLevelFilter, lnaWfHasTypeFilter, lnaWfCountFilter].filter(
                  Boolean,
                ).length
              }}</span
            >
            <span
              v-if="
                lnaSubTab === 'competency' &&
                (lnaClusterFilter ||
                  lnaStrongestFilter ||
                  lnaWeakestFilter ||
                  lnaInterventionFilter ||
                  lnaCompClusterFilter ||
                  lnaCompCompetencyFilter ||
                  lnaHasObsFilter)
              "
              class="adv-badge"
              >{{
                [
                  lnaClusterFilter,
                  lnaStrongestFilter,
                  lnaWeakestFilter,
                  lnaInterventionFilter,
                  lnaCompClusterFilter,
                  lnaCompCompetencyFilter,
                  lnaHasObsFilter,
                ].filter(Boolean).length
              }}</span
            >
            <span
              v-if="
                lnaSubTab === 'sources' &&
                (lnaDataSourceFilter ||
                  lnaHasSourcesFilter ||
                  lnaInsightSourceFilter ||
                  lnaInsightPersonnelFilter ||
                  lnaInsightInterventionFilter)
              "
              class="adv-badge"
              >{{
                [
                  lnaDataSourceFilter,
                  lnaHasSourcesFilter,
                  lnaInsightSourceFilter,
                  lnaInsightPersonnelFilter,
                  lnaInsightInterventionFilter,
                ].filter(Boolean).length
              }}</span
            >
          </button>
          <span class="result-count"
            >{{ filteredLNAs.length }} record{{
              filteredLNAs.length !== 1 ? "s" : ""
            }}</span
          >
        </div>

        <!-- ── LNA ADVANCED FILTER PANEL ── -->
        <transition name="adv-slide">
          <div v-if="showLnaAdvFilters" class="adv-filter-panel">
            <!-- ALL SUBMISSIONS -->
            <template v-if="lnaSubTab === 'list'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Office / Unit</label>
                  <select v-model="lnaOfficeFilter" class="adv-select">
                    <option value="">All Offices</option>
                    <option v-for="o in lnaOffices" :key="o" :value="o">
                      {{ o }}
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Purpose</label>
                  <select v-model="lnaPurposeFilter" class="adv-select">
                    <option value="">All Purposes</option>
                    <option
                      v-for="o in lnaPurposeOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaOfficeFilter = '';
                    lnaPurposeFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="lnaOfficeFilter || lnaPurposeFilter"
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredLNAs.length }}</span>
                office{{ filteredLNAs.length !== 1 ? "s" : "" }} match this
                filter
              </div>
            </template>

            <!-- WORKFORCE -->
            <template v-if="lnaSubTab === 'workforce'">
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Position Level</label>
                  <select v-model="lnaWfLevelFilter" class="adv-select">
                    <option value="">All Levels</option>
                    <option
                      v-for="o in lnaWfLevelOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }}
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Has Personnel Type</label>
                  <select v-model="lnaWfHasTypeFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in lnaWfHasTypeOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }}
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Personnel Count</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaWfCountFilter === '' }"
                      @click="lnaWfCountFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaWfCountFilter === 'gt0' }"
                      @click="
                        lnaWfCountFilter =
                          lnaWfCountFilter === 'gt0' ? '' : 'gt0'
                      "
                    >
                      &gt; 0
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaWfCountFilter === 'gt10' }"
                      @click="
                        lnaWfCountFilter =
                          lnaWfCountFilter === 'gt10' ? '' : 'gt10'
                      "
                    >
                      &gt; 10
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaWfCountFilter === 'gt50' }"
                      @click="
                        lnaWfCountFilter =
                          lnaWfCountFilter === 'gt50' ? '' : 'gt50'
                      "
                    >
                      &gt; 50
                    </button>
                  </div>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaWfLevelFilter = '';
                    lnaWfHasTypeFilter = '';
                    lnaWfCountFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  lnaWfLevelFilter || lnaWfHasTypeFilter || lnaWfCountFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{
                  filteredWorkforceRows.length
                }}</span>
                row{{ filteredWorkforceRows.length !== 1 ? "s" : "" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredWorkforceRows.map((r) => r.refId)).size
                }}</span>
                unique office{{
                  new Set(filteredWorkforceRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>

            <!-- COMPETENCY -->
            <template v-if="lnaSubTab === 'competency'">
              <div class="adv-filter-section-label">Cluster Summary</div>
              <div class="adv-filter-row" style="margin-bottom: 14px">
                <div class="adv-filter-group">
                  <label class="adv-label">Cluster</label>
                  <select v-model="lnaClusterFilter" class="adv-select">
                    <option value="">All Clusters</option>
                    <option
                      v-for="o in lnaClusterOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Strongest Competency</label>
                  <select v-model="lnaStrongestFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in lnaStrongestOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Weakest Competency</label>
                  <select v-model="lnaWeakestFilter" class="adv-select">
                    <option value="">All</option>
                    <option
                      v-for="o in lnaWeakestOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Intervention Needed?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaInterventionFilter === '' }"
                      @click="lnaInterventionFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle adv-toggle-red"
                      :class="{ active: lnaInterventionFilter === 'Yes' }"
                      @click="
                        lnaInterventionFilter =
                          lnaInterventionFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle adv-toggle-green"
                      :class="{ active: lnaInterventionFilter === 'No' }"
                      @click="
                        lnaInterventionFilter =
                          lnaInterventionFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaClusterFilter = '';
                    lnaStrongestFilter = '';
                    lnaWeakestFilter = '';
                    lnaInterventionFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  lnaClusterFilter ||
                  lnaStrongestFilter ||
                  lnaWeakestFilter ||
                  lnaInterventionFilter
                "
                class="adv-who-count"
                style="margin-bottom: 14px"
              >
                <span class="adv-who-num">{{
                  filteredClusterRows.length
                }}</span>
                entr{{ filteredClusterRows.length !== 1 ? "ies" : "y" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredClusterRows.map((r) => r.refId)).size
                }}</span>
                unique office{{
                  new Set(filteredClusterRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>

              <div class="adv-filter-section-label">
                Detailed Competency Mapping
              </div>
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Cluster</label>
                  <select v-model="lnaCompClusterFilter" class="adv-select">
                    <option value="">All Clusters</option>
                    <option
                      v-for="o in lnaCompClusterOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Competency</label>
                  <select v-model="lnaCompCompetencyFilter" class="adv-select">
                    <option value="">All Competencies</option>
                    <option
                      v-for="o in lnaCompCompetencyOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Has Observations?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasObsFilter === '' }"
                      @click="lnaHasObsFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasObsFilter === 'Yes' }"
                      @click="
                        lnaHasObsFilter = lnaHasObsFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasObsFilter === 'No' }"
                      @click="
                        lnaHasObsFilter = lnaHasObsFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaCompClusterFilter = '';
                    lnaCompCompetencyFilter = '';
                    lnaHasObsFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  lnaCompClusterFilter ||
                  lnaCompCompetencyFilter ||
                  lnaHasObsFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{ filteredCompRows.length }}</span>
                entr{{ filteredCompRows.length !== 1 ? "ies" : "y" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredCompRows.map((r) => r.refId)).size
                }}</span>
                unique office{{
                  new Set(filteredCompRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>

            <!-- DATA SOURCES & INSIGHTS -->
            <template v-if="lnaSubTab === 'sources'">
              <div class="adv-filter-section-label">Data Sources</div>
              <div class="adv-filter-row" style="margin-bottom: 14px">
                <div class="adv-filter-group">
                  <label class="adv-label">Data Source</label>
                  <select v-model="lnaDataSourceFilter" class="adv-select">
                    <option value="">All Sources</option>
                    <option
                      v-for="o in lnaDataSourceOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Has Sources?</label>
                  <div class="adv-toggle-group">
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasSourcesFilter === '' }"
                      @click="lnaHasSourcesFilter = ''"
                    >
                      All
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasSourcesFilter === 'Yes' }"
                      @click="
                        lnaHasSourcesFilter =
                          lnaHasSourcesFilter === 'Yes' ? '' : 'Yes'
                      "
                    >
                      Yes
                    </button>
                    <button
                      class="adv-toggle"
                      :class="{ active: lnaHasSourcesFilter === 'No' }"
                      @click="
                        lnaHasSourcesFilter =
                          lnaHasSourcesFilter === 'No' ? '' : 'No'
                      "
                    >
                      No
                    </button>
                  </div>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaDataSourceFilter = '';
                    lnaHasSourcesFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="lnaDataSourceFilter || lnaHasSourcesFilter"
                class="adv-who-count"
                style="margin-bottom: 14px"
              >
                <span class="adv-who-num">{{
                  filteredDataSourceRows.length
                }}</span>
                office{{ filteredDataSourceRows.length !== 1 ? "s" : "" }} match
              </div>

              <div class="adv-filter-section-label">Key Insights</div>
              <div class="adv-filter-row">
                <div class="adv-filter-group">
                  <label class="adv-label">Data Source</label>
                  <select v-model="lnaInsightSourceFilter" class="adv-select">
                    <option value="">All Sources</option>
                    <option
                      v-for="o in lnaInsightSourceOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Relevant Personnel</label>
                  <select
                    v-model="lnaInsightPersonnelFilter"
                    class="adv-select"
                  >
                    <option value="">All Personnel</option>
                    <option
                      v-for="o in lnaInsightPersonnelOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <div class="adv-filter-group">
                  <label class="adv-label">Recommended Intervention</label>
                  <select
                    v-model="lnaInsightInterventionFilter"
                    class="adv-select"
                  >
                    <option value="">All</option>
                    <option
                      v-for="o in lnaInsightInterventionOptions"
                      :key="o.v"
                      :value="o.v"
                    >
                      {{ o.v }} ({{ o.c }})
                    </option>
                  </select>
                </div>
                <button
                  class="btn-clear-adv"
                  @click="
                    lnaInsightSourceFilter = '';
                    lnaInsightPersonnelFilter = '';
                    lnaInsightInterventionFilter = '';
                  "
                >
                  Clear
                </button>
              </div>
              <div
                v-if="
                  lnaInsightSourceFilter ||
                  lnaInsightPersonnelFilter ||
                  lnaInsightInterventionFilter
                "
                class="adv-who-count"
              >
                <span class="adv-who-num">{{
                  filteredInsightRows.length
                }}</span>
                insight{{ filteredInsightRows.length !== 1 ? "s" : "" }} match
                &nbsp;·&nbsp;
                <span class="adv-who-num">{{
                  new Set(filteredInsightRows.map((r) => r.refId)).size
                }}</span>
                unique office{{
                  new Set(filteredInsightRows.map((r) => r.refId)).size !== 1
                    ? "s"
                    : ""
                }}
              </div>
            </template>
          </div>
        </transition>

        <!-- ALL SUBMISSIONS -->
        <div v-if="lnaSubTab === 'list'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th
                  v-for="(col, i) in lnaCols"
                  :key="col"
                  :class="{
                    'th-sortable': i > 0,
                    'th-sorted': sortState.lna.col === i,
                  }"
                  @click="i > 0 && sortTable('lna', i)"
                >
                  {{ col }}
                  <span v-if="i > 0" class="sort-ind">{{
                    sortIndicator("lna", i)
                  }}</span>
                </th>
                <th class="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredLNAs.length" class="empty-row">
                <td colspan="8">No records found.</td>
              </tr>
              <tr v-for="r in filteredLNAs" :key="r.refId">
                <td>
                  <code class="ref-code">{{ r.refId || "—" }}</code>
                </td>
                <td>
                  <strong>{{ r.office || "—" }}</strong>
                </td>
                <td>
                  {{ r.headOfUnit || "—" }}<br /><span class="sub-text">{{
                    r.email || ""
                  }}</span>
                </td>
                <td>{{ r.yearCovered || "—" }}</td>
                <td>
                  <span class="badge badge-grey">{{ r.purpose || "—" }}</span>
                </td>
                <td style="text-align: center">
                  {{ r.totalPersonnel || "—" }}
                </td>
                <td class="date-cell">{{ fmtDateTime(r.submittedAt) }}</td>
                <td>
                  <button class="btn-view" @click="viewLNA(r.refId)">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION I: WORKFORCE PROFILE -->
        <div v-if="lnaSubTab === 'workforce'" class="tbl-wrap">
          <table class="dtbl">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Office / Unit</th>
                <th>Year</th>
                <th>Position Level</th>
                <th>Permanent</th>
                <th>Temporary</th>
                <th>Contractual</th>
                <th>Casual</th>
                <th>Coterminus</th>
                <th>COS</th>
                <th>Job Order</th>
                <th>Others</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredWorkforceRows.length" class="empty-row">
                <td colspan="13">No workforce data found.</td>
              </tr>
              <tr v-for="r in filteredWorkforceRows" :key="r._key">
                <td>
                  <code class="ref-code">{{ r.refId }}</code>
                </td>
                <td>{{ r.office }}</td>
                <td>{{ r.year }}</td>
                <td>
                  <strong>{{ r.levelLabel }}</strong>
                </td>
                <td style="text-align: center">{{ r.permanent || 0 }}</td>
                <td style="text-align: center">{{ r.temporary || 0 }}</td>
                <td style="text-align: center">{{ r.contractual || 0 }}</td>
                <td style="text-align: center">{{ r.casual || 0 }}</td>
                <td style="text-align: center">{{ r.coterminus || 0 }}</td>
                <td style="text-align: center">{{ r.cos || 0 }}</td>
                <td style="text-align: center">{{ r.jobOrder || 0 }}</td>
                <td style="text-align: center">{{ r.others || 0 }}</td>
                <td
                  style="
                    text-align: center;
                    font-weight: 700;
                    color: var(--navy);
                  "
                >
                  {{ r.total }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SECTION II: COMPETENCY MAPPING -->
        <div v-if="lnaSubTab === 'competency'">
          <div v-if="!filteredLNAs.length" class="comp2-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              width="28"
              height="28"
              style="opacity: 0.35"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
            <p>No submissions found.</p>
          </div>

          <template v-else>
            <div class="comp2-toolbar">
              <span class="comp2-toolbar-count"
                >{{ filteredLNAs.length }} submission{{
                  filteredLNAs.length !== 1 ? "s" : ""
                }}</span
              >
              <button class="comp2-expand-all-btn" @click="comp2ExpandAll">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  width="11"
                  height="11"
                >
                  <polyline v-if="comp2AllExpanded" points="18 15 12 9 6 15" />
                  <polyline v-else points="6 9 12 15 18 9" />
                </svg>
                {{ comp2AllExpanded ? "Collapse All" : "Expand All" }}
              </button>
            </div>

            <div class="comp2-list">
              <div
                v-for="lna in filteredLNAs"
                :key="lna.refId"
                class="comp2-item"
                :class="{ 'comp2-item-open': comp2IsExpanded(lna.refId) }"
              >
                <!-- Header -->
                <div class="comp2-header" @click="comp2Toggle(lna.refId)">
                  <div class="comp2-header-left">
                    <div
                      class="comp2-chevron"
                      :class="{
                        'comp2-chevron-open': comp2IsExpanded(lna.refId),
                      }"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        width="12"
                        height="12"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                    <div class="comp2-header-info">
                      <span class="comp2-header-office">{{ lna.office }}</span>
                      <div class="comp2-header-meta">
                        <code
                          class="ref-code"
                          style="font-size: 9px; padding: 1px 5px"
                          >{{ lna.refId }}</code
                        >
                        <span class="comp2-meta-year">{{
                          lna.yearCovered
                        }}</span>
                        <span class="comp2-meta-count"
                          >{{ comp2CompCount(lna) }} competenc{{
                            comp2CompCount(lna) !== 1 ? "ies" : "y"
                          }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="comp2-header-right">
                    <template
                      v-for="cs in lna._clusterSummary || []"
                      :key="cs.cluster"
                    >
                      <span
                        class="comp2-hpill"
                        :class="
                          cs.interventionNeeded === 'Y' ||
                          cs.interventionNeeded === 'Yes'
                            ? 'comp2-hpill-warn'
                            : 'comp2-hpill-ok'
                        "
                      >
                        <span class="comp2-hpill-dot"></span>{{ cs.cluster }}
                      </span>
                    </template>
                    <span
                      v-if="!(lna._clusterSummary || []).length"
                      class="comp2-hpill comp2-hpill-none"
                      >No clusters</span
                    >
                  </div>
                </div>

                <!-- Expanded body -->
                <transition name="comp2-slide">
                  <div v-if="comp2IsExpanded(lna.refId)" class="comp2-body">
                    <!-- Cluster summary strip -->
                    <div
                      v-if="(lna._clusterSummary || []).length"
                      class="comp2-cluster-strip"
                    >
                      <div
                        v-for="cs in lna._clusterSummary"
                        :key="cs.cluster"
                        class="comp2-cs-card"
                        :class="
                          cs.interventionNeeded === 'Y' ||
                          cs.interventionNeeded === 'Yes'
                            ? 'comp2-cs-flagged'
                            : ''
                        "
                      >
                        <div class="comp2-cs-top">
                          <span class="comp2-cs-name">{{ cs.cluster }}</span>
                          <span
                            v-if="
                              cs.interventionNeeded === 'Y' ||
                              cs.interventionNeeded === 'Yes'
                            "
                            class="comp2-cs-badge comp2-cs-badge-warn"
                            >⚠ Needs Intervention</span
                          >
                          <span
                            v-else-if="
                              cs.interventionNeeded === 'N' ||
                              cs.interventionNeeded === 'No'
                            "
                            class="comp2-cs-badge comp2-cs-badge-ok"
                            >✓ No Urgent Need</span
                          >
                          <span
                            v-else
                            class="comp2-cs-badge comp2-cs-badge-none"
                            >—</span
                          >
                        </div>
                        <div class="comp2-cs-body">
                          <div class="comp2-cs-row comp2-cs-strong">
                            <span class="comp2-cs-lbl">Strongest</span>
                            <span class="comp2-cs-val">{{
                              cs.strongest || "—"
                            }}</span>
                          </div>
                          <div class="comp2-cs-row comp2-cs-weak">
                            <span class="comp2-cs-lbl">Weakest</span>
                            <span class="comp2-cs-val">{{
                              cs.weakest || "—"
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Competency tables per cluster type -->
                    <template
                      v-for="{ key: ck, label: clusterLabel } in COMP_CLUSTERS"
                      :key="ck"
                    >
                      <div
                        v-if="(lna[ck] || []).length"
                        class="comp2-cluster-block"
                      >
                        <div class="comp2-cluster-block-title">
                          <span class="comp2-cbt-dot"></span
                          >{{ clusterLabel }} Competencies
                          <span class="comp2-cbt-count">{{
                            lna[ck].length
                          }}</span>
                        </div>
                        <div class="comp2-grid">
                          <!-- Column headers -->
                          <div class="comp2-grid-head">
                            <div class="comp2-gh-name">Competency</div>
                            <div class="comp2-gh-levels">
                              <span
                                v-for="lvl in comp2Levels"
                                :key="lvl.key"
                                class="comp2-gh-lvl"
                                >{{ lvl.short }}</span
                              >
                            </div>
                            <div class="comp2-gh-obs">Observations</div>
                          </div>
                          <!-- Rows -->
                          <div
                            v-for="(row, ri) in lna[ck]"
                            :key="ri"
                            class="comp2-grid-row"
                            :class="ri % 2 === 1 ? 'comp2-row-alt' : ''"
                          >
                            <div class="comp2-gr-name">
                              {{ row.competency || "—" }}
                            </div>
                            <div class="comp2-gr-levels">
                              <div
                                v-for="lvl in comp2Levels"
                                :key="lvl.key"
                                class="comp2-gr-lvl"
                              >
                                <template
                                  v-if="
                                    row[lvl.key + '_cl'] ||
                                    row[lvl.key + '_pct']
                                  "
                                >
                                  <span class="comp2-val-cl">{{
                                    row[lvl.key + "_cl"] || "—"
                                  }}</span>
                                  <span class="comp2-val-pct">{{
                                    row[lvl.key + "_pct"] || "—"
                                  }}</span>
                                </template>
                                <span v-else class="comp2-val-nil">·</span>
                              </div>
                            </div>
                            <div class="comp2-gr-obs">
                              {{ row.observations || "" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <div
                      v-if="
                        !(lna._clusterSummary || []).length &&
                        !COMP_CLUSTERS.some((c) => (lna[c.key] || []).length)
                      "
                      class="comp2-body-empty"
                    >
                      No competency data recorded for this submission.
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </template>
        </div>

        <!-- SECTION III: DATA SOURCES & KEY INSIGHTS -->
        <div v-if="lnaSubTab === 'sources'">
          <div class="sub-section-label" style="margin-bottom: 8px">
            A. Data Sources Used
          </div>
          <div class="tbl-wrap" style="margin-bottom: 20px">
            <table class="dtbl">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Office / Unit</th>
                  <th>Year</th>
                  <th>Data Sources Selected</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!filteredDataSourceRows.length" class="empty-row">
                  <td colspan="4">No records found.</td>
                </tr>
                <tr v-for="r in filteredDataSourceRows" :key="r.refId">
                  <td>
                    <code class="ref-code">{{ r.refId }}</code>
                  </td>
                  <td>{{ r.office || "—" }}</td>
                  <td>{{ r.yearCovered || "—" }}</td>
                  <td style="font-size: 12px">
                    <span
                      v-for="(src, i) in r.dataSources || []"
                      :key="i"
                      class="badge badge-grey"
                      style="margin-right: 4px; margin-bottom: 4px"
                      >{{ src }}</span
                    >
                    <span
                      v-if="!r.dataSources || !r.dataSources.length"
                      style="color: var(--text-light)"
                      >—</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="sub-section-label" style="margin-bottom: 8px">
            B. Summary of Key Insights / Gaps Identified
          </div>
          <div class="tbl-wrap">
            <table class="dtbl">
              <thead>
                <tr>
                  <th>Ref ID</th>
                  <th>Office / Unit</th>
                  <th>Year</th>
                  <th>Data Source</th>
                  <th>Identified Gap / Issue</th>
                  <th>Relevant Personnel / Function</th>
                  <th>Recommended Intervention</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!filteredInsightRows.length" class="empty-row">
                  <td colspan="7">No insight data found.</td>
                </tr>
                <tr v-for="r in filteredInsightRows" :key="r._key">
                  <td>
                    <code class="ref-code">{{ r.refId }}</code>
                  </td>
                  <td>{{ r.office }}</td>
                  <td>{{ r.year }}</td>
                  <td>{{ r.dataSource || "—" }}</td>
                  <td class="cell-wrap">{{ r.gap || "—" }}</td>
                  <td style="font-size: 12px">{{ r.personnel || "—" }}</td>
                  <td style="font-size: 12px">{{ r.intervention || "—" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── HR REGISTRY ── -->
      <div v-if="activeTab === 'registry'" class="tab-panel">
        <!-- Toolbar -->
        <div class="reg-toolbar">
          <div class="reg-toolbar-left">
            <input
              v-model="regSearch"
              type="text"
              class="reg-search"
              placeholder="🔍  Search name or email..."
            />
            <select v-model="regRoleFilter" class="reg-filter">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="hr-staff">HR Staff</option>
              <option value="user">Employee</option>
            </select>
            <select v-model="regSupFilter" class="reg-filter">
              <option value="">All</option>
              <option value="yes">Supervisor</option>
              <option value="no">Not Supervisor</option>
            </select>
            <span class="result-count">
              {{ filteredRegUsers.length }} user{{
                filteredRegUsers.length !== 1 ? "s" : ""
              }}
            </span>
          </div>
          <!-- <button class="btn-add" @click="addHRModal = true">
            <svg
              viewBox="0 0 24 24"
              style="
                width: 13px;
                height: 13px;
                stroke: currentColor;
                fill: none;
                stroke-width: 2.5;
                stroke-linecap: round;
              "
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add User
          </button> -->
        </div>

        <!-- Table — no tbl-wrap, plain layout -->
        <div class="reg-table-wrap">
          <table class="dtbl reg-dtbl">
            <thead>
              <tr>
                <th class="th-sortable" @click="sortReg('name')">
                  Name
                  <span class="sort-ind">{{ regSortIndicator("name") }}</span>
                </th>
                <th class="th-sortable" @click="sortReg('email')">
                  Email
                  <span class="sort-ind">{{ regSortIndicator("email") }}</span>
                </th>
                <th class="th-sortable" @click="sortReg('role')">
                  Role
                  <span class="sort-ind">{{ regSortIndicator("role") }}</span>
                </th>
                <th>Supervisor</th>
                <th class="th-sortable" @click="sortReg('createdAt')">
                  Date Added
                  <span class="sort-ind">{{
                    regSortIndicator("createdAt")
                  }}</span>
                </th>
                <th class="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredRegUsers.length" class="empty-row">
                <td colspan="6">No users found.</td>
              </tr>
              <tr v-for="u in filteredRegUsers" :key="u.id">
                <td>
                  <strong>{{
                    [u.firstName, u.lastName].filter(Boolean).join(" ") || "—"
                  }}</strong>
                </td>
                <td>
                  <span class="sub-text">{{ u.email || "—" }}</span>
                </td>
                <td>
                  <span v-if="u.role === 'admin'" class="badge badge-green"
                    >Admin</span
                  >
                  <span
                    v-else-if="u.role === 'hr-staff'"
                    class="badge badge-blue"
                    >HR Staff</span
                  >
                  <span v-else class="badge badge-grey">Employee</span>
                </td>
                <td>
                  <span v-if="u.isSupervisor" class="badge badge-green"
                    >Yes</span
                  >
                  <span v-else class="badge badge-grey">No</span>
                </td>
                <td class="date-cell">{{ fmtDate(u.createdAt) }}</td>
                <td>
                  <div class="reg-dropdown-wrap">
                    <button
                      class="btn-reg-dots"
                      @click.stop="toggleRegMenu(u.id, $event)"
                    >
                      ⋯
                    </button>
                    <div
                      v-if="regMenuOpen === u.id"
                      class="reg-dropdown"
                      :style="{
                        top: regMenuPos.top ? regMenuPos.top + 'px' : 'auto',
                        bottom: regMenuPos.bottom
                          ? regMenuPos.bottom + 'px'
                          : 'auto',
                        right: regMenuPos.right + 'px',
                      }"
                    >
                      <div class="reg-dd-section">ROLE</div>

                      <template v-if="u.role !== 'admin'">
                        <button
                          class="reg-dd-item"
                          @click="
                            regAction(() =>
                              openConfirm({
                                title: 'Grant Admin Access',
                                message: `Grant full Admin access to ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}? This gives them complete system control.`,
                                confirmLabel: 'Grant Admin',
                                confirmClass: 'btn-confirm-danger',
                                onConfirm: () => setRole(u.id, 'admin'),
                              }),
                            )
                          "
                        >
                          Make Admin
                        </button>
                      </template>
                      <template v-if="u.role === 'admin' && isMasterAdmin">
                        <button
                          class="reg-dd-item reg-dd-danger"
                          @click="
                            regAction(() =>
                              openConfirm({
                                title: 'Revoke Admin Access',
                                message: `Revoke Admin access from ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}? They will become a regular employee.`,
                                confirmLabel: 'Revoke Admin',
                                confirmClass: 'btn-confirm-danger',
                                onConfirm: () => setRole(u.id, 'user'),
                              }),
                            )
                          "
                        >
                          Revoke Admin
                        </button>
                      </template>
                      <template
                        v-if="u.role === 'user' || u.role === 'employee'"
                      >
                        <button
                          class="reg-dd-item"
                          @click="
                            regAction(() =>
                              openConfirm({
                                title: 'Grant HR Staff Access',
                                message: `Grant HR Staff access to ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}? They will be able to access the dashboard.`,
                                confirmLabel: 'Grant HR Staff',
                                confirmClass: 'btn-confirm-primary',
                                onConfirm: () => confirmGrantHr(u),
                              }),
                            )
                          "
                        >
                          Grant HR Staff
                        </button>
                      </template>
                      <template v-if="u.role === 'hr-staff'">
                        <button
                          class="reg-dd-item reg-dd-warn"
                          @click="
                            regAction(() =>
                              openConfirm({
                                title: 'Revoke HR Staff Access',
                                message: `Revoke HR Staff access from ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}? They will lose dashboard access.`,
                                confirmLabel: 'Revoke',
                                confirmClass: 'btn-confirm-danger',
                                onConfirm: () => confirmRevokeHr(u),
                              }),
                            )
                          "
                        >
                          Revoke HR Staff
                        </button>
                      </template>

                      <div class="reg-dd-section">SUPERVISOR</div>
                      <button
                        v-if="!u.isSupervisor"
                        class="reg-dd-item"
                        @click="
                          regAction(() =>
                            openConfirm({
                              title: 'Grant Supervisor Access',
                              message: `Grant supervisor access to ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}? They will be able to submit LNA forms.`,
                              confirmLabel: 'Grant Supervisor',
                              confirmClass: 'btn-confirm-primary',
                              onConfirm: () => setSupervisor(u.id, true),
                            }),
                          )
                        "
                      >
                        Grant Supervisor
                      </button>
                      <button
                        v-else
                        class="reg-dd-item reg-dd-warn"
                        @click="
                          regAction(() =>
                            openConfirm({
                              title: 'Revoke Supervisor Access',
                              message: `Revoke supervisor access from ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}?`,
                              confirmLabel: 'Revoke',
                              confirmClass: 'btn-confirm-danger',
                              onConfirm: () => setSupervisor(u.id, false),
                            }),
                          )
                        "
                      >
                        Revoke Supervisor
                      </button>

                      <template v-if="u.role !== 'admin'">
                        <div class="reg-dd-divider"></div>
                        <button
                          class="reg-dd-item reg-dd-danger"
                          @click="
                            regAction(() =>
                              openConfirm({
                                title: 'Remove User',
                                message: `Remove ${[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email} from the system? This cannot be undone.`,
                                confirmLabel: 'Remove',
                                confirmClass: 'btn-confirm-danger',
                                onConfirm: () => removeUser(u.id, u.email),
                              }),
                            )
                          "
                        >
                          Remove User
                        </button>
                      </template>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- IDP DETAIL MODAL -->
    <div
      v-if="idpModal"
      class="modal-overlay active"
      @click.self="idpModal = false"
    >
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <h3>IDP — {{ selectedIDP?.employeeName || "Unknown" }}</h3>
            <p>
              {{ selectedIDP?.refId }} &nbsp;·&nbsp;
              {{ selectedIDP?.yearCovered || "—" }} &nbsp;·&nbsp;
              <span :class="statusBadgeClass(selectedIDP?.status)">{{
                statusBadgeLabel(selectedIDP?.status)
              }}</span>
            </p>
          </div>
          <div class="modal-header-right">
            <button
              class="btn-pdf"
              @click="
                downloadPDF('idp', selectedIDP.refId, selectedIDP.employeeName)
              "
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Download PDF
            </button>
            <button class="btn-close" @click="idpModal = false">×</button>
          </div>
        </div>
        <div class="modal-body" v-if="selectedIDP">
          <!-- Header -->
          <div class="m-section">
            <div class="m-section-title">
              Employee Information <span class="m-badge">Header</span>
            </div>
            <div class="dgrid g3">
              <div class="df">
                <label>Reference ID</label
                ><code>{{ selectedIDP.refId || "—" }}</code>
              </div>
              <div class="df">
                <label>Year Covered</label
                ><span>{{ selectedIDP.yearCovered || "—" }}</span>
              </div>
              <div class="df">
                <label>Purpose</label
                ><span>{{ selectedIDP.headerPurpose || "—" }}</span>
              </div>
              <div class="df s3">
                <label>Name of Personnel</label
                ><span>{{ selectedIDP.employeeName || "—" }}</span>
              </div>
              <div class="df">
                <label>Email</label><span>{{ selectedIDP.email || "—" }}</span>
              </div>
              <div class="df">
                <label>Position / Designation</label
                ><span>{{ selectedIDP.position || "—" }}</span>
              </div>
              <div class="df">
                <label>Office / Unit</label
                ><span>{{ selectedIDP.office || "—" }}</span>
              </div>
              <div class="df">
                <label>Campus</label
                ><span>{{ selectedIDP.campus || "—" }}</span>
              </div>
              <div class="df">
                <label>Educational Attainment</label
                ><span>{{ selectedIDP.educAttainment || "—" }}</span>
              </div>
              <div class="df">
                <label>Years in Position</label
                ><span>{{ selectedIDP.yearsInPosition || "—" }}</span>
              </div>
              <div class="df">
                <label>Years in CSU</label
                ><span>{{ selectedIDP.yearsInCSU || "—" }}</span>
              </div>
              <div class="df">
                <label>Immediate Supervisor</label
                ><span>{{ selectedIDP.supervisorName || "—" }}</span>
              </div>
              <div class="df">
                <label>Supervisor Email</label
                ><span>{{ selectedIDP.supervisorEmail || "—" }}</span>
              </div>
            </div>
          </div>
          <!-- Section I -->
          <div class="m-section">
            <div class="m-section-title">
              Section I — Competency Assessment
              <span class="m-badge">Employee</span>
            </div>
            <div class="df" style="margin-bottom: 10px">
              <label>Purpose</label
              ><span>{{ selectedIDP.competencyPurpose || "—" }}</span>
            </div>
            <table
              class="m-table"
              v-if="
                selectedIDP._competencyRows &&
                selectedIDP._competencyRows.length
              "
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Target Competency</th>
                  <th>Cluster</th>
                  <th>Current Level</th>
                  <th>Required Level</th>
                  <th>Suggested Intervention</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in selectedIDP._competencyRows" :key="i">
                  <td>{{ row.priority ?? i + 1 }}</td>
                  <td>
                    <strong>{{ row.targetCompetency || "—" }}</strong>
                  </td>
                  <td>{{ row.competencyGroup || "—" }}</td>
                  <td>{{ row.currentLevel || "—" }}</td>
                  <td>{{ row.requiredLevel || "—" }}</td>
                  <td>{{ row.leadInterventions || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else style="font-size: 13px; color: var(--text-light)">
              No competency entries.
            </p>
          </div>
          <!-- Section II -->
          <div class="m-section">
            <div class="m-section-title">
              Section II — AGAP <span class="m-badge">Employee</span>
            </div>
            <table
              class="m-table"
              v-if="selectedIDP._agapRows && selectedIDP._agapRows.length"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Degree Program</th>
                  <th>Target HEI</th>
                  <th>Mode of Study</th>
                  <th>Scholarship / Grant</th>
                  <th>Intended Year of Enrollment</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in selectedIDP._agapRows" :key="i">
                  <td>{{ row.priority ?? i + 1 }}</td>
                  <td>{{ row.degreeProgram || "—" }}</td>
                  <td>{{ row.targetHEI || "—" }}</td>
                  <td>{{ row.modeOfStudy || "—" }}</td>
                  <td>{{ row.scholarshipGrant || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else style="font-size: 13px; color: var(--text-light)">
              No AGAP entries.
            </p>
          </div>
          <!-- Section III -->
          <div class="m-section">
            <div class="m-section-title">
              Section III — Pro-ACT <span class="m-badge">Employee</span>
            </div>
            <table
              class="m-table"
              v-if="selectedIDP._proactRows && selectedIDP._proactRows.length"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Training / Workshop Title</th>
                  <th>Target Competency</th>
                  <th>Mode of Activity</th>
                  <th>Trainer / Provider</th>
                  <th>Timeline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in selectedIDP._proactRows" :key="i">
                  <td>{{ row.priority ?? i + 1 }}</td>
                  <td>{{ row.trainingTitle || "—" }}</td>
                  <td>{{ row.targetSkill || "—" }}</td>
                  <td>{{ row.modeOfActivity || "—" }}</td>
                  <td>{{ row.trainerProvider || "—" }}</td>
                  <td>{{ row.targetTimeline || "—" }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else style="font-size: 13px; color: var(--text-light)">
              No Pro-ACT entries.
            </p>
          </div>
          <!-- Section IV -->
          <div class="m-section">
            <div class="m-section-title">
              Section IV — Supervisor Assessment
              <span class="m-badge">Supervisor</span>
            </div>
            <div
              v-if="
                selectedIDP.status === 'COMPLETE' && selectedIDP._assessment
              "
              class="dgrid"
            >
              <div class="df">
                <label>Performance Gaps?</label
                ><span>{{ selectedIDP._assessment.perfGapsYN || "—" }}</span>
              </div>
              <div class="df">
                <label>Ready for Advancement?</label
                ><span>{{ selectedIDP._assessment.readinessYN || "—" }}</span>
              </div>
              <div class="df s2">
                <label>Gap Description</label
                ><span style="white-space: pre-wrap">{{
                  selectedIDP._assessment.perfGapsSpec || "—"
                }}</span>
              </div>
              <div class="df s2">
                <label>Readiness Remarks</label
                ><span style="white-space: pre-wrap">{{
                  selectedIDP._assessment.readinessRemarks || "—"
                }}</span>
              </div>
              <div class="df s2">
                <label>Recommended Interventions</label
                ><span>{{
                  Array.isArray(selectedIDP._assessment.interventions)
                    ? selectedIDP._assessment.interventions.join(", ")
                    : selectedIDP._assessment.interventions || "—"
                }}</span>
              </div>
              <div class="df">
                <label>Implementation Period</label
                ><span
                  >{{ selectedIDP._assessment.implYear || "" }}
                  {{
                    selectedIDP._assessment.implementationPeriod || "—"
                  }}</span
                >
              </div>
              <div class="df s2">
                <label>Additional Comments</label
                ><span style="white-space: pre-wrap">{{
                  selectedIDP._assessment.additionalComments || "—"
                }}</span>
              </div>
            </div>
            <div v-else class="pending-note">
              Supervisor assessment not yet completed.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LNA DETAIL MODAL -->
    <div
      v-if="lnaModal"
      class="modal-overlay active"
      @click.self="lnaModal = false"
    >
      <div class="modal">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-header-left">
            <h3>LNA — {{ selectedLNA?.office || "Unknown Office" }}</h3>
            <p>
              {{ selectedLNA?.refId }} &nbsp;·&nbsp;
              {{ selectedLNA?.yearCovered || "—" }} &nbsp;·&nbsp;
              {{ selectedLNA?.purpose || "—" }}
            </p>
          </div>
          <div class="modal-header-right">
            <button
              class="btn-pdf"
              @click="downloadPDF('lna', selectedLNA.refId, selectedLNA.office)"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Download PDF
            </button>
            <button class="btn-close" @click="lnaModal = false">×</button>
          </div>
        </div>

        <div class="modal-body" v-if="selectedLNA">
          <!-- ── SECTION H: Office Information ── -->
          <div class="m-section">
            <div class="m-section-title">
              Office Information <span class="m-badge">Header</span>
            </div>
            <div class="dgrid g3">
              <div class="df">
                <label>Reference ID</label
                ><code>{{ selectedLNA.refId || "—" }}</code>
              </div>
              <div class="df">
                <label>Submitter Email</label
                ><span>{{ selectedLNA.submitterEmail || "—" }}</span>
              </div>
              <div class="df">
                <label>Campus</label
                ><span>{{ selectedLNA.campus || "—" }}</span>
              </div>
              <div class="df">
                <label>Office Affiliation</label
                ><span>{{ selectedLNA.officeAffiliation || "—" }}</span>
              </div>
              <div class="df s2">
                <label>Office / Unit / College</label
                ><span>{{ selectedLNA.office || "—" }}</span>
              </div>
              <div class="df" v-if="selectedLNA.collegeProgram">
                <label>Program / Department</label
                ><span>{{ selectedLNA.collegeProgram || "—" }}</span>
              </div>
              <div class="df">
                <label>Head of Office</label
                ><span>{{ selectedLNA.headOfUnit || "—" }}</span>
              </div>
              <div class="df">
                <label>Position</label
                ><span>{{ selectedLNA.position || "—" }}</span>
              </div>
              <div class="df">
                <label>Designation</label
                ><span>{{ selectedLNA.designation || "N/A" }}</span>
              </div>
              <div class="df">
                <label>Year Covered</label
                ><span>{{ selectedLNA.yearCovered || "—" }}</span>
              </div>
              <div class="df">
                <label>Total Personnel</label
                ><span>{{ selectedLNA.totalPersonnel ?? "—" }}</span>
              </div>
              <div class="df">
                <label>Purpose</label
                ><span>{{ selectedLNA.purpose || "—" }}</span>
              </div>
            </div>
          </div>

          <!-- ── SECTION I: Workforce Profile ── -->
          <div class="m-section">
            <div class="m-section-title">
              Section I — Workforce Profile
              <span class="m-badge">Employment Classification</span>
            </div>
            <div style="overflow-x: auto">
              <table class="m-table" v-if="selectedLNA.workforceProfile">
                <thead>
                  <tr>
                    <th>Position Level</th>
                    <th>Permanent</th>
                    <th>Temporary</th>
                    <th>Contractual</th>
                    <th>Casual</th>
                    <th>Coterminus</th>
                    <th>COS</th>
                    <th>Job Order</th>
                    <th>Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(lvLabel, lvKey) in {
                      first: 'First Level Positions',
                      secondNonSup: 'Second Level (Non-Supervisory)',
                      secondSup: 'Second Level (Supervisory)',
                      third: 'Third Level Positions',
                      faculty: 'Faculty Positions',
                    }"
                    :key="lvKey"
                    v-show="selectedLNA.workforceProfile[lvKey]"
                  >
                    <td>
                      <strong>{{ lvLabel }}</strong>
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.permanent ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.temporary ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{
                        selectedLNA.workforceProfile[lvKey]?.contractual ?? 0
                      }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.casual ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.coterminus ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.cos ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.jobOrder ?? 0 }}
                    </td>
                    <td style="text-align: center">
                      {{ selectedLNA.workforceProfile[lvKey]?.others ?? 0 }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <span v-else style="font-size: 13px; color: var(--text-light)"
                >No workforce data recorded.</span
              >
            </div>
          </div>

          <!-- ── SECTION II: Competency Mapping — Cluster Summary ── -->
          <div class="m-section">
            <div class="m-section-title">
              Section II — Competency Cluster Summary
              <span class="m-badge">Per Position Level</span>
            </div>
            <template
              v-if="
                selectedLNA.clusterSummaryRaw &&
                Object.keys(selectedLNA.clusterSummaryRaw).length
              "
            >
              <div
                v-for="(rows, lvKey) in selectedLNA.clusterSummaryRaw"
                :key="lvKey"
                style="margin-bottom: 20px"
              >
                <div
                  style="
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--navy);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                    padding: 4px 10px;
                    background: rgba(26, 77, 46, 0.07);
                    border-left: 3px solid var(--navy);
                    border-radius: 0 4px 4px 0;
                  "
                >
                  {{
                    {
                      first: "First Level Positions",
                      secondNonSup: "Second Level (Non-Supervisory) Positions",
                      secondSup: "Second Level (Supervisory) Positions",
                      third: "Third Level Positions",
                      faculty: "Faculty Positions",
                    }[lvKey] || lvKey
                  }}
                </div>
                <table class="m-table">
                  <thead>
                    <tr>
                      <th>Competency Cluster</th>
                      <th>Strongest Competency</th>
                      <th>Weakest Competency</th>
                      <th>Intervention Needed?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in rows" :key="c.cluster">
                      <td>
                        <strong>{{ c.cluster || "—" }}</strong>
                      </td>
                      <td>{{ c.strongest || "—" }}</td>
                      <td>{{ c.weakest || "—" }}</td>
                      <td style="text-align: center">
                        <span
                          :style="
                            c.interventionNeeded === 'Yes'
                              ? 'background:rgba(26,107,60,0.12);color:#1a6b3c;font-weight:700;font-size:11px;padding:3px 10px;border-radius:20px;display:inline-block;'
                              : c.interventionNeeded === 'No'
                                ? 'background:rgba(192,57,43,0.1);color:#c0392b;font-weight:700;font-size:11px;padding:3px 10px;border-radius:20px;display:inline-block;'
                                : ''
                          "
                        >
                          {{ c.interventionNeeded || "—" }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <span v-else style="font-size: 13px; color: var(--text-light)"
              >No competency summary recorded.</span
            >
          </div>

          <!-- ── SECTION II: Detailed Competency Data (per cluster per level) ── -->
          <div class="m-section">
            <div class="m-section-title">
              Section II — Competency Assessment Detail
              <span class="m-badge">CL &amp; %</span>
            </div>

            <template
              v-if="
                selectedLNA.coreCompetencies ||
                selectedLNA.leadershipComps ||
                selectedLNA.orgComps ||
                selectedLNA.technicalComps
              "
            >
              <template
                v-for="(clusterRows, clusterLabel) in {
                  'Core Competencies': selectedLNA.coreCompetencies,
                  'Leadership Competencies': selectedLNA.leadershipComps,
                  'Organizational Competencies': selectedLNA.orgComps,
                  'Technical Competencies': selectedLNA.technicalComps,
                }"
                :key="clusterLabel"
              >
                <div
                  style="margin-bottom: 24px"
                  v-if="clusterRows && clusterRows.length"
                >
                  <!-- Cluster label bar -->
                  <div
                    style="
                      font-size: 12px;
                      font-weight: 700;
                      color: var(--navy);
                      text-transform: uppercase;
                      letter-spacing: 0.05em;
                      margin-bottom: 8px;
                      padding: 4px 10px;
                      background: rgba(26, 77, 46, 0.07);
                      border-left: 3px solid var(--navy);
                      border-radius: 0 4px 4px 0;
                    "
                  >
                    {{ clusterLabel }}
                  </div>

                  <div style="overflow-x: auto">
                    <table
                      class="m-table"
                      style="table-layout: fixed; width: 100%"
                    >
                      <!-- colgroup: pin Competency col width, then 2 equal cols per active level -->
                      <colgroup>
                        <col style="width: 200px" />
                        <template
                          v-for="lvKey in [
                            'first',
                            'secondNonSup',
                            'secondSup',
                            'third',
                            'faculty',
                          ]"
                          :key="'col-' + lvKey"
                        >
                          <template
                            v-if="
                              selectedLNA.workforceProfile &&
                              Object.values(
                                selectedLNA.workforceProfile[lvKey] || {},
                              ).some((v) => Number(v) > 0)
                            "
                          >
                            <col style="width: 90px" />
                            <col style="width: 90px" />
                          </template>
                        </template>
                      </colgroup>

                      <thead>
                        <!-- Row 1: Competency header + level group headers -->
                        <tr>
                          <th style="text-align: left; vertical-align: bottom">
                            Competency
                          </th>
                          <template
                            v-for="lvKey in [
                              'first',
                              'secondNonSup',
                              'secondSup',
                              'third',
                              'faculty',
                            ]"
                            :key="'hdr-' + lvKey"
                          >
                            <th
                              v-if="
                                selectedLNA.workforceProfile &&
                                Object.values(
                                  selectedLNA.workforceProfile[lvKey] || {},
                                ).some((v) => Number(v) > 0)
                              "
                              colspan="2"
                              style="text-align: center; white-space: nowrap"
                            >
                              {{
                                {
                                  first: "1st Level",
                                  secondNonSup: "2nd (Non-Sup)",
                                  secondSup: "2nd (Sup)",
                                  third: "3rd Level",
                                  faculty: "Faculty",
                                }[lvKey]
                              }}
                            </th>
                          </template>
                        </tr>
                        <!-- Row 2: empty placeholder to hold Competency col + CL/% sub-headers -->
                        <tr>
                          <th style="border-top: none"></th>
                          <template
                            v-for="lvKey in [
                              'first',
                              'secondNonSup',
                              'secondSup',
                              'third',
                              'faculty',
                            ]"
                            :key="'sub-' + lvKey"
                          >
                            <template
                              v-if="
                                selectedLNA.workforceProfile &&
                                Object.values(
                                  selectedLNA.workforceProfile[lvKey] || {},
                                ).some((v) => Number(v) > 0)
                              "
                            >
                              <th
                                style="
                                  text-align: center;
                                  font-size: 11px;
                                  white-space: nowrap;
                                "
                              >
                                CL
                              </th>
                              <th
                                style="
                                  text-align: center;
                                  font-size: 11px;
                                  white-space: nowrap;
                                "
                              >
                                %
                              </th>
                            </template>
                          </template>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="row in clusterRows" :key="row.competency">
                          <td>{{ row.competency }}</td>
                          <template
                            v-for="lvKey in [
                              'first',
                              'secondNonSup',
                              'secondSup',
                              'third',
                              'faculty',
                            ]"
                            :key="'cell-' + lvKey"
                          >
                            <template
                              v-if="
                                selectedLNA.workforceProfile &&
                                Object.values(
                                  selectedLNA.workforceProfile[lvKey] || {},
                                ).some((v) => Number(v) > 0)
                              "
                            >
                              <td style="text-align: center">
                                {{ row[lvKey + "_cl"] || "—" }}
                              </td>
                              <td style="text-align: center">
                                {{ row[lvKey + "_pct"] || "—" }}
                              </td>
                            </template>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </template>
            <span v-else style="font-size: 13px; color: var(--text-light)"
              >No competency detail recorded.</span
            >
          </div>

          <!-- ── SECTION III: Data Sources & Key Insights ── -->
          <div class="m-section">
            <div class="m-section-title">
              Section III — Other LeaD Data Sources
              <span class="m-badge">Insights</span>
            </div>

            <!-- A. Selected Sources -->
            <div style="margin-bottom: 12px">
              <div
                style="
                  font-size: 11px;
                  font-weight: 700;
                  color: var(--navy-mid);
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-bottom: 6px;
                "
              >
                A. Data Source Checklist
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px">
                <span
                  v-for="(src, i) in selectedLNA.dataSourcesRaw || []"
                  :key="i"
                  class="badge badge-grey"
                  >{{ src }}</span
                >
                <span
                  v-if="!selectedLNA.dataSourcesRaw?.length"
                  style="font-size: 13px; color: var(--text-light)"
                  >No sources recorded.</span
                >
              </div>
            </div>

            <!-- B. Key Insights / Gaps -->
            <div>
              <div
                style="
                  font-size: 11px;
                  font-weight: 700;
                  color: var(--navy-mid);
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  margin-bottom: 6px;
                "
              >
                B. Summary of Key Insights or Gaps Identified
              </div>
              <table
                class="m-table"
                v-if="(selectedLNA.dataSourceInsights || []).length"
              >
                <thead>
                  <tr>
                    <th style="width: 36px">No.</th>
                    <th>Data Source</th>
                    <th>Identified Competency Gap / Issue</th>
                    <th>Relevant Personnel / Function</th>
                    <th>Recommended Intervention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, i) in selectedLNA.dataSourceInsights || []"
                    :key="i"
                  >
                    <td
                      style="
                        text-align: center;
                        color: var(--text-light);
                        font-weight: 600;
                      "
                    >
                      {{ i + 1 }}
                    </td>
                    <td>{{ row.dataSource || "—" }}</td>
                    <td style="white-space: pre-wrap">{{ row.gap || "—" }}</td>
                    <td>{{ row.personnel || "—" }}</td>
                    <td>{{ row.interventions || "—" }}</td>
                  </tr>
                </tbody>
              </table>
              <span v-else style="font-size: 13px; color: var(--text-light)"
                >No insights or gaps recorded.</span
              >
            </div>
          </div>

          <!-- ── SECTION IV: Certification ── -->
          <div class="m-section">
            <div class="m-section-title">
              Section IV — Certification <span class="m-badge">Rater</span>
            </div>
            <div
              style="
                background: rgba(201, 168, 76, 0.08);
                border: 1.5px solid var(--gold);
                border-radius: 10px;
                padding: 20px 24px;
              "
            >
              <p
                style="
                  font-size: 13px;
                  color: var(--text-light);
                  font-style: italic;
                  margin-bottom: 14px;
                  line-height: 1.6;
                "
              >
                I hereby certify that the information provided in this Learning
                Needs Assessment is accurate and based on actual observation,
                data, and evidence gathered from the office.
              </p>
              <div
                style="
                  font-size: 18px;
                  font-weight: 700;
                  color: var(--navy);
                  letter-spacing: 0.03em;
                  border-bottom: 2px solid var(--navy);
                  display: inline-block;
                  padding-bottom: 2px;
                  margin-bottom: 4px;
                "
              >
                {{ selectedLNA.headOfUnit || "—" }}
              </div>
              <div style="font-size: 11px; color: var(--text-light)">
                Signature over Printed Name of Rater / Head of Office
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- CONFIRM MODAL -->
    <div
      v-if="confirmModal.open"
      class="modal-overlay active"
      @click.self="confirmModal.open = false"
    >
      <div class="modal confirm-modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <h3>{{ confirmModal.title }}</h3>
          </div>
          <div class="modal-header-right">
            <button class="btn-close" @click="confirmModal.open = false">
              ×
            </button>
          </div>
        </div>
        <div class="modal-body">
          <p
            style="
              font-size: 14px;
              color: var(--text);
              line-height: 1.6;
              margin-bottom: 24px;
            "
          >
            {{ confirmModal.message }}
          </p>
          <div class="confirm-actions">
            <button
              class="btn-confirm-cancel"
              @click="confirmModal.open = false"
            >
              Cancel
            </button>
            <button :class="confirmModal.confirmClass" @click="runConfirm">
              {{ confirmModal.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD HR MODAL -->
    <div
      v-if="addHRModal"
      class="modal-overlay active"
      @click.self="addHRModal = false"
    >
      <div class="modal" style="max-width: 400px">
        <div class="modal-header">
          <div class="modal-header-left"><h3>Add HR User</h3></div>
          <div class="modal-header-right">
            <button class="btn-close" @click="addHRModal = false">×</button>
          </div>
        </div>
        <div class="modal-body">
          <p
            style="
              font-size: 13px;
              color: var(--text-light);
              margin-bottom: 16px;
            "
          >
            The new user can log in once added to the HR Registry.
          </p>
          <div class="add-field">
            <label>CarSU Email *</label
            ><input
              type="email"
              v-model="newHR.email"
              placeholder="name@carsu.edu.ph"
            />
          </div>
          <div class="add-field">
            <label>Full Name *</label
            ><input
              type="text"
              v-model="newHR.name"
              placeholder="e.g. Juan Dela Cruz"
            />
          </div>
          <div class="add-field">
            <label>Role / Designation</label
            ><input
              type="text"
              v-model="newHR.role"
              placeholder="e.g. HRMO II"
            />
          </div>
          <button class="btn-save" @click="saveHR">Save to Registry</button>
        </div>
      </div>
    </div>

    <!-- TOASTS -->
    <div class="toast-wrap">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
        {{ t.msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "hr-staff"],
  ssr: false,
});

import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";

const { getAccessToken } = useAuth();

function authFetch(url, options = {}) {
  const token = getAccessToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

const config = useRuntimeConfig();
const API = config.public.apiBase;

// ── STATE ──────────────────────────────────────────────────────────────────
const dataLoading = ref(false);
const lastUpdated = ref("Loading data...");
const activeTab = ref("overview");
const idpSubTab = ref("list");
const lnaSubTab = ref("list");

const idps = ref([]);
const lnas = ref([]);
const hrUsers = ref([]);

const idpSearch = ref("");
const idpStatusFilter = ref("");
const idpYearFilter = ref("");
const lnaSearch = ref("");
const lnaYearFilter = ref("");

// ── Advanced filter state ──
const showAdvFilters = ref(false);

// IDP - All Submissions
const idpOfficeFilter = ref("");
const idpPositionFilter = ref("");

// IDP - Competency tab
const idpCompClusterFilter = ref("");
const idpCompTargetCompFilter = ref("");
const idpCompCurrentLvlFilter = ref("");
const idpCompRequiredLvlFilter = ref("");
const idpCompInterventionFilter = ref("");
const idpCompTimelineFilter = ref("");
const idpCompGapFilter = ref("");

// IDP - AGAP tab
const idpAgapDegreeFilter = ref("");
const idpAgapHeiFilter = ref("");
const idpAgapModeFilter = ref("");
const idpAgapScholarshipFilter = ref("");
const idpAgapTimelineFilter = ref("");

// IDP - Pro-ACT tab
const idpProactTitleFilter = ref("");
const idpProactSkillFilter = ref("");
const idpProactModeFilter = ref("");
const idpProactProviderFilter = ref("");
const idpProactTimelineFilter = ref("");

// IDP - Supervisor tab
const idpSupPerfGapsFilter = ref("");
const idpSupReadinessFilter = ref("");
const idpSupInterventionFilter = ref("");
const idpSupImplYearFilter = ref("");
const idpSupImplPeriodFilter = ref("");

// LNA advanced filter state
const showLnaAdvFilters = ref(false);

// LNA - All Submissions
const lnaPurposeFilter = ref("");
const lnaOfficeFilter = ref("");

// LNA - Workforce
const lnaWfLevelFilter = ref("");
const lnaWfHasTypeFilter = ref("");
const lnaWfCountFilter = ref("");

// LNA - Competency (cluster summary)
const lnaClusterFilter = ref("");
const lnaStrongestFilter = ref("");
const lnaWeakestFilter = ref("");
const lnaInterventionFilter = ref(""); // Yes / No / ''

// LNA - Competency (detailed mapping)
const lnaCompClusterFilter = ref("");
const lnaCompCompetencyFilter = ref("");
const lnaHasObsFilter = ref("");

// LNA - Sources (data sources table)
const lnaDataSourceFilter = ref("");
const lnaHasSourcesFilter = ref("");

// LNA - Insights
const lnaInsightSourceFilter = ref("");
const lnaInsightPersonnelFilter = ref("");
const lnaInsightInterventionFilter = ref("");

// ── LNA Section II accordion state ─────────────────────────────────────────
const comp2Expanded = ref(new Set());
const comp2Levels = [
  { key: "first", short: "1st" },
  { key: "secondNonSup", short: "2nd (NS)" },
  { key: "secondSup", short: "2nd (S)" },
  { key: "third", short: "3rd" },
  { key: "faculty", short: "Faculty" },
];
function comp2Toggle(refId) {
  const s = new Set(comp2Expanded.value);
  s.has(refId) ? s.delete(refId) : s.add(refId);
  comp2Expanded.value = s;
}
function comp2IsExpanded(refId) {
  return comp2Expanded.value.has(refId);
}
const comp2AllExpanded = computed(
  () =>
    filteredLNAs.value.length > 0 &&
    filteredLNAs.value.every((lna) => comp2Expanded.value.has(lna.refId)),
);
function comp2ExpandAll() {
  if (comp2AllExpanded.value) {
    comp2Expanded.value = new Set();
  } else {
    comp2Expanded.value = new Set(filteredLNAs.value.map((lna) => lna.refId));
  }
}
function comp2CompCount(lna) {
  return [
    "coreCompetencies",
    "leadershipComps",
    "orgComps",
    "technicalComps",
  ].reduce((s, k) => s + (lna[k] || []).length, 0);
}

const sortState = reactive({
  idp: { col: -1, asc: true },
  lna: { col: -1, asc: true },
  ovIdp: { col: -1, asc: true },
  ovLna: { col: -1, asc: true },
  ovLnaOffice: { col: -1, asc: true },
});
const ovActive = ref(null); // null | 'idp-all' | 'idp-pending' | 'idp-complete' | 'lna-all'

const idpModal = ref(false);
const lnaModal = ref(false);
const addHRModal = ref(false);
const selectedIDP = ref(null);
const selectedLNA = ref(null);
const newHR = reactive({ email: "", name: "", role: "" });
const toasts = ref([]);

// ── STATIC CONFIG ──────────────────────────────────────────────────────────
const tabs = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "idp", label: "IDP Submissions", icon: "📋" },
  { key: "lna", label: "LNA Submissions", icon: "📝" },
  { key: "registry", label: "HR Registry", icon: "👥" },
];

const idpSubTabs = [
  { key: "list", label: "All Submissions", icon: "📋" },
  { key: "competency", label: "Section I — Competency", icon: "🎯" },
  { key: "agap", label: "Section II — AGAP", icon: "🎓" },
  { key: "proact", label: "Section III — Pro-ACT", icon: "📚" },
  { key: "supervisor", label: "Section IV — Supervisor", icon: "✅" },
];

const lnaSubTabs = [
  { key: "list", label: "All Submissions", icon: "📋" },
  { key: "workforce", label: "Section I — Workforce", icon: "👥" },
  { key: "competency", label: "Section II — Competency", icon: "🎯" },
  { key: "sources", label: "Section III — Data Sources", icon: "📊" },
];

const idpCols = [
  "Ref ID",
  "Name",
  "Position",
  "Office",
  "Year",
  "Submitted",
  "Status",
  "Completed",
];
const lnaCols = [
  "Ref ID",
  "Office / Unit",
  "Head of Office",
  "Year",
  "Purpose",
  "Personnel",
  "Submitted",
];

const POSITION_LEVELS = [
  { key: "first", label: "First Level Positions" },
  { key: "secondNonSup", label: "Second Level (Non-Supervisory)" },
  { key: "secondSup", label: "Second Level (Supervisory)" },
  { key: "third", label: "Third Level Positions" },
  { key: "faculty", label: "Faculty Positions" },
];
const EMP_TYPE_KEYS = [
  "permanent",
  "temporary",
  "contractual",
  "casual",
  "coterminus",
  "cos",
  "jobOrder",
  "others",
];
const COMP_CLUSTERS = [
  { key: "coreCompetencies", label: "Core" },
  { key: "leadershipComps", label: "Leadership" },
  { key: "orgComps", label: "Organizational" },
  { key: "technicalComps", label: "Technical" },
];

// ── COMPUTED — FILTERS ─────────────────────────────────────────────────────
const idpYears = computed(() =>
  [...new Set(idps.value.map((r) => r.yearCovered).filter(Boolean))]
    .sort()
    .reverse(),
);
const lnaYears = computed(() =>
  [...new Set(lnas.value.map((r) => r.yearCovered).filter(Boolean))]
    .sort()
    .reverse(),
);

const filteredLNAs = computed(() => {
  const q = lnaSearch.value.toLowerCase();
  let rows = lnas.value.filter((r) => {
    const ms =
      !q ||
      [r.refId, r.office, r.headOfUnit, r.email].some((v) =>
        (v || "").toLowerCase().includes(q),
      );
    return (
      ms &&
      (!lnaYearFilter.value || r.yearCovered === lnaYearFilter.value) &&
      (!lnaPurposeFilter.value || r.purpose === lnaPurposeFilter.value) &&
      (!lnaOfficeFilter.value || r.office === lnaOfficeFilter.value)
    );
  });
  const { col, asc } = sortState.lna;
  if (col >= 0) {
    // keys align with lnaCols: ['Ref ID','Office / Unit','Head of Office','Year','Purpose','Personnel','Submitted']
    // index 0 (Ref ID) is not sortable
    const ks = [
      null,
      "office",
      "headOfUnit",
      "yearCovered",
      "purpose",
      "totalPersonnel",
      "submittedAt",
    ];
    const key = ks[col];
    if (key) {
      rows = [...rows].sort((a, b) => {
        if (key === "submittedAt") {
          const ad = a[key] ? new Date(a[key]).getTime() : 0;
          const bd = b[key] ? new Date(b[key]).getTime() : 0;
          return asc ? ad - bd : bd - ad;
        }
        if (key === "totalPersonnel") {
          return asc
            ? (a[key] || 0) - (b[key] || 0)
            : (b[key] || 0) - (a[key] || 0);
        }
        const av = (a[key] || "").toLowerCase(),
          bv = (b[key] || "").toLowerCase();
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
  }
  return rows;
});

// ── COMPUTED — ADVANCED FILTER OPTIONS (with counts) ───────────────────────
const idpOffices = computed(() =>
  [...new Set(idps.value.map((r) => r.office).filter(Boolean))].sort(),
);
const idpPositions = computed(() =>
  [...new Set(idps.value.map((r) => r.position).filter(Boolean))].sort(),
);

// Base filtered IDPs (shared by all sub-tabs, includes office+position filter)
const baseFilteredIDPs = computed(() => {
  const q = idpSearch.value.toLowerCase();
  let rows = idps.value.filter((r) => {
    const ms =
      !q ||
      [r.refId, r.employeeName, r.email, r.office, r.campus, r.position].some(
        (v) => (v || "").toLowerCase().includes(q),
      );
    return (
      ms &&
      (!idpStatusFilter.value || r.status === idpStatusFilter.value) &&
      (!idpYearFilter.value || r.yearCovered === idpYearFilter.value) &&
      (!idpOfficeFilter.value || r.office === idpOfficeFilter.value) &&
      (!idpPositionFilter.value || r.position === idpPositionFilter.value)
    );
  });
  const { col, asc } = sortState.idp;
  if (col >= 0) {
    // keys align with idpCols: ['Ref ID','Name','Position','Office','Year','Submitted','Status','Completed']
    // index 0 (Ref ID) is not sortable — null means skip
    const ks = [
      null,
      "employeeName",
      "position",
      "office",
      "yearCovered",
      "submittedAt",
      "status",
      "supervisorSignedAt",
    ];
    const key = ks[col];
    if (key) {
      rows = [...rows].sort((a, b) => {
        const av = (a[key] || "").toLowerCase(),
          bv = (b[key] || "").toLowerCase();
        // For dates, sort nulls/empty to end
        if (key === "submittedAt" || key === "supervisorSignedAt") {
          const ad = a[key] ? new Date(a[key]).getTime() : 0;
          const bd = b[key] ? new Date(b[key]).getTime() : 0;
          return asc ? ad - bd : bd - ad;
        }
        return asc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
  }
  return rows;
});

const filteredIDPs = computed(() => baseFilteredIDPs.value);

// ── Competency filter options ───────────────────────────────────────────────
const compClusterOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.competencyGroup || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const compTargetCompOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.targetCompetency || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const compCurrentLvlOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.currentLevel || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const compRequiredLvlOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.requiredLevel || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const compInterventionOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.leadInterventions || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const compTimelineOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._competencyRows || []).forEach((row) => {
      const v = (row.targetTimeline || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});

// Filtered competency rows (applies adv filters on top)
const filteredCompetencyRows = computed(() => {
  return idpCompetencyRows.value.filter((r) => {
    const curLvl = parseInt(r.currentLevel) || 0;
    const reqLvl = parseInt(r.requiredLevel) || 0;
    const hasGap = reqLvl > curLvl;
    const gapMatch =
      !idpCompGapFilter.value ||
      (idpCompGapFilter.value === "Yes" && hasGap) ||
      (idpCompGapFilter.value === "No" && !hasGap);
    return (
      (!idpCompClusterFilter.value ||
        r.competencyGroup === idpCompClusterFilter.value) &&
      (!idpCompTargetCompFilter.value ||
        r.targetCompetency === idpCompTargetCompFilter.value) &&
      (!idpCompCurrentLvlFilter.value ||
        r.currentLevel === idpCompCurrentLvlFilter.value) &&
      (!idpCompRequiredLvlFilter.value ||
        r.requiredLevel === idpCompRequiredLvlFilter.value) &&
      (!idpCompInterventionFilter.value ||
        r.leadInterventions === idpCompInterventionFilter.value) &&
      (!idpCompTimelineFilter.value ||
        r.targetTimeline === idpCompTimelineFilter.value) &&
      gapMatch
    );
  });
});

// ── AGAP filter options ─────────────────────────────────────────────────────
const agapDegreeOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._agapRows || []).forEach((row) => {
      const v = (row.degreeProgram || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const agapHeiOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._agapRows || []).forEach((row) => {
      const v = (row.targetHEI || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const agapModeOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._agapRows || []).forEach((row) => {
      const v = (row.modeOfStudy || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const agapScholarshipOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._agapRows || []).forEach((row) => {
      const v = (row.scholarshipGrant || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const agapTimelineOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._agapRows || []).forEach((row) => {
      const v = (row.targetTimeline || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const filteredAgapRows = computed(() => {
  return idpAgapRows.value.filter(
    (r) =>
      (!idpAgapDegreeFilter.value ||
        r.degreeProgram === idpAgapDegreeFilter.value) &&
      (!idpAgapHeiFilter.value || r.targetHEI === idpAgapHeiFilter.value) &&
      (!idpAgapModeFilter.value || r.modeOfStudy === idpAgapModeFilter.value) &&
      (!idpAgapScholarshipFilter.value ||
        r.scholarshipGrant === idpAgapScholarshipFilter.value) &&
      (!idpAgapTimelineFilter.value ||
        r.targetTimeline === idpAgapTimelineFilter.value),
  );
});

// ── Pro-ACT filter options ──────────────────────────────────────────────────
const proactTitleOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._proactRows || []).forEach((row) => {
      const v = (row.trainingTitle || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const proactSkillOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._proactRows || []).forEach((row) => {
      const v = (row.targetSkill || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const proactModeOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._proactRows || []).forEach((row) => {
      const v = (row.modeOfActivity || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const proactProviderOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._proactRows || []).forEach((row) => {
      const v = (row.trainerProvider || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const proactTimelineOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) =>
    (r._proactRows || []).forEach((row) => {
      const v = (row.targetTimeline || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    }),
  );
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const filteredProactRows = computed(() => {
  return idpProactRows.value.filter(
    (r) =>
      (!idpProactTitleFilter.value ||
        r.trainingTitle === idpProactTitleFilter.value) &&
      (!idpProactSkillFilter.value ||
        r.targetSkill === idpProactSkillFilter.value) &&
      (!idpProactModeFilter.value ||
        r.modeOfActivity === idpProactModeFilter.value) &&
      (!idpProactProviderFilter.value ||
        r.trainerProvider === idpProactProviderFilter.value) &&
      (!idpProactTimelineFilter.value ||
        r.targetTimeline === idpProactTimelineFilter.value),
  );
});

// ── Supervisor filter options ───────────────────────────────────────────────
const supInterventionOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) => {
    if (!r._assessment) return;
    const arr = Array.isArray(r._assessment.interventions)
      ? r._assessment.interventions
      : [];
    arr.forEach((v) => {
      const vt = (v || "").trim();
      if (vt) freq[vt] = (freq[vt] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const supImplYearOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) => {
    if (!r._assessment) return;
    const v = (r._assessment.implYear || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const supImplPeriodOptions = computed(() => {
  const freq = {};
  baseFilteredIDPs.value.forEach((r) => {
    if (!r._assessment) return;
    const v = (r._assessment.implementationPeriod || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});

// People who match the supervisor filters (for WHO count)
const filteredSupRows = computed(() => {
  return baseFilteredIDPs.value.filter((r) => {
    if (
      !r._assessment &&
      (idpSupPerfGapsFilter.value ||
        idpSupReadinessFilter.value ||
        idpSupInterventionFilter.value ||
        idpSupImplYearFilter.value ||
        idpSupImplPeriodFilter.value)
    )
      return false;
    if (!r._assessment) return true;
    const a = r._assessment;
    const interventions = Array.isArray(a.interventions) ? a.interventions : [];
    return (
      (!idpSupPerfGapsFilter.value ||
        a.perfGapsYN === idpSupPerfGapsFilter.value) &&
      (!idpSupReadinessFilter.value ||
        a.readinessYN === idpSupReadinessFilter.value) &&
      (!idpSupInterventionFilter.value ||
        interventions.includes(idpSupInterventionFilter.value)) &&
      (!idpSupImplYearFilter.value ||
        a.implYear === idpSupImplYearFilter.value) &&
      (!idpSupImplPeriodFilter.value ||
        a.implementationPeriod === idpSupImplPeriodFilter.value)
    );
  });
});

// helper: active filter count for a tab
function countActiveFilters(filters) {
  return filters.filter((v) => v.value !== "").length;
}
function clearFilters(refs) {
  refs.forEach((r) => (r.value = ""));
}

// ── COMPUTED — IDP SECTION EXPANSIONS ──────────────────────────────────────
const idpCompetencyRows = computed(() => {
  const out = [];
  filteredIDPs.value.forEach((r) => {
    (r._competencyRows || []).forEach((row, i) => {
      out.push({
        _key: `${r.refId}-c${i}`,
        refId: r.refId,
        name: r.employeeName,
        email: r.email,
        position: r.position,
        office: r.office,
        year: r.yearCovered,
        priority: row.priority ?? i + 1,
        targetCompetency: row.targetCompetency,
        competencyGroup: row.competencyGroup,
        currentLevel: row.currentLevel,
        requiredLevel: row.requiredLevel,
        leadInterventions: row.leadInterventions,
        targetTimeline: row.targetTimeline,
      });
    });
  });
  return out;
});

const idpAgapRows = computed(() => {
  const out = [];
  filteredIDPs.value.forEach((r) => {
    (r._agapRows || []).forEach((row, i) => {
      out.push({
        _key: `${r.refId}-a${i}`,
        refId: r.refId,
        name: r.employeeName,
        position: r.position,
        office: r.office,
        year: r.yearCovered,
        priority: row.priority ?? i + 1,
        degreeProgram: row.degreeProgram,
        targetHEI: row.targetHEI,
        modeOfStudy: row.modeOfStudy,
        scholarshipGrant: row.scholarshipGrant,
        targetTimeline: row.targetTimeline,
      });
    });
  });
  return out;
});

const idpProactRows = computed(() => {
  const out = [];
  filteredIDPs.value.forEach((r) => {
    (r._proactRows || []).forEach((row, i) => {
      out.push({
        _key: `${r.refId}-p${i}`,
        refId: r.refId,
        name: r.employeeName,
        position: r.position,
        office: r.office,
        year: r.yearCovered,
        priority: row.priority ?? i + 1,
        trainingTitle: row.trainingTitle,
        targetSkill: row.targetSkill,
        modeOfActivity: row.modeOfActivity,
        trainerProvider: row.trainerProvider,
        targetTimeline: row.targetTimeline,
      });
    });
  });
  return out;
});

// ── COMPUTED — LNA SECTION EXPANSIONS ──────────────────────────────────────
const lnaWorkforceRows = computed(() => {
  const out = [];
  filteredLNAs.value.forEach((r) => {
    const wp = r.workforceProfile || {};
    POSITION_LEVELS.forEach((lv) => {
      const row = wp[lv.key] || {};
      const total = EMP_TYPE_KEYS.reduce(
        (s, k) => s + (Number(row[k]) || 0),
        0,
      );
      if (total === 0) return;
      out.push({
        _key: `${r.refId}-wf-${lv.key}`,
        refId: r.refId,
        office: r.office,
        campus: r.campus,
        year: r.yearCovered,
        levelLabel: lv.label,
        ...row,
        total,
      });
    });
  });
  return out;
});

const lnaClusterRows = computed(() => {
  const out = [];
  filteredLNAs.value.forEach((r) => {
    (r._clusterSummary || []).forEach((row, i) => {
      out.push({
        _key: `${r.refId}-cs${i}`,
        refId: r.refId,
        office: r.office,
        campus: r.campus,
        year: r.yearCovered,
        cluster: row.cluster,
        strongest: row.strongest,
        weakest: row.weakest,
        interventionNeeded: row.interventionNeeded,
      });
    });
  });
  return out;
});

const lnaCompRows = computed(() => {
  const out = [];
  filteredLNAs.value.forEach((r) => {
    COMP_CLUSTERS.forEach(({ key, label }) => {
      (r[key] || []).forEach((row, i) => {
        out.push({
          _key: `${r.refId}-${key}-${i}`,
          refId: r.refId,
          office: r.office,
          campus: r.campus,
          year: r.yearCovered,
          cluster: label,
          competency: row.competency,
          first_cl: row.first_cl,
          first_pct: row.first_pct,
          secondNonSup_cl: row.secondNonSup_cl,
          secondNonSup_pct: row.secondNonSup_pct,
          secondSup_cl: row.secondSup_cl,
          secondSup_pct: row.secondSup_pct,
          third_cl: row.third_cl,
          third_pct: row.third_pct,
          faculty_cl: row.faculty_cl,
          faculty_pct: row.faculty_pct,
          observations: row.observations,
        });
      });
    });
  });
  return out;
});

const lnaInsightRows = computed(() => {
  const out = [];
  filteredLNAs.value.forEach((r) => {
    (r._insightRows || []).forEach((row, i) => {
      out.push({
        _key: `${r.refId}-ins${i}`,
        refId: r.refId,
        office: r.office,
        campus: r.campus,
        year: r.yearCovered,
        dataSource: row.dataSource,
        gap: row.gap,
        personnel: row.personnel,
        intervention: row.intervention,
      });
    });
  });
  return out;
});
// ── COMPUTED — LNA ADVANCED FILTER OPTIONS ─────────────────────────────────
const lnaPurposeOptions = computed(() => {
  const freq = {};
  lnas.value.forEach((r) => {
    const v = (r.purpose || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const lnaOffices = computed(() =>
  [...new Set(lnas.value.map((r) => r.office).filter(Boolean))].sort(),
);

// Workforce - position level options
const lnaWfLevelOptions = computed(() => {
  const seen = new Set();
  filteredLNAs.value.forEach((r) => {
    const wp = r.workforceProfile || {};
    POSITION_LEVELS.forEach((lv) => {
      const row = wp[lv.key] || {};
      const total = EMP_TYPE_KEYS.reduce(
        (s, k) => s + (Number(row[k]) || 0),
        0,
      );
      if (total > 0) seen.add(lv.label);
    });
  });
  return POSITION_LEVELS.filter((lv) => seen.has(lv.label)).map((lv) => ({
    v: lv.label,
    c: null,
  }));
});
const lnaWfHasTypeOptions = computed(() => {
  const freq = {};
  lnaWorkforceRows.value.forEach((r) => {
    EMP_TYPE_KEYS.forEach((k) => {
      if (Number(r[k]) > 0) {
        const label = k.charAt(0).toUpperCase() + k.slice(1);
        freq[label] = (freq[label] || 0) + 1;
      }
    });
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const filteredWorkforceRows = computed(() =>
  lnaWorkforceRows.value.filter((r) => {
    const levelMatch =
      !lnaWfLevelFilter.value || r.levelLabel === lnaWfLevelFilter.value;
    let typeMatch = true;
    if (lnaWfHasTypeFilter.value) {
      const key = lnaWfHasTypeFilter.value.toLowerCase();
      typeMatch = Number(r[key]) > 0;
    }
    let countMatch = true;
    if (lnaWfCountFilter.value) {
      const t = r.total || 0;
      if (lnaWfCountFilter.value === "gt0") countMatch = t > 0;
      else if (lnaWfCountFilter.value === "gt10") countMatch = t > 10;
      else if (lnaWfCountFilter.value === "gt50") countMatch = t > 50;
    }
    return levelMatch && typeMatch && countMatch;
  }),
);

// Competency - cluster summary filter options
const lnaClusterOptions = computed(() => {
  const freq = {};
  lnaClusterRows.value.forEach((r) => {
    const v = (r.cluster || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const lnaStrongestOptions = computed(() => {
  const freq = {};
  lnaClusterRows.value.forEach((r) => {
    const v = (r.strongest || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const lnaWeakestOptions = computed(() => {
  const freq = {};
  lnaClusterRows.value.forEach((r) => {
    const v = (r.weakest || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const filteredClusterRows = computed(() =>
  lnaClusterRows.value.filter((r) => {
    const intMatch =
      !lnaInterventionFilter.value ||
      (lnaInterventionFilter.value === "Yes" &&
        (r.interventionNeeded === "Y" || r.interventionNeeded === "Yes")) ||
      (lnaInterventionFilter.value === "No" &&
        (r.interventionNeeded === "N" || r.interventionNeeded === "No"));
    return (
      (!lnaClusterFilter.value || r.cluster === lnaClusterFilter.value) &&
      (!lnaStrongestFilter.value || r.strongest === lnaStrongestFilter.value) &&
      (!lnaWeakestFilter.value || r.weakest === lnaWeakestFilter.value) &&
      intMatch
    );
  }),
);

// Competency - detailed mapping filter options
const lnaCompClusterOptions = computed(() => {
  const freq = {};
  lnaCompRows.value.forEach((r) => {
    const v = (r.cluster || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const lnaCompCompetencyOptions = computed(() => {
  const freq = {};
  lnaCompRows.value
    .filter(
      (r) =>
        !lnaCompClusterFilter.value || r.cluster === lnaCompClusterFilter.value,
    )
    .forEach((r) => {
      const v = (r.competency || "").trim();
      if (v) freq[v] = (freq[v] || 0) + 1;
    });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const filteredCompRows = computed(() =>
  lnaCompRows.value.filter((r) => {
    let obsMatch = true;
    if (lnaHasObsFilter.value) {
      const hasObs = !!(r.observations && r.observations.trim());
      obsMatch = lnaHasObsFilter.value === "Yes" ? hasObs : !hasObs;
    }
    return (
      (!lnaCompClusterFilter.value ||
        r.cluster === lnaCompClusterFilter.value) &&
      (!lnaCompCompetencyFilter.value ||
        r.competency === lnaCompCompetencyFilter.value) &&
      obsMatch
    );
  }),
);

// Sources - data source options
const lnaDataSourceOptions = computed(() => {
  const freq = {};
  filteredLNAs.value.forEach((r) => {
    (r.dataSources || []).forEach((v) => {
      const vt = (v || "").trim();
      if (vt) freq[vt] = (freq[vt] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const filteredDataSourceRows = computed(() =>
  filteredLNAs.value.filter((r) => {
    let srcMatch =
      !lnaDataSourceFilter.value ||
      (r.dataSources || []).includes(lnaDataSourceFilter.value);
    let hasMatch = true;
    if (lnaHasSourcesFilter.value) {
      const hasSources = (r.dataSources || []).length > 0;
      hasMatch = lnaHasSourcesFilter.value === "Yes" ? hasSources : !hasSources;
    }
    return srcMatch && hasMatch;
  }),
);

// Insights filter options
const lnaInsightSourceOptions = computed(() => {
  const freq = {};
  lnaInsightRows.value.forEach((r) => {
    const v = (r.dataSource || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const lnaInsightPersonnelOptions = computed(() => {
  const freq = {};
  lnaInsightRows.value.forEach((r) => {
    const raw = r.personnel;
    const items = Array.isArray(raw)
      ? raw
      : (raw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    items.forEach((v) => {
      freq[v] = (freq[v] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([v, c]) => ({ v, c }));
});
const lnaInsightInterventionOptions = computed(() => {
  const freq = {};
  lnaInsightRows.value.forEach((r) => {
    const v = (r.intervention || "").trim();
    if (v) freq[v] = (freq[v] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([v, c]) => ({ v, c }));
});
const filteredInsightRows = computed(() =>
  lnaInsightRows.value.filter(
    (r) =>
      (!lnaInsightSourceFilter.value ||
        r.dataSource === lnaInsightSourceFilter.value) &&
      (!lnaInsightPersonnelFilter.value ||
        (() => {
          const raw = r.personnel;
          const items = Array.isArray(raw)
            ? raw
            : (raw || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
          return items.includes(lnaInsightPersonnelFilter.value);
        })()) &&
      (!lnaInsightInterventionFilter.value ||
        r.intervention === lnaInsightInterventionFilter.value),
  ),
);

// ── STATS ──────────────────────────────────────────────────────────────────
const ovFilteredIdps = computed(() => idps.value);
const ovFilteredLnas = computed(() => lnas.value);

const stats = computed(() => {
  const total = idps.value.length;
  const done = idps.value.filter((r) => r.status === "COMPLETE").length;
  const pend = idps.value.filter(
    (r) => r.status === "PENDING" || r.status === "SUPERVISOR_NOTIFIED",
  ).length;
  const lnaCount = lnas.value.length;
  const offices = new Set(
    [
      ...idps.value.map((r) => r.office),
      ...lnas.value.map((r) => r.office),
    ].filter(Boolean),
  ).size;
  return [
    {
      label: "Total IDPs",
      value: total,
      sub: "Submitted plans",
      icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    },
    {
      label: "Completed",
      value: done,
      sub: "Supervisor reviewed",
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    },
    {
      label: "Pending IDPs",
      value: pend,
      sub: "Awaiting supervisor",
      icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    },
    {
      label: "Total LNAs",
      value: lnaCount,
      sub: "Office assessments",
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    },
    {
      label: "Offices Covered",
      value: offices,
      sub: "Unique units submitted",
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    },
  ];
});

const insights = computed(() => {
  const yrs = idps.value
    .map((r) => parseFloat(r.yearsInPosition))
    .filter((n) => !isNaN(n));
  const avgYrs = yrs.length
    ? (yrs.reduce((a, b) => a + b, 0) / yrs.length).toFixed(1) + " yrs"
    : "—";
  const rate = idps.value.length
    ? Math.round(
        (idps.value.filter((r) => r.status === "COMPLETE").length /
          idps.value.length) *
          100,
      ) + "%"
    : "—";
  const supPending = new Set(
    idps.value
      .filter(
        (r) => r.status === "PENDING" || r.status === "SUPERVISOR_NOTIFIED",
      )
      .map((r) => r.supervisorEmail)
      .filter(Boolean),
  ).size;
  let flagCount = 0;
  lnas.value.forEach((r) => {
    try {
      if ((r.clusterSummary || []).some((c) => c.interventionNeeded === "Y"))
        flagCount++;
    } catch {}
  });
  const modes = {};
  idps.value.forEach((r) => {
    (r.agapRows || []).forEach((row) => {
      const m = (row.modeOfStudy || "").trim();
      if (m) modes[m] = (modes[m] || 0) + 1;
    });
  });
  const tm = Object.entries(modes).sort((a, b) => b[1] - a[1])[0];
  const rf = {};
  idps.value.forEach((r) => {
    (r.supervisorInterventions || []).forEach((i) => {
      rf[i] = (rf[i] || 0) + 1;
    });
  });
  const tr = Object.entries(rf).sort((a, b) => b[1] - a[1])[0];
  return [
    { label: "Avg Years in Position", value: avgYrs },
    { label: "IDP Completion Rate", value: rate },
    { label: "Supervisors w/ Pending", value: supPending },
    {
      label: "LNA Offices Flagging Intervention",
      value: flagCount + (flagCount === 1 ? " office" : " offices"),
    },
    { label: "Most Common AGAP Mode", value: tm ? tm[0] : "—" },
    { label: "Top Supervisor Recommendation", value: tr ? tr[0] : "—" },
  ];
});

// ── DATA NORMALIZATION ──────────────────────────────────────────────────────
function normalizeIDP(raw) {
  let competencyRows = [],
    agapRows = [],
    proactRows = [],
    assessment = null;
  try {
    competencyRows = JSON.parse(raw.competencyRowsJson || "[]");
  } catch {}
  try {
    agapRows = JSON.parse(raw.agapRowsJson || "[]");
  } catch {}
  try {
    proactRows = JSON.parse(raw.proactRowsJson || "[]");
  } catch {}
  try {
    assessment = JSON.parse(raw.supervisorAssessment || "null");
  } catch {}
  // Derive yearCovered from datePrepared or submittedAt if not stored directly
  let yearCovered = raw.yearCovered || "";
  if (!yearCovered && raw.datePrepared) {
    const yr = new Date(raw.datePrepared).getFullYear();
    if (!isNaN(yr)) yearCovered = String(yr);
  }
  if (!yearCovered && raw.submittedAt) {
    const yr = new Date(raw.submittedAt).getFullYear();
    if (!isNaN(yr)) yearCovered = String(yr);
  }
  const u = raw.user || {};
  return {
    ...raw,
    yearCovered,
    status: (raw.status || "").toUpperCase(),
    employeeName:
      [u.firstName, u.lastName].filter(Boolean).join(" ") ||
      raw.nameOfPersonnel ||
      u.email ||
      "",
    email: u.email || raw.employeeEmail || "",
    position: u.currentPosition || raw.currentPosition || "",
    office: u.collegeOfficeUnit || raw.collegeOfficeUnit || "",
    campus: u.campus || raw.campus || "",
    _competencyRows: competencyRows,
    _agapRows: agapRows,
    _proactRows: proactRows,
    _assessment: assessment,
  };
}

function safeArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim().startsWith("[")) {
    try {
      const p = JSON.parse(val);
      return Array.isArray(p) ? p : [];
    } catch {}
  }
  return [];
}

function normalizeLNA(raw) {
  let yearCovered = raw.yearCovered || "";
  if (!yearCovered && raw.submittedAt) {
    const yr = new Date(raw.submittedAt).getFullYear();
    if (!isNaN(yr)) yearCovered = String(yr);
  }
  const u = raw.user || {};

  const headOfUnit =
    [u.firstName, u.middleInitial ? u.middleInitial + "." : "", u.lastName]
      .filter(Boolean)
      .join(" ") ||
    u.headOfUnit ||
    raw.headOfUnit ||
    "";

  return {
    ...raw,
    yearCovered,
    office:
      u.collegeOfficeUnit ||
      u.officeAffiliation ||
      raw.office ||
      raw.unitOfficCollege ||
      "",
    headOfUnit,
    email: u.email || raw.email || "",
    _clusterSummary: safeArray(raw.clusterSummaryRaw ?? raw.clusterSummary),
    _dataSources: safeArray(raw.dataSourcesRaw ?? raw.dataSources),
    _insightRows: safeArray(raw.dataSourceInsights),
  };
}
const topCompetencyGaps = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    (r._competencyRows || []).forEach((row) => {
      const comp = (row.targetCompetency || "").trim();
      const cur = parseInt(row.currentLevel) || 0;
      const req = parseInt(row.requiredLevel) || 0;
      if (comp && req > cur) freq[comp] = (freq[comp] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));
});

// ── OVERVIEW COMPUTED ──────────────────────────────────────────────────────
const ovCounts = computed(() => ({
  idpPending: ovFilteredIdps.value.filter(
    (r) => r.status === "PENDING" || r.status === "SUPERVISOR_NOTIFIED",
  ).length,
  idpComplete: ovFilteredIdps.value.filter((r) => r.status === "COMPLETE")
    .length,
  lnaOffices: new Set(ovFilteredLnas.value.map((r) => r.office).filter(Boolean))
    .size,
  lnaFlagged: ovFilteredLnas.value.filter((r) =>
    (r._clusterSummary || []).some(
      (c) => c.interventionNeeded === "Yes" || c.interventionNeeded === "Y",
    ),
  ).length,
}));

const ovDrillTitle = computed(() => {
  const map = {
    "idp-all": `All IDP Submissions (${ovFilteredIdps.value.length})`,
    "idp-pending": `Pending IDPs — Awaiting Supervisor (${ovCounts.value.idpPending})`,
    "idp-complete": `Completed IDPs (${ovCounts.value.idpComplete})`,
    "lna-all": `All LNA Submissions (${ovFilteredLnas.value.length})`,
    "lna-offices": `Offices Covered (${ovCounts.value.lnaOffices})`,
    "lna-workforce": `Workforce Headcount (${lnaTotalWorkforce.value.toLocaleString()})`,
  };
  return map[ovActive.value] || "";
});

// Overview drill column definitions (index 0 = Ref ID, always non-sortable)
const ovIdpCols = [
  "Ref ID",
  "Name",
  "Position",
  "Office",
  "Year",
  "Status",
  "Submitted",
  "Completed",
];
const ovLnaCols = [
  "Ref ID",
  "Office / Unit",
  "Head of Office",
  "Year",
  "Purpose",
  "Personnel",
  "Submitted",
];

function sortOvRows(rows, state, keys) {
  const { col, asc } = state;
  if (col < 0 || !keys[col]) return rows;
  const key = keys[col];
  return [...rows].sort((a, b) => {
    if (key === "submittedAt" || key === "supervisorSignedAt") {
      const ad = a[key] ? new Date(a[key]).getTime() : 0;
      const bd = b[key] ? new Date(b[key]).getTime() : 0;
      return asc ? ad - bd : bd - ad;
    }
    if (key === "totalPersonnel" || key === "count") {
      return asc
        ? (a[key] || 0) - (b[key] || 0)
        : (b[key] || 0) - (a[key] || 0);
    }
    const av = (a[key] || "").toLowerCase(),
      bv = (b[key] || "").toLowerCase();
    return asc ? av.localeCompare(bv) : bv.localeCompare(av);
  });
}

const ovIdpKeys = [
  null,
  "employeeName",
  "position",
  "office",
  "yearCovered",
  "status",
  "submittedAt",
  "supervisorSignedAt",
];
const ovLnaKeys = [
  null,
  "office",
  "headOfUnit",
  "yearCovered",
  "purpose",
  "totalPersonnel",
  "submittedAt",
];

const ovLnaOfficeCols = [
  "Office / Unit",
  "LNAs Submitted",
  "Total Personnel",
  "Latest Submission",
];
const ovLnaOfficeKeys = ["office", "count", "totalPersonnel", "submittedAt"];

const ovLnaByOffice = computed(() => {
  const map = new Map();
  for (const r of ovFilteredLnas.value) {
    const office = r.office || "Unspecified";
    if (!map.has(office)) {
      map.set(office, {
        office,
        count: 0,
        totalPersonnel: 0,
        submittedAt: null,
      });
    }
    const entry = map.get(office);
    entry.count += 1;
    entry.totalPersonnel += Number(r.totalPersonnel) || 0;
    const ts = r.submittedAt ? new Date(r.submittedAt).getTime() : 0;
    const prevTs = entry.submittedAt
      ? new Date(entry.submittedAt).getTime()
      : 0;
    if (ts > prevTs) entry.submittedAt = r.submittedAt;
  }
  return Array.from(map.values());
});

const ovDrillRows = computed(() => {
  let rows = [];
  switch (ovActive.value) {
    case "idp-all":
      rows = ovFilteredIdps.value;
      break;
    case "idp-pending":
      rows = ovFilteredIdps.value.filter(
        (r) => r.status === "PENDING" || r.status === "SUPERVISOR_NOTIFIED",
      );
      break;
    case "idp-complete":
      rows = ovFilteredIdps.value.filter((r) => r.status === "COMPLETE");
      break;
    case "lna-all":
      rows = ovFilteredLnas.value;
      break;
    case "lna-offices":
    case "lna-workforce":
      rows = ovLnaByOffice.value;
      break;
    default:
      return [];
  }
  if (ovActive.value === "lna-offices" || ovActive.value === "lna-workforce")
    return sortOvRows(rows, sortState.ovLnaOffice, ovLnaOfficeKeys);
  if (ovActive.value.startsWith("idp"))
    return sortOvRows(rows, sortState.ovIdp, ovIdpKeys);
  if (ovActive.value.startsWith("lna"))
    return sortOvRows(rows, sortState.ovLna, ovLnaKeys);
  return rows;
});
function toggleOv(key) {
  if (ovActive.value !== key) {
    sortState.ovIdp = { col: -1, asc: true };
    sortState.ovLna = { col: -1, asc: true };
    sortState.ovLnaOffice = { col: -1, asc: true };
  }
  ovActive.value = ovActive.value === key ? null : key;
}

const interventionOffices = computed(() =>
  lnas.value
    .filter((r) =>
      (r._clusterSummary || []).some(
        (c) => c.interventionNeeded === "Yes" || c.interventionNeeded === "Y",
      ),
    )
    .map((r) => r.office)
    .filter(Boolean),
);

const recentActivity = computed(() => {
  const all = [
    ...idps.value.map((r) => ({
      refId: r.refId,
      type: "IDP",
      label: r.employeeName || r.refId,
      position: r.position || "—",
      office: r.office || "—",
      yearCovered: r.yearCovered || "—",
      status: r.status,
      submittedAt: r.submittedAt,
      completedAt: r.supervisorSignedAt || null,
    })),
    ...lnas.value.map((r) => ({
      refId: r.refId,
      type: "LNA",
      label: r.office || r.refId,
      position: "—",
      office: r.office || "—",
      yearCovered: r.yearCovered || "—",
      status: "SUBMITTED",
      submittedAt: r.submittedAt,
      completedAt: null,
    })),
  ];
  return all
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 10);
});

// ── OVERVIEW — EXTENDED COMPUTEDS ──────────────────────────────────────────

const idpCompletionRate = computed(() => {
  const total = idps.value.length;
  if (!total) return 0;
  return Math.round(
    (idps.value.filter((r) => r.status === "COMPLETE").length / total) * 100,
  );
});

const idpByPosition = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    const p = (r.position || "Unknown").trim();
    freq[p] = (freq[p] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
});

const supervisorReadiness = computed(() => {
  let ready = 0,
    notReady = 0,
    noData = 0;
  idps.value.forEach((r) => {
    if (!r._assessment) {
      noData++;
      return;
    }
    const v = (r._assessment.readinessYN || "").toLowerCase();
    if (v === "yes" || v === "y") ready++;
    else if (v === "no" || v === "n") notReady++;
    else noData++;
  });
  return { ready, notReady, noData };
});

const supervisorPerfGaps = computed(() => {
  let hasGap = 0,
    noGap = 0,
    pending = 0;
  idps.value.forEach((r) => {
    if (!r._assessment) {
      pending++;
      return;
    }
    const v = (r._assessment.perfGapsYN || "").toLowerCase();
    if (v === "yes" || v === "y") hasGap++;
    else if (v === "no" || v === "n") noGap++;
    else pending++;
  });
  return { hasGap, noGap, pending };
});

const topSupInterventions = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    if (!r._assessment) return;
    const arr = Array.isArray(r._assessment.interventions)
      ? r._assessment.interventions
      : [];
    arr.forEach((v) => {
      const vt = (v || "").trim();
      if (vt) freq[vt] = (freq[vt] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
});

const topIdpGaps = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    (r._competencyRows || []).forEach((row) => {
      const comp = (row.targetCompetency || "").trim();
      const cur = parseInt(row.currentLevel) || 0;
      const req = parseInt(row.requiredLevel) || 0;
      if (comp && req > cur) freq[comp] = (freq[comp] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
});

const lnaInterventionClusters = computed(() => {
  const freq = {};
  lnas.value.forEach((r) => {
    (r._clusterSummary || []).forEach((c) => {
      if (c.interventionNeeded === "Y" || c.interventionNeeded === "Yes") {
        const cl = (c.cluster || "Unknown").trim();
        freq[cl] = (freq[cl] || 0) + 1;
      }
    });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]);
});

const lnaWeakestCompetencies = computed(() => {
  const freq = {};
  lnas.value.forEach((r) => {
    (r._clusterSummary || []).forEach((c) => {
      const w = (c.weakest || "").trim();
      if (w) freq[w] = (freq[w] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
});

const lnaStrongestCompetencies = computed(() => {
  const freq = {};
  lnas.value.forEach((r) => {
    (r._clusterSummary || []).forEach((c) => {
      const s = (c.strongest || "").trim();
      if (s) freq[s] = (freq[s] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
});

const lnaTotalWorkforce = computed(() => {
  let total = 0;
  lnas.value.forEach((r) => {
    const wp = r.workforceProfile || {};
    POSITION_LEVELS.forEach((lv) => {
      const row = wp[lv.key] || {};
      total += EMP_TYPE_KEYS.reduce((s, k) => s + (Number(row[k]) || 0), 0);
    });
  });
  return total;
});

const lnaEmploymentBreakdown = computed(() => {
  const counts = {};
  EMP_TYPE_KEYS.forEach((k) => (counts[k] = 0));
  lnas.value.forEach((r) => {
    const wp = r.workforceProfile || {};
    POSITION_LEVELS.forEach((lv) => {
      const row = wp[lv.key] || {};
      EMP_TYPE_KEYS.forEach((k) => {
        counts[k] += Number(row[k]) || 0;
      });
    });
  });
  return counts;
});

const agapModeBreakdown = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    (r._agapRows || []).forEach((row) => {
      const m = (row.modeOfStudy || "").trim();
      if (m) freq[m] = (freq[m] || 0) + 1;
    });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]);
});

const agapDegreeBreakdown = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    (r._agapRows || []).forEach((row) => {
      const d = (row.degreeProgram || "").trim();
      if (d) freq[d] = (freq[d] || 0) + 1;
    });
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
});

const proactModeBreakdown = computed(() => {
  const freq = {};
  idps.value.forEach((r) => {
    (r._proactRows || []).forEach((row) => {
      const m = (row.modeOfActivity || "").trim();
      if (m) freq[m] = (freq[m] || 0) + 1;
    });
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]);
});

function maxOf(arr) {
  return arr.length ? Math.max(...arr.map((x) => x[1])) : 1;
}

// ── DATA ───────────────────────────────────────────────────────────────────
async function loadDashboard() {
  dataLoading.value = true;
  lastUpdated.value = "Loading...";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const [idpRes, lnaRes, hrRes] = await Promise.all([
      authFetch(`${API}/idp`, { signal: controller.signal }),
      authFetch(`${API}/lna`, { signal: controller.signal }),
      authFetch(`${API}/users`, { signal: controller.signal }),
    ]);

    if (!idpRes.ok || !lnaRes.ok || !hrRes.ok) {
      throw new Error(
        `Server error: ${[idpRes, lnaRes, hrRes].find((r) => !r.ok)?.status}`,
      );
    }
    const [rawIdps, rawLnas, rawHr] = await Promise.all([
      idpRes.json(),
      lnaRes.json(),
      hrRes.json(),
    ]);
    idps.value = Array.isArray(rawIdps) ? rawIdps.map(normalizeIDP) : [];
    lnas.value = Array.isArray(rawLnas) ? rawLnas.map(normalizeLNA) : [];
    hrUsers.value = Array.isArray(rawHr) ? rawHr : [];
    const now = new Date();
    lastUpdated.value = `Last updated: ${now.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} at ${now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}`;
  } catch (err) {
    const msg =
      err?.name === "AbortError"
        ? "Request timed out."
        : "Failed to load data.";
    toast(msg, "error");
    lastUpdated.value = "Failed to load.";
  } finally {
    clearTimeout(timeout);
    dataLoading.value = false;
  }
}

// ── CHARTS ─────────────────────────────────────────────────────────────────

// ── MODALS// ── MODALS ─────────────────────────────────────────────────────────────────
function viewIDP(refId) {
  selectedIDP.value = idps.value.find((x) => x.refId === refId) || null;
  if (selectedIDP.value) idpModal.value = true;
}
function viewLNA(refId) {
  selectedLNA.value = lnas.value.find((x) => x.refId === refId) || null;
  if (selectedLNA.value) lnaModal.value = true;
}

async function downloadPDF(type, refId, name) {
  try {
    toast("Generating PDF…");
    const url = `${API}/${type}/${encodeURIComponent(refId)}/pdf`;
    const res = await authFetch(url);
    if (!res.ok) {
      toast("PDF generation failed.", "error");
      return;
    }
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type.toUpperCase()}_${refId}_${(name || "").replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    toast("Failed to download PDF.", "error");
  }
}

// ── HR REGISTRY ─────────────────────────────────────────────────────────────
const regMenuOpen = ref(null);
const { user: authUser, fetchMe } = useAuth();
const isMasterAdmin = computed(
  () => authUser.value?.email === "altheaguila.gorres@carsu.edu.ph",
);
const regMenuOpenUp = ref(false);

const regMenuPos = reactive({ top: 0, right: 0 });

function toggleRegMenu(id, event) {
  if (regMenuOpen.value === id) {
    regMenuOpen.value = null;
    return;
  }
  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;

  if (spaceBelow < 280) {
    regMenuPos.top = null;
    regMenuPos.bottom = window.innerHeight - rect.top + 6;
  } else {
    regMenuPos.top = rect.bottom + 6;
    regMenuPos.bottom = null;
  }
  regMenuPos.right = window.innerWidth - rect.right;
  regMenuOpen.value = id;
}

function regAction(fn) {
  regMenuOpen.value = null;
  fn();
}

// Close dropdown when clicking outside
if (import.meta.client) {
  document.addEventListener("click", () => {
    regMenuOpen.value = null;
  });
}

async function saveHR() {
  if (!newHR.email || !newHR.name) {
    toast("Email and Name are required.", "error");
    return;
  }
  if (!newHR.email.endsWith("@carsu.edu.ph")) {
    toast("Must be a @carsu.edu.ph email.", "error");
    return;
  }
  try {
    await authFetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newHR.email,
        name: newHR.name,
        role: newHR.role,
      }),
    });
    toast(`${newHR.name} added.`, "success");
    addHRModal.value = false;
    newHR.email = "";
    newHR.name = "";
    newHR.role = "";
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}
async function removeHR(email, name) {
  if (!confirm(`Remove ${name || email} from the HR Registry?`)) return;
  try {
    await authFetch(`${API}/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    toast(`${name || email} removed.`, "success");
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}

// Confirm modal state
const confirmModal = reactive({
  open: false,
  title: "",
  message: "",
  confirmLabel: "Confirm",
  confirmClass: "btn-confirm-primary",
  onConfirm: null,
});

function openConfirm({
  title,
  message,
  confirmLabel,
  confirmClass,
  onConfirm,
}) {
  confirmModal.title = title;
  confirmModal.message = message;
  confirmModal.confirmLabel = confirmLabel;
  confirmModal.confirmClass = confirmClass;
  confirmModal.onConfirm = onConfirm;
  confirmModal.open = true;
}

function runConfirm() {
  confirmModal.open = false;
  confirmModal.onConfirm?.();
}

async function setRole(userId, role) {
  try {
    await authFetch(`${API}/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    toast(`Role updated to ${role}.`, "success");
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}

async function setSupervisor(userId, grant) {
  const action = grant ? 'grant-supervisor' : 'revoke-supervisor';
  try {
    await authFetch(`${API}/users/${userId}/${action}`, { method: 'PATCH' });
    toast(grant ? 'Supervisor access granted.' : 'Supervisor access revoked.', 'success');
    if (userId === authUser.value?.id) await fetchMe();
    loadDashboard();
  } catch {
    toast('Network error.', 'error');
  }
}

async function confirmGrantHr(u) {
  try {
    await authFetch(`${API}/users/${u.id}/grant-hr-staff`, { method: "PATCH" });
    toast(`HR Staff access granted.`, "success");
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}

async function confirmRevokeHr(u) {
  try {
    await authFetch(`${API}/users/${u.id}/revoke-hr-staff`, {
      method: "PATCH",
    });
    toast(`HR Staff access revoked.`, "success");
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}

async function removeUser(userId, email) {
  try {
    await authFetch(`${API}/users/${userId}`, { method: "DELETE" });
    toast(`User removed.`, "success");
    loadDashboard();
  } catch {
    toast("Network error.", "error");
  }
}

// ── REGISTRY SEARCH / SORT / FILTER STATE ──────────────────────────
const regSearch = ref("");
const regRoleFilter = ref("");
const regSupFilter = ref("");
const regSortCol = ref("name");
const regSortAsc = ref(true);

function sortReg(col) {
  if (regSortCol.value === col) {
    regSortAsc.value = !regSortAsc.value;
  } else {
    regSortCol.value = col;
    regSortAsc.value = true;
  }
}

function regSortIndicator(col) {
  if (regSortCol.value !== col) return "↕";
  return regSortAsc.value ? "↑" : "↓";
}

const filteredRegUsers = computed(() => {
  const q = regSearch.value.toLowerCase();
  let rows = hrUsers.value.filter((u) => {
    const name = [u.firstName, u.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchSearch =
      !q || name.includes(q) || (u.email || "").toLowerCase().includes(q);
    const matchRole = !regRoleFilter.value || u.role === regRoleFilter.value;
    const matchSup =
      !regSupFilter.value ||
      (regSupFilter.value === "yes" && u.isSupervisor) ||
      (regSupFilter.value === "no" && !u.isSupervisor);
    return matchSearch && matchRole && matchSup;
  });

  const col = regSortCol.value;
  const asc = regSortAsc.value;

  rows = [...rows].sort((a, b) => {
    let av = "",
      bv = "";
    if (col === "name") {
      av = [a.firstName, a.lastName].filter(Boolean).join(" ").toLowerCase();
      bv = [b.firstName, b.lastName].filter(Boolean).join(" ").toLowerCase();
    } else if (col === "email") {
      av = (a.email || "").toLowerCase();
      bv = (b.email || "").toLowerCase();
    } else if (col === "role") {
      av = a.role || "";
      bv = b.role || "";
    } else if (col === "createdAt") {
      return asc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return asc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return rows;
});

// ── SORT ────────────────────────────────────────────────────────────────────
function sortTable(type, col) {
  const s = sortState[type];
  if (s.col === col) s.asc = !s.asc;
  else {
    s.col = col;
    s.asc = true;
  }
}
function sortIndicator(type, col) {
  const s = sortState[type];
  if (s.col !== col) return "↕";
  return s.asc ? "↑" : "↓";
}

// ── HELPERS ─────────────────────────────────────────────────────────────────
function fmtDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d)
    ? v
    : d.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      });
}
function fmtDateTime(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d)
    ? v
    : d.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      }) +
        " " +
        d.toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Manila",
        });
}
function statusBadgeClass(s) {
  const c = (s || "").toUpperCase();
  if (c === "COMPLETE") return "badge badge-green";
  if (c === "PENDING") return "badge badge-gold";
  return "badge badge-grey";
}
function statusBadgeLabel(s) {
  const c = (s || "").toUpperCase();
  if (c === "COMPLETE") return "Completed";
  if (c === "PENDING") return "Pending";
  return s || "—";
}
function toast(msg, type = "") {
  const id = Date.now();
  toasts.value.push({ id, msg, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 3500);
}

onMounted(async () => {
  if (!getAccessToken()) {
    await tryRefresh();
  }
  await loadDashboard();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");

body,
* {
  font-family: "Roboto", sans-serif;
}
:root {
  --navy: #003300;
  --navy-mid: #1a5c1a;
  --navy-light: #3d8b50;
  --gold: #ffcc00;
  --gold-light: #ffd740;
  --gold-dim: rgba(255, 204, 0, 0.12);
  --cream: #f9f8f4;
  --white: #fff;
  --text: #1a1a2e;
  --text-light: #5a6070;
  --border: #d8d4c8;
  --error: #c0392b;
  --success: #1a6b3c;
  --input-bg: #f8f7f4;
  --shadow: 0 4px 24px rgba(0, 51, 0, 0.1);
  --shadow-sm: 0 2px 8px rgba(0, 51, 0, 0.07);
  --shadow-lg: 0 8px 40px rgba(0, 51, 0, 0.12);
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
  opacity: 0.8;
  transition: transform 0.2s;
}
.page-nav a.back-link:hover svg {
  transform: translateX(-3px);
  opacity: 1;
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
  letter-spacing: 0.03em;
}

.dash-wrap {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 28px 80px;
}
.dash-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 14px;
}
.dash-head-left h1 {
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  color: var(--navy);
  margin-bottom: 2px;
}
.dash-head-left p {
  font-size: 13px;
  color: var(--text-light);
}
.btn-refresh {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-refresh:hover {
  background: var(--navy-mid);
}
.btn-refresh svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.btn-refresh.spinning svg {
  animation: spin 0.8s linear infinite;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}
.stat-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 20px 16px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  animation: fadeUp 0.4s ease both;
}
.stat-card::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}
.stat-card:hover::before {
  transform: scaleX(1);
}
.stat-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 51, 0, 0.07);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon svg {
  width: 16px;
  height: 16px;
  stroke: var(--navy-mid);
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
}
.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 6px;
}
.stat-value {
  font-family: "Roboto", sans-serif;
  font-size: 34px;
  color: var(--navy);
  line-height: 1;
  margin-bottom: 2px;
}
.stat-sub {
  font-size: 11px;
  color: var(--text-light);
}

.tab-bar {
  display: flex;
  gap: 3px;
  background: rgba(0, 51, 0, 0.07);
  border-radius: 11px;
  padding: 4px;
  margin-bottom: 22px;
  width: fit-content;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn.active {
  background: var(--navy);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 51, 0, 0.2);
}
.tab-btn:not(.active):hover {
  background: rgba(0, 51, 0, 0.1);
  color: var(--navy);
}
.tab-panel {
  animation: fadeUp 0.3s ease;
}

.sub-tab-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.sub-tab-btn {
  padding: 7px 16px;
  border: 1.5px solid var(--border);
  background: var(--white);
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.sub-tab-btn.active {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.sub-tab-btn:not(.active):hover {
  border-color: var(--navy);
  color: var(--navy);
}

.sub-section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--navy-mid);
  padding-bottom: 6px;
  border-bottom: 1.5px solid var(--border);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}
.chart-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 20px 16px;
  box-shadow: var(--shadow-sm);
}
.chart-card h4 {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 2px;
}
.chart-sub {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 14px;
}
.chart-wrap {
  position: relative;
  height: 210px;
}
.insight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 6px;
}
.insight-item {
  background: rgba(0, 51, 0, 0.04);
  border-left: 3px solid var(--gold);
  border-radius: 0 8px 8px 0;
  padding: 10px 13px;
}
.i-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 3px;
}
.i-val {
  font-size: 14px;
  font-weight: 600;
  color: var(--navy);
}

.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}
.filter-bar input,
.filter-bar select {
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  background: var(--white);
  outline: none;
  transition: border-color 0.2s;
}
.filter-bar input {
  min-width: 200px;
}
.filter-bar input:focus,
.filter-bar select:focus {
  border-color: var(--navy);
}
.filter-bar select {
  min-width: 145px;
}
.result-count {
  font-size: 12px;
  color: var(--text-light);
  margin-left: auto;
}

.tbl-wrap {
  overflow-x: auto;
  border-radius: 11px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 8px;
}
.dtbl {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background: var(--white);
}
.dtbl thead tr {
  background: var(--navy);
}
.dtbl thead th {
  padding: 11px 13px;
  color: #fff;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  user-select: none;
}
.dtbl thead th:last-child {
  border-right: none;
}
.dtbl thead th.th-sortable {
  cursor: pointer;
}
.dtbl thead th.th-sortable:hover {
  background: var(--navy-mid);
}
.dtbl thead th.th-sorted {
  background: var(--navy-mid);
}
.dtbl thead th.th-action {
  cursor: default;
}
.sort-ind {
  font-size: 9px;
  margin-left: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}
.th-sortable:hover .sort-ind {
  opacity: 0.6;
}
.th-sorted .sort-ind {
  opacity: 1;
}
.dtbl tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.dtbl tbody tr:last-child {
  border-bottom: none;
}
.dtbl tbody tr:hover {
  background: rgba(0, 51, 0, 0.03);
}
.dtbl tbody td {
  padding: 10px 13px;
  vertical-align: middle;
}
.empty-row td {
  text-align: center;
  padding: 44px;
  color: var(--text-light);
  font-style: italic;
}
.sub-text {
  font-size: 11px;
  color: var(--text-light);
}
.date-cell {
  font-size: 12px;
  white-space: nowrap;
}
.ref-code {
  font-size: 11px;
  background: rgba(0, 51, 0, 0.07);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
.cell-wrap {
  max-width: 200px;
  white-space: pre-wrap;
  font-size: 12px;
}
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}
.level-cur {
  background: rgba(90, 96, 112, 0.1);
  color: var(--text-light);
}
.level-req {
  background: rgba(0, 51, 0, 0.1);
  color: var(--navy);
}

.btn-view {
  background: none;
  border: 1px solid var(--border);
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: var(--navy);
  font-family: inherit;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-view:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.badge-green {
  background: rgba(0, 51, 0, 0.1);
  color: #1a6b3c;
}
.badge-gold {
  background: rgba(245, 195, 0, 0.15);
  color: #8a6c00;
}
.badge-red {
  background: rgba(192, 57, 43, 0.1);
  color: var(--error);
}
.badge-grey {
  background: rgba(90, 96, 112, 0.1);
  color: var(--text-light);
}
.badge-blue {
  background: rgba(45, 106, 159, 0.1);
  color: #2d6a9f;
}

.reg-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-add:hover {
  background: var(--navy-mid);
}
.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--error);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 13px;
  transition: background 0.15s;
}
.btn-remove:hover {
  background: rgba(192, 57, 43, 0.08);
}

.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.6);
  z-index: 500;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}
.modal-overlay.active {
  display: flex;
}
.modal {
  background: var(--white);
  border-radius: 16px;
  max-width: 960px;
  width: 100%;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  animation: fadeUp 0.3s ease;
  margin: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 1;
  border-radius: 16px 16px 0 0;
}
.modal-header-left h3 {
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  color: var(--navy);
}
.modal-header-left p {
  font-size: 12px;
  color: var(--text-light);
  margin-top: 1px;
}
.modal-header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.btn-pdf {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-pdf:hover {
  background: var(--navy-mid);
}
.btn-pdf svg {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
}
.btn-close {
  width: 30px;
  height: 30px;
  background: rgba(0, 51, 0, 0.07);
  border: none;
  border-radius: 7px;
  cursor: pointer;
  font-size: 17px;
  color: var(--text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-close:hover {
  background: rgba(192, 57, 43, 0.1);
  color: var(--error);
}
.modal-body {
  padding: 20px 24px 26px;
}
.m-section {
  margin-bottom: 22px;
}
.m-section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--navy-mid);
  padding-bottom: 7px;
  border-bottom: 1.5px solid var(--border);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.m-badge {
  font-size: 9px;
  padding: 2px 8px;
  background: var(--gold-dim);
  color: var(--navy);
  border-radius: 10px;
  border: 1px solid rgba(245, 195, 0, 0.3);
  font-weight: 700;
}
.dgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.dgrid.g3 {
  grid-template-columns: 1fr 1fr 1fr;
}
.df {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.df.s2 {
  grid-column: span 2;
}
.df.s3 {
  grid-column: span 3;
}
.df label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-light);
}
.df span,
.df code {
  font-size: 13px;
  color: var(--text);
}
.df code {
  background: rgba(0, 51, 0, 0.07);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
}
.m-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.m-table thead tr {
  background: var(--navy-mid);
}
.m-table thead th {
  padding: 7px 10px;
  color: #fff;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
}
.m-table tbody tr {
  border-bottom: 1px solid var(--border);
}
.m-table tbody tr:last-child {
  border-bottom: none;
}
.m-table tbody tr:nth-child(even) {
  background: #faf9f6;
}
.m-table tbody td {
  padding: 7px 10px;
  vertical-align: top;
}
.pending-note {
  background: rgba(245, 195, 0, 0.08);
  border: 1px solid rgba(245, 195, 0, 0.35);
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  color: var(--navy);
}

.add-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 13px;
}
.add-field label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--navy-mid);
}
.add-field input {
  padding: 10px 13px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.add-field input:focus {
  border-color: var(--navy);
}
.btn-save {
  width: 100%;
  padding: 11px;
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save:hover {
  background: var(--navy-mid);
}

.toast-wrap {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 600;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.toast {
  background: var(--navy);
  color: #fff;
  padding: 11px 16px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: fadeUp 0.3s ease;
  max-width: 300px;
}
.toast.success {
  background: var(--success);
}
.toast.error {
  background: var(--error);
}

@media (max-width: 640px) {
  .dash-wrap {
    padding: 20px 14px 60px;
  }
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .page-nav {
    padding: 0 16px;
  }
  .nav-current,
  .nav-sep {
    display: none;
  }
  .sub-tab-btn {
    font-size: 11px;
    padding: 6px 12px;
  }
}
/* ── OVERVIEW CARDS ── */
.ov-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: stretch;
}
.ov-card-divider {
  width: 1px;
  background: var(--border);
  margin: 0 4px;
  align-self: stretch;
}
.ov-card {
  flex: 1;
  min-width: 130px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.18s;
  user-select: none;
}
.ov-card:hover {
  border-color: var(--navy);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.ov-card.active {
  border-color: var(--navy);
  background: var(--navy);
}
.ov-card.active .ov-card-label,
.ov-card.active .ov-card-num,
.ov-card.active .ov-card-sub {
  color: #fff !important;
  opacity: 1;
}
.ov-card-amber {
  border-left: 3px solid #c9a200;
}
.ov-card-amber.active {
  background: #8a6c00;
  border-color: #8a6c00;
}
.ov-card-green {
  border-left: 3px solid var(--navy-light);
}
.ov-card-green.active {
  background: var(--navy-mid);
  border-color: var(--navy-mid);
}
.ov-card-blue {
  border-left: 3px solid #2d6a9f;
}
.ov-card-blue.active {
  background: #1e4e7a;
  border-color: #1e4e7a;
}
.ov-card-red {
  border-left: 3px solid #c0392b;
}
.ov-card-red.active {
  background: #922b21;
  border-color: #922b21;
}
.ov-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.ov-card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-light);
}
.ov-card-num {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);
  line-height: 1;
}
.ov-card-sub {
  font-size: 11px;
  color: var(--text-light);
}

.ov-drill {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 18px;
  overflow: hidden;
  animation: fadeUp 0.2s ease;
}
.ov-drill-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border);
  background: #faf9f6;
}
.ov-drill-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
}
.btn-ov-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-light);
  padding: 2px 6px;
  border-radius: 5px;
  transition: all 0.15s;
  font-family: inherit;
}
.btn-ov-close:hover {
  background: rgba(192, 57, 43, 0.1);
  color: var(--error);
}

/* ── OVERVIEW PANEL ─────────────────────────────────────────────────── */
.ov-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Metric Cards Row */
.ov-metrics-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}
@media (max-width: 1100px) {
  .ov-metrics-row {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 700px) {
  .ov-metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ov-metric-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: default;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.ov-metric-card[onClick],
.ov-metric-card:has(.ov-mc-body) {
  cursor: pointer;
}
.ov-metric-card:hover {
  border-color: var(--navy);
  box-shadow: 0 4px 16px rgba(26, 77, 46, 0.1);
  transform: translateY(-1px);
}
.ov-metric-card.active {
  border-color: var(--navy);
  background: var(--navy);
}
.ov-metric-card.active .ov-mc-num,
.ov-metric-card.active .ov-mc-label,
.ov-metric-card.active .ov-mc-sub {
  color: #fff;
}
.ov-metric-card.active .ov-mc-icon svg {
  stroke: rgba(255, 255, 255, 0.8);
}

.ov-mc-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ov-mc-icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ov-mc-navy .ov-mc-icon {
  background: rgba(26, 77, 46, 0.1);
}
.ov-mc-navy .ov-mc-icon svg {
  stroke: var(--navy);
}
.ov-mc-amber .ov-mc-icon {
  background: rgba(180, 120, 0, 0.1);
}
.ov-mc-amber .ov-mc-icon svg {
  stroke: #8a6c00;
}
.ov-mc-green .ov-mc-icon {
  background: rgba(26, 107, 60, 0.1);
}
.ov-mc-green .ov-mc-icon svg {
  stroke: #1a6b3c;
}
.ov-mc-blue .ov-mc-icon {
  background: rgba(45, 106, 159, 0.1);
}
.ov-mc-blue .ov-mc-icon svg {
  stroke: #2d6a9f;
}
.ov-mc-slate .ov-mc-icon {
  background: rgba(90, 96, 112, 0.1);
}
.ov-mc-slate .ov-mc-icon svg {
  stroke: var(--text-light);
}
.ov-mc-teal .ov-mc-icon {
  background: rgba(0, 128, 128, 0.1);
}
.ov-mc-teal .ov-mc-icon svg {
  stroke: #007a7a;
}

.ov-mc-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ov-mc-num {
  font-family: "Roboto", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.1;
}
.ov-mc-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.02em;
}
.ov-mc-sub {
  font-size: 10px;
  color: var(--text-light);
}

/* 2-col and 3-col grids */
.ov-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ov-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
@media (max-width: 1000px) {
  .ov-grid-2 {
    grid-template-columns: 1fr;
  }
  .ov-grid-3 {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 700px) {
  .ov-grid-3 {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.ov-card {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: var(--shadow-sm);
}
.ov-card-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ov-card-sub {
  font-size: 11px;
  color: var(--text-light);
  margin-bottom: 2px;
}
.ov-card-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(26, 77, 46, 0.08);
  color: var(--navy-mid);
  border-radius: 20px;
  letter-spacing: 0.02em;
}

/* Completion ring */
.ov-completion-wrap {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-top: 10px;
}
.ov-ring-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.ov-ring {
  width: 90px;
  height: 90px;
}
.ov-ring-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-light);
  text-align: center;
  line-height: 1.3;
}
.ov-completion-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
}
.ov-detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ov-detail-label {
  font-size: 12px;
  color: var(--text);
  flex: 1;
}
.ov-detail-val {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  font-family: "Roboto", sans-serif;
}
.ov-divider {
  border-top: 1px solid var(--border);
  margin: 4px 0;
}
.ov-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ov-dot-green {
  background: #1a6b3c;
}
.ov-dot-amber {
  background: #c67c00;
}
.ov-dot-slate {
  background: var(--text-light);
}

/* Bar charts */
.ov-bar-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}
.ov-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.ov-bar-rank {
  width: 14px;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-light);
  text-align: center;
  flex-shrink: 0;
}
.ov-bar-label {
  flex: 0 0 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text);
  font-size: 11px;
}
.ov-bar-track {
  flex: 1;
  height: 8px;
  background: rgba(90, 96, 112, 0.1);
  border-radius: 4px;
  overflow: hidden;
}
.ov-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}
.ov-bar-navy {
  background: var(--navy);
}
.ov-bar-blue {
  background: #2d6a9f;
}
.ov-bar-red {
  background: #c0392b;
}
.ov-bar-amber {
  background: #c67c00;
}
.ov-bar-teal {
  background: #007a7a;
}
.ov-bar-slate {
  background: #5a6070;
}
.ov-bar-count {
  font-size: 11px;
  font-weight: 700;
  color: var(--navy);
  font-family: "Roboto", sans-serif;
  min-width: 20px;
  text-align: right;
}

/* Mini titles */
.ov-mini-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 6px;
  margin-top: 4px;
}
.ov-title-green {
  color: #1a6b3c !important;
}
.ov-title-red {
  color: #c0392b !important;
}

/* Pill badges */
.ov-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  margin-bottom: 4px;
}
.ov-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}
.ov-pill-red {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
}
.ov-pill-green {
  background: rgba(26, 107, 60, 0.1);
  color: #1a6b3c;
}
.ov-pill-grey {
  background: rgba(90, 96, 112, 0.1);
  color: var(--text-light);
}

/* Sub sections inside cards */
.ov-sub-section {
  margin-bottom: 12px;
}
.ov-sub-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--navy-mid);
  margin-bottom: 5px;
}

/* Mini stats */
.ov-mini-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ov-mini-num {
  font-family: "Roboto", sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}
.ov-num-navy {
  color: var(--navy);
}
.ov-num-red {
  color: #c0392b;
}
.ov-mini-label {
  font-size: 11px;
  color: var(--text-light);
}

/* Inner 2-col grid */
.ov-grid-inner-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Tag rows (label + small badge) */
.ov-tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(90, 96, 112, 0.08);
  font-size: 11px;
}
.ov-tag-label {
  color: var(--text);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ov-tag-count {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  flex-shrink: 0;
}
.ov-tag-green {
  background: rgba(26, 107, 60, 0.1);
  color: #1a6b3c;
}
.ov-tag-red {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
}
.ov-tag-blue {
  background: rgba(45, 106, 159, 0.1);
  color: #2d6a9f;
}

/* Recent activity */
.ov-activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 10px;
}
.ov-activity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.ov-activity-row:last-child {
  border-bottom: none;
}
.ov-activity-type {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}
.ov-type-idp {
  background: rgba(26, 77, 46, 0.1);
  color: var(--navy);
}
.ov-type-lna {
  background: rgba(45, 106, 159, 0.1);
  color: #2d6a9f;
}
.ov-activity-info {
  flex: 1;
  min-width: 0;
}
.ov-activity-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ov-activity-meta {
  font-size: 10px;
  color: var(--text-light);
  margin-top: 1px;
}
.ov-activity-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  flex-shrink: 0;
}
.ov-activity-date {
  font-size: 10px;
  color: var(--text-light);
}

/* Empty state */
.ov-empty-note {
  font-size: 12px;
  color: var(--text-light);
  padding: 10px 0;
  font-style: italic;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
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
/* ── Advanced Filter Panel ─────────────────────────────────────────── */
.btn-adv-filter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--white);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-adv-filter:hover {
  border-color: var(--navy);
  color: var(--navy);
}
.btn-adv-filter.active {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.btn-adv-filter.active svg {
  stroke: #fff;
}
.adv-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  background: var(--gold);
  color: var(--navy);
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  margin-left: 2px;
}
.btn-adv-filter.active .adv-badge {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.adv-filter-panel {
  background: #f7f6f1;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 14px 18px 12px;
  margin-bottom: 12px;
}
.adv-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}
.adv-filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  flex: 1;
}
.adv-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-light);
}
.adv-select {
  padding: 7px 10px;
  border: 1.5px solid var(--border);
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  color: var(--text);
  background: var(--white);
  outline: none;
  transition: border-color 0.2s;
  min-width: 0;
}
.adv-select:focus {
  border-color: var(--navy);
}

.adv-toggle-group {
  display: flex;
  gap: 4px;
}
.adv-toggle {
  padding: 6px 14px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  background: var(--white);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.adv-toggle:hover {
  border-color: var(--navy);
  color: var(--navy);
}
.adv-toggle.active {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.adv-toggle-red.active {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
}
.adv-toggle-green.active {
  background: #1a6b3c;
  border-color: #1a6b3c;
  color: #fff;
}

.btn-clear-adv {
  padding: 7px 14px;
  border: 1.5px dashed var(--border);
  border-radius: 7px;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  align-self: flex-end;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-clear-adv:hover {
  border-color: var(--error);
  color: var(--error);
}

.adv-who-count {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-light);
}
.adv-filter-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--navy-mid);
  margin-bottom: 8px;
  margin-top: 4px;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border);
}

.adv-who-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  font-family: "Roboto", sans-serif;
}

/* slide transition */
.adv-slide-enter-active,
.adv-slide-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
}
.adv-slide-enter-from,
.adv-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}
.adv-slide-enter-to,
.adv-slide-leave-from {
  opacity: 1;
  max-height: 300px;
}

/* ── LNA Section II: Competency Accordion ───────────────────────── */
.comp2-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 0;
  color: var(--text-light);
  font-size: 13px;
}
.comp2-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.comp2-toolbar-count {
  font-size: 11px;
  color: var(--text-light);
}
.comp2-expand-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: var(--navy);
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.comp2-expand-all-btn:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.comp2-expand-all-btn:hover svg {
  stroke: #fff;
}

/* List */
.comp2-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.comp2-item {
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}
.comp2-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.comp2-item-open {
  border-color: rgba(26, 77, 46, 0.3);
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08);
}

/* Header row */
.comp2-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  transition: background 0.1s;
}
.comp2-header:hover {
  background: var(--bg);
}
.comp2-item-open .comp2-header {
  background: rgba(26, 77, 46, 0.035);
  border-bottom: 1.5px solid var(--border);
}
.comp2-header-left {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  flex: 1;
}
.comp2-chevron {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  color: var(--text-light);
}
.comp2-chevron-open {
  transform: rotate(90deg);
}
.comp2-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.comp2-header-office {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.comp2-header-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.comp2-meta-year {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-light);
  background: var(--bg);
  border-radius: 4px;
  padding: 1px 6px;
}
.comp2-meta-count {
  font-size: 10px;
  color: var(--text-light);
}
.comp2-header-right {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex-shrink: 0;
}
.comp2-hpill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  padding: 2px 9px;
  white-space: nowrap;
}
.comp2-hpill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.comp2-hpill-warn {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
}
.comp2-hpill-warn .comp2-hpill-dot {
  background: #c0392b;
}
.comp2-hpill-ok {
  background: rgba(26, 107, 60, 0.09);
  color: #1a6b3c;
}
.comp2-hpill-ok .comp2-hpill-dot {
  background: #1a6b3c;
}
.comp2-hpill-none {
  background: var(--bg);
  color: var(--text-light);
  font-style: italic;
}

/* Slide transition */
.comp2-slide-enter-active,
.comp2-slide-leave-active {
  transition: all 0.22s ease;
  overflow: hidden;
}
.comp2-slide-enter-from,
.comp2-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.comp2-slide-enter-to,
.comp2-slide-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* Body */
.comp2-body {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.comp2-body-empty {
  padding: 14px 16px;
  font-size: 12px;
  color: var(--text-light);
  font-style: italic;
}

/* Cluster summary strip */
.comp2-cluster-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--border);
  background: rgba(26, 77, 46, 0.018);
}
.comp2-cs-card {
  flex: 1;
  min-width: 160px;
  max-width: 240px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 8px;
  padding: 9px 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.comp2-cs-flagged {
  border-color: #e8c4c4;
  background: #fff9f9;
}
.comp2-cs-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}
.comp2-cs-name {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--navy);
  background: rgba(26, 77, 46, 0.08);
  border-radius: 4px;
  padding: 2px 7px;
}
.comp2-cs-badge {
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  padding: 2px 8px;
  white-space: nowrap;
}
.comp2-cs-badge-warn {
  background: rgba(192, 57, 43, 0.1);
  color: #c0392b;
}
.comp2-cs-badge-ok {
  background: rgba(26, 107, 60, 0.1);
  color: #1a6b3c;
}
.comp2-cs-badge-none {
  background: var(--bg);
  color: var(--text-light);
}
.comp2-cs-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.comp2-cs-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.comp2-cs-lbl {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
  width: 54px;
}
.comp2-cs-strong .comp2-cs-lbl {
  color: #1a6b3c;
}
.comp2-cs-weak .comp2-cs-lbl {
  color: #c0392b;
}
.comp2-cs-val {
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.3;
}

/* Per-cluster competency block */
.comp2-cluster-block {
  border-bottom: 1px solid var(--border);
}
.comp2-cluster-block:last-child {
  border-bottom: none;
}
.comp2-cluster-block-title {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px 6px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--navy);
}
.comp2-cbt-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--navy);
  flex-shrink: 0;
}
.comp2-cbt-count {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-light);
  font-style: normal;
  text-transform: none;
  letter-spacing: 0;
}

/* Compact grid table */
.comp2-grid {
  width: 100%;
  font-size: 11.5px;
}
.comp2-grid-head {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.1fr;
  background: var(--bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.comp2-grid-row {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.1fr;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.comp2-grid-row:last-child {
  border-bottom: none;
}
.comp2-grid-row:hover {
  background: rgba(26, 77, 46, 0.025);
}
.comp2-row-alt {
  background: rgba(0, 0, 0, 0.012);
}
.comp2-row-alt:hover {
  background: rgba(26, 77, 46, 0.025);
}

.comp2-gh-name,
.comp2-gh-levels,
.comp2-gh-obs {
  padding: 6px 12px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-light);
}
.comp2-gh-levels {
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}

/* 5 level sub-columns inside the levels cell */
.comp2-gh-levels,
.comp2-gr-levels {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}
.comp2-gh-lvl {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-light);
  text-align: center;
  padding: 0 4px;
  border-right: 1px solid var(--border);
}
.comp2-gh-lvl:last-child {
  border-right: none;
}

.comp2-gr-name {
  padding: 7px 12px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  line-height: 1.35;
}
.comp2-gr-levels {
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
}
.comp2-gr-lvl {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 5px 4px;
  border-right: 1px solid var(--border);
}
.comp2-gr-lvl:last-child {
  border-right: none;
}
.comp2-gr-obs {
  padding: 7px 12px;
  font-size: 11px;
  font-style: italic;
  color: var(--text-light);
  line-height: 1.4;
  display: flex;
  align-items: center;
}

.comp2-val-cl {
  font-size: 10px;
  font-weight: 700;
  background: rgba(26, 77, 46, 0.1);
  color: var(--navy);
  border-radius: 4px;
  padding: 1px 5px;
  white-space: nowrap;
}
.comp2-val-pct {
  font-size: 10px;
  font-weight: 600;
  background: rgba(45, 106, 159, 0.1);
  color: #2d6a9f;
  border-radius: 4px;
  padding: 1px 5px;
  white-space: nowrap;
}
.comp2-val-nil {
  font-size: 14px;
  color: var(--border);
  line-height: 1;
}

@media (max-width: 860px) {
  .comp2-gh-levels,
  .comp2-gr-levels {
    grid-template-columns: repeat(3, 1fr);
  }
  .comp2-gh-lvl:nth-child(4),
  .comp2-gh-lvl:nth-child(5),
  .comp2-gr-lvl:nth-child(4),
  .comp2-gr-lvl:nth-child(5) {
    display: none;
  }
  .comp2-grid-head,
  .comp2-grid-row {
    grid-template-columns: 1.6fr 1fr 1fr;
  }
  .comp2-header {
    flex-wrap: wrap;
  }
}
@media (max-width: 580px) {
  .comp2-cs-card {
    min-width: 100%;
  }
  .comp2-grid-head,
  .comp2-grid-row {
    grid-template-columns: 1.4fr 1fr;
  }
  .comp2-gh-obs,
  .comp2-gr-obs {
    display: none;
  }
}
.btn-toggle-sup {
  padding: 4px 10px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-toggle-sup:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.btn-toggle-sup-revoke {
  background: rgba(26, 107, 60, 0.1);
  color: #1a6b3c;
  border-color: rgba(26, 107, 60, 0.3);
}
.btn-toggle-sup-revoke:hover {
  background: #c0392b;
  color: #fff;
  border-color: #c0392b;
}

.reg-action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.btn-reg-action {
  padding: 4px 10px;
  border: 1.5px solid var(--border);
  border-radius: 6px;
  background: none;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--navy);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-reg-action:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.btn-reg-revoke {
  color: #8a6c00;
  border-color: rgba(138, 108, 0, 0.3);
  background: rgba(255, 204, 0, 0.08);
}
.btn-reg-revoke:hover {
  background: #8a6c00;
  color: #fff;
  border-color: #8a6c00;
}
.btn-reg-remove {
  color: var(--error);
  border-color: rgba(192, 57, 43, 0.3);
  background: rgba(192, 57, 43, 0.05);
}
.btn-reg-remove:hover {
  background: var(--error);
  color: #fff;
  border-color: var(--error);
}

/* Confirm modal */
.confirm-modal {
  max-width: 420px;
}
.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn-confirm-cancel {
  padding: 9px 20px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.15s;
}
.btn-confirm-cancel:hover {
  border-color: var(--text-light);
  color: var(--text);
}
.btn-confirm-primary {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: var(--navy);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-confirm-primary:hover {
  background: var(--navy-mid);
}
.btn-confirm-danger {
  padding: 9px 20px;
  border: none;
  border-radius: 8px;
  background: var(--error);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-confirm-danger:hover {
  background: #a93226;
}

.reg-dropdown-wrap {
  position: relative;
  display: inline-block;
}
.reg-dropdown-up {
  top: auto;
  bottom: calc(100% + 6px);
}
.btn-reg-dots {
  width: 30px;
  height: 30px;
  border: 1.5px solid var(--border);
  border-radius: 7px;
  background: none;
  font-size: 16px;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: inherit;
  letter-spacing: 1px;
}
.btn-reg-dots:hover {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}
.reg-dropdown {
  position: fixed; /* was absolute */
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 170px;
  z-index: 1000;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.reg-dd-section {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--text-light);
  padding: 6px 8px 3px;
}
.reg-dd-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}
.reg-dd-item {
  width: 100%;
  text-align: left;
  padding: 7px 10px;
  border: none;
  border-radius: 6px;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: background 0.12s;
}
.reg-dd-item:hover {
  background: rgba(0, 51, 0, 0.06);
  color: var(--navy);
}
.reg-dd-warn {
  color: #8a6c00;
}
.reg-dd-warn:hover {
  background: rgba(255, 204, 0, 0.1);
  color: #8a6c00;
}
.reg-dd-danger {
  color: var(--error);
}
.reg-dd-danger:hover {
  background: rgba(192, 57, 43, 0.07);
  color: var(--error);
}

.reg-tbl {
  overflow-x: visible;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.reg-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.reg-toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}
.reg-search {
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  background: var(--white);
  outline: none;
  min-width: 220px;
  transition: border-color 0.2s;
}
.reg-search:focus {
  border-color: var(--navy);
}
.reg-filter {
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  color: var(--text);
  background: var(--white);
  outline: none;
  transition: border-color 0.2s;
}
.reg-filter:focus {
  border-color: var(--navy);
}
.reg-dtbl {
  border-radius: 0;   /* wrap handles it */
  border: none;
  box-shadow: none;
  border-collapse: collapse;
  width: 100%;
}
.reg-table-wrap {
  width: 100%;
  box-shadow: var(--shadow-sm);
  overflow: hidden; /* back to normal */
}
.reg-dtbl tbody tr {
  position: static;
}
.reg-dtbl thead {
  position: relative;
  z-index: 1;
}
</style>