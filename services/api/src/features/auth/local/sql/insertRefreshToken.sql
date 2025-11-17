-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertRefreshToken.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/04 18:21:05 by jeportie          #+#    #+#             --
--   Updated: 2025/11/04 18:21:17 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Insert a new refresh token for a user session
--
-- Purpose:
--   Stores a new hashed refresh token (rotated or newly issued) in the
--   `refresh_tokens` table. Each row represents one device/browser session.
--
-- Columns:
--   - user_id           : Owner of the session.
--   - token_hash        : Hashed version of the refresh token (unique).
--   - user_agent        : User-Agent string for identifying browser/device.
--   - ip                : IP address of the client at the time of issue.
--   - device_fingerprint: (Optional) Stable per-device UUID provided by client.
--                         Enables deduplication and consistent session identity.
--   - expires_at        : Expiration date/time for the token.
--   - last_used_at      : Timestamp of last usage (defaults to now).
--
-- Notes:
--   - The device_fingerprint column may be NULL for legacy clients.
--   - The backend should delete any existing token for the same (user_id, device_fingerprint)
--     before inserting a new one.
--
-- Example:
--   INSERT INTO refresh_tokens (user_id, token_hash, user_agent, ip, device_fingerprint, expires_at, last_used_at)
--   VALUES (1, '<hash>', 'Firefox/118', '92.184.96.40', 'b58e0e83...', '2025-11-18 12:00:00', datetime('now'));
-- -------------------------------------------------------------------------- --

INSERT INTO
    refresh_tokens (
        user_id,
        token_hash,
        user_agent,
        ip,
        device_fingerprint,
        expires_at,
        last_used_at
    )
VALUES (
    :user_id,
    :token_hash,
    :user_agent,
    :ip,
    :device_fingerprint,
    :expires_at,
    datetime('now')
);
