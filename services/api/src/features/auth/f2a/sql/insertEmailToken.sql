-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   insertEmailToken.sql                               :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/18 12:14:23 by jeportie          #+#    #+#             --
--   Updated: 2025/11/18 12:14:28 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

INSERT INTO email_tokens (user_id, token_hash, expires_at)
VALUES (:user_id, :token_hash, :expires_at);
