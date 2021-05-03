import { MigrationInterface, QueryRunner } from 'typeorm'
import { PasswordUtil } from '../../shared/password'

export class tableUser1619684527953 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "hotel_user"
        (
            "id"                             serial       NOT NULL,
            "user_name"                      varchar(50)  NOT NULL,
            "email"                          varchar(255) NOT NULL,
            "first_name"                     varchar(50)  NOT NULL,
            "last_name"                      varchar(50)  NOT NULL,
            "password"                       varchar(255) NOT NULL,
            "avatar"                         varchar(255) NULL,
            "description"                    varchar      NULL,
            "address"                        varchar      NULL,
            "social_media_links"             varchar      NULL,
            "facebook_id"                    varchar(255) NULL,
            "google_id"                      varchar(255) NULL,
            "linkedin_id"                    varchar(255) NULL,
            "is_enable"                      bool         NOT NULL DEFAULT true,
            "reset_password_token"           varchar(500) NULL,
            "reset_password_token_expired"   timestamp,
            "is_verified_account"            bool         NOT NULL DEFAULT false,
            "verified_account_token"         varchar(500) NULL,
            "verified_account_token_expired" timestamp,
            "created_at"                     timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "modified_at"                    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by"                     int          NULL,
            "modified_by"                    int          NULL,

            CONSTRAINT "pk_hotel_user_id" PRIMARY KEY ("id"),

            CONSTRAINT "uq_hotel_user_user_name" UNIQUE ("user_name"),
            CONSTRAINT "uq_hotel_user_email" UNIQUE ("email"),
            CONSTRAINT "uq_hotel_user_facebook_id" UNIQUE ("facebook_id"),
            CONSTRAINT "uq_hotel_user_google_id" UNIQUE ("google_id"),
            CONSTRAINT "uq_hotel_user_linkedin_id" UNIQUE ("linkedin_id"),

            CONSTRAINT "fk_hotel_user_created_by" FOREIGN KEY ("created_by") REFERENCES hotel_user ("id"),
            CONSTRAINT "fk_hotel_user_modified_by" FOREIGN KEY ("modified_by") REFERENCES hotel_user ("id")
        );
        CREATE INDEX idx_hotel_user_user_name ON hotel_user (user_name ASC);
        CREATE INDEX idx_hotel_user_email ON hotel_user (email ASC);
        CREATE TABLE "hotel_role"
        (
            "id"           serial       NOT NULL,
            "name"         varchar(50)  NOT NULL,
            "description"  varchar(255) NOT NULL,
            "global_role"  bool         NOT NULL DEFAULT false,
            "project_role" bool         NOT NULL DEFAULT false,

            CONSTRAINT "pk_hotel_role" PRIMARY KEY ("id"),

            CONSTRAINT "unq_hotel_role_name" UNIQUE (name)
        );
        CREATE INDEX "idx_hotel_role_name" ON hotel_role (name ASC);


        CREATE TABLE "personnel"
        (
            "id"          serial       NOT NULL,
            "name"        varchar(50)  NOT NULL,
            "description" varchar(255) NOT NULL,

            CONSTRAINT "pk_personnel" PRIMARY KEY ("id"),

            CONSTRAINT "unq_personnel_name" UNIQUE (name)
        );
        CREATE INDEX "idx_personnel_name" ON personnel (name ASC);

        CREATE TABLE "hotel_user_role"
        (
            "id"          serial       NOT NULL,
            "user_id"     integer      not null,
            "role_id"     integer      not null,
            CONSTRAINT "pk_hotel_user_role" PRIMARY KEY ("id"),
            CONSTRAINT "fk_hotel_user_role_hotel_user_user_id" FOREIGN KEY (user_id) REFERENCES hotel_user (id),
            CONSTRAINT "fk_hotel_user_role_hotel_role_role_id" FOREIGN KEY (role_id) REFERENCES hotel_role (id)
        );

        CREATE TABLE "personnel_role"
        (
            "id"               serial       NOT NULL,
            "personnel_id"     integer      not null,
            "role_id"          integer      not null,
            CONSTRAINT "pk_personnel_role_role" PRIMARY KEY ("id"),
            CONSTRAINT "fk_personnel_role_role_personnel_id" FOREIGN KEY (personnel_id) REFERENCES personnel (id),
            CONSTRAINT "fk_personnel_role_role_hotel_role_role_id" FOREIGN KEY (role_id) REFERENCES hotel_role (id)
        );

        CREATE TABLE "work_level"
        (
            "id"          serial       NOT NULL,
            "level"       varchar(20)  NOT NULL,
            "description" varchar(255) NOT NULL,

            CONSTRAINT "pk_work_level" PRIMARY KEY ("id"),
            CONSTRAINT "unq_work_level_level" UNIQUE (level)
        );
        CREATE INDEX "idx_work_level_level" ON work_level (level ASC);

        CREATE TABLE "work"
        (
            "id"          serial       NOT NULL,
            "name"        varchar(50)  NOT NULL,
            "description" varchar(255) NOT NULL,

            CONSTRAINT "pk_work" PRIMARY KEY ("id"),
            CONSTRAINT "unq_work_name" UNIQUE (name)
        );
        CREATE INDEX "idx_work_name" ON work (name ASC);

        CREATE TABLE "user_work"
        (
            "id"               serial       NOT NULL,
            "work_id"          integer      not null,
            "employee_id"      integer      not null,
            CONSTRAINT "pk_user_work_role" PRIMARY KEY ("id"),
            CONSTRAINT "fk_user_work_role_work_id" FOREIGN KEY (work_id) REFERENCES work (id),
            CONSTRAINT "fk_user_work_role_employee_id" FOREIGN KEY (employee_id) REFERENCES hotel_user (id)
        );

        CREATE TABLE "salary"
        (
            "id"                serial       NOT NULL,
            "work_id"           integer      not null,
            "work_level_id"     integer      not null,
            CONSTRAINT "pk_salary_role" PRIMARY KEY ("id"),
            CONSTRAINT "fk_salary_role_work_id" FOREIGN KEY (work_id) REFERENCES work (id),
            CONSTRAINT "fk_salary_work_level_id" FOREIGN KEY (work_level_id) REFERENCES work_level (id)
        );

        CREATE TABLE "timekeeping"
        (
            "id"            serial       NOT NULL,
            "offtime"       integer      not null,
            "employee_id"   integer      not null,
            "salary_id"     integer      not null,
            "description"   varchar      null,
            "created_at"    timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "modified_at"   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by"    int          NOT NULL,
            "modified_by"   int          NOT NULL,

            CONSTRAINT "pk_timekeeping" PRIMARY KEY ("id"),
            CONSTRAINT "fk_salary_role_employee_id" FOREIGN KEY (employee_id) REFERENCES hotel_user (id),
            CONSTRAINT "fk_salary_work_salary_id" FOREIGN KEY (salary_id) REFERENCES salary (id)
        );
        
    `)
    const password = PasswordUtil.generateHash('123')
    await queryRunner.query(`
        INSERT INTO hotel_role (name, description, global_role, project_role)
        VALUES ('SystemAdmin', 'System Admin', true, false),('User', 'Normal User', true, false);

        INSERT INTO hotel_user (user_name, email, first_name, last_name, password, is_enable)
        VALUES ('admin', 'ontherise@gmail.com', 'system', 'admin', '${password}', true),
        ('anh', 'anh@gmail.com', 'system', 'admin', '${password}', true),
        ('anhnguyen', 'anhgnuyen@gmail.com', 'system', 'admin', '${password}', true),
        ('dung', 'dung@gmail.com', 'system', 'admin', '${password}', true),
        ('dungtran', 'dungtran@gmail.com', 'system', 'admin', '${password}', true);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        Drop table timekeeping;
        drop table salary;
        drop table work_level;
        drop table user_work;
        drop table work;
        DROP TABLE personnel_role;
        DROP TABLE hotel_user_role;
        DROP TABLE hotel_role;
        DROP TABLE hotel_user;
        DROP TABLE personnel;
      `)
  }
}
