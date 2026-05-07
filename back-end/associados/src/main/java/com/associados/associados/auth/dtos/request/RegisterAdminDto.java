package com.associados.associados.auth.dtos.request;

import com.associados.associados.user.enums.RoleEnum;
import com.fasterxml.jackson.annotation.JsonUnwrapped;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record RegisterAdminDto(
        @JsonUnwrapped
        @Valid
        BaseRegisterDto baseData,

        @NotNull(message = "Role is required")
        RoleEnum role
) {
        public RegisterAdminDto(String string, String string2, String string3, RoleEnum admin) {
		this(new BaseRegisterDto(string, string2, string3, string3, string3), admin);
	}

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
