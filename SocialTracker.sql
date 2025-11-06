CREATE DATABASE SocialTracker;
USE SocialTracker;

-- Create Users table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NULL,
    Email NVARCHAR(100) NULL,
    Password NVARCHAR(100) NULL,
    Role NVARCHAR(20) CHECK (Role IN ('Admin','Moderator','Victim')),
    PhoneNumber NVARCHAR(20) NULL,
    Address NVARCHAR(200) NULL,
  
);

SELECT* FROM Users;

-- Create Complain table
CREATE TABLE Complain (
    Complain_Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Description NVARCHAR(100) NULL,
    Status NVARCHAR(20) CHECK (Status IN ('Rejected','Accepted','Pending')) ,
    ImageUrl VARBINARY(MAX) NULL,
);
ALTER TABLE Complain
ALTER COLUMN ImageUrl NVARCHAR(MAX) NULL;

DROP TABLE Complain;
SELECT* FROM Complain;  

