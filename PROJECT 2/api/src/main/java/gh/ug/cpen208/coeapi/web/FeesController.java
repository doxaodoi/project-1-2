package gh.ug.cpen208.coeapi.web;

import gh.ug.cpen208.coeapi.service.FeesService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Exposes the Project 1 outstanding-fees function over HTTP. */
@RestController
@RequestMapping("/api/fees")
public class FeesController {

    private final FeesService fees;

    public FeesController(FeesService fees) {
        this.fees = fees;
    }

    /**
     * GET /api/fees/outstanding
     * Returns the JSON array produced by finance.get_outstanding_fees()
     * (every student's billed / paid / outstanding amounts).
     */
    @GetMapping("/outstanding")
    public ResponseEntity<String> outstanding() {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(fees.getAllOutstandingJson());
    }
}
