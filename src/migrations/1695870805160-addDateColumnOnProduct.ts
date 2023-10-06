import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDateColumnOnProduct1695870805160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product"
    ADD COLUMN created_at `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
