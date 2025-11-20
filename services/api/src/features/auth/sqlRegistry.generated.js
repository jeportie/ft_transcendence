// AUTO-GENERATED — DO NOT EDIT
export const sql = {
  "f2a": {
    "checkF2a": "SELECT f2a_enabled FROM users WHERE username = :username;",
    "checkF2aByMail": "SELECT f2a_enabled FROM users WHERE email = :email",
    "deleteBackupCode": "DELETE FROM backup_codes WHERE user_id = :user_id;",
    "disableF2a": "UPDATE users SET f2a_secret = NULL, f2a_enabled = 0 WHERE id = :user_id;",
    "enableF2a": "UPDATE users SET f2a_enabled = 1 WHERE id = :user_id;",
    "findUserById": "SELECT id, username, email, password_hash, role FROM users WHERE id = :id LIMIT 1;",
    "getBackupCodes": "SELECT id, code_hash, used_at FROM backup_codes WHERE user_id = :user_id -- used_at IS NULL;",
    "getF2aSecret": "SELECT f2a_secret FROM users WHERE id = :user_id LIMIT 1;",
    "insertBackupCodes": "INSERT INTO backup_codes (user_id, code_hash) VALUES (:user_id, :code_hash);",
    "storeF2aSecret": "UPDATE users SET f2a_secret = :secret, f2a_enabled = 0 WHERE id = :user_id;",
    "useBackupCode": "UPDATE backup_codes SET used_at = datetime('now') WHERE user_id = :user_id AND id = :id AND used_at IS NULL;"
  },
  "local": {
    "activateUser": "UPDATE users SET is_active = 1, updated_at = datetime('now') WHERE id = :user_id;",
    "createUser": "INSERT INTO users ( username, email, password_hash, role) VALUES ( :username, :email, :password_hash, :role )",
    "deleteRefreshTokenByDevice": "DELETE FROM refresh_tokens WHERE user_id = :user_id AND device_fingerprint = :device_fingerprint AND revoked_at IS NULL;",
    "deleteRefreshTokenByHash": "DELETE FROM refresh_tokens WHERE token_hash = :token_hash;",
    "deleteRefreshTokenByID": "DELETE FROM refresh_tokens WHERE id = :id;",
    "findActivationToken": "SELECT * FROM activation_tokens WHERE token = :token;",
    "findActivationTokenByUserId": "SELECT * FROM activation_tokens WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 1;",
    "findPwdResetToken": "SELECT * FROM password_reset_tokens WHERE token_hash = :token;",
    "findRefreshTokenWithUserByHash": "SELECT rt.id, rt.user_id, rt.token_hash, rt.user_agent, rt.ip, rt.expires_at, rt.revoked_at, rt.last_used_at, u.username, u.role FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id WHERE rt.token_hash = :token_hash;",
    "findUserByEmail": "SELECT id, username, email, password_hash, role FROM users WHERE email = :email LIMIT 1;",
    "findUserByUsernameOrEmail": "SELECT id, username, email, password_hash, role, f2a_enabled, is_active FROM users WHERE username = :username OR email = :email LIMIT 1;",
    "insertActivationToken": "INSERT INTO activation_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at);",
    "insertRefreshToken": "INSERT INTO refresh_tokens ( user_id, token_hash, user_agent, ip, device_fingerprint, expires_at, last_used_at ) VALUES ( :user_id, :token_hash, :user_agent, :ip, :device_fingerprint, :expires_at, datetime('now') );",
    "insertResetPasswordToken": "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, :expires_at);",
    "markActivationTokenUsed": "UPDATE activation_tokens SET used_at = datetime('now') WHERE id = :id;",
    "markPwdResetTokenUsed": "UPDATE password_reset_tokens SET used_at = datetime('now') WHERE id = :id;",
    "updatePassword": "UPDATE users SET password_hash = :password_hash WHERE id = :user_id;"
  },
  "oauth": {
    "activateUser": "UPDATE users SET is_active = 1, updated_at = datetime('now') WHERE id = :user_id;",
    "createOAuthLink": "INSERT INTO user_oauth_providers (user_id, provider, provider_sub, email_at_login, profile_picture) VALUES (:user_id, :provider, :provider_sub, :email_at_login, :profile_picture);",
    "createUser": "INSERT INTO users ( username, email, password_hash, role) VALUES ( :username, :email, :password_hash, :role )",
    "findOAuthLinkByProviderSub": "SELECT users.id, users.username, users.email, users.password_hash, users.role, users.created_at, users.updated_at, users.f2a_secret, users.f2a_enabled, users.is_active FROM user_oauth_providers JOIN users ON users.id = user_oauth_providers.user_id WHERE user_oauth_providers.provider = :provider AND user_oauth_providers.provider_sub = :provider_sub;",
    "findUserByEmail": "SELECT id, username, email, password_hash, role FROM users WHERE email = :email LIMIT 1;",
    "findUserById": "SELECT id, username, email, password_hash, role FROM users WHERE id = :id LIMIT 1;"
  },
  "sessions": {
    "getSession": "SELECT t.id, t.user_agent, t.ip, t.created_at, t.last_used_at, t.expires_at, t.revoked_at FROM refresh_tokens t WHERE t.user_id = :user_id ORDER BY t.created_at DESC;",
    "revokeSession": "UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE id = :id AND user_id = :user_id AND revoked_at IS NULL;"
  }
};
