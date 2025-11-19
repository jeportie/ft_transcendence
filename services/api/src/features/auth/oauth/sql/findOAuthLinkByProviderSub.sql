-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   findOAuthLinkByProviderSub.sql                     :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/14 21:58:23 by jeportie          #+#    #+#             --
--   Updated: 2025/11/14 22:06:44 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

SELECT
    users.id,
    users.username,
    users.email,
    users.password_hash,
    users.role,
    users.created_at,
    users.updated_at,
    users.is_active
FROM
    user_oauth_providers
JOIN
    users ON users.id = user_oauth_providers.user_id
WHERE
    user_oauth_providers.provider = :provider
  AND
    user_oauth_providers.provider_sub = :provider_sub;

