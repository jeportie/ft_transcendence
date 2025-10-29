-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   revokeSession.sql                                  :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/29 14:55:52 by jeportie          #+#    #+#             --
--   Updated: 2025/10/29 14:56:23 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

UPDATE
    refresh_tokens
SET
    revoked_at = datetime('now')
WHERE
    id = :id AND
    user_id = :user_id AND
    revoked_at IS NULL;
