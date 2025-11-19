-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   updateMfaMethod.sql                                :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 12:14:18 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:14:44 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

UPDATE mfa_methods
SET
    enabled = :enabled,
    secret = :secret,
    updated_at = datetime('now')
WHERE
    id = :id
