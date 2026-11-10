package com.cargomind.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CargoMindApplication {

	public static void main(String[] args) {
		SpringApplication.run(CargoMindApplication.class, args);
	}

}
