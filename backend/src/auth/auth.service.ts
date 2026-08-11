import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User, UserRole } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private tokenRepo: Repository<RefreshToken>,
     @InjectRepository(PasswordResetToken)
    private resetTokenRepo: Repository<PasswordResetToken>,
    private jwt: JwtService,
    private cfg: ConfigService,
    private mail: MailService,
  ) {}

  // ── Register (email/password) ──────────────────────────────────────
async register(email: string, password: string, firstName?: string, lastName?: string) {
  const existing = await this.userRepo.findOne({ where: { email } });
  if (existing) {
    throw new ConflictException('Email already in use.');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = this.userRepo.create({ email, password: hashed, firstName, lastName });
  await this.userRepo.save(user);

  return this.login(email, password); // reuse login to return tokens
}

  // ── Login (email/password) ─────────────────────────────────────────
  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials.');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials.');
    return this.issueTokens(user);
  }

  // ── HR/Admin passwordless login (email only) ─────────────────────────
  // No password check by design — access is gated purely on the account's
  // role. Anyone who knows/guesses an admin or hr-staff email can log in,
  // so only use this for low-sensitivity internal deployments.
  async hrLogin(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.HR_STAFF)) {
      throw new UnauthorizedException('Not an authorized HR/admin account.');
    }
    return this.issueTokens(user);
  }

  // ── Refresh token ──────────────────────────────────────────────────
  async refresh(token: string) {
    const stored = await this.tokenRepo.findOne({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
    const user = await this.userRepo.findOne({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException();
    await this.tokenRepo.delete({ id: stored.id });
    return this.issueTokens(user);
  }

  // ── Logout ─────────────────────────────────────────────────────────
  async logout(token: string) {
    await this.tokenRepo.delete({ token });
    return { success: true };
  }

  // ── Forgot password ─────────────────────────────────────────────────
  async forgotPassword(email: string) {
    const genericResponse = {
      message: 'If that email is registered, a reset link has been sent.',
    };

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return genericResponse; // don't reveal whether the email exists

    const token = uuid();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    await this.resetTokenRepo.save(
  this.resetTokenRepo.create({ id: uuid(), token, userId: user.id, expiresAt }),
);

    const frontendUrl = this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    const name = user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email;

    await this.mail.sendPasswordReset({ to: user.email, name, resetUrl });

    return genericResponse;
  }

  // ── Reset password ──────────────────────────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    const stored = await this.resetTokenRepo.findOne({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link.');
    }

    const user = await this.userRepo.findOne({ where: { id: stored.userId } });
    if (!user) throw new BadRequestException('Invalid or expired reset link.');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user.id, { password: hashed });

    await this.resetTokenRepo.delete({ id: stored.id });
    await this.tokenRepo.delete({ userId: user.id }); // logs out old sessions

    return { success: true };
  }



  // ── Internal: issue access + refresh tokens ────────────────────────
  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });

    const refreshToken = uuid();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.tokenRepo.save(
      this.tokenRepo.create({
        token: refreshToken,
        userId: user.id,
        expiresAt,
      }),
    );

    return {
      accessToken,
      refreshToken,
      profileComplete: user.profileComplete,
      role: user.role,
    };
  }
}