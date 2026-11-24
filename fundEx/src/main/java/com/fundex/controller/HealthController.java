
package com.fundex.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "application", "FundEx",
                "status", "UP"
        );
    }



    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint() {

        return Map.of(
                "message",
                "JWT authentication successful"
        );
    }



    @GetMapping("/me")
    public Map<String, String> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        return Map.of(
                "message", "Authenticated successfully",
                "email", email
        );
    }


}
