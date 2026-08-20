const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "scripts", "index.html");

function loadEntryPoint(fetchImplementation) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const script = html.match(/<script>([\s\S]*)<\/script>/);
  assert.ok(script, "scripts/index.html must contain an inline script");

  const context = {
    AbortController,
    clearTimeout,
    console,
    fetch: fetchImplementation,
    setTimeout,
    window: {},
  };
  vm.runInNewContext(script[1], context, { filename: htmlPath });
  return context.window.ai_edge_gallery_get_result;
}

test("skill uses the current Gallery layout and secret metadata", () => {
  assert.ok(fs.existsSync(htmlPath));
  const rootEntries = fs.readdirSync(root);
  assert.ok(rootEntries.includes("scripts"));
  assert.ok(!rootEntries.includes("Scripts"));

  const skill = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
  assert.match(skill, /^---\nname: live-info\n/m);
  assert.match(skill, /metadata:\n  require-secret: true\n/);
  assert.match(skill, /script name: `index\.html`/);

  const html = fs.readFileSync(htmlPath, "utf8");
  assert.doesNotMatch(html, /const TAVILY_API_KEY/);
});

test("searches Tavily with the secret and formats its answer and sources", async () => {
  let request;
  const run = loadEntryPoint(async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      async json() {
        return {
          answer: "The current answer.",
          results: [
            {
              title: "Example source",
              url: "https://example.com/story",
              content: "Supporting search snippet.",
            },
          ],
        };
      },
    };
  });

  const rawResult = await run('{"query":" latest example news "}', "tvly-test-secret");
  const result = JSON.parse(rawResult);
  const body = JSON.parse(request.options.body);

  assert.equal(request.url, "https://api.tavily.com/search");
  assert.equal(request.options.headers.Authorization, "Bearer tvly-test-secret");
  assert.equal(body.query, "latest example news");
  assert.equal(body.search_depth, "basic");
  assert.equal(body.include_answer, "basic");
  assert.match(result.result, /The current answer\./);
  assert.match(result.result, /https:\/\/example\.com\/story/);
  assert.match(result.result, /Supporting search snippet\./);
});

test("rejects missing model input or secret before making a request", async () => {
  let calls = 0;
  const run = loadEntryPoint(async () => {
    calls += 1;
  });

  assert.deepEqual(JSON.parse(await run("{}", "tvly-test-secret")), {
    error: "A non-empty search query is required.",
  });
  assert.deepEqual(JSON.parse(await run('{"query":"news"}', "")), {
    error: "A Tavily API key is required. Add it in this skill's secret settings and try again.",
  });
  assert.equal(calls, 0);
});

test("returns Tavily's API error without leaking the secret", async () => {
  const run = loadEntryPoint(async () => ({
    ok: false,
    status: 401,
    async json() {
      return { detail: { error: "Unauthorized: missing or invalid API key." } };
    },
  }));

  const rawResult = await run('{"query":"news"}', "tvly-secret-must-not-leak");
  const result = JSON.parse(rawResult);

  assert.equal(result.error, "Unauthorized: missing or invalid API key.");
  assert.doesNotMatch(rawResult, /tvly-secret-must-not-leak/);
});
