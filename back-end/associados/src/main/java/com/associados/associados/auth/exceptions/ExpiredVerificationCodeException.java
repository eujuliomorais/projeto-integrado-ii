package com.associados.associados.auth.exceptions;

public class ExpiredVerificationCodeException extends RuntimeException {
    public ExpiredVerificationCodeException(String message) {
        super(message);
    }

}
