-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findEmailToken.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/18 12:15:26 by jeportie          #+#    #+#             --
--   Updated: 2025/11/18 12:18:32 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    id,
    user_id,
    token_hash,
    created_at,
    expires_at
FROM
    email_tokens
WHERE
    user_id = :user_id
LIMIT 1
