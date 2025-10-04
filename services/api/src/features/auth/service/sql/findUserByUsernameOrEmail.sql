-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findUserByUsernameOrEmail.sql                      :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/26 15:52:28 by jeportie          #+#    #+#             --
--   Updated: 2025/09/26 16:03:55 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    id,
    username,
    email,
    password_hash,
    role,
    f2a_enabled
FROM
    users
WHERE
    username = :username
OR
    email = :email 
LIMIT
    1;
