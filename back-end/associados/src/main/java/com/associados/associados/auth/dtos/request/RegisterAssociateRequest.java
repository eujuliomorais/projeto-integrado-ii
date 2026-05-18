package com.associados.associados.auth.dtos.request;

import jakarta.validation.Valid;

public record RegisterAssociateRequest(
    @Valid RegisterManagementUserDto managementData,
    @Valid RegisterCompleteUserDto userData
) {
    
}
