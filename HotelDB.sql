BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `HotelDB` (
	`city`	TEXT,
	`hotel_name`	TEXT
);
INSERT INTO `HotelDB` VALUES ('Palo Alto','The Zen Hotel');
INSERT INTO `HotelDB` VALUES ('Palo Alto','Dinah''s Garden Hotel');
INSERT INTO `HotelDB` VALUES ('Santa Monica','Shore Hotel');
INSERT INTO `HotelDB` VALUES ('Santa Monica','The Ambrose');
COMMIT;
