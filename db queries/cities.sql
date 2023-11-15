CREATE TABLE
    "cities" (
        "id" int NOT NULL AUTO_INCREMENT,
        "name" varchar(255) NOT NULL,
        "state_id" int NOT NULL,
        "country" int DEFAULT NULL,
        "latitude" varchar(255) DEFAULT NULL,
        "longitude" varchar(255) DEFAULT NULL,
        PRIMARY KEY ("id"),
        KEY "state_id" ("state_id"),
        CONSTRAINT "cities_ibfk_1" FOREIGN KEY ("state_id") REFERENCES "states" ("id") ON DELETE CASCADE
    )