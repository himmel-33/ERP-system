package com.constructionerp.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * 프로젝트 영속성 데이터의 최소 골격을 나타낸다.
 */
@Entity
@Table(name = "Projects")
@Getter
@NoArgsConstructor
public class ProjectEntity {

    @Id
    @Column(name = "id", columnDefinition = "uniqueidentifier")
    private UUID id;
}
