-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   002_users.sql                                      :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/03 17:28:46 by jeportie          #+#    #+#             --
--   Updated: 2025/09/03 17:42:51 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Users table
--
-- Purpose:
--   Stores all registered accounts for the application.
--   Each row corresponds to a single user with authentication data
--   and basic role information.
--
-- Columns:
--   id            - Auto-incremented primary key (unique identifier).
--   username      - Unique handle chosen by the user (required).
--   email         - Optional email address, must be unique if provided.
--   password_hash - Hashed password for authentication (required).
--   role          - User role, defaults to 'player' (can be 'admin', etc.).
--   created_at    - Timestamp when the user was created (defaults to now).
--   updated_at    - Timestamp for last update (must be set by application).
--
-- Notes:
--   - Passwords are never stored in plaintext: only secure hashes go here.
--   - `updated_at` is nullable and should be updated manually by the app
--     whenever user info changes.
--   - Roles allow extending authorization in the future (RBAC).
--
-- ASCII representation:
--
-- +----+----------+-------------------+--------------------+--------+---------------------+---------------------+
-- | id | username | email             | password_hash      | role   | created_at          | updated_at          |
-- +----+----------+-------------------+--------------------+--------+---------------------+---------------------+
-- |  1 | player1  | user@example.com  | <hashed_password>  | player | 2025-09-03 17:40:00 | NULL                |
-- |  2 | admin    | admin@example.com | <hashed_password>  | admin  | 2025-09-03 17:41:00 | 2025-09-03 17:50:00 |
-- +----+----------+-------------------+--------------------+--------+---------------------+---------------------+
--
-- Example:
--   SELECT username, role FROM users;
--   → Returns list of users with their roles.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
);
