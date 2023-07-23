import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePost1597106889894 implements MigrationInterface {
  name = "CreatePost1597106889894";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_m" (
        "id" SERIAL NOT NULL,
        "text" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "ownerId" integer NOT NULL,
        CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"),
        CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8" FOREIGN KEY ("ownerId")
          REFERENCES "user"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION
        )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_m" DROP CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8"`
    );
    await queryRunner.query(`DROP TABLE "post_m"`);
  }
}
