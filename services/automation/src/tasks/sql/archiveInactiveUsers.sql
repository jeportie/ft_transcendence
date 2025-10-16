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

INSERT INTO archived_users (
    id,
    username,
    email,
    password_hash,
    role,
    created_at,
    updated_at,
    is_active
)
SELECT
    u.id,
    u.username,
    u.email,
    u.password_hash,
    u.role,
    u.created_at,
    u.updated_at,
    u.is_active
FROM users u
JOIN activation_tokens t ON t.user_id = u.id
WHERE u.is_active = 0
  AND t.used_at IS NULL
  AND datetime(t.expires_at || 'Z') <= datetime('now');

