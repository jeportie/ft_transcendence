-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   006_email_activation.sql                           :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/05 18:12:54 by jeportie          #+#    #+#             --
--   Updated: 2025/10/05 20:36:09 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Email Activation Support
--
-- Purpose:
--   Adds support for user account activation via email confirmation link.
--
-- Changes:
--   - Extend `users` with:
--       * is_active: Boolean flag (0 = inactive, 1 = active).
--
--   - New table `activation_tokens`:
--       * Stores unique activation tokens associated with each user.
--       * Each token has an expiration time and is marked once used.
--
-- Notes:
--   - Upon registration, a token is generated and emailed to the user.
--   - The user becomes active only after accessing the activation link.
--   - Tokens are automatically invalidated after their expiration or use.
--
-- ASCII representation:
--
-- users
-- +----+----------+---------+------------------+----------+-------------+
-- | id | username | email   | password_hash    | is_active| created_at  |
-- +----+----------+---------+------------------+----------+-------------+
--
-- activation_tokens
-- +----+---------+---------+--------------+--------------+-----------+
-- | id | user_id | token   | created_at   | expires_at   | used_at   |
-- +----+---------+---------+--------------+--------------+-----------+
-- -------------------------------------------------------------------------- --

ALTER TABLE users
ADD COLUMN is_active INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS activation_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    used_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activation_tokens_user
ON activation_tokens(user_id);
