package com.raiff.alepessoaapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Para liberar a conexão do navegador com o React
        registry.addMapping("/**")
                .allowedOrigins("*") // Aceita conexão do React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Libera o HEAD e GET
                .allowedHeaders("*");
    }
}