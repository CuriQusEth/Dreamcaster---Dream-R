# Dreamseed Gardener & DreamCaster Orchestrator

Welcome to **Dreamseed Gardener**, a peaceful, magical gardening simulation game built for the modern web on Base. Within this serene ecosystem, you can nurture your own living dream garden, planting magical Dreamseeds that grow into fantastical plants, shaping beautiful dreamscapes.

## Features

- **Magical Gardening**: Drag and drop Dreamseeds into the soil.
- **Rich Interaction**: Water, nourish, and interact with your plants as they grow over time with canvas-rendered particle effects.
- **Web3 Integration**: Integrated with the Base ecosystem (Mainnet). Features include SIWE (Sign-In with Ethereum) capabilities, letting you assert ownership of your breathtaking gardens safely and securely on-chain.
- **ERC-8004 AI Agent Integration**: We introduce the **DreamCaster Orchestrator**, a fully integrated ERC-8004 intelligent agent that manages dream-casting, content generation, and multi-task automation.

## Project Architecture

- **Frontend**: Built with React 19, Vite, Tailwind CSS, and Framer Motion. 
- **Blockchain**: Integrates `wagmi` and `viem` for trustless interaction. Also supports ERC-8021 tracking.
- **Server**: Express.js is utilized to serve the app and provide the AI automation endpoints:
  - `GET /api/agent`: Agent control API.
  - `GET/POST /api/mcp`: Active Model Context Protocol command execution endpoint.
  - `/.well-known/agent-card.json`: The public identity file for the Orchestrator AI.

## Getting Started

1. Clone or download the repository.
2. Run `npm install` to load dependencies.
3. Start the dev server using `npm run dev`.
4. Open the displayed localhost URL to start shaping your dreamscapes!

## Deployment

Deploy using `npm run build` and follow up with `npm run start` for production usage, or directly host it on platforms like Vercel with your configuration.

All interactions are securely tracked on Base network to give a beautiful, persistent legacy to your dream gardens. Happy gardening!
