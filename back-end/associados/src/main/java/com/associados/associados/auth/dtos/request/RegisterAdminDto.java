package com.associados.associados.auth.dtos.request;

import com.associados.associados.user.enums.RoleEnum;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterAdminDto(
        @Valid
        BaseRegisterDto baseData,

        @NotNull(message = "Role is required")
        RoleEnum role
) {
        public String email() {
                return baseData.email();
        }

        public String password() {
                return baseData.password();
        }

        public String fullName() {
                return baseData.fullName();
        }

        public String cpf() {
                return baseData.cpf();
        }

        public String phone() {
                return baseData.phone();
        }
}
