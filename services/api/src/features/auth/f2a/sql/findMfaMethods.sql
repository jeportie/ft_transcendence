-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findMfaMethods.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 12:11:57 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:12:12 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    id,
    user_id,
    type,
    secret,
    enabled,
    is_primary,
    created_at,
    updated_at,
    last_used_at
FROM
    mfa_methods
WHERE
    user_id = :user_id
