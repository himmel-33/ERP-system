DECLARE
    project_table_count NUMBER;
BEGIN
    SELECT COUNT(*)
      INTO project_table_count
      FROM USER_TABLES
     WHERE TABLE_NAME = 'PROJECTS';

    IF project_table_count = 0 THEN
        EXECUTE IMMEDIATE '
            CREATE TABLE Projects
            (
                id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
                name VARCHAR2(255 CHAR) NOT NULL,
                description CLOB,
                location VARCHAR2(255 CHAR),
                startDate DATE,
                endDate DATE,
                budget NUMBER(15, 2),
                status VARCHAR2(50 CHAR) DEFAULT ''PLANNING'' NOT NULL,
                projectManagerId RAW(16),
                createdAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
                updatedAt TIMESTAMP
            )';
    END IF;
END;
