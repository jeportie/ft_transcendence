-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   getSession.sql                                     :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/29 13:00:00 by jeportie          #+#    #+#             --
--   Updated: 2025/10/29 13:00:00 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    t.id,
    t.user_agent,
    t.ip,
    t.created_at,
    t.last_used_at,
    t.expires_at,
    t.revoked_at
FROM
    refresh_tokens t
WHERE
    t.user_id = :user_id
ORDER BY
    t.created_at DESC;

