-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   getBackupCodes.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/28 15:59:02 by jeportie          #+#    #+#             --
--   Updated: 2025/10/04 21:19:06 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    id,
    code_hash,
    used_at
FROM
    backup_codes
WHERE
    user_id = :user_id
-- AND
    -- used_at IS NULL;
