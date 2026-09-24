# Cloud Agent npm publish

Cloud Agents can publish `guardz` to npm without using your local machine. Credentials never belong in the repository.

## One-time setup

### 1. Create an npm publish token

1. Sign in at [npmjs.com](https://www.npmjs.com/).
2. **Access Tokens** → **Generate New Token** → **Granular Access Token**.
3. Permissions: **Read and write** for package `guardz` (or the whole scope you use).
4. Copy the token once (npm shows it only at creation time).

Use an **Automation**-style token if your account has 2FA and you publish from CI/agents.

### 2. Add the token to Cursor (Runtime Secret)

1. Open [Cloud Agents → Secrets](https://cursor.com/dashboard?tab=cloud-agents) (Personal / My Secrets).
2. **Add secret**:
   - **Name:** `NPM_TOKEN`
   - **Type:** **Runtime Secret** (value stays redacted in chat and commits)
   - **Apply to:** this repository (or all repos you trust)
3. Save the secret value (the npm token).

If you use a repo-managed environment (`.cursor/environment.json`), Personal secrets still apply to agents for this repo.

### 3. Refresh the environment (after adding or changing secrets)

From [your environment](https://cursor.com/dashboard/cloud-agents/environments), run **Update with Agent** or start a **new** Cloud Agent. Existing VMs do not pick up new secrets.

## Publish from a Cloud Agent

On `main` with the release version bumped in `package.json`:

```bash
npm run release:publish
```

This runs `prepublishOnly` (`build` + `test:ci`), then `npm publish --access public`.

Typical release flow for the agent:

1. Merge release PR to `main`.
2. Tag: `git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`
3. Create GitHub Release (optional).
4. `npm run release:publish`

Verify:

```bash
npm view guardz version
```

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| `NPM_TOKEN is not set` | Add Runtime Secret `NPM_TOKEN`; start a **new** agent |
| `npm authentication failed` | Regenerate token with publish access to `guardz` |
| `ENEEDAUTH` on publish | Same as above; confirm secret type is **Runtime Secret**, not **Build Secret** |
| Publish succeeds but registry still old version | CDN cache; wait a minute or check `npm view guardz@X.Y.Z` |

Build Secrets are only for Docker **build** steps. Publishing at runtime requires a **Runtime Secret** or **Environment Variable** named `NPM_TOKEN`.
