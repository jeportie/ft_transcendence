-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   purgeExpiredTokens.sql                             :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 15:53:33 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 17:25:26 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

DELETE FROM
    activation_tokens
WHERE
    (used_at IS NULL OR used_at = '')
  AND julianday(expires_at) <= julianday('now');
