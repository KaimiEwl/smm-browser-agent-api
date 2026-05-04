# SMM Browser Agent API

![Project preview](docs/screenshots/preview.png)

A prototype web interface for launching visible browser automation tasks through an AI agent.

## Demo

- GitHub: https://github.com/KaimiEwl/smm-browser-agent-api
- Live demo: not applicable for this project type
- Video: planned
- Case notes: see `docs/architecture.md`

## What it shows

This project shows AI-agent orchestration, FastAPI routing, browser-use integration and Playwright-style automation concepts.

## Features

- FastAPI web interface
- Task endpoint for browser agent runs
- Visible browser automation configuration
- Static/templates UI shell
- OpenAI-backed agent execution

## Tech stack

- FastAPI
- browser-use
- LangChain OpenAI
- Playwright
- Jinja templates

## Local setup

```
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
python main.py
```

## Verification

```
python -m py_compile main.py
```

## Status

Prototype export. API keys and local virtual environments are excluded.

## Security and cleanup

This public repository is a clean portfolio export. It intentionally excludes production secrets, local databases, logs, generated media, backups, runtime folders and private deployment artifacts.
