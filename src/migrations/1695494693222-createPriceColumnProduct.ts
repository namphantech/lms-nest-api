import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnProduct21695494693222 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN price NUMERIC(10,2) `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN price`);
  }
}
