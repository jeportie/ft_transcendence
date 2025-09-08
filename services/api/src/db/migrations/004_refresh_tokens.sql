-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   004_refresh_tokens.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/08 by jeportie                   #+#    #+#             --
--   Updated: 2025/09/08 18:08:59 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Refresh Tokens table
--
-- Purpose:
--   Stores hashed refresh tokens for user sessions.
--   Each row represents one active session (browser, device, etc.).
--   The token is stored as a secure hash (never plaintext).
--
-- Columns:
--   id           - Auto-incremented primary key (unique identifier).
--   user_id      - Foreign key linking to the users table (required).
--   token_hash   - Unique, securely hashed refresh token (required).
--   user_agent   - Optional user-agent string (browser/device info).
--   ip           - Optional IP address of the client.
--   created_at   - Timestamp when the token was created (defaults to now).
--   last_used_at - Timestamp of the last use (updated on refresh).
--   expires_at   - Expiration timestamp after which token is invalid.
--   revoked_at   - Timestamp when token was explicitly revoked (nullable).
--
-- Constraints:
--   - `FOREIGN KEY (user_id)` ensures token ownership consistency.
--   - `ON DELETE CASCADE` removes tokens if the user is deleted.
--   - `token_hash` is UNIQUE to prevent duplicates.
--
-- Indexes:
--   - idx_refresh_tokens_user  → Speeds up lookups by user_id.
--   - idx_refresh_tokens_valid → Speeds up queries filtering by expiry/revocation.
--
-- ASCII representation:
--
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+
-- | id | user_id | token_hash       | user_agent  | ip        | created_at          | last_used_at        | expires_at          | revoked_at          |
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+
-- |  1 |   1     | <hash>           | Firefox/123 | 1.2.3.4   | 2025-09-08 14:00:00 | 2025-09-08 16:10:00 | 2025-09-22 14:00:00 | NULL                |
-- |  2 |   2     | <hash>           | Safari/17   | 5.6.7.8   | 2025-09-08 14:30:00 | NULL                | 2025-09-15 14:30:00 | 2025-09-09 10:00:00 |
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+
--
-- Example queries:
--   SELECT * FROM refresh_tokens WHERE user_id = 1;
--   → Returns all sessions for user with id=1.
--
--   DELETE FROM refresh_tokens WHERE revoked_at IS NOT NULL OR expires_at < datetime('now');
--   → Cleans up expired or revoked tokens.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_used_at TEXT,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_valid ON refresh_tokens(expires_at, revoked_at);
