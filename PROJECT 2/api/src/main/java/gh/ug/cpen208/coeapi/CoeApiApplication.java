package gh.ug.cpen208.coeapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CPEN 208 Project 2 - CoE Department API / web service.
 *
 * Exposes the Project 1 database (students, enrollments, fees and the
 * outstanding-fees function) over a small JSON REST API secured with JWT.
 */
@SpringBootApplication
public class CoeApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoeApiApplication.class, args);
    }
}
