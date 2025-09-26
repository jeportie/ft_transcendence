-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findRefreshTokenWithUserByHash.sql                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/26 16:43:56 by jeportie          #+#    #+#             --
--   Updated: 2025/09/26 16:50:55 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    rt.id,
    rt.user_id,
    rt.token_hash,
    rt.user_agent,
    rt.ip,
    rt.expires_at,
    rt.revoked_at,
    rt.last_used_at,
    u.username,
    u.role
FROM
    refresh_tokens rt
JOIN
    users u
ON
    u.id = rt.user_id
WHERE
    rt.token_hash = :token_hash;
