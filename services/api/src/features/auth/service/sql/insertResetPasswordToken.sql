-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertResetPasswordToken.sql                       :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/10/07 14:41:27 by jeportie          #+#    #+#             --
--   Updated: 2025/10/07 15:11:28 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO
    password_reset_tokens (user_id, token_hash, expires_at)
VALUES
    (:user_id, :token_hash, :expires_at);
