-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   purgeExpiredTokens.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 15:53:33 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 16:04:30 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

DELETE FROM
    activation_tokens
WHERE
    used_at IS NULL
  AND datetime(expires_at) <= datetime('now');
