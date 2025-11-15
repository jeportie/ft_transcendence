-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   createOAuthLink.sql                                :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/14 22:07:18 by jeportie          #+#    #+#             --
--   Updated: 2025/11/14 22:07:42 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO user_oauth_providers
    (user_id, provider, provider_sub, email_at_login, profile_picture)
VALUES
    (:user_id, :provider, :provider_sub, :email_at_login, :profile_picture);
