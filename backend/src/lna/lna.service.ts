import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Lna } from './lna.entity';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class LnaService {
  private readonly logger = new Logger(LnaService.name);

  constructor(
    @InjectRepository(Lna) private repo: Repository<Lna>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly mail: MailService,
    private readonly pdf: PdfService,
    private readonly dataSource: DataSource,
  ) {}

  // ── RefId generation ─────────────────────────────────────────────────────

  private async generateRefId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `LNA-${year}-`;

    const last = await this.repo
      .createQueryBuilder('lna')
      .where('lna."refId" LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('lna."refId"', 'DESC')
      .getOne();

    let nextNum = 1;
    if (last) {
      const parts = last.refId.split('-');
      const lastNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    return `${prefix}${String(nextNum).padStart(4, '0')}`;
  }

  // ── Create ───────────────────────────────────────────────────────────────

  async create(data: Record<string, any>): Promise<Lna> {
    const refId = await this.generateRefId();

    // Login/profiles have been removed — there's no logged-in user to
    // resolve anymore. Every office/personnel field is taken directly
    // from what the Head of Unit typed into the form.
    const record = this.repo.create({
      refId,
      userId: data.userId ?? null,
      submittedAt: new Date(),
      submitterEmail: data.submitterEmail ?? '',
      campus: data.campus ?? '',
      officeAffiliation: data.officeAffiliation ?? '',
      office: data.office ?? '',
      collegeProgram: data.collegeProgram ?? '',
      headOfUnit: data.headOfUnit ?? '',
      position: data.position ?? '',
      designation: data.designation ?? '',
      datePrepared: data.datePrepared ?? null,
      yearCovered: data.yearCovered ?? null,
      totalPersonnel: data.totalPersonnel ?? null,
      purpose: data.purpose ?? null,
      workforceProfile: data.workforceProfile ?? null,
      coreCompetencies: data.coreCompetencies ?? null,
      leadershipComps: data.leadershipComps ?? null,
      orgComps: data.orgComps ?? null,
      technicalComps: data.technicalComps ?? null,
      clusterSummaryRaw: data.clusterSummaryRaw ?? null,
      dataSourcesRaw: data.dataSourcesRaw ?? null,
      dataSourceInsights: data.dataSourceInsights ?? null,
      leadInterventions: data.leadInterventions ?? null,
    });

    const saved = await this.repo.save(record);

    const submitterEmail = saved.submitterEmail ?? '';
    const headOfUnit = saved.headOfUnit ?? '';
    const office = saved.office ?? '';

    const submittedAt = new Date().toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      const pdfBuffer = await this.pdf.generateLnaPdf({ ...saved } as any);

      await this.mail.sendLnaHrNotification({
        refId: saved.refId,
        office,
        headOfUnit,
        submitterEmail,
        submittedAt,
        pdfBuffer,
      });

      if (submitterEmail) {
        // Confirmation to the rater/Head of Unit who submitted the LNA
        await this.mail.sendLnaSubmitterConfirmation({
          to: submitterEmail,
          headOfUnit,
          refId: saved.refId,
          office,
          submittedAt,
          pdfBuffer,
        });
      } else {
        this.logger.warn(
          `LNA ${saved.refId}: no submitterEmail on record — confirmation email skipped.`,
        );
      }
    } catch (err) {
      this.logger.error(`LNA post-save email/PDF failed: ${err.message}`);
    }

    return saved;
  }

  // ── Read ─────────────────────────────────────────────────────────────────

  findAll(): Promise<Lna[]> {
    return this.repo.find({
      order: { submittedAt: 'DESC' },
      relations: ['user'],
    });
  }

  async generatePdf(refId: string): Promise<Buffer | null> {
    const record = await this.repo.findOne({
      where: { refId },
      relations: ['user'],
    });
    if (!record) return null;
    try {
      return await this.pdf.generateLnaPdf({ ...record } as any);
    } catch (err) {
      this.logger.error(`PDF generation failed for ${refId}: ${err.message}`);
      return null;
    }
  }
}