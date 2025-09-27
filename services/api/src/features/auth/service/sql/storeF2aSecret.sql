-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   storeF2aSecret.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/09/28 00:10:17 by jeportie          #+#    #+#             --
--   Updated: 2025/09/28 00:20:03 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO users (id, f2a_secret, f2a_enabled)
VALUES (:user_id, :secret, 0)
ON CONFLICT(id) DO UPDATE SET
    f2a_secret = excluded.f2a_secret,
    f2a_enabled = excluded.f2a_enabled;
