-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findUserByEmail.sql                                :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/26 18:46:15 by jeportie          #+#    #+#             --
--   Updated: 2025/09/26 18:46:23 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    id,
    username,
    email,
    password_hash,
    role
FROM
    users
WHERE
    email = :email
LIMIT 1;
