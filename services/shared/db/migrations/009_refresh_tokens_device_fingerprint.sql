-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   009_refresh_tokens_device_fingerprint.sql          :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/04 18:13:34 by jeportie          #+#    #+#             --
--   Updated: 2025/11/04 18:17:15 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Device Fingerprint Extension for Refresh Tokens
--
-- Purpose:
--   Adds a stable per-device identifier to the refresh_tokens table.
--   This helps deduplicate sessions across changing IPs (e.g., mobile tethering)
--   and ensures each device/browser only maintains a single active refresh token.
--
-- Columns added:
--   - device_fingerprint : A persistent, client-generated UUID that identifies
--                          the physical device/browser. It remains stable across
--                          refreshes and IP changes.
--
-- Behavior:
--   - When a device performs a token refresh, the API associates the request
--     with its `device_fingerprint` (sent via the `x-device-id` header).
--   - Before inserting a new refresh token, the API deletes any existing token
--     for that same `(user_id, device_fingerprint)` pair.
--   - This ensures one active refresh token per device at a time.
--
-- Constraints:
--   - The new column is nullable for backward compatibility.
--   - An index `(user_id, device_fingerprint)` speeds up deduplication queries.
--
-- Example queries:
--   SELECT * FROM refresh_tokens WHERE user_id = 1;
--   → Returns one row per connected device, even if IP changes.
--
--   DELETE FROM refresh_tokens WHERE device_fingerprint IS NULL AND expires_at < datetime('now');
--   → Optionally cleans up legacy tokens without fingerprint.
--
-- ASCII representation:
--
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+--------------------------+
-- | id | user_id | token_hash       | user_agent  | ip        | created_at          | last_used_at        | expires_at          | revoked_at          | device_fingerprint       |
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+--------------------------+
-- |  1 |   1     | <hash>           | Firefox/123 | 1.2.3.4   | 2025-11-04 10:00:00 | 2025-11-04 14:00:00 | 2025-11-18 10:00:00 | NULL                | "8a9d7f22-b..."          |
-- |  2 |   1     | <hash>           | Safari/17   | 5.6.7.8   | 2025-11-04 11:00:00 | NULL                | 2025-11-11 11:00:00 | NULL                | NULL (legacy)            |
-- +----+---------+------------------+-------------+-----------+---------------------+---------------------+---------------------+---------------------+--------------------------+
-- -------------------------------------------------------------------------- --

-- Add a new column for stable per-device identification
ALTER TABLE refresh_tokens
ADD COLUMN device_fingerprint TEXT;

-- Create an index to efficiently find or delete tokens per user/device
CREATE INDEX IF NOT EXISTS idx_refresh_device
ON refresh_tokens (user_id, device_fingerprint);
