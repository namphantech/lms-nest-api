import { MigrationInterface, QueryRunner } from 'typeorm';

export class INSERTTOKENFIELD1687332198533 implements MigrationInterface {
  name = 'INSERTTOKENFIELD1687332198533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" ADD "token" character varying `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "token"`);
  }
}
