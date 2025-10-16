-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   deleteInactiveUsers.sql                            :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/16 16:18:06 by jeportie          #+#    #+#             --
--   Updated: 2025/10/16 16:19:21 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

DELETE FROM
    users
WHERE
    id
IN (
  SELECT id FROM archived_users
  WHERE is_active = 0
);
