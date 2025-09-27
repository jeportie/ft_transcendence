import { AppError } from "../utils/AppError.js";

export const SystemErrors = {
    HealthNotFound: () =>
        new AppError("HEALTH_NOT_FOUND", "Health check not found", 404),
};
