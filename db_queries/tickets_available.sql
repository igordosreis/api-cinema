CREATE TABLE
    "tickets_available" (
        "id" int NOT NULL AUTO_INCREMENT,
        "voucher" varchar(255) NOT NULL,
        "ticket_name" varchar(255) NOT NULL,
        "ticket_type" varchar(255) NOT NULL,
        "establishment_id" varchar(255) NOT NULL, 
        "expire_date" datetime DEFAULT NULL,
        "created_at" datetime DEFAULT NULL,
        PRIMARY KEY ("id")
    ) ENGINE = InnoDB DEFAULT CHARSET = latin1