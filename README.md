# Browser Agent API Prototype

![Project preview](docs/screenshots/preview.png)

A small prototype for visible browser automation tasks. The stronger public version of this idea is now represented by [BROAGENTS Browser AI Runtime](https://github.com/KaimiEwl/broagents-browser-ai-runtime).

## Portfolio Status

This repository is kept as a code archive, not as a featured portfolio project.

For the polished portfolio story, open:

- Portfolio: https://kaimiewl.github.io/
- BROAGENTS: https://github.com/KaimiEwl/broagents-browser-ai-runtime

## What It Shows

This prototype shows FastAPI routing, browser-use integration and Playwright-style automation concepts.

## Features

- FastAPI web interface
- Task endpoint for browser agent runs
- Visible browser automation configuration
- Static/templates UI shell
- OpenAI-backed agent execution

## Stack

FastAPI, browser-use, LangChain OpenAI, Playwright, Jinja templates.

## Run Locally

```bash
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
python main.py
```

## Check

```bash
python -m py_compile main.py
```

## Status

Archived prototype export. API keys, local virtual environments, browser state and logs are excluded.
