-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   010_user_oauth_providers.sql                       :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/14 21:54:27 by jeportie          #+#    #+#             --
--   Updated: 2025/11/14 21:55:56 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- OAuth Provider Linking Table
--
-- Purpose:
--   Links external OAuth identities (Google, GitHub, 42) to local users.
--   Enables multi-provider accounts and stable logins even if email missing.
--
-- Columns:
--   user_id        - Local user reference (FK).
--   provider       - Provider name ('google', 'github', '42').
--   provider_sub   - Stable user ID from provider.
--   email_at_login - Optional email value returned by provider.
--   profile_picture- Optional avatar/profile image.
--   created_at     - Timestamp of link creation.
--
-- Constraints:
--   UNIQUE(provider, provider_sub) ensures stable identity binding.
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS user_oauth_providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    provider TEXT NOT NULL,
    provider_sub TEXT NOT NULL,
    email_at_login TEXT,
    profile_picture TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(provider, provider_sub)
);

CREATE INDEX IF NOT EXISTS idx_oauth_user
ON user_oauth_providers(user_id);
