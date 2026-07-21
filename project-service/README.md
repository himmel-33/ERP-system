# Construction ERP Project Service

건설 ERP 시스템에서 프로젝트 정보를 담당하는 Spring Boot 마이크로서비스입니다. 프로젝트 조회, 등록, 수정 및 삭제 REST API를 제공합니다.

## 요구 환경

- Java 17
- Maven 3.9 이상 권장
- Oracle AI Database Free (`localhost:1521/FREEPDB1`) 또는 호환 Oracle Database

## Oracle 스키마 준비

SQL Developer 또는 SQL*Plus에서 관리자 계정으로 `FREEPDB1`에 접속하여 애플리케이션 사용자를 생성합니다.

```sql
ALTER SESSION SET CONTAINER = FREEPDB1;

CREATE USER construction_erp_app IDENTIFIED BY "your_strong_password";
GRANT CREATE SESSION, CREATE TABLE TO construction_erp_app;
ALTER USER construction_erp_app QUOTA UNLIMITED ON USERS;
```

애플리케이션 시작 시 `src/main/resources/schema.sql`이 실행되어 `PROJECTS` 테이블이 존재하지 않을 경우 생성합니다.

## 환경 변수

PowerShell에서는 다음과 같이 현재 세션의 접속 정보를 설정합니다.

```powershell
$env:DB_USERNAME="construction_erp_app"
$env:DB_PASSWORD="your_password"
$env:DB_URL="jdbc:oracle:thin:@//localhost:1521/FREEPDB1"
```

운영 비밀번호를 소스 코드나 버전 관리 시스템에 저장하지 마십시오.

## 빌드 및 실행

```powershell
mvn clean compile
mvn spring-boot:run
```

패키징한 JAR 파일은 다음과 같이 실행할 수 있습니다.

```powershell
mvn clean package
java -jar target/project-service-0.0.1-SNAPSHOT.jar
```

애플리케이션 실행에는 접근 가능한 SQL Server와 `DB_USERNAME`, `DB_PASSWORD` 환경 변수가 필요합니다.

## API 문서

- Swagger UI: http://localhost:8081/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/v3/api-docs

## 제공 API

- `GET /api/projects`
- `GET /api/projects/{id}`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

## 현재 구현되지 않은 기능

- 프로젝트 상태 Enum 및 상태 변경 전용 흐름
- Redis 및 API Gateway 연동
- 인증과 권한 처리
- 다른 마이크로서비스와의 통신
