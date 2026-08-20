# Tavily Live Info for Google AI Edge Gallery

`live-info` is a JavaScript agent skill that gives
[Google AI Edge Gallery](https://github.com/google-ai-edge/gallery) access to
current web information through the [Tavily Search API](https://tavily.com/).

The skill is intended for prompts about current news, events, facts, prices,
schedules, and releases. A Tavily API key is required; Tavily offers free API
credits for new accounts.

## Install from GitHub Pages

AI Edge Gallery no longer supports running JavaScript skills directly from a
normal GitHub repository or `raw.githubusercontent.com` URL. Those endpoints do
not serve the files with the MIME types required by the app's WebView.

1. In this repository's **Settings > Pages**, select **Deploy from a branch**.
2. Select the `main` branch and the `/(root)` folder, then save.
3. In AI Edge Gallery, open **Agent Skills**, tap **Skills**, then **+** and
   **Load skill from URL**.
4. Enter this URL (with no trailing `SKILL.md`):

   ```text
   https://jimliddle.github.io/Tavily-Search-Skill-AI-Edge-Gallery
   ```

The `.nojekyll` file in this repository makes GitHub Pages publish `SKILL.md`
unchanged. If Pages has just been enabled, wait for its first deployment to
finish before importing the skill.

### Upgrading an older installation

AI Edge Gallery stores an imported skill definition and its source URL. It does
not automatically refresh an existing installation when this repository
changes. Delete the old `live-info` skill in the Skill Manager, then add it
again using the Pages URL or the updated local folder. This is also what causes
the new secure Tavily-key prompt to appear.

## Install from a local folder

Download or clone the repository, then use **Skills > + > Import from local
file** in AI Edge Gallery and select the repository folder. The selected folder
must contain both of these paths:

```text
SKILL.md
scripts/index.html
```

## Use

Ask a time-sensitive question such as “What are today's main UK technology
stories?” The first time the skill runs, AI Edge Gallery prompts for a secret.
Paste a Tavily API key beginning with `tvly-`. The key is stored by the app and
passed directly to the script; it is not stored in this repository or exposed
to the on-device model.

You can create a key at <https://app.tavily.com/>.

## Test

The compatibility and script tests use Node.js without third-party packages:

```sh
npm test
```

## Compatibility fix

Current AI Edge Gallery releases require:

- a lowercase `scripts/` directory;
- `metadata.require-secret` for API-key entry;
- the entry point `window["ai_edge_gallery_get_result"]` to accept the secret as
  its second argument; and
- a real web host, such as GitHub Pages, for URL-based JavaScript skills.

This repository now follows those requirements.
