import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailer: MailerService) {}

  // ── Sent to the employee after Stage 1 submission ─────────────────────────
  async sendEmployeeConfirmation(opts: {
    to: string;
    name: string;
    refId: string;
    supervisorName: string;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] IDP Submitted — Reference ID: ${opts.refId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">Learning &amp; Development — IDP Submission</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.name}</strong>,</p>
              <p>Your Individual Development Plan (IDP) has been successfully submitted and is now awaiting review by your supervisor.</p>

              <div style="background:#f5f5f5;border-left:4px solid #003300;padding:16px 20px;border-radius:4px;margin:20px 0;">
                <p style="margin:0 0 8px;font-size:13px;color:#666;">REFERENCE ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:#003300;">${opts.refId}</p>
              </div>

              <p>Your supervisor (<strong>${opts.supervisorName}</strong>) has been notified and will receive a separate email to review your submission.</p>
              <p>Please keep your Reference ID for your records. You may need it for follow-up.</p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Confirmation email sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send confirmation to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to the employee after supervisor completes Stage 2 ──────────────
  async sendEmployeeCompletion(opts: {
    to: string;
    name: string;
    refId: string;
    supervisorName: string;
    pdfBuffer?: Buffer;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] Your IDP has been reviewed — ${opts.refId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">IDP Review Complete</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.name}</strong>,</p>
              <p>Your Individual Development Plan (IDP) has been reviewed and endorsed by your supervisor, <strong>${opts.supervisorName}</strong>. Your IDP is now complete and has been forwarded to the Office of Human Resource Management Services.</p>
              <div style="background:#f5f5f5;border-left:4px solid #003300;padding:16px 20px;border-radius:4px;margin:20px 0;">
                <p style="margin:0 0 8px;font-size:13px;color:#666;">REFERENCE ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:#003300;">${opts.refId}</p>
              </div>
              <p>Your completed IDP is attached to this email as a PDF. Please keep a copy for your records.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
        ...(opts.pdfBuffer
          ? {
              attachments: [
                {
                  filename: `IDP_${opts.refId}_${opts.name.replace(/\s+/g, '_')}.pdf`,
                  content: opts.pdfBuffer,
                  contentType: 'application/pdf',
                },
              ],
            }
          : {}),
      });
      this.logger.log(`Completion email sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send completion email to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to HR after IDP is fully complete (with PDF attachment) ─────────
  async sendHrNotification(opts: {
    employeeName: string;
    refId: string;
    position: string;
    officeUnit: string;
    supervisorName: string;
    completedAt: string;
    pdfBuffer: Buffer;
  }) {
    const hrEmail = process.env.HR_EMAIL ?? 'hrmslandd@carsu.edu.ph';
    try {
      await this.mailer.sendMail({
        to: hrEmail,
        subject: `[CarSU LeaD] IDP Complete — ${opts.employeeName} (${opts.refId})`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">IDP Fully Completed — HR Copy</p>
            </div>
            <div style="padding:28px 32px;">
              <p>This is to notify you that the following Individual Development Plan has been completed by both the employee and their immediate supervisor.</p>
              <div style="background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:20px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#666;width:40%;">Reference ID</td><td style="padding:6px 0;font-weight:bold;letter-spacing:1px;">${opts.refId}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Employee</td><td style="padding:6px 0;font-weight:bold;">${opts.employeeName}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Position</td><td style="padding:6px 0;">${opts.position}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Office / Unit</td><td style="padding:6px 0;">${opts.officeUnit}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Immediate Supervisor</td><td style="padding:6px 0;">${opts.supervisorName}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Completed On</td><td style="padding:6px 0;">${opts.completedAt}</td></tr>
                </table>
              </div>
              <p>The complete IDP document — including the supervisor's assessment and endorsement — is attached as a PDF to this email.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `IDP_${opts.refId}_${opts.employeeName.replace(/\s+/g, '_')}.pdf`,
            content: opts.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(`HR notification with PDF sent to ${hrEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send HR notification: ${err.message}`);
    }
  }

  // ── Sent to the supervisor after Stage 1 submission ───────────────────────
  async sendSupervisorNotification(opts: {
    to: string;
    supervisorName: string;
    employeeName: string;
    refId: string;
    position: string;
    officeUnit: string;
    reviewUrl: string;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] Action Required — IDP Review for ${opts.employeeName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">Learning &amp; Development — Supervisor Action Required</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.supervisorName}</strong>,</p>
              <p>An Individual Development Plan (IDP) has been submitted for your review.</p>

              <div style="background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:20px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#666;width:40%;">Employee</td>
                    <td style="padding:6px 0;font-weight:bold;">${opts.employeeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Position</td>
                    <td style="padding:6px 0;">${opts.position}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Office / Unit</td>
                    <td style="padding:6px 0;">${opts.officeUnit}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Reference ID</td>
                    <td style="padding:6px 0;font-weight:bold;letter-spacing:1px;">${opts.refId}</td>
                  </tr>
                </table>
              </div>

              <p>Please use the reference ID or visit the link below to review and sign off on the IDP:</p>

              <div style="text-align:center;margin:24px 0;">
                <a href="${opts.reviewUrl}"
                   style="background:#003300;color:#ffcc00;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                  Review IDP
                </a>
              </div>

              <p style="font-size:13px;color:#666;">Or copy this link into your browser:<br>
                <a href="${opts.reviewUrl}" style="color:#003300;">${opts.reviewUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Supervisor notification sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send supervisor email to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to the employee after they edit/resubmit their IDP ─────────────
  async sendEmployeeEditConfirmation(opts: {
    to: string;
    name: string;
    refId: string;
    supervisorName: string;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] IDP Updated — Reference ID: ${opts.refId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">Learning &amp; Development — IDP Updated</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.name}</strong>,</p>
              <p>Your Individual Development Plan (IDP) has been successfully updated and resubmitted for review by your supervisor.</p>

              <div style="background:#f5f5f5;border-left:4px solid #003300;padding:16px 20px;border-radius:4px;margin:20px 0;">
                <p style="margin:0 0 8px;font-size:13px;color:#666;">REFERENCE ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:#003300;">${opts.refId}</p>
              </div>

              <p>Your supervisor (<strong>${opts.supervisorName}</strong>) has been notified of the update and will receive a separate email to re-review your submission.</p>
              <p>Please keep your Reference ID for your records.</p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Edit confirmation email sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send edit confirmation to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to the supervisor when an IDP is edited and resubmitted ──────────
  async sendSupervisorRenotification(opts: {
    to: string;
    supervisorName: string;
    employeeName: string;
    refId: string;
    position: string;
    officeUnit: string;
    reviewUrl: string;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] IDP Updated — Re-review Required for ${opts.employeeName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">Learning &amp; Development — Supervisor Re-review Required</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.supervisorName}</strong>,</p>
              <p>An Individual Development Plan (IDP) you previously reviewed has been updated and requires your re-review.</p>

              <div style="background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:20px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#666;width:40%;">Employee</td>
                    <td style="padding:6px 0;font-weight:bold;">${opts.employeeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Position</td>
                    <td style="padding:6px 0;">${opts.position}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Office / Unit</td>
                    <td style="padding:6px 0;">${opts.officeUnit}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#666;">Reference ID</td>
                    <td style="padding:6px 0;font-weight:bold;letter-spacing:1px;">${opts.refId}</td>
                  </tr>
                </table>
              </div>

              <p>Please use the reference ID or visit the link below to re-review the updated IDP:</p>

              <div style="text-align:center;margin:24px 0;">
                <a href="${opts.reviewUrl}"
                   style="background:#003300;color:#ffcc00;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                  Review Updated IDP
                </a>
              </div>

              <p style="font-size:13px;color:#666;">Or copy this link into your browser:<br>
                <a href="${opts.reviewUrl}" style="color:#003300;">${opts.reviewUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Supervisor re-notification sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send supervisor re-notification to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to HR after LNA submission (with PDF attachment) ────────────────
  async sendLnaHrNotification(opts: {
    refId: string;
    office: string;
    headOfUnit: string;
    submitterEmail: string;
    submittedAt: string;
    pdfBuffer: Buffer;
  }) {
    const hrEmail = process.env.HR_EMAIL ?? 'hrmslandd@carsu.edu.ph';
    try {
      await this.mailer.sendMail({
        to: hrEmail,
        subject: `[CarSU LeaD] LNA Submitted — ${opts.office} (${opts.refId})`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">USWAG Plan (LNA) Submitted — HR Copy</p>
            </div>
            <div style="padding:28px 32px;">
              <p>A Learning Needs Assessment has been submitted and is ready for processing.</p>
              <div style="background:#f5f5f5;border-radius:6px;padding:16px 20px;margin:20px 0;">
                <table style="width:100%;font-size:14px;border-collapse:collapse;">
                  <tr><td style="padding:6px 0;color:#666;width:40%;">Reference ID</td><td style="padding:6px 0;font-weight:bold;letter-spacing:1px;">${opts.refId}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Office / Unit</td><td style="padding:6px 0;font-weight:bold;">${opts.office}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Head of Unit</td><td style="padding:6px 0;">${opts.headOfUnit}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Submitted By</td><td style="padding:6px 0;">${opts.submitterEmail}</td></tr>
                  <tr><td style="padding:6px 0;color:#666;">Submitted On</td><td style="padding:6px 0;">${opts.submittedAt}</td></tr>
                </table>
              </div>
              <p>The complete LNA document is attached as a PDF to this email.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `LNA_${opts.refId}_${opts.office.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            content: opts.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(`LNA HR notification with PDF sent to ${hrEmail}`);
    } catch (err) {
      this.logger.error(`Failed to send LNA HR notification: ${err.message}`);
    }
  }

  // ── Sent to the head of office/submitter after LNA submission ─────────────
  async sendLnaSubmitterConfirmation(opts: {
    to: string;
    headOfUnit: string;
    refId: string;
    office: string;
    submittedAt: string;
    pdfBuffer: Buffer;
  }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] LNA Submitted — Reference ID: ${opts.refId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">USWAG Plan (LNA) Submission Confirmation</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.headOfUnit}</strong>,</p>
              <p>The Learning Needs Assessment (USWAG Plan) for your office has been successfully submitted. HRMS has been notified and will process your submission accordingly.</p>
              <div style="background:#f5f5f5;border-left:4px solid #003300;padding:16px 20px;border-radius:4px;margin:20px 0;">
                <p style="margin:0 0 8px;font-size:13px;color:#666;">REFERENCE ID</p>
                <p style="margin:0;font-size:22px;font-weight:bold;letter-spacing:2px;color:#003300;">${opts.refId}</p>
              </div>
              <p style="font-size:14px;color:#444;">
                <strong>Office / Unit:</strong> ${opts.office}<br>
                <strong>Submitted On:</strong> ${opts.submittedAt}
              </p>
              <p>A copy of your submitted LNA is attached to this email as a PDF. Please keep it for your records.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `LNA_${opts.refId}_${opts.office.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            content: opts.pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });
      this.logger.log(`LNA confirmation with PDF sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send LNA confirmation to ${opts.to}: ${err.message}`,
      );
    }
  }

  // ── Sent to a user who requested a password reset ─────────────────────────
  async sendPasswordReset(opts: { to: string; name: string; resetUrl: string }) {
    try {
      await this.mailer.sendMail({
        to: opts.to,
        subject: `[CarSU LeaD] Reset your password`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#003300;padding:24px 32px;">
              <h2 style="color:#ffcc00;margin:0;">CarSU LeaD System</h2>
              <p style="color:#cce6cc;margin:4px 0 0;">Password Reset Request</p>
            </div>
            <div style="padding:28px 32px;">
              <p>Dear <strong>${opts.name}</strong>,</p>
              <p>We received a request to reset the password for your CarSU LeaD account. Click the button below to choose a new password. This link will expire in 30 minutes.</p>

              <div style="text-align:center;margin:24px 0;">
                <a href="${opts.resetUrl}"
                   style="background:#003300;color:#ffcc00;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                  Reset Password
                </a>
              </div>

              <p style="font-size:13px;color:#666;">Or copy this link into your browser:<br>
                <a href="${opts.resetUrl}" style="color:#003300;">${opts.resetUrl}</a>
              </p>

              <p style="font-size:13px;color:#666;">If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>

              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
              <p style="font-size:12px;color:#999;">This is an automated message from the CarSU HRMS LeaD System. Please do not reply to this email.</p>
              <p style="font-size:12px;color:#999;">Caraga State University — Office of Human Resource Management Services</p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Password reset email sent to ${opts.to}`);
    } catch (err) {
      this.logger.error(
        `Failed to send password reset email to ${opts.to}: ${err.message}`,
      );
    }
  }
}
