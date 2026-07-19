# Construction ERP Project Service

건설 ERP 시스템에서 프로젝트 정보를 담당할 Spring Boot 마이크로서비스의 1단계 기본 골격입니다. 현재 단계는 이후 엔티티, 서비스 및 API 구현을 위한 빌드 가능한 기반만 제공합니다.

## 요구 환경

- Java 17
- Maven 3.9 이상 권장
- Microsoft SQL Server (`localhost:1433`)

## 데이터베이스 준비

SQL Server에 접속하여 다음 명령으로 데이터베이스를 생성합니다.

```sql
IF DB_ID(N'construction_erp') IS NULL
BEGIN
    CREATE DATABASE construction_erp;
END;
```

애플리케이션 시작 시 `src/main/resources/schema.sql`이 실행되어 `Projects` 테이블이 존재하지 않을 경우 생성합니다. 데이터베이스 계정에는 해당 데이터베이스의 테이블 생성 권한이 필요합니다.

## 환경 변수

PowerShell에서는 다음과 같이 현재 세션의 접속 정보를 설정합니다.

```powershell
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"
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

## 현재 구현되지 않은 기능

- Project 엔티티의 전체 필드 및 상태 Enum
- DTO 필드와 Entity/DTO 변환
- CRUD API와 Controller 메서드
- Service 비즈니스 로직 및 Repository 주입
- Repository 사용자 정의 쿼리
- Redis 및 API Gateway 연동
- 인증과 권한 처리
- 다른 마이크로서비스와의 통신
