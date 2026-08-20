---
name: live-info
description: Search the live internet with Tavily for current news, events, facts, prices, schedules, releases, and other up-to-date information.
metadata:
  require-secret: true
  require-secret-description: Paste your Tavily API key (it starts with tvly-). Create one at https://app.tavily.com/
  homepage: https://github.com/jimliddle/Tavily-Search-Skill-AI-Edge-Gallery
---

# Live Info

Use this skill whenever the user asks for something that may have changed
recently or cannot be answered from memory: current news, today's events,
recent or breaking stories, live facts, prices, schedules, or product releases.

## Instructions

Call the `run_js` tool with the following exact parameters:
- script name: `index.html`
- data: A JSON string with the following field:
  - query: Required string. The user's question, rewritten as a concise and
    self-contained web search query. Preserve names, dates, locations, and
    other details needed to answer accurately.

After the tool succeeds, answer from its `result` and include the most relevant
source URLs it provides. Do not invent facts or URLs that are absent from the
tool result. If the tool reports an error, explain it briefly and do not answer
the time-sensitive part of the question from memory.
