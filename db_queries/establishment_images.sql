CREATE TABLE
    "establishment_images" (
        "id" int NOT NULL,
        "image" varchar(255) DEFAULT NULL,
        "image_carousel" varchar(255) DEFAULT NULL,
        "cover" varchar(120) DEFAULT NULL,
        "resize_color" varchar(255) DEFAULT '#ffffff',
        PRIMARY KEY ("id")
    )