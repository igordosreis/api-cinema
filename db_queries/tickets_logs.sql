CREATE TABLE
    "vouchers_logs" (
        "id" int(11) NOT NULL AUTO_INCREMENT,
        "request" longtext,
        "response" longtext,
        "ticket" longtext,
        "date" datetime DEFAULT NULL,
        PRIMARY KEY ("id")
    )