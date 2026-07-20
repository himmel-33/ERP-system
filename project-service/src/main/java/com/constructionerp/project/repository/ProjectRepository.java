package com.constructionerp.project.repository;

import com.constructionerp.project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

/**
 * 프로젝트 엔티티의 기본 영속성 작업을 제공한다.
 */
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findByStatusIgnoreCase(String status);

    List<ProjectEntity> findByNameContainingIgnoreCase(String name);
}
