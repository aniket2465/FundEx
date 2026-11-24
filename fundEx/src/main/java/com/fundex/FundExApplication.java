package com.fundex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FundExApplication {

	public static void main(String[] args) {

		SpringApplication.run(FundExApplication.class, args);


	}

}
