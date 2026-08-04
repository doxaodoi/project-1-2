package gh.ug.cpen208.coeapi.service;

import gh.ug.cpen208.coeapi.repository.FeesRepository;
import org.springframework.stereotype.Service;

@Service
public class FeesService {

    private final FeesRepository fees;

    public FeesService(FeesRepository fees) {
        this.fees = fees;
    }

    /** Raw JSON array from the Project 1 finance.get_outstanding_fees() function. */
    public String getAllOutstandingJson() {
        return fees.getAllOutstandingJson();
    }
}
