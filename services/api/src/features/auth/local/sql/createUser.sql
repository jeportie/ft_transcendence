-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   createUser.sql                                     :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/26 18:30:56 by jeportie          #+#    #+#             --
--   Updated: 2025/09/26 18:54:14 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    users (
        username,
        email,
        password_hash,
        role)
VALUES (
    :username,
    :email,
    :password_hash,
    :role
    )
