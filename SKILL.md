---
name: live-info
description: Search the live internet using Tavily for current news, events, facts, prices, releases, and other up-to-date information.
---

# Live Info

Use this skill whenever the user asks for something that may have changed
recently or cannot be answered from memory: current news, today's events,
recent or breaking stories, live facts, prices, schedules, or product releases.

## Instructions

Call the `run_js` tool, passing as data a JSON string with the following field:
- query: String. The user's question, phrased as a concise web search query.

After the script returns, it provides a stringified JSON object containing a
`result` field (a summary followed by a numbered list of source URLs) or an
`error` field. On success, summarize the `result` conversationally for the user
and include the most relevant source URLs.
