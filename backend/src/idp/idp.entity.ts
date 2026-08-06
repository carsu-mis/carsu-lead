import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('idp')
export class Idp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  refId: string;

  @Column({ default: 'PENDING' })
  status: string;

  // ── FK to user (legacy — no longer populated; login/profiles removed) ──
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  // ── Personnel / office info (submitted directly on the form) ─────
  @Column({ nullable: true }) employeeEmail: string;
  @Column({ nullable: true }) campus: string;
  @Column({ nullable: true }) officeAffiliation: string;
  @Column({ nullable: true }) collegeOfficeUnit: string;
  @Column({ nullable: true }) collegeProgram: string;
  @Column({ nullable: true }) nameOfPersonnel: string;
  @Column({ nullable: true }) lastName: string;
  @Column({ nullable: true }) firstName: string;
  @Column({ nullable: true }) middleInitial: string;
  @Column({ nullable: true }) educAttainment: string;
  @Column({ nullable: true }) educAttainmentSpec: string;
  @Column({ nullable: true }) currentPosition: string;
  @Column({ nullable: true }) designation: string;
  @Column({ nullable: true, type: 'float' }) yearsInPosition: number;
  @Column({ nullable: true, type: 'float' }) yearsInCSU: number;

  // ── Fields that remain submission-specific ───────────────────────
  @Column({ nullable: true }) supervisorName: string;
  @Column({ nullable: true }) supervisorEmail: string;
  @Column({ nullable: true }) headerPurpose: string;
  @Column({ nullable: true }) competencyPurpose: string;

  @Column({ type: 'text', nullable: true }) competencyRowsJson: string;
  @Column({ type: 'text', nullable: true }) agapRowsJson: string;
  @Column({ type: 'text', nullable: true }) proactRowsJson: string;

  @Column({ nullable: true }) supervisorRemarks: string;
  @Column({ nullable: true }) supervisorApproval: string;
  @Column({ nullable: true }) supervisorSignedAt: string;
  @Column({ type: 'text', nullable: true }) supervisorAssessment: string;

  @Column({ nullable: true, unique: true })
  supervisorToken: string;

  @Column({ nullable: true })
  supervisorNotifiedAt: string;

  @CreateDateColumn()
  submittedAt: Date;
}