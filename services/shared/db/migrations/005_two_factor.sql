-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   005_two_factor.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/27 by jeportie                   #+#    #+#             --
--   Updated: 2025/09/27 21:53:52 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Two-Factor Authentication (2FA) support
--
-- Purpose:
--   Adds columns and tables needed for TOTP-based 2FA (Google Authenticator)
--   and backup codes.
--
-- Changes:
--   - Extend `users` with:
--       * f2a_secret: Base32 secret for TOTP (NULL if disabled).
--       * f2a_enabled: Boolean flag indicating if 2FA is active.
--
--   - New table `backup_codes`:
--       * Stores Argon2-hashed backup codes tied to a user.
--       * Each code is single-use (marked used_at when consumed).
--
-- Notes:
--   - Secrets are stored as raw base32 (not encrypted in this MVP).
--     In production, consider encrypting them with a server key.
--   - Backup codes are hashed like passwords to avoid leaking plaintext.
--
-- ASCII representation:
--
-- users
-- +----+----------+-------------+------------------+--------+-------------+--------------+-------------+--------------+
-- | id | username | email       | password_hash    | role   | created_at  | updated_at   | f2a_secret  | f2a_enabled  |
-- +----+----------+-------------+------------------+--------+-------------+--------------+-------------+--------------+
--
-- backup_codes
-- +----+---------+-------------------+---------------------+
-- | id | user_id | code_hash         | used_at             |
-- +----+---------+-------------------+---------------------+
-- -------------------------------------------------------------------------- --

ALTER TABLE users
ADD COLUMN f2a_secret TEXT DEFAULT NULL;

ALTER TABLE users
ADD COLUMN f2a_enabled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS backup_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code_hash TEXT NOT NULL,
    used_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
