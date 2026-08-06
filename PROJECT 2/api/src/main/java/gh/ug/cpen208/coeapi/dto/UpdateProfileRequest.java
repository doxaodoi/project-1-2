package gh.ug.cpen208.coeapi.dto;

/** Editable contact details for a student (functionality 1). */
public record UpdateProfileRequest(String email, String phone) {}
