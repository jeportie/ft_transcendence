-- ************************************************************************** --
--                                                                            --
--                                                        :::      ::::::::   --
--   010_oauth_pkce.sql                                 :+:      :+:    :+:   --
--                                                    +:+ +:+         +:+     --
--   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        --
--                                                +#+#+#+#+#+   +#+           --
--   Created: 2025/11/13 10:15:00 by jeportie          #+#    #+#             --
--   Updated: 2025/11/13 10:15:00 by jeportie         ###   ########.fr       --
--                                                                            --
-- ************************************************************************** --

-- -------------------------------------------------------------------------- --
-- PKCE OAuth State Table
--
-- Purpose:
--   Store short-lived OAuth "state" and PKCE "code_verifier" secrets.
--   Each row represents one OAuth authorization attempt.
--
-- Columns:
--   id            - Primary key.
--   state         - Random, unique anti-CSRF state string.
--   code_verifier - PKCE verifier (high-entropy secret).
--   created_at    - Timestamp of creation.
--   consumed_at   - Timestamp when the state was used (one-time use).
-- -------------------------------------------------------------------------- --

CREATE TABLE IF NOT EXISTS oauth_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL UNIQUE,
    code_verifier TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    consumed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_active
    ON oauth_states (state, consumed_at);
