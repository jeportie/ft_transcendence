-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   useBackupCode.sql                                  :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/28 12:30:51 by jeportie          #+#    #+#             --
--   Updated: 2025/09/28 15:01:10 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

UPDATE
    backup_codes
SET 
    used_at = datetime('now')
WHERE
    user_id = :user_id
AND
    id = :id
AND
    used_at IS NULL;
