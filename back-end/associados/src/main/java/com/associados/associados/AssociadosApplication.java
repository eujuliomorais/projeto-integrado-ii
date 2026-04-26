package com.associados.associados;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AssociadosApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssociadosApplication.class, args);
	}

}
