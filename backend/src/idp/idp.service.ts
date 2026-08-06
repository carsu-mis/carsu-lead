import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Idp } from './idp.entity';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { PdfService } from '../pdf/pdf.service';
import { IdpSuggestion } from './idp-suggestion.entity';

type EditCheckResult = Idp | 'not_found' | 'wrong_email' | 'locked';

@Injectable()
export class IdpService {
  constructor(
    @InjectRepository(Idp) private repo: Repository<Idp>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(IdpSuggestion)
    private suggestionRepo: Repository<IdpSuggestion>,
    private readonly mail: MailService,
    private readonly pdf: PdfService,
    private readonly dataSource: DataSource,
  ) {}

  // ── Shared autocomplete suggestions ─────────────────────────────────────

  async getSuggestions(fieldName: string): Promise<string[]> {
    const rows = await this.suggestionRepo.find({
      where: { fieldName },
      order: { usedCount: 'DESC' },
      take: 30,
    });
    return rows.map((r) => r.value);
  }

  async saveSuggestion(fieldName: string, value: string): Promise<void> {
    const trimmed = value.trim();
    if (!trimmed) return;

    const existing = await this.suggestionRepo.findOne({
      where: { fieldName, value: trimmed },
    });

    if (existing) {
      existing.usedCount += 1;
      await this.suggestionRepo.save(existing);
    } else {
      await this.suggestionRepo.save(
        this.suggestionRepo.create({ fieldName, value: trimmed }),
      );
    }
  }

  // ── RefId generation ─────────────────────────────────────────────────────

  private async generateRefId(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `IDP-${year}-`;

    const last = await this.repo
      .createQueryBuilder('idp')
      .where('idp."refId" LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('idp."refId"', 'DESC')
      .getOne();

    let nextNum = 1;
    if (last) {
      const parts = last.refId.split('-');
      const lastNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    return `${prefix}${String(nextNum).padStart(6, '0')}`;
  }

  // ── Helper: resolve user and derive display name ─────────────────────────

  private async resolveUser(userId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }

  private getEmployeeName(user: User): string {
    return (
      [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
    );
  }

  // ── Create ───────────────────────────────────────────────────────────────

  async create(data: Record<string, any>): Promise<Idp> {
    const refId = await this.generateRefId();
    const supervisorToken = uuidv4();

    // Login/profiles have been removed — there's no logged-in user to
    // resolve anymore. userId stays null; every personnel/office field is
    // taken directly from what the employee typed into the form.
    const record = this.repo.create({
      refId,
      supervisorToken,
      status: 'PENDING',
      userId: data.userId ?? null,
      employeeEmail: data.employeeEmail ?? '',
      campus: data.campus ?? '',
      officeAffiliation: data.officeAffiliation ?? '',
      collegeOfficeUnit: data.collegeOfficeUnit ?? '',
      collegeProgram: data.collegeProgram ?? '',
      nameOfPersonnel: data.nameOfPersonnel ?? '',
      lastName: data.lastName ?? '',
      firstName: data.firstName ?? '',
      middleInitial: data.middleInitial ?? '',
      educAttainment: data.educAttainment ?? '',
      educAttainmentSpec: data.educAttainmentSpec ?? '',
      currentPosition: data.currentPosition ?? '',
      designation: data.designation ?? '',
      yearsInPosition: data.yearsInPosition ?? null,
      yearsInCSU: data.yearsInCSU ?? null,
      supervisorName: data.supervisorName ?? '',
      supervisorEmail: data.supervisorEmail ?? '',
      headerPurpose: data.headerPurpose ?? '',
      competencyPurpose: data.competencyPurpose ?? '',
      competencyRowsJson: JSON.stringify(data.competencyRows ?? []),
      agapRowsJson: JSON.stringify(data.agapRows ?? []),
      proactRowsJson: JSON.stringify(data.proactRows ?? []),
    });

    const saved = await this.repo.save(record);

    const employeeName =
      saved.nameOfPersonnel ||
      [saved.firstName, saved.lastName].filter(Boolean).join(' ');
    const employeeEmail = saved.employeeEmail ?? '';
    const frontendBase = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const reviewUrl = `${frontendBase}/idp-supervisor?token=${saved.supervisorToken}`;

    if (employeeEmail) {
      this.mail.sendEmployeeConfirmation({
        to: employeeEmail,
        name: employeeName,
        refId: saved.refId,
        supervisorName: saved.supervisorName,
      });
    }

    if (saved.supervisorEmail) {
      this.mail.sendSupervisorNotification({
        to: saved.supervisorEmail,
        supervisorName: saved.supervisorName,
        employeeName: saved.nameOfPersonnel ?? employeeName,
        refId: saved.refId,
        position: saved.currentPosition ?? '',
        officeUnit: saved.collegeOfficeUnit ?? '',
        reviewUrl,
      });

      await this.repo.update(
        { refId: saved.refId },
        {
          supervisorNotifiedAt: new Date().toISOString(),
          status: 'SUPERVISOR_NOTIFIED',
        },
      );
    }

    return (
      (await this.repo.findOne({
        where: { refId: saved.refId },
        relations: ['user'],
      })) ?? saved
    );
  }

  // ── Read ─────────────────────────────────────────────────────────────────

  findAll(): Promise<Idp[]> {
    return this.repo.find({
      order: { submittedAt: 'DESC' },
      relations: ['user'],
    });
  }

  findByRef(refId: string): Promise<Idp | null> {
    return this.repo.findOne({
      where: { refId },
      relations: ['user'],
    });
  }

  findByToken(token: string): Promise<Idp | null> {
    return this.repo.findOne({
      where: { supervisorToken: token },
      relations: ['user'],
    });
  }

  // ── Employee edit ─────────────────────────────────────────────────────────

  async getForEdit(refId: string, email: string): Promise<EditCheckResult> {
    const record = await this.repo.findOne({
      where: { refId },
      relations: ['user'],
    });
    if (!record) return 'not_found';

    const employeeEmail = record.user?.email ?? '';
    if (employeeEmail.toLowerCase() !== email.trim().toLowerCase())
      return 'wrong_email';
    if (record.status === 'COMPLETE') return 'locked';

    return record;
  }

  async updateByEmployee(
    refId: string,
    email: string,
    data: Record<string, any>,
  ): Promise<EditCheckResult> {
    const check = await this.getForEdit(refId, email);
    if (typeof check === 'string') return check;

    // If personnel profile fields are included in data, update the User record
    const record = check;
    if (record.userId) {
      const profileUpdate: Partial<User> = {};
      const profileFields: (keyof User)[] = [
        'firstName',
        'lastName',
        'middleInitial',
        'campus',
        'officeAffiliation',
        'collegeOfficeUnit',
        'collegeProgram',
        'personnelType',
        'educAttainment',
        'educAttainmentSpec',
        'currentPosition',
        'designation',
        'yearsInPosition',
        'yearsInCSU',
      ];
      for (const field of profileFields) {
        if (data[field] !== undefined) {
          (profileUpdate as any)[field] = data[field];
        }
      }
      if (Object.keys(profileUpdate).length > 0) {
        await this.userRepo.update({ id: record.userId }, profileUpdate);
      }
    }

    // Update only the IDP-specific fields
    await this.repo.update(
      { refId },
      {
        supervisorName: data.supervisorName ?? record.supervisorName,
        supervisorEmail: data.supervisorEmail ?? record.supervisorEmail,
        headerPurpose: data.headerPurpose ?? record.headerPurpose,
        competencyPurpose: data.competencyPurpose ?? record.competencyPurpose,
        competencyRowsJson: JSON.stringify(data.competencyRows ?? []),
        agapRowsJson: JSON.stringify(data.agapRows ?? []),
        proactRowsJson: JSON.stringify(data.proactRows ?? []),
        supervisorNotifiedAt: new Date().toISOString(),
      },
    );

    const updated = await this.repo.findOne({
      where: { refId },
      relations: ['user'],
    });
    if (!updated) return 'not_found';

    const employeeName = updated.user ? this.getEmployeeName(updated.user) : '';
    const employeeEmail = updated.user?.email ?? '';
    const frontendBase = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const reviewUrl = `${frontendBase}/idp-supervisor?token=${updated.supervisorToken}`;

    if (employeeEmail) {
      this.mail.sendEmployeeEditConfirmation({
        to: employeeEmail,
        name: employeeName,
        refId: updated.refId,
        supervisorName: updated.supervisorName,
      });
    }

    if (updated.supervisorEmail) {
      this.mail.sendSupervisorRenotification({
        to: updated.supervisorEmail,
        supervisorName: updated.supervisorName,
        employeeName,
        refId: updated.refId,
        position: updated.user?.currentPosition ?? '',
        officeUnit: updated.user?.collegeOfficeUnit ?? '',
        reviewUrl,
      });
    }

    return updated;
  }

  // ── Supervisor review ─────────────────────────────────────────────────────

  async updateSupervisor(
    refId: string,
    data: Partial<Idp>,
  ): Promise<Idp | null> {
    await this.repo.update({ refId }, { ...data, status: 'COMPLETE' });
    const updated = await this.repo.findOne({ where: { refId } });
    if (!updated) return null;

    const employeeName =
      updated.nameOfPersonnel ||
      [updated.firstName, updated.lastName].filter(Boolean).join(' ');
    const employeeEmail = updated.employeeEmail ?? '';
    const completedAt = new Date().toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      const pdfBuffer = await this.pdf.generateIdpPdf({ ...updated } as any);

      if (employeeEmail) {
        this.mail.sendEmployeeCompletion({
          to: employeeEmail,
          name: employeeName,
          refId: updated.refId,
          supervisorName: updated.supervisorName,
          pdfBuffer,
        });
      }

      this.mail.sendHrNotification({
        employeeName: employeeName || updated.supervisorName,
        refId: updated.refId,
        position: updated.currentPosition ?? '',
        officeUnit: updated.collegeOfficeUnit ?? '',
        supervisorName: updated.supervisorName,
        completedAt,
        pdfBuffer,
      });
    } catch (err) {
      console.error('PDF generation failed:', err.message);
    }

    return updated;
  }

  async updateSupervisorByToken(
    token: string,
    data: Partial<Idp>,
  ): Promise<Idp | null> {
    const record = await this.repo.findOne({
      where: { supervisorToken: token },
    });
    if (!record) return null;
    return this.updateSupervisor(record.refId, data);
  }

  // ── PDF ───────────────────────────────────────────────────────────────────

  async generatePdf(refId: string): Promise<Buffer | null> {
    const record = await this.repo.findOne({
      where: { refId },
      relations: ['user'],
    });
    if (!record) return null;
    try {
      return await this.pdf.generateIdpPdf({ ...record } as any);
    } catch (err) {
      console.error('PDF generation failed:', err.message);
      return null;
    }
  }
}