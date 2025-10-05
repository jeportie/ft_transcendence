-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertActivationToken.sql                          :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/05 19:51:09 by jeportie          #+#    #+#             --
--   Updated: 2025/10/05 19:52:36 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    activation_tokens (user_id, token, expires_at)
VALUES
    (:user_id, :token, :expires_at);
