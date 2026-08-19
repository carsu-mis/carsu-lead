import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLnaProactRows1787121680543 implements MigrationInterface {
    name = 'AddLnaProactRows1787121680543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lna_submissions" ADD "proactRows" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lna_submissions" DROP COLUMN "proactRows"`);
    }

}