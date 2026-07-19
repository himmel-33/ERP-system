IF OBJECT_ID(N'dbo.Projects', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Projects
    (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name VARCHAR(255) NOT NULL,
        description VARCHAR(MAX),
        location VARCHAR(255),
        startDate DATE,
        endDate DATE,
        budget DECIMAL(15, 2),
        status VARCHAR(50) NOT NULL DEFAULT 'PLANNING',
        projectManagerId UNIQUEIDENTIFIER,
        createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME2
    );
END;
