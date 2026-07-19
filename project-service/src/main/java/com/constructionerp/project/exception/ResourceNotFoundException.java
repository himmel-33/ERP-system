package com.constructionerp.project.exception;

/**
 * 요청한 프로젝트 리소스를 찾을 수 없을 때 사용하는 예외이다.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
