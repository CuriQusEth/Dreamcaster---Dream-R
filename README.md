# Dreamseed Gardener & DreamCaster Orchestrator

Welcome to **Dreamseed Gardener**, a peaceful, magical gardening simulation game powered by the **DreamCaster Orchestrator**, an ERC-8004 compliant intelligent AI Agent.

## Platform Overview

The project provides a unified web experience combining:
1. **Dreamseed Gardener UI**: A mobile-first, canvas-rendered frontend for nurturing your dreamscape ecosystem.
2. **DreamCaster Orchestrator API**: An intelligent agent managing dream-casting, content generation, multi-task automation, and creative operations.

## Technical Stack

- **Framework**: Next.js 14+ (App Router) features alongside React & Vite
- **Styling**: Tailwind CSS & Framer Motion
- **Web3 Ecosystem**: Wagmi, Viem, and Base Smart Contracts (Mainnet `eip155:8453`)
- **Agent Standard**: ERC-8004 Trustless Agents (`registration-v1`)

## Agent Identity

- **Name**: DreamCaster Orchestrator
- **Status**: Online / Active
- **Version**: 1.0.0
- **Supported Chains**: Base (`eip155:8453`)
- **Capabilities**: `dream-casting`, `content-generation`, `creative-orchestration`, `multi-task-automation`, `daily-operations`, `mcp-command-execution`

### Core Service Endpoints

- **Agent Identity Card**: `/.well-known/agent-card.json` (A2A capabilities)
- **Agent Control API**: `/api/agent` (Main agent info endpoint)
- **MCP Server Endpoint**: `/api/mcp` (Model Context Protocol)

## Model Context Protocol (MCP) Connection Guide

The DreamCaster Orchestrator exposes an MCP server for active command execution. To integrate:

1. **Handshake**: Clients must initially send an `initialize` JSON-RPC request to `/api/mcp`.
2. **Tool Discovery**: Retrieve the orchestrator's available capabilities by posting a `tools/list` request. Current active capabilities include:
   - `get_race_status`
   - `start_race`
   - `get_leaderboard`
   - `optimize_speed`
   - `get_track_info`
3. **Execution**: Invoke commands via `tools/call`.
4. **Resources & Prompts**: Additional context can be sourced via `prompts/list` and `resources/list`.

## Running Locally

1. Clone or download the repository.
2. Run `npm install` to load dependencies.
3. Start the dev server using `npm run dev`.
4. Access the frontend locally dynamically assigned by Vite, and the `app/api/*` routes if using Next.js routing structures.

*(Note: Configuration APIs, wallets, and credentials are intentionally excluded from this documentation and source control to ensure public repo safety.)*
