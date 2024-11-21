package com.codelab.codelab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@SpringBootApplication(scanBasePackages={"com.codelab.codelab"})
public class CodelabApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodelabApplication.class, args);
	}

}
