/**
 * Loads env files for Node seed/migrate scripts (Next.js does not inject .env for `node …`).
 * Later files override earlier ones (e.g. `.env.local` wins over `.env`).
 * Does not override variables already set in the shell.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILES = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
];

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function loadEnvFiles(cwd = process.cwd()) {
  let merged = {};
  for (const name of ENV_FILES) {
    merged = { ...merged, ...parseEnvFile(resolve(cwd, name)) };
  }
  for (const [key, val] of Object.entries(merged)) {
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

/** Prefer SANITY_API_WRITE_TOKEN; some setups use SANITY_TOKEN instead. */
export function getSanityWriteToken() {
  return (
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_TOKEN ||
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_API_READ_TOKEN ||
    null
  );
}

/** Returns the token or prints a short guide and exits the process. */
export function resolveSanityWriteTokenOrExit() {
  const token = getSanityWriteToken();
  if (token) {
    if (
      !process.env.SANITY_API_WRITE_TOKEN &&
      process.env.SANITY_API_READ_TOKEN
    ) {
      console.warn(
        "Using SANITY_API_READ_TOKEN for this script. Prefer renaming it to SANITY_API_WRITE_TOKEN in .env.local (same secret is fine if the token has Editor/write access).",
      );
    }
    return token;
  }

  console.error(`Missing Sanity write token for this script.

Add the secret string to a file in your project root (same folder as package.json), for example .env.local:

  SANITY_API_WRITE_TOKEN=sk…paste-the-full-secret-here

Important:
• Creating a token in sanity.io/manage only creates it on Sanity’s servers—you still have to copy the secret into .env.local once (Sanity shows it only at creation time).
• The name must be SANITY_API_WRITE_TOKEN (fallbacks include SANITY_TOKEN, SANITY_API_READ_TOKEN — read-named vars only work if the token actually has write access).
• These scripts read .env, .env.local, and .env.development(.local); they do not use Next.js’s automatic env loading.

https://www.sanity.io/docs/http-auth
`);
  process.exit(1);
}
