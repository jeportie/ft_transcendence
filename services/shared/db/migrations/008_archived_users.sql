-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   008_archived_users.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 15:42:00 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 15:42:07 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Archived Users Table
--
-- Purpose:
--   Introduces a new table `archived_users` to store user data that has been
--   removed from the active `users` table. This preserves historical records
--   for auditing, analytics, or recovery without cluttering the main user
--   dataset.
--
-- Changes:
--   - New table `archived_users`:
--       * Mirrors key fields from `users` (id, username, email, etc.).
--       * Adds `archived_at` timestamp for when the user was archived.
--       * Retains metadata such as creation and update timestamps.
--
-- Notes:
--   - Data is moved here via an archival or cleanup process before deletion
--     from the main `users` table.
--   - `archived_at` defaults to the current timestamp at insertion time.
--   - The `is_active` flag can preserve the last known state of the user.
--   - This table is not linked via foreign keys to avoid dependency cycles
--     with the live system tables.
--
-- ASCII representation:
--
-- archived_users
-- +----+-----------+------------------+-------------------+--------+---------------------+---------------------+------------+---------------------+
-- | id | username  | email            | password_hash     | role   | created_at          | updated_at          | is_active  | archived_at         |
-- +----+-----------+------------------+-------------------+--------+---------------------+---------------------+------------+---------------------+
--
-- Example lifecycle:
--   1. User account is marked for deletion or deactivation.
--   2. A cleanup service copies user data into `archived_users`.
--   3. The original record is removed from the `users` table.
--   4. Archived data remains for compliance or later restoration.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS archived_users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    password_hash TEXT,
    role TEXT,
    created_at TEXT,
    updated_at TEXT,
    is_active INTEGER,
    archived_at TEXT NOT NULL DEFAULT (datetime('now'))
);
