/**
 * One-off script to create the first admin/HR-staff account.
 *
 * There's no automatic admin seeding on boot — TypeORM's `synchronize: true`
 * only creates empty tables, it never inserts rows. Without this, a fresh
 * clone has an empty `users` table and nobody can log into /dashboard.
 *
 * Usage (run inside the backend container, after `docker compose up`):
 *
 *   docker compose exec backend npx ts-node src/seed-admin.ts <email> [role] [firstName] [lastName]
 *   # or, using the npm alias:
 *   docker compose exec backend npm run seed:admin -- <email> [role] [firstName] [lastName]
 *
 * Examples:
 *   docker compose exec backend npx ts-node src/seed-admin.ts admin@carsu.edu.ph
 *   docker compose exec backend npx ts-node src/seed-admin.ts jdelacruz@carsu.edu.ph hr-staff Juan "Dela Cruz"
 *
 * role defaults to "admin" if omitted. Must be "admin" or "hr-staff" —
 * these are the only two roles that can use the passwordless HR/admin
 * login (see AuthService.hrLogin). The password column is required by
 * the schema but is never checked on that login path, so this script
 * just fills it with a random bcrypt hash.
 *
 * Safe to re-run: if the email already exists, it just updates the role
 * instead of creating a duplicate.
 */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User, UserRole } from './users/user.entity';

async function main() {
  const [, , emailArg, roleArg, firstNameArg, lastNameArg] = process.argv;

  if (!emailArg) {
    console.error(
      'Usage: npx ts-node src/seed-admin.ts <email> [admin|hr-staff] [firstName] [lastName]',
    );
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  const role = (roleArg?.trim() as UserRole) || UserRole.ADMIN;

  if (role !== UserRole.ADMIN && role !== UserRole.HR_STAFF) {
    console.error(`Invalid role "${role}". Must be "admin" or "hr-staff".`);
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
  });

  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);

  const randomPassword = randomBytes(24).toString('hex');
  const hashed = await bcrypt.hash(randomPassword, 10);

  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    existing.role = role;
    await userRepo.save(existing);
    console.log(`Updated existing user "${email}" to role "${role}".`);
  } else {
    const user = userRepo.create({
      email,
      password: hashed,
      role,
      firstName: firstNameArg ?? undefined,
      lastName: lastNameArg ?? undefined,
      profileComplete: true,
    });
    await userRepo.save(user);
    console.log(`Created user "${email}" with role "${role}".`);
  }

  console.log(
    `\nLog into /dashboard with this email — HR/admin login is email-only, no password needed.`,
  );

  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});