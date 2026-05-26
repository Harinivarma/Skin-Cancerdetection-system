package com.project.skin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class SkinCancerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkinCancerApplication.class, args);
    }
}