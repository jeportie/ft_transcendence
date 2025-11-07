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

-- Delete any refresh tokens that have either expired or been revoked.
DELETE FROM refresh_tokens
WHERE
    (revoked_at IS NOT NULL OR julianday(expires_at) <= julianday('now'));

