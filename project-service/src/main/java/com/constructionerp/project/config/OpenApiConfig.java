package com.constructionerp.project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Project Service의 OpenAPI 문서 메타데이터를 설정한다.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI projectServiceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Construction ERP Project Service API")
                        .description("Construction ERP 프로젝트 관리 마이크로서비스 API")
                        .version("v1"));
    }
}
