// Central place for environment-driven configuration.
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";
export const AUTH_COOKIE = process.env.AUTH_COOKIE ?? "coe_token";
// Non-sensitive, readable cookie used only for UI routing (student vs admin).
export const ROLE_COOKIE = process.env.ROLE_COOKIE ?? "coe_role";
