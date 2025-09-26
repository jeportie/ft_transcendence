-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertRefreshToken.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/26 16:04:24 by jeportie          #+#    #+#             --
--   Updated: 2025/09/26 17:00:39 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    refresh_tokens (
        user_id,
        token_hash,
        user_agent,
        ip,
        expires_at,
        last_used_at
) VALUES (
    :user_id,
    :token_hash,
    :user_agent,
    :ip,
    :expires_at,
    datetime('now')
);
