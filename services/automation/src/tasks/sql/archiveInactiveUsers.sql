-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   archiveInactiveUsers.sql                           :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 15:53:23 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 16:08:26 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    archived_users
SELECT
    u.*
FROM
    users u
JOIN
    activation_tokens t ON t.user_id = u.id
WHERE
    u.is_active = 0
    AND t.used_at IS NULL
    AND datetime(t.expires_at) <= datetime('now');
