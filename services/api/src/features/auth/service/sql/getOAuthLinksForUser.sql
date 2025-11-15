-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   getOAuthLinksForUser.sql                           :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/14 22:08:26 by jeportie          #+#    #+#             --
--   Updated: 2025/11/14 22:09:10 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    provider,
    provider_sub,
    email_at_login, 
    profile_picture, 
    created_at
FROM
    user_oauth_providers
WHERE
    user_id = :user_id;
