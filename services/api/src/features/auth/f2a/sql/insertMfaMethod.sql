-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertMfaMethod.sql                                :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 12:13:35 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:13:55 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    mfa_methods (user_id, type, secret, enabled, is_primary)
VALUES (:user_id, :type, :secret, :enabled, :is_primary)
