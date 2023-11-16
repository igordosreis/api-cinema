CREATE TABLE
    "establishments" (
        "id" int NOT NULL AUTO_INCREMENT,
        "name" varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
        "about" longtext COLLATE utf8mb3_unicode_ci NOT NULL,
        "primary_color" varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '#000000',
        "link" longtext COLLATE utf8mb3_unicode_ci,
        "link_description" varchar(80) COLLATE utf8mb3_unicode_ci NOT NULL,
        "telephone" varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "telephone_2" varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "whatsapp" varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "instagram" varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "site" varchar(150) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "rules" longtext COLLATE utf8mb3_unicode_ci NOT NULL,
        "key_words" text COLLATE utf8mb3_unicode_ci,
        "active" tinyint(1) DEFAULT '0',
        "created_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        "views" bigint DEFAULT '0',
        "under_highlight" int DEFAULT '0', --provavelmente nao vou usar
        PRIMARY KEY ("id"),
    )