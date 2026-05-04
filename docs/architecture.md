# Architecture

## Purpose

A prototype web interface for launching visible browser automation tasks through an AI agent.

## Main flow

`	ext
User task -> FastAPI endpoint -> browser-use Agent -> visible browser -> result returned to UI
`

## Design notes

The project is intentionally small and demonstrates the integration boundary rather than a hardened production service.

## Portfolio note

This repository is packaged for review. Some runtime integrations require local credentials or external services and are represented with .env.example instead of real secrets.
