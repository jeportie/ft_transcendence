-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   deleteRefreshTokenByDevice.sql                     :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/04 18:34:39 by jeportie          #+#    #+#             --
--   Updated: 2025/11/04 18:34:50 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- Delete refresh tokens belonging to the same (user_id, device_fingerprint)
--
-- Purpose:
--   Ensures only one refresh token exists per physical device/browser.
--   Removes duplicates created when IPs change or multiple logins occur
--   from the same device.
--
-- Notes:
--   - Does nothing if :device_fingerprint is NULL.
--   - Safe to call before inserting a new token.
--
-- Example:
--   DELETE FROM refresh_tokens
--   WHERE user_id = 1
--     AND device_fingerprint = 'b58e0e83-fc2b-4d9f-bdf1-cafedeadbeef';
-- -------------------------------------------------------------------------- --

DELETE FROM
    refresh_tokens
WHERE
    user_id = :user_id
    AND device_fingerprint = :device_fingerprint
    AND revoked_at IS NULL;
