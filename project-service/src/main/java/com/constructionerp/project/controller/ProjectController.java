package com.constructionerp.project.controller;

import com.constructionerp.project.dto.CreateProjectDTO;
import com.constructionerp.project.dto.ProjectDTO;
import com.constructionerp.project.dto.UpdateProjectDTO;
import com.constructionerp.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * 프로젝트 API 요청을 처리할 REST 컨트롤러 골격이다.
 */
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "건설 프로젝트 생성, 조회, 수정 및 삭제 API")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "프로젝트 목록 조회", description = "등록된 모든 프로젝트를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "프로젝트 목록 조회 성공")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    @Operation(summary = "프로젝트 상세 조회", description = "프로젝트 ID로 상세 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로젝트 조회 성공",
                    content = @Content(schema = @Schema(implementation = ProjectDTO.class))),
            @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음", content = @Content)
    })
    public ResponseEntity<ProjectDTO> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @Operation(summary = "프로젝트 등록", description = "새 프로젝트를 등록하고 생성된 프로젝트를 반환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "프로젝트 생성 성공",
                    content = @Content(schema = @Schema(implementation = ProjectDTO.class))),
            @ApiResponse(responseCode = "400", description = "요청 데이터 검증 실패", content = @Content)
    })
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "프로젝트 수정", description = "기존 프로젝트 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로젝트 수정 성공",
                    content = @Content(schema = @Schema(implementation = ProjectDTO.class))),
            @ApiResponse(responseCode = "400", description = "요청 데이터 검증 실패", content = @Content),
            @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음", content = @Content)
    })
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectDTO request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "프로젝트 삭제", description = "프로젝트 ID에 해당하는 프로젝트를 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "프로젝트 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "프로젝트를 찾을 수 없음", content = @Content)
    })
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
