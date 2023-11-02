CREATE TABLE ADLCardsMigrationData (
	Id int IDENTITY(0,1) NOT NULL,
	CardToken nvarchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	PAN nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	UserId nvarchar(100) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT ADLCardsMigrationData_PK PRIMARY KEY (Id)
);


CREATE TABLE ADLUserMigrationData (
	UserId nvarchar(128) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	ClearCardNumber nvarchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	EncCardNumber nvarchar(60) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT ADLUserMigrationData_PK PRIMARY KEY (UserId)
);

ALTER TABLE AspNetUsers ADD isDecrypted bit DEFAULT 0 NULL;
ALTER TABLE DebitCards ADD isDecrypted bit DEFAULT 0 NULL;