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
  AND
    t.id = (
    SELECT
        id
    FROM
        refresh_tokens sub
    WHERE
        sub.user_id = t.user_id AND
        sub.ip = t.ip
    ORDER BY 
        sub.created_at DESC
    LIMIT 1
  )
ORDER BY t.created_at DESC;
