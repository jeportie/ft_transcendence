-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   007_password_reset.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/07 11:07:40 by jeportie          #+#    #+#             --
--   Updated: 2025/10/07 11:09:24 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Password Reset Token Support
--
-- Purpose:
--   Adds a new table `password_reset_tokens` to manage secure password
--   recovery operations. Each token is linked to a specific user and
--   expires after a limited time.
--
-- Changes:
--   - New table `password_reset_tokens`:
--       * Stores Argon2-hashed reset tokens.
--       * Includes expiration and single-use tracking (used_at column).
--
-- Notes:
--   - Tokens are hashed with Argon2 for security. The original plaintext
--     token is only sent to the user (via email) and never stored.
--   - The `expires_at` column ensures tokens are time-limited.
--   - `used_at` is set when a token has been consumed to prevent reuse.
--   - When a user is deleted, their reset tokens are cascaded automatically.
--
-- ASCII representation:
--
-- password_reset_tokens
-- +----+---------+------------------+---------------------+---------------------+---------------------+
-- | id | user_id | token_hash       | created_at          | expires_at          | used_at             |
-- +----+---------+------------------+---------------------+---------------------+---------------------+
--
-- Example lifecycle:
--   1. User requests password reset.
--   2. System creates a new token (hashed) with expiry (e.g. +1h).
--   3. User clicks email link containing plaintext token.
--   4. System verifies token hash match, updates used_at.
--   5. Token cannot be reused after being marked used.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    used_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_password_reset_user
ON password_reset_tokens(user_id);
