package gh.ug.cpen208.coeapi.web;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Public landing endpoint so hitting the root URL confirms the API is running. */
@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <html><body style="font-family:sans-serif;max-width:640px;margin:40px auto">
            <h2>CPEN 208 Project 2 &mdash; CoE Department API</h2>
            <p>The API is running. Endpoints:</p>
            <ul>
              <li><code>POST /api/auth/register</code></li>
              <li><code>POST /api/auth/login</code></li>
              <li><code>GET  /api/me</code> (auth)</li>
              <li><code>GET  /api/students/{id}</code> (auth)</li>
              <li><code>GET  /api/students/{id}/enrollments</code> (auth)</li>
              <li><code>GET  /api/students/{id}/payments</code> (auth)</li>
              <li><code>GET  /api/students/{id}/outstanding</code> (auth)</li>
              <li><code>GET  /api/fees/outstanding</code> (auth) &mdash; implements the Project 1 JSON function</li>
            </ul>
            </body></html>
            """;
    }
}
