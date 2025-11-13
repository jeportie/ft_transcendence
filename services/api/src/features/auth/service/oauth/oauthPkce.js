// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   oauthPkce.js                                       :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/11/13 10:42:33 by jeportie          #+#    #+#             //
//   Updated: 2025/11/13 10:46:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import crypto from "crypto";

// Generate a high-entropy PKCE code_verifier
export function generateCodeVerifier() {
    // 32 bytes → 43+ chars URL-safe base64, OK by spec
    return crypto.randomBytes(32).toString("base64url");
}

// Compute S256 code_challenge from verifier
export function generateCodeChallenge(verifier) {
    const hash = crypto.createHash("sha256").update(verifier).digest();
    // Node 18+ supports 'base64url'
    return Buffer.from(hash).toString("base64url");
}

// Generate "state" (anti-CSRF, links start <-> callback)
export function generateState() {
    return crypto.randomBytes(32).toString("hex");
}

// Create and persist a PKCE state, return challenge and state
export async function createPkceState(fastify) {
    const db = await fastify.getDb();

    const state = generateState();
    const verifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(verifier);

    await db.run(
        "INSERT INTO oauth_states (state, code_verifier) VALUES (?, ?)",
        state,
        verifier
    );

    return { state, codeChallenge };
}

// Consume state and retrieve verifier (one-time)
export async function consumePkceState(fastify, state) {
    const db = await fastify.getDb();

    const row = await db.get(
        "SELECT id, code_verifier, consumed_at FROM oauth_states WHERE state = ?",
        state
    );

    if (!row || row.consumed_at) {
        return null; // invalid or already used
    }

    await db.run(
        "UPDATE oauth_states SET consumed_at = datetime('now') WHERE id = ?",
        row.id
    );

    return row.code_verifier;
}
