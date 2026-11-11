package com.cargomind.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class ExecutorConfig {

    // Virtual threads: ideal for blocking HTTP calls (one Gemini request per offer, run in parallel)
    @Bean(destroyMethod = "close")
    public ExecutorService summaryExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}