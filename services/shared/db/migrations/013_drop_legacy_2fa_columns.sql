-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   013_drop_legacy_2fa_columns.sql                    :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/19 12:55:46 by jeportie          #+#    #+#             --
--   Updated: 2025/11/19 12:56:49 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

ALTER TABLE users DROP COLUMN f2a_secret;
ALTER TABLE users DROP COLUMN f2a_enabled;
ALTER TABLE users DROP COLUMN f2a_email_enabled;
