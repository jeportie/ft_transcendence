-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   disableMfaMethod.sql                               :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 12:15:39 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:16:05 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

UPDATE
    mfa_methods
SET
    enabled = 0, updated_at = datetime('now')
WHERE
    user_id = :user_id AND type = :type
