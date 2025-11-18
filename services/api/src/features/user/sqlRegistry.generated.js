// AUTO-GENERATED — DO NOT EDIT
export const sql = {
  "admin": {
    "getUsers": "SELECT id, username, email, role, created_at FROM users ORDER BY id"
  },
  "user": {
    "getMe": "SELECT id, username, password_hash, email, role, created_at, f2a_enabled, f2a_email_enabled FROM users WHERE id = :id;",
    "updatePassword": "UPDATE users SET password_hash = :password_hash WHERE id = :user_id;"
  }
};
