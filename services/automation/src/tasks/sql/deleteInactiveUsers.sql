-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   deleteInactiveUsers.sql                            :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 16:18:06 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 16:19:21 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

DELETE FROM
    users
WHERE
    id
IN (
    SELECT u.id
    FROM users u
    JOIN activation_tokens t ON t.user_id = u.id
    WHERE u.is_active = 0
      AND t.used_at IS NULL
      AND datetime(t.expires_at) <= datetime('now')
);
