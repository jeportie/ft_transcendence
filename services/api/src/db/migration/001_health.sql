-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   001_health.sql                                     :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/03 17:07:42 by jeportie          #+#    #+#             --
--   Updated: 2025/09/03 17:23:18 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Health table
--
-- Purpose:
--   This table is used as a simple health indicator for the API and database.
--   It is designed as a **singleton table**: only one row exists (id = 1).
--   The `/health` endpoint queries this row to report service status.
--
-- Columns:
--   id          - Always 1. Enforced by PRIMARY KEY + CHECK constraint.
--   status      - Textual status of the service (default: "ok").
--   updated_at  - Timestamp of the last update (default: CURRENT_TIMESTAMP).
--
-- Notes:
--   - The CHECK constraint ensures only `id = 1` is valid.
--   - The INSERT OR IGNORE statement seeds the row on first migration.
--
-- ASCII representation:
--
--   +----+--------+---------------------+
--   | id | status |     updated_at      |
--   +----+--------+---------------------+
--   | 1  |  ok    | 2025-09-03 17:23:18 |
--   +----+--------+---------------------+
--
-- Example:
--   SELECT * FROM health;
--   → Returns a single row with current status and timestamp.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS health (
    id INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'ok',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK id = 1
);

INSERT OR IGNORE INTO health (id, status, updated_at)
VALUES (1, 'ok', datetime('now'));
