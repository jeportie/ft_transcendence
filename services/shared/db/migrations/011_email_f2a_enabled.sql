-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   011_email_f2a_enabled.sql                          :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/18 11:37:40 by jeportie          #+#    #+#             --
--   Updated: 2025/11/18 12:13:50 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Email-based Two-Factor Authentication (2FA)
--
-- Purpose:
--   Adds support for a secondary 2FA method using email-delivered codes.
--
-- Changes:
--   1. Extend `users` with:
--        * f2a_email_enabled : Boolean flag (0/1).
--
--   2. Create table `email_tokens`:
--        * Stores a hashed 6-digit code for a user.
--        * Each entry expires and is single-use.
--        * A user can only have one active email token at a time.
--
-- ASCII representation:
--
-- users
-- +----+----------+-------------+------------------+--------+--------------+-------------------+
-- | id | username | email       | password_hash    | role   | f2a_enabled  | f2a_email_enabled |
-- +----+----------+-------------+------------------+--------+--------------+-------------------+
--
-- email_tokens
-- +----+---------+--------------------+---------------------+---------------------+
-- | id | user_id | token_hash         | created_at          | expires_at          |
-- +----+---------+--------------------+---------------------+---------------------+
--
-- Notes:
--   - token_hash is Argon2-hashed (never store plaintext).
--   - expires_at ensures validity window (e.g., 10 minutes).
--   - On new request: delete existing token for user, insert a fresh one.
-- -------------------------------------------------------------------------- --

ALTER TABLE users
ADD COLUMN f2a_email_enabled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS email_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

