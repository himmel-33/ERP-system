package com.constructionerp.project.service;

import com.constructionerp.project.dto.CreateProjectDTO;
import com.constructionerp.project.dto.ProjectDTO;
import com.constructionerp.project.dto.UpdateProjectDTO;
import com.constructionerp.project.entity.ProjectEntity;
import com.constructionerp.project.exception.ResourceNotFoundException;
import com.constructionerp.project.exception.ValidationException;
import com.constructionerp.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static com.constructionerp.project.util.ProjectConstants.DEFAULT_PROJECT_STATUS;

/**
 * 프로젝트 관련 비즈니스 로직이 구현될 서비스 골격이다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream().map(this::toDTO).toList();
    }

    public ProjectDTO getProjectById(UUID id) {
        return toDTO(findProject(id));
    }

    @Transactional
    public ProjectDTO createProject(CreateProjectDTO request) {
        validateDates(request.getStartDate(), request.getEndDate());
        ProjectEntity project = ProjectEntity.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .status(normalizeStatus(request.getStatus()))
                .projectManagerId(request.getProjectManagerId())
                .build();
        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public ProjectDTO updateProject(UUID id, UpdateProjectDTO request) {
        validateDates(request.getStartDate(), request.getEndDate());
        ProjectEntity project = findProject(id);
        project.setName(request.getName().trim());
        project.setDescription(request.getDescription());
        project.setLocation(request.getLocation());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setBudget(request.getBudget());
        project.setStatus(normalizeStatus(request.getStatus()));
        project.setProjectManagerId(request.getProjectManagerId());
        return toDTO(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(UUID id) {
        ProjectEntity project = findProject(id);
        projectRepository.delete(project);
    }

    private ProjectEntity findProject(UUID id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("프로젝트를 찾을 수 없습니다: " + id));
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new ValidationException("종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

    private String normalizeStatus(String status) {
        return status == null || status.isBlank() ? DEFAULT_PROJECT_STATUS : status.trim().toUpperCase();
    }

    private ProjectDTO toDTO(ProjectEntity project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .location(project.getLocation())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .budget(project.getBudget())
                .status(project.getStatus())
                .projectManagerId(project.getProjectManagerId())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
