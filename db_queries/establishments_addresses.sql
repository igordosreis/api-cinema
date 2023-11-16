CREATE TABLE
    "establishments_addresses" (
        "id" int NOT NULL AUTO_INCREMENT,
        "establishment_id" int NOT NULL,
        "name" varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
        "active" tinyint(1) DEFAULT '1',
        "address" varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
        "city_id" int NOT NULL,
        "latitude" text COLLATE utf8mb3_unicode_ci NOT NULL,
        "longitude" text COLLATE utf8mb3_unicode_ci NOT NULL,
        "telephone" varchar(40) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
        "code" int DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "establishment_id" ("establishment_id"),
        KEY "city_id" ("city_id"),
        CONSTRAINT "establishments_addresses_ibfk_1" FOREIGN KEY ("establishment_id") REFERENCES "establishments" ("id") ON DELETE CASCADE,
        CONSTRAINT "establishments_addresses_ibfk_2" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE CASCADE
    )