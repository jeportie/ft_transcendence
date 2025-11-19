-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   012_mfa_methods.sql                                :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 11:59:31 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:00:21 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Multi-Factor Authentication Methods
--
-- Purpose:
--   Introduces a generic "mfa_methods" table to track which MFA factors are
--   enabled per user. This replaces the hard-coded boolean flags
--   (users.f2a_enabled, users.f2a_email_enabled) at the application level.
--
--   Each row represents a single MFA method for a user (TOTP, email, SMS, ...).
--
-- Columns:
--   id           - Auto-incremented primary key.
--   user_id      - FK to users.id.
--   type         - Method type ('totp', 'email', 'sms', 'webauthn', ...).
--   secret       - Optional secret/config (e.g. TOTP secret). NULL for email.
--   enabled      - 0/1 flag; rows are kept even if disabled for history.
--   is_primary   - 0/1 flag; at most one primary per user (enforced in app).
--   created_at   - When the method was created.
--   updated_at   - Last update timestamp (set by application).
--   last_used_at - Last successful use of this MFA method.
--
-- Notes:
--   - We DO NOT drop old columns in this migration to avoid breaking
--     existing code. Backend should stop reading:
--        * users.f2a_enabled
--        * users.f2a_email_enabled
--     and instead query mfa_methods.
--
--   - Existing data is migrated:
--       * If users.f2a_secret IS NOT NULL → insert a 'totp' method.
--       * If users.f2a_email_enabled = 1 → insert an 'email' method.
--
-- ASCII representation:
--
-- mfa_methods
-- +----+---------+--------+---------+---------+------------+---------------------+---------------------+---------------------+
-- | id | user_id | type   | secret  | enabled | is_primary | created_at          | updated_at          | last_used_at        |
-- +----+---------+--------+---------+---------+------------+---------------------+---------------------+---------------------+
-- | 1  |   1     | 'totp' | ABC...  |   1     |     1      | 2025-11-19 11:31:00 | NULL                | NULL                |
-- | 2  |   1     | 'email'| NULL    |   1     |     0      | 2025-11-19 11:31:00 | NULL                | NULL                |
-- +----+---------+--------+---------+---------+------------+---------------------+---------------------+---------------------+
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS mfa_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,           -- 'totp', 'email', 'sms', 'webauthn', ...
    secret TEXT,                  -- TOTP secret or other config, NULL for email
    enabled INTEGER NOT NULL DEFAULT 1,     -- 0/1
    is_primary INTEGER NOT NULL DEFAULT 0,  -- 0/1 (enforced in app logic)
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    last_used_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, type)
);

CREATE INDEX IF NOT EXISTS idx_mfa_methods_user
ON mfa_methods (user_id);

-- -------------------------------------------------------------------------- --
-- Data migration from legacy 2FA flags
--
-- 1) Migrate TOTP-based 2FA
--    If a user has a non-NULL f2a_secret, we create a 'totp' method.
--    The 'enabled' flag mirrors users.f2a_enabled (0/1).
-- -------------------------------------------------------------------------- --

INSERT INTO mfa_methods (user_id, type, secret, enabled, is_primary, created_at)
SELECT
    id              AS user_id,
    'totp'          AS type,
    f2a_secret      AS secret,
    CASE
        WHEN f2a_enabled IS NULL THEN 0
        ELSE f2a_enabled
    END             AS enabled,
    1               AS is_primary,
    datetime('now') AS created_at
FROM users
WHERE f2a_secret IS NOT NULL;

-- -------------------------------------------------------------------------- --
-- 2) Migrate email-based 2FA
--    If a user has f2a_email_enabled = 1, we create an 'email' method.
--    No secret is required; email_tokens table manages the codes themselves.
-- -------------------------------------------------------------------------- --

INSERT OR IGNORE INTO mfa_methods (user_id, type, enabled, is_primary, created_at)
SELECT
    id              AS user_id,
    'email'         AS type,
    f2a_email_enabled AS enabled,
    0               AS is_primary,
    datetime('now') AS created_at
FROM users
WHERE f2a_email_enabled = 1;

-- -------------------------------------------------------------------------- --
-- From this point on, the application should:
--   - Query `mfa_methods` to know which MFA methods are enabled.
--   - Treat: COUNT(enabled = 1) > 0  → "user has MFA".
--   - Consider f2a_secret / f2a_enabled / f2a_email_enabled as deprecated.
--
-- A later migration may safely DROP those columns once all code paths and
-- data are confirmed migrated and there is no production dependency.
-- -------------------------------------------------------------------------- --
