// AUTO-GENERATED — DO NOT EDIT
export const sql = {
  "admin": {
    "getUsers": "SELECT id, username, email, role, created_at FROM users ORDER BY id"
  },
  "user": {
    "getMe": "SELECT id, username, password_hash, email, role, created_at, f2a_enabled FROM users WHERE id = :id;"
  }
};
