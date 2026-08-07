import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async updateProfile(id: string, data: Partial<User>) {
    await this.repo.update(id, { ...data, profileComplete: true });
    return this.repo.findOne({ where: { id } });
  }

  findAll() {
    return this.repo.find();
  }

  async grantHrStaffRole(userId: string) {
    await this.repo.update(userId, { role: UserRole.HR_STAFF });
    return this.repo.findOne({ where: { id: userId } });
  }

  async revokeHrStaffRole(userId: string) {
    await this.repo.update(userId, { role: UserRole.USER });
    return this.repo.findOne({ where: { id: userId } });
  }

  async grantSupervisor(userId: string) {
    await this.repo.update(userId, { isSupervisor: true });
    return this.repo.findOne({ where: { id: userId } });
  }

  async revokeSupervisor(userId: string) {
    await this.repo.update(userId, { isSupervisor: false });
    return this.repo.findOne({ where: { id: userId } });
  }

  async setRole(userId: string, role: UserRole) {
    await this.repo.update(userId, { role });
    return this.repo.findOne({ where: { id: userId } });
  }

  // ── Create a new Admin/HR-Staff account directly ─────────────────────
  // Used by the HR Registry "Add User" flow. These accounts sign in via
  // the passwordless /auth/hr-login (email only), so we still fill the
  // password column with a random, never-shared hash purely to satisfy
  // the NOT NULL constraint — it's never used to authenticate.
  async createHrOrAdmin(
    email: string,
    role: UserRole.ADMIN | UserRole.HR_STAFF,
    firstName?: string,
    lastName?: string,
  ) {
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use.');
    }
    const randomPassword = await bcrypt.hash(uuid(), 10);
    const user = this.repo.create({
      email,
      password: randomPassword,
      role,
      firstName,
      lastName,
      profileComplete: true,
    });
    return this.repo.save(user);
  }
}