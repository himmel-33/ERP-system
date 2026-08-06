# Construction ERP

건설 프로젝트의 기본 정보, 일정, 예산 및 진행 상태를 관리하는 풀스택 예제입니다.

- `project-service`: Java 17, Spring Boot, JPA, Oracle 기반 REST API
- `construction-erp-frontend`: React, Vite, React Router, Axios 기반 관리자 화면

## 프로젝트 관리 화면

![Construction ERP 프로젝트 관리 화면](docs/images/project-dashboard.png)

## 실행 순서

### 1. Oracle 준비

Oracle AI Database Free를 설치하고 기본 Pluggable Database인 `FREEPDB1`을 실행합니다. SQL Developer 또는 SQL*Plus에서 관리자 계정으로 `FREEPDB1`에 접속한 뒤 애플리케이션 사용자를 생성합니다.

```text
호스트: localhost
포트: 1521
서비스 이름: FREEPDB1
```

```sql
ALTER SESSION SET CONTAINER = FREEPDB1;

CREATE USER construction_erp_app IDENTIFIED BY "your_strong_password";
GRANT CREATE SESSION, CREATE TABLE TO construction_erp_app;
ALTER USER construction_erp_app QUOTA UNLIMITED ON USERS;
```

백엔드가 시작될 때 `project-service/src/main/resources/schema.sql`이 실행되어 `PROJECTS` 테이블이 없는 경우 자동 생성됩니다.

### 2. 백엔드 실행

새 PowerShell을 열고 데이터베이스 접속 환경변수를 설정합니다.

```powershell
cd C:\Users\82104\Desktop\claude\e-study\project-service
$env:DB_USERNAME="your_username"
$env:DB_PASSWORD="your_password"
$env:DB_URL="jdbc:oracle:thin:@//localhost:1521/FREEPDB1"
mvn clean compile
mvn spring-boot:run
```

백엔드는 `http://localhost:8081`에서 실행됩니다.

- Swagger UI: http://localhost:8081/swagger-ui.html
- OpenAPI JSON: http://localhost:8081/v3/api-docs
- Project API: http://localhost:8081/api/projects

### 3. 프런트엔드 실행

별도 PowerShell을 열어 실행합니다.

```powershell
cd C:\Users\82104\Desktop\claude\e-study\construction-erp-frontend
npm install
npm run dev
```

브라우저에서 http://localhost:3000 에 접속합니다.

API 주소를 변경해야 하면 `.env.example`을 `.env`로 복사하고 값을 수정합니다.

```text
VITE_API_BASE_URL=http://localhost:8081/api
```

환경변수를 변경한 경우 프런트엔드 개발 서버를 다시 시작해야 합니다.

## 제공 기능

- 프로젝트 전체 목록과 상세 정보 조회
- 프로젝트 등록, 수정 및 삭제
- 프로젝트명 필수 및 예산 음수 방지 검증
- 프로젝트 기간 검증
- 로딩 및 API 오류 표시
- 반응형 ERP 관리자 레이아웃
- Swagger 기반 REST API 문서

대시보드, 자원/재료, 인력, 재무/회계 메뉴는 현재 안내 화면만 제공합니다.

## 건설 ERP 학습 방향

이 프로젝트는 실무 건설 ERP에서 제공하는 업무 서비스의 범위와 화면 구성을 학습 아이디어로 참고합니다. 특정 회사의 소스 코드, 데이터베이스 객체, 화면별 DLL 구조 또는 레거시 구현을 복제하지 않습니다.

현재의 Java 17, Spring Boot, JPA, Oracle 및 React/Vite 기반 구현 방식과 프로젝트 구조를 유지하면서 다음 업무 영역을 단계적으로 확장합니다.

- 인사
- 연말정산
- 경영
- 회계
- 자금
- 영업
- 공사
- 외주
- 자재
- 노무
- 경비
- 안전보건
- 공통

화면과 기능을 설계할 때는 조회 조건, 목록 Grid, 상세 Form, 공통코드 선택, 현장·거래처·품목 검색, 등록·수정·삭제 및 사용자 권한처럼 ERP에서 공통적으로 필요한 업무 흐름만 참고합니다.

우선 학습 후보는 다음과 같습니다.

1. 자재 품목 조회 및 관리
2. 현장별 자재 요청
3. 거래처와 외주업체 관리
4. 발주 및 입고·재고 관리
5. 공사 현장과 담당자 관리
6. 인사·노무 기초정보
7. 회계·자금 현황

각 기능은 기존 코드 구조를 먼저 확인한 뒤 현재 아키텍처에 맞게 구현하며, 레거시 시스템의 명명 규칙이나 기술 구조를 그대로 도입하지 않습니다.

## 프로덕션 빌드 확인

```powershell
cd project-service
mvn clean compile

cd ..\construction-erp-frontend
npm run build
```
