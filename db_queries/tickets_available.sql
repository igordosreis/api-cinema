CREATE TABLE
    "tickets_available" (
        "id" int NOT NULL AUTO_INCREMENT,
        "voucher" varchar(255) NOT NULL,
        "cinema_id" varchar(255) NOT NULL, 
        "expire_date" datetime DEFAULT NULL,
        "created_at" datetime DEFAULT NULL,
        PRIMARY KEY ("id")
    ) ENGINE = InnoDB DEFAULT CHARSET = latin1