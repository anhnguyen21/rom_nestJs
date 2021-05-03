import { MigrationInterface, QueryRunner } from 'typeorm'

export class tableRoom1619756557781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "hotel_category"
            (
                "id"        serial          not null,
                "name"      varchar(255)    not null,
                CONSTRAINT "pk_hotel_category_id" PRIMARY KEY ("id"),
                CONSTRAINT "uq_hotel_category_name" UNIQUE ("name")
            );
            CREATE INDEX idx_hotel_category_name ON hotel_category (name ASC);
        
            CREATE TABLE "room"
            (
                "id"                    serial          not null,
                "title"                 varchar(255)    not null,
                "short_description"     character       not null,
                "project_image"         character       not null,
                "is_active"             boolean         not null default true,
                "category_id"           integer         not null,
                "created_by"            integer         not null,
                "modified_by"           integer         not null,
                "created_at"            timestamp       not null default CURRENT_TIMESTAMP,
                "modified_at"           timestamp       not null default CURRENT_TIMESTAMP,
                CONSTRAINT "pk_room_id" PRIMARY KEY ("id"),
                CONSTRAINT "uq_room_title" UNIQUE ("title"),

                CONSTRAINT "fk_room_category_id" FOREIGN KEY ("category_id") REFERENCES hotel_category ("id")
            );
            CREATE INDEX "idx_room_title" ON room (title ASC);

            CREATE TABLE "room_detail"
            (
                "id"            serial          not null,
                "description"   varchar(255)    not null,
                "price"         float           not null,
                "room_id"       integer         not null,
                "created_at"    timestamp       not null default CURRENT_TIMESTAMP,
                "modified_at"   timestamp       not null default CURRENT_TIMESTAMP,
                CONSTRAINT "pk_room_detail_id" PRIMARY KEY ("id"),
                CONSTRAINT "fk_room_detail_room" FOREIGN KEY ("room_id") REFERENCES room ("id")
            );

            CREATE TABLE "hotel_attachment"
            (
                "id"            integer     not null,
                "type"          varchar(50) not null,
                "url"           varchar     not null,
                "room_id"       integer     not null,
                "created_at"    timestamp   not null default CURRENT_TIMESTAMP,
                "modified_at"   timestamp   not null default CURRENT_TIMESTAMP,
                CONSTRAINT "pk_hotel_attachment_id" PRIMARY KEY ("id"),
                CONSTRAINT "fk_hotel_attachment_room" FOREIGN KEY ("room_id") REFERENCES room ("id")
            );

            CREATE TABLE "room_status"
            (
                "id"            integer         not null,
                "name"          varchar(100)    not null,
                "description"   varchar         not null,
                CONSTRAINT "pk_room_status_id" PRIMARY KEY ("id"),
                CONSTRAINT "uq_room_status_name" unique ("name")
            );
            CREATE INDEX "idx_room_status_name" ON room_status (name ASC);

            CREATE TABLE "room_staus_history"
            (
                "id"            integer     not null,
                "room_id"       integer     not null,
                "status_id"     integer     not null,
                "employee_id"   integer     not null,
                "personnel_id"  integer     not null,
                "created_by"    integer     not null,
                "modified_by"   integer     not null,
                "created_at"    timestamp   not null default CURRENT_TIMESTAMP,
                "modified_at"   timestamp   not null default CURRENT_TIMESTAMP,
                CONSTRAINT "pk_room_staus_history_id" PRIMARY KEY ("id"),
                CONSTRAINT "fk_room_staus_history_room_status" FOREIGN KEY ("status_id") REFERENCES room_status ("id"),
                CONSTRAINT "fk_room_staus_history_hotel_user" FOREIGN KEY ("employee_id") REFERENCES hotel_user ("id")
            );

        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE room_status_history;
        DROP TABLE room_status;
        DROP TABLE hotel_attachment;
        DROP TABLE room_detail;
        DROP TABLE room;
        DROP TABLE hotel_category;
      `)
  }
}
