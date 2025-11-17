-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findActivationTokenByUserId.sql                    :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 22:45:06 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 23:09:10 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    *
FROM
    activation_tokens
WHERE
    user_id = :user_id
ORDER BY 
    created_at DESC
LIMIT 1;
