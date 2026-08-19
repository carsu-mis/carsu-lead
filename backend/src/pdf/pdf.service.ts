import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generateIdpPdf(idp: Record<string, any>): Promise<Buffer> {
    const html = this.buildHtml(idp);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '18mm', bottom: '18mm', left: '14mm', right: '14mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private safe(v: any): string {
    if (v === null || v === undefined || v === '') return '—';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private tableRows(rows: any[], cols: string[]): string {
    if (!rows || !rows.length) {
      return `<tr><td colspan="${cols.length}" style="text-align:center;color:#888;font-style:italic;padding:12px;">No entries provided.</td></tr>`;
    }
    return rows
      .map(
        (row, i) =>
          `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9f8f5'}">
        <td style="text-align:center;font-weight:600;color:#666;">${i + 1}</td>
        ${cols.map((c) => `<td>${this.safe(row[c])}</td>`).join('')}
      </tr>`,
      )
      .join('');
  }

  private buildHtml(idp: Record<string, any>): string {
    // ── ADD THIS: resolve user profile fields ──────────────────────────
    const u = idp.user ?? {};
    const campus = idp.campus || u.campus || '—';
    const officeAffiliation =
      idp.officeAffiliation || u.officeAffiliation || '—';
    const collegeOfficeUnit =
      idp.collegeOfficeUnit || u.collegeOfficeUnit || '—';
    const collegeProgram = idp.collegeProgram || u.collegeProgram || '';
    const currentPosition = idp.currentPosition || u.currentPosition || '—';
    const designation = idp.designation || u.designation || '—';
    const yearsInPosition = idp.yearsInPosition ?? u.yearsInPosition ?? '—';
    const yearsInCSU = idp.yearsInCSU ?? u.yearsInCSU ?? '—';
    const educAttainment = idp.educAttainment || u.educAttainment || '—';
    const educAttainmentSpec =
      idp.educAttainmentSpec || u.educAttainmentSpec || '';
    const employeeName = (
      idp.nameOfPersonnel ||
      [u.firstName, u.lastName].filter(Boolean).join(' ') ||
      [idp.firstName, idp.lastName].filter(Boolean).join(' ') ||
      '—'
    ).toUpperCase();
    // ───────────────────────────────────────────────────────────────────
    let competencyRows: any[] = [];
    let agapRows: any[] = [];
    let proactRows: any[] = [];
    let assessment: any = {};

    try {
      competencyRows = JSON.parse(idp.competencyRowsJson || '[]');
    } catch {}
    try {
      agapRows = JSON.parse(idp.agapRowsJson || '[]');
    } catch {}
    try {
      proactRows = JSON.parse(idp.proactRowsJson || '[]');
    } catch {}
    try {
      assessment = JSON.parse(idp.supervisorAssessment || '{}');
    } catch {}

    const completedAt = idp.supervisorSignedAt
      ? new Date(idp.supervisorSignedAt).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '—';

    const tdStyle =
      'border:1px solid #ccc;padding:8px 10px;font-size:12px;vertical-align:top;';
    const thStyle =
      'border:1px solid #1a5c1a;padding:8px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:#fff;background:#003300;text-align:left;';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a2e; line-height: 1.5; }
  h1 { font-size: 18px; color: #003300; }
  h2 { font-size: 14px; color: #003300; margin-bottom: 2px; }
  .header { text-align: center; padding-bottom: 14px; border-bottom: 3px solid #003300; margin-bottom: 20px; }
  .header p { color: #555; font-size: 12px; margin-top: 4px; }
  .ref-badge { display: inline-block; background: #003300; color: #ffcc00; font-family: monospace; font-size: 14px; font-weight: 700; padding: 5px 16px; border-radius: 6px; letter-spacing: 0.08em; margin-top: 8px; }
  .section { margin-bottom: 20px; break-inside: avoid; }
  .section-header { background: #003300; color: #fff; padding: 8px 14px; border-radius: 6px 6px 0 0; display: flex; align-items: center; gap: 10px; }
  .section-num { background: #ffcc00; color: #003300; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
  .section-header h2 { color: #fff; margin: 0; }
  .section-body { border: 1px solid #ccc; border-top: none; border-radius: 0 0 6px 6px; padding: 14px; }
  .ro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .ro-field { display: flex; flex-direction: column; gap: 2px; }
  .ro-field.span-2 { grid-column: span 2; }
  .ro-label { font-size: 10px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
  .ro-value { background: #f0ede8; border: 1px solid #ddd; border-radius: 4px; padding: 6px 10px; font-size: 12px; min-height: 28px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .ro-badge { display: inline-block; padding: 2px 7px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
  .cluster-core { background: #e8f4e8; color: #2d7a2d; }
  .cluster-leadership { background: #e8eef8; color: #1a4080; }
  .cluster-org { background: #f8f0e8; color: #8b5e1a; }
  .cluster-tech { background: #f0e8f8; color: #6b1a8b; }
  .assess-area { font-weight: 700; color: #1a5c1a; font-size: 12px; }
  .cert-block { background: rgba(255,204,0,0.08); border: 1.5px solid #ffcc00; border-radius: 6px; padding: 14px 18px; margin-top: 14px; }
  .cert-block p { font-size: 11px; color: #666; font-style: italic; margin-bottom: 12px; }
  .sup-name { font-weight: 700; color: #003300; font-size: 15px; padding: 8px 0; border-bottom: 2px solid #003300; display: inline-block; min-width: 260px; }
  .cert-block small { font-size: 10px; color: #888; display: block; margin-top: 4px; }
  .status-complete { display: inline-block; background: #e8f4e8; color: #2d7a2d; border: 1px solid #2d7a2d; border-radius: 20px; padding: 2px 12px; font-size: 11px; font-weight: 700; margin-left: 10px; }
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #ccc; text-align: center; font-size: 10px; color: #999; }
</style>
</head>
<body>

<div class="header">
  <h1>Individual Development Plan (IDP)</h1>
  <p>Caraga State University — Office of Human Resource Management Services</p>
  <p>Ampayon, Butuan City 8600, Philippines</p>
  <div class="ref-badge">${this.safe(idp.refId)}</div>
  <span class="status-complete">COMPLETE</span>
  <p style="margin-top:8px;font-size:11px;color:#555;">Completed: ${completedAt}</p>
</div>

<!-- SECTION H: Personnel Information -->
<div class="section">
  <div class="section-header">
    <span class="section-num">H</span>
    <h2>Personnel Information</h2>
  </div>
  <div class="section-body">
    <div class="ro-grid">
      <div class="ro-field"><div class="ro-label">Campus</div><div class="ro-value">${this.safe(campus)}</div></div>
<div class="ro-field"><div class="ro-label">Office Affiliation</div><div class="ro-value">${this.safe(officeAffiliation)}</div></div>
<div class="ro-field span-2"><div class="ro-label">College / Office / Unit</div><div class="ro-value">${this.safe(collegeOfficeUnit)}${collegeProgram ? ' — ' + this.safe(collegeProgram) : ''}</div></div>
<div class="ro-field span-2"><div class="ro-label">Name of Personnel</div><div class="ro-value">${this.safe(employeeName)}</div></div>
<div class="ro-field span-2"><div class="ro-label">Highest Educational Attainment</div><div class="ro-value">${this.safe(educAttainment)}${educAttainmentSpec ? ' — ' + this.safe(educAttainmentSpec) : ''}</div></div>
<div class="ro-field"><div class="ro-label">Current Position</div><div class="ro-value">${this.safe(currentPosition)}</div></div>
<div class="ro-field"><div class="ro-label">Designation</div><div class="ro-value">${this.safe(designation)}</div></div>
<div class="ro-field"><div class="ro-label">Years in Position</div><div class="ro-value">${this.safe(yearsInPosition)}</div></div>
<div class="ro-field"><div class="ro-label">Years in CSU</div><div class="ro-value">${this.safe(yearsInCSU)}</div></div>
    </div>
  </div>
</div>

<!-- SECTION I: Competency Assessment -->
<div class="section">
  <div class="section-header">
    <span class="section-num">I</span>
    <h2>Competency Assessment</h2>
  </div>
  <div class="section-body">
    <div style="margin-bottom:10px;">
      <span class="ro-label">Assessment Purpose: </span>
      <span style="font-size:12px;">${this.safe(idp.competencyPurpose)}</span>
    </div>
    <table>
      <thead><tr>
        <th style="${thStyle}width:30px">No.</th>
        <th style="${thStyle}">Target Competency</th>
        <th style="${thStyle}">Cluster</th>
        <th style="${thStyle}">Current Level</th>
        <th style="${thStyle}">Required Level</th>
        <th style="${thStyle}">LeaD Interventions</th>
        <th style="${thStyle}">Target Timeline</th>
      </tr></thead>
      <tbody>
        ${
          competencyRows
            .map(
              (row, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9f8f5'}">
            <td style="${tdStyle}text-align:center;font-weight:600;color:#666;">${i + 1}</td>
            <td style="${tdStyle}">${this.safe(row.targetCompetency)}</td>
            <td style="${tdStyle}"><span class="ro-badge cluster-${(row.competencyGroup || '').toLowerCase().replace('organizational', 'org')}">${this.safe(row.competencyGroup)}</span></td>
            <td style="${tdStyle}">${this.safe(row.currentLevel)}</td>
            <td style="${tdStyle}">${this.safe(row.requiredLevel)}</td>
            <td style="${tdStyle}">${this.safe(row.leadInterventions)}</td>
            <td style="${tdStyle}">${this.safe(row.targetTimeline)}</td>
          </tr>`,
            )
            .join('') ||
          `<tr><td colspan="7" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No entries.</td></tr>`
        }
      </tbody>
    </table>
  </div>
</div>

<!-- SECTION II: AGAP -->
<div class="section">
  <div class="section-header">
    <span class="section-num">II</span>
    <h2>Academic Growth and Advancement Program (AGAP)</h2>
  </div>
  <div class="section-body">
    <table>
      <thead><tr>
        <th style="${thStyle}width:30px">No.</th>
        <th style="${thStyle}">Degree Program</th>
        <th style="${thStyle}">Target HEI</th>
        <th style="${thStyle}">Mode of Study</th>
        <th style="${thStyle}">Target Scholarship Grant</th>
        <th style="${thStyle}">Intended Year of Enrollment</th>
      </tr></thead>
      <tbody>
        ${
          agapRows
            .map(
              (row, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9f8f5'}">
            <td style="${tdStyle}text-align:center;font-weight:600;color:#666;">${i + 1}</td>
            <td style="${tdStyle}">${this.safe(row.degreeProgram)}</td>
            <td style="${tdStyle}">${this.safe(row.targetHEI)}</td>
            <td style="${tdStyle}">${this.safe(row.modeOfStudy)}</td>
            <td style="${tdStyle}">${this.safe(row.scholarshipGrant)}</td>
            <td style="${tdStyle}">${this.safe(row.targetTimeline)}</td>
          </tr>`,
            )
            .join('') ||
          `<tr><td colspan="6" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No entries.</td></tr>`
        }
      </tbody>
    </table>
  </div>
</div>

<!-- SECTION III: Pro-ACT -->
<div class="section">
  <div class="section-header">
    <span class="section-num">III</span>
    <h2>Professional Advancement through Capacity-Building and Trainings (Pro-ACT)</h2>
  </div>
  <div class="section-body">
    <table>
      <thead><tr>
        <th style="${thStyle}width:30px">No.</th>
        <th style="${thStyle}">Target Competency / Skill</th>
        <th style="${thStyle}">Training / LeaD Intervention</th>
        <th style="${thStyle}">Mode of Activity</th>
        <th style="${thStyle}">Trainer / Provider</th>
        <th style="${thStyle}">Intended Year of Enrollment</th>
      </tr></thead>
      <tbody>
        ${
          proactRows
            .map(
              (row, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f9f8f5'}">
            <td style="${tdStyle}text-align:center;font-weight:600;color:#666;">${i + 1}</td>
            <td style="${tdStyle}font-weight:600;color:#1a5c1a;">${this.safe(row.targetSkill)}</td>
            <td style="${tdStyle}">${this.safe(row.trainingTitle)}</td>
            <td style="${tdStyle}">${this.safe(row.modeOfActivity)}</td>
            <td style="${tdStyle}">${this.safe(row.trainerProvider)}</td>
            <td style="${tdStyle}">${this.safe(row.targetTimeline)}</td>
          </tr>`,
            )
            .join('') ||
          `<tr><td colspan="6" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No entries.</td></tr>`
        }
      </tbody>
    </table>
  </div>
</div>

<!-- SECTION IV: Supervisor Assessment -->
<div class="section">
  <div class="section-header">
    <span class="section-num">IV</span>
    <h2>Supervisor's Assessment and Endorsement</h2>
  </div>
  <div class="section-body">
    <table>
      <thead><tr>
        <th style="${thStyle}width:160px">Assessment Area</th>
        <th style="${thStyle}">Response</th>
      </tr></thead>
      <tbody>
        <tr><td style="${tdStyle}" class="assess-area">1. Observed Performance Gaps</td>
          <td style="${tdStyle}"><strong>${this.safe(assessment.perfGapsYN)}</strong>${assessment.perfGapsSpec ? '<br><span style="color:#444;font-size:11px;"><em>Remarks:</em> ' + this.safe(assessment.perfGapsSpec) + '</span>' : ''}</td></tr>
        <tr style="background:#f9f8f5"><td style="${tdStyle}" class="assess-area">2. Readiness for Advancement</td>
          <td style="${tdStyle}"><strong>${this.safe(assessment.readinessYN)}</strong>${assessment.readinessRemarks ? '<br><em>' + this.safe(assessment.readinessRemarks) + '</em>' : ''}</td></tr>
        <tr><td style="${tdStyle}" class="assess-area">3. Recommended L&amp;D Interventions</td>
          <td style="${tdStyle}">${Array.isArray(assessment.interventions) ? assessment.interventions.map((v: string) => `<span style="display:inline-block;background:#e8f0e8;border:1px solid #2d7a2d;border-radius:4px;padding:2px 8px;font-size:11px;margin:2px;">${this.safe(v)}</span>`).join(' ') : this.safe(assessment.interventions)}</td></tr>
        <tr style="background:#f9f8f5"><td style="${tdStyle}" class="assess-area">4. Preferred Implementation Period</td>
          <td style="${tdStyle}">${this.safe(assessment.implYear)} — ${this.safe(assessment.implementationPeriod)}</td></tr>
        <tr><td style="${tdStyle}" class="assess-area">5. Additional Comments</td>
          <td style="${tdStyle}">${this.safe(assessment.additionalComments)}</td></tr>
      </tbody>
    </table>

    <div class="cert-block">
      <p>I hereby certify that I have reviewed and assessed the Individual Development Plan (IDP) of the concerned personnel and confirm that the proposed goals and interventions are aligned with their role, performance needs, and the strategic direction of the office.</p>
      <div class="sup-name">${this.safe(idp.supervisorName ? String(idp.supervisorName).toUpperCase() : '—')}</div>
      <small>Signature over Printed Name of Immediate Supervisor</small>
      <small style="margin-top:6px;">Date signed: ${completedAt}</small>
    </div>
  </div>
</div>

<div class="footer">
  <p>This document was automatically generated by the CarSU HRMS LeaD System.</p>
  <p>Caraga State University — Office of Human Resource Management Services | Ampayon, Butuan City 8600, Philippines</p>
</div>

</body>
</html>`;
  }

  async generateLnaPdf(lna: Record<string, any>): Promise<Buffer> {
    const html = this.buildLnaHtml(lna);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true, // wide tables need landscape to fit all columns
        printBackground: true,
        margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private buildLnaHtml(lna: Record<string, any>): string {
    const s = (v: any) => this.safe(v);

    // Office/personal fields — the Lna entity stores these directly on the
    // record now (see lna.entity.ts); no user relation to fall back to.
    const campus = lna.campus || '—';
    const officeAffiliation = lna.officeAffiliation || '—';
    const position = [lna.position, lna.designation].filter(Boolean).join(' / ') || '—';
    const submitterEmail = lna.submitterEmail || '—';

    const workforce = lna.workforceProfile ?? {};
    const core = lna.coreCompetencies ?? [];
    const leadership = lna.leadershipComps ?? [];
    const org = lna.orgComps ?? [];
    const technical = lna.technicalComps ?? [];
    const clusterSumRaw = lna.clusterSummaryRaw ?? {};
    const dataSources = lna.dataSourcesRaw ?? [];
    const insights = lna.dataSourceInsights ?? [];
    const officeName = lna.office || '';
    const certName = lna.headOfUnit || '';

    const submittedAt = lna.submittedAt
      ? new Date(lna.submittedAt).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '—';

    const thStyle =
      'border:1px solid #1a5c1a;padding:4px 6px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#fff;background:#003300;text-align:left;word-wrap:break-word;';
    const tdStyle =
      'border:1px solid #ccc;padding:4px 6px;font-size:10px;vertical-align:top;word-wrap:break-word;';
    const tdAlt =
      'border:1px solid #ccc;padding:4px 6px;font-size:10px;vertical-align:top;background:#f9f8f5;word-wrap:break-word;';

    // Workforce table rows
    const empTypes = [
      'Permanent',
      'Temporary',
      'Contractual',
      'Casual',
      'Coterminus',
      'COS',
      'Job Order',
      'Others',
    ];
    const empKeys = [
      'permanent',
      'temporary',
      'contractual',
      'casual',
      'coterminus',
      'cos',
      'jobOrder',
      'others',
    ];
    const posLevels = [
      { key: 'first', label: 'First Level Positions', header: '1st Level' },
      {
        key: 'secondNonSup',
        label: 'Second Level (Non-Supervisory)',
        header: '2nd (Non-Supervisory)',
      },
      {
        key: 'secondSup',
        label: 'Second Level (Supervisory)',
        header: '2nd (Supervisory)',
      },
      { key: 'third', label: 'Third Level Positions', header: '3rd Level' },
      { key: 'faculty', label: 'Faculty Positions', header: 'Faculty' },
    ];

    // ── KEY FILTER: keep only levels where at least one employment-type cell > 0 ──
    const activePosLevels = posLevels.filter((lv) => {
      const row =
        typeof workforce === 'object' ? (workforce[lv.key] ?? {}) : {};
      return empKeys.some((k) => Number(row[k] ?? 0) > 0);
    });

    // Workforce table rows — active levels only
    const wfRows = activePosLevels.length
      ? activePosLevels
          .map((lv, i) => {
            const row =
              typeof workforce === 'object' ? (workforce[lv.key] ?? {}) : {};
            const rowTotal = empKeys.reduce(
              (sum, k) => sum + Number(row[k] ?? 0),
              0,
            );
            const cells = empKeys
              .map(
                (k) =>
                  `<td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${s(row[k] ?? 0)}</td>`,
              )
              .join('');
            return `<tr>
              <td style="${i % 2 === 0 ? tdStyle : tdAlt}font-weight:600;">${lv.label}</td>
              ${cells}
              <td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;font-weight:700;color:#003300;">${rowTotal}</td>
            </tr>`;
          })
          .join('')
      : `<tr><td colspan="${empTypes.length + 2}" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No workforce data recorded.</td></tr>`;

    // Competency cluster renderer
    // activeLevels: array of { key, header } — only levels with non-zero workforce
    const renderCluster = (
      label: string,
      rows: any[],
      activeLevels: { key: string; header: string }[],
    ) => {
      if (!rows.length || !activeLevels.length) return '';

      const headerCells = activeLevels
        .flatMap(({ header: h }) => [
          `<th style="${thStyle}text-align:center;min-width:60px;">CL<br><small>${h}</small></th>`,
          `<th style="${thStyle}text-align:center;min-width:60px;">%<br><small>${h}</small></th>`,
        ])
        .join('');

      const bodyRows = rows
        .map((row, i) => {
          const dataCells = activeLevels
            .flatMap(({ key }) => [
              // Use the exact storage key: e.g. 'first_cl', 'secondNonSup_cl'
              `<td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${s(row[key + '_cl'] ?? '')}</td>`,
              `<td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${s(row[key + '_pct'] ?? '')}</td>`,
            ])
            .join('');
          return `<tr>
            <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(row.competency)}</td>
            ${dataCells}
            <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(row.observations)}</td>
          </tr>`;
        })
        .join('');

      const lvCount = activeLevels.length;
      const dataColWidth = Math.floor(58 / (lvCount * 2));
      const colgroup = `<colgroup>
        <col style="width:22%;">
        ${activeLevels.map(() => `<col style="width:${dataColWidth}%;"><col style="width:${dataColWidth}%;">`).join('')}
        <col style="width:14%;">
      </colgroup>`;
      const headerRow = `<th style="${thStyle}">Competency</th>${headerCells}<th style="${thStyle}">Observations</th>`;
      return `
        <h4 style="font-size:11px;color:#003300;margin:14px 0 5px;text-transform:uppercase;letter-spacing:0.05em;">${label}</h4>
        <div style="margin-bottom:10px;">
          <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
            ${colgroup}
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>`;
    };

    // Level headers derived from active levels only — matches workforce filter above
    const allLvHeaders = activePosLevels.map((lv) => lv.header);

    // Cluster summary — supports new per-level keyed shape { [levelKey]: rows[] }
    // and falls back gracefully to the old flat array shape for legacy records.
    const levelFormalLabel: Record<string, string> = {
      first: 'First Level Positions',
      secondNonSup: 'Second Level (Non-Supervisory) Positions',
      secondSup: 'Second Level (Supervisory) Positions',
      third: 'Third Level Positions',
      faculty: 'Faculty Positions',
    };

    const renderClusterSummaryRows = (rows: any[]): string =>
      rows.length
        ? rows
            .map(
              (c: any, i: number) =>
                `<tr>
                  <td style="${i % 2 === 0 ? tdStyle : tdAlt}font-weight:600;">${s(c.cluster)}</td>
                  <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(c.strongest)}</td>
                  <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(c.weakest)}</td>
                  <td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${s(c.interventionNeeded)}</td>
                </tr>`,
            )
            .join('')
        : `<tr><td colspan="4" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No data.</td></tr>`;

    const clusterSummaryHtml = (() => {
      // New shape: plain object keyed by level key
      if (
        !Array.isArray(clusterSumRaw) &&
        typeof clusterSumRaw === 'object' &&
        clusterSumRaw !== null
      ) {
        const levelKeys = Object.keys(clusterSumRaw);
        if (levelKeys.length === 0) {
          return `<p style="font-size:10px;color:#888;font-style:italic;">No cluster summary data.</p>`;
        }
        return levelKeys
          .map((k) => {
            const levelLabel = levelFormalLabel[k] ?? k;
            const rows: any[] = Array.isArray(clusterSumRaw[k])
              ? clusterSumRaw[k]
              : [];
            return `
              <div style="margin-bottom:14px;">
                <div style="background:#e8f0e8;border-left:3px solid #003300;padding:4px 10px;margin-bottom:6px;font-size:10px;font-weight:700;color:#003300;text-transform:uppercase;letter-spacing:0.04em;">
                  ${s(levelLabel)}
                </div>
                <p style="font-size:10px;color:#555;font-style:italic;margin-bottom:6px;">
                  Assess the competencies of <strong>${s(levelLabel)}</strong> employees within each cluster.
                </p>
                <table style="width:100%;border-collapse:collapse;">
                  <thead><tr>
                    <th style="${thStyle}">Cluster</th>
                    <th style="${thStyle}">Strongest</th>
                    <th style="${thStyle}">Weakest</th>
                    <th style="${thStyle}text-align:center;">Intervention Needed?</th>
                  </tr></thead>
                  <tbody>${renderClusterSummaryRows(rows)}</tbody>
                </table>
              </div>`;
          })
          .join('');
      }
      // Legacy shape: flat array (old submissions)
      const legacyRows = Array.isArray(clusterSumRaw) ? clusterSumRaw : [];
      return `
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr>
            <th style="${thStyle}">Cluster</th>
            <th style="${thStyle}">Strongest</th>
            <th style="${thStyle}">Weakest</th>
            <th style="${thStyle}text-align:center;">Intervention Needed?</th>
          </tr></thead>
          <tbody>${renderClusterSummaryRows(legacyRows)}</tbody>
        </table>`;
    })();

    // Data source insights
    const insightRowsHtml =
      Array.isArray(insights) && insights.length
        ? insights
            .map(
              (r: any, i: number) =>
                `<tr><td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${i + 1}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.dataSource)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.gap)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.personnel)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.interventions ?? r.intervention)}</td></tr>`,
            )
            .join('')
        : `<tr><td colspan="5" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No insights recorded.</td></tr>`;

    // Section IV — Pro-ACT (Professional Advancement through Capacity-
    // Building and Trainings). Field names match what the LNA form actually
    // submits (targetSkill/trainingTitle/modeOfActivity/trainerProvider/
    // targetTimeline) — NOT the older leadInterventions shape, which this
    // table used to (incorrectly) reference.
    const proactRows = lna.proactRows ?? [];
    const proactRowsHtml =
      Array.isArray(proactRows) && proactRows.length
        ? proactRows
            .map((r: any, i: number) => {
              const trainingTitle =
                r.trainingTitle === '__others__'
                  ? r.trainingTitleOther
                  : r.trainingTitle;
              return `<tr><td style="${i % 2 === 0 ? tdStyle : tdAlt}text-align:center;">${i + 1}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.targetSkill)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(trainingTitle)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.modeOfActivity)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.trainerProvider)}</td>
           <td style="${i % 2 === 0 ? tdStyle : tdAlt}">${s(r.targetTimeline)}</td></tr>`;
            })
            .join('')
        : `<tr><td colspan="6" style="${tdStyle}text-align:center;color:#888;font-style:italic;">No Pro-ACT entries recorded.</td></tr>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a2e; line-height: 1.5; }
  h1 { font-size: 17px; color: #003300; }
  .header { text-align: center; padding-bottom: 14px; border-bottom: 3px solid #003300; margin-bottom: 20px; }
  .header p { color: #555; font-size: 11px; margin-top: 4px; }
  .ref-badge { display: inline-block; background: #003300; color: #ffcc00; font-family: monospace; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 6px; letter-spacing: 0.08em; margin-top: 8px; }
  .section { margin-bottom: 18px; break-inside: avoid; }
  .section-header { background: #003300; color: #fff; padding: 7px 12px; border-radius: 6px 6px 0 0; display: flex; align-items: center; gap: 8px; }
  .section-num { background: #ffcc00; color: #003300; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 10px; flex-shrink: 0; }
  .section-header h2 { color: #fff; margin: 0; font-size: 13px; }
  .section-body { border: 1px solid #ccc; border-top: none; border-radius: 0 0 6px 6px; padding: 12px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-field { display: flex; flex-direction: column; gap: 2px; }
  .info-field.span-2 { grid-column: span 2; }
  .info-label { font-size: 9px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
  .info-value { background: #f0ede8; border: 1px solid #ddd; border-radius: 4px; padding: 5px 8px; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; }
  .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center; font-size: 10px; color: #999; }
</style>
</head>
<body>

<div class="header">
  <h1>USWAG Plan — Learning Needs Assessment (LNA)</h1>
  <p>Caraga State University — Office of Human Resource Management Services</p>
  <p>Ampayon, Butuan City 8600, Philippines</p>
  <div class="ref-badge">${s(lna.refId)}</div>
  <p style="margin-top:8px;font-size:10px;color:#555;">Submitted: ${submittedAt}</p>
</div>

<!-- SECTION H: Office Information -->
<div class="section">
  <div class="section-header"><span class="section-num">H</span><h2>Office Information</h2></div>
  <div class="section-body">
    <div class="info-grid">
      <div class="info-field"><div class="info-label">Submitter Email</div><div class="info-value">${s(submitterEmail)}</div></div>
      <div class="info-field"><div class="info-label">Campus</div><div class="info-value">${s(campus)}</div></div>
      <div class="info-field span-2"><div class="info-label">Office Affiliation</div><div class="info-value">${s(officeAffiliation)}</div></div>
      <div class="info-field span-2"><div class="info-label">Office / Unit / College</div><div class="info-value">${s(officeName)}</div></div>
      <div class="info-field"><div class="info-label">Head of Unit</div><div class="info-value">${s(certName)}</div></div>
      <div class="info-field"><div class="info-label">Position / Designation</div><div class="info-value">${s(position)}</div></div>
      <div class="info-field"><div class="info-label">Year Covered</div><div class="info-value">${s(lna.yearCovered)}</div></div>
      <div class="info-field"><div class="info-label">Total Personnel in Your Office</div><div class="info-value">${s(lna.totalPersonnel)}</div></div>
      <div class="info-field span-2"><div class="info-label">Purpose</div><div class="info-value">${s(lna.purpose)}</div></div>
    </div>
  </div>
</div>

<!-- SECTION I: Workforce Profile -->
<div class="section">
  <div class="section-header"><span class="section-num">I</span><h2>Workforce Profile by Employment Classification and Position Level</h2></div>
  <div class="section-body">
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
      <colgroup>
        <col style="width:17%;">
        ${empTypes.map(() => '<col style="width:9%;">').join('')}
        <col style="width:7%;">
      </colgroup>
      <thead>
        <tr>
          <th style="${thStyle}">Position Level</th>
          ${empTypes.map((t) => `<th style="${thStyle}text-align:center;">${t}</th>`).join('')}
          <th style="${thStyle}text-align:center;">Total</th>
        </tr>
      </thead>
      <tbody>${wfRows}</tbody>
    </table>
  </div>
</div>

<!-- SECTION II: Competency Mapping -->
<div class="section">
  <div class="section-header"><span class="section-num">II</span><h2>Competency Mapping and Assessment</h2></div>
  <div class="section-body">
    ${renderCluster('Core Competencies', Array.isArray(core) ? core : [], activePosLevels)}
    ${renderCluster('Leadership Competencies', Array.isArray(leadership) ? leadership : [], activePosLevels)}
    ${renderCluster('Organizational Competencies', Array.isArray(org) ? org : [], activePosLevels)}
    ${renderCluster('Technical Competencies', Array.isArray(technical) ? technical : [], activePosLevels)}
    <h4 style="font-size:12px;color:#003300;margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Competency Cluster Summary</h4>
    ${clusterSummaryHtml}
  </div>
</div>

<!-- SECTION III: Data Sources & Insights -->
<div class="section">
  <div class="section-header"><span class="section-num">III</span><h2>Other LeaD Data Sources &amp; Insights</h2></div>
  <div class="section-body">
    <table>
      <thead><tr>
        <th style="${thStyle}width:30px;">No.</th>
        <th style="${thStyle}">Data Source</th>
        <th style="${thStyle}">Identified Gap / Issue</th>
        <th style="${thStyle}">Relevant Personnel</th>
        <th style="${thStyle}">Recommended Intervention</th>
      </tr></thead>
      <tbody>${insightRowsHtml}</tbody>
    </table>
  </div>
</div>

<!-- SECTION IV: Pro-ACT -->
<div class="section">
  <div class="section-header"><span class="section-num">IV</span><h2>Professional Advancement through Capacity-Building and Trainings (Pro-ACT)</h2></div>
  <div class="section-body">
    <table>
      <thead><tr>
        <th style="${thStyle}width:30px;">No.</th>
        <th style="${thStyle}">Target Skill / Competency Gap</th>
        <th style="${thStyle}">Training / Intervention Title</th>
        <th style="${thStyle}">Mode of Activity</th>
        <th style="${thStyle}">Trainer / Provider</th>
        <th style="${thStyle}">Target Timeline</th>
      </tr></thead>
      <tbody>${proactRowsHtml}</tbody>
    </table>
  </div>
</div>

<!-- Certification -->
<div class="section">
  <div class="section-header"><h2>Certification</h2></div>
  <div class="section-body">
    <p style="font-size:11px;color:#666;font-style:italic;margin-bottom:14px;">
      I hereby certify that the information provided in this Learning Needs Assessment is accurate and based on actual observation, data, and evidence gathered from the office.
    </p>
    <div style="display:inline-block;padding:8px 0;border-bottom:2px solid #003300;min-width:260px;font-weight:700;font-size:14px;color:#003300;">
      ${s(certName)}
    </div>
    <small style="display:block;font-size:10px;color:#888;margin-top:4px;">Signature over Printed Name of Rater/Head of Office</small>
  </div>
</div>

<div class="footer">
  <p>This document was automatically generated by the CarSU HRMS LeaD System.</p>
  <p>Caraga State University — Office of Human Resource Management Services | Ampayon, Butuan City 8600, Philippines</p>
</div>

</body>
</html>`;
  }
}