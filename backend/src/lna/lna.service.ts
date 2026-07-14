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

    // Resolve the submitting user
    const user = data.userId
      ? await this.userRepo.findOne({ where: { id: data.userId } })
      : null;

    const record = this.repo.create({
      refId,
      userId: data.userId ?? null,
       submittedAt: new Date(),
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

    // ── Derive fields — prefer payload data, fall back to user relation ──
    const submitterEmail = data.submitterEmail ?? user?.email ?? '';
    const headOfUnit = data.headOfUnit ?? user?.headOfUnit ?? '';
    const office =
      data.office ?? user?.collegeOfficeUnit ?? user?.officeAffiliation ?? '';
    const raterName = user?.raterName ?? '';

    const submittedAt = new Date().toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      const pdfBuffer = await this.pdf.generateLnaPdf({
        ...saved,
        user,
      } as any);

      this.mail.sendLnaHrNotification({
        refId: saved.refId,
        office,
        headOfUnit,
        submitterEmail,
        submittedAt,
        pdfBuffer,
      });

      if (submitterEmail) {
        // Confirmation to the rater/supervisor who submitted the LNA
        this.mail.sendLnaSubmitterConfirmation({
          to: submitterEmail,
          headOfUnit,
          refId: saved.refId,
          office,
          submittedAt,
          pdfBuffer,
        });
      }
    } catch (err) {
      this.logger.error(`LNA post-save email/PDF failed: ${err.message}`);
    }

    return (
      (await this.repo.findOne({
        where: { refId: saved.refId },
        relations: ['user'],
      })) ?? saved
    );
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
