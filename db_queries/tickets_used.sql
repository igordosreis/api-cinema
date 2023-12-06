CREATE TABLE
    "vouchers_user" (
        "id" int NOT NULL AUTO_INCREMENT,
        "voucher" varchar(255) NOT NULL,
        "ticket_name" varchar(255) NOT NULL,
        "ticket_type" varchar(255) NOT NULL,
        "establishment_id" varchar(255) NOT NULL, 
        "user_id" varchar(255) NOT NULL, 
        "expire_at" datetime DEFAULT NULL,
        "payment_id" varchar(255) DEFAULT NULL,
        "created_at" datetime DEFAULT NULL,
        "sold_at" datetime DEFAULT NULL,
        PRIMARY KEY ("id")
    ) ENGINE = InnoDB DEFAULT CHARSET = latin1