package com.constructionerp.project.exception;

/**
 * 프로젝트 요청 데이터가 유효하지 않을 때 사용하는 예외이다.
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }
}
