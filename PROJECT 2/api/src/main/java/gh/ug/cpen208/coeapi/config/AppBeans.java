package gh.ug.cpen208.coeapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Shared beans. Uses BCrypt (same algorithm the seed data was hashed with),
 * so seeded accounts and newly-registered accounts verify identically.
 */
@Configuration
public class AppBeans {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
