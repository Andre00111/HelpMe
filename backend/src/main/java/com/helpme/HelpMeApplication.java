package com.helpme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.helpme"})
public class HelpMeApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelpMeApplication.class, args);
    }
}
