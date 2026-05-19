import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: /api/mcp
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "DreamCaster MCP Endpoint",
      status: "active",
      description: "Active MCP server for DreamCaster Orchestrator Agent",
      capabilities: ["dream-casting", "content-generation", "creative-orchestration"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const method = body?.method;

      if (method === 'initialize') {
        res.json({
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: { name: "DreamCaster Orchestrator", version: "1.0.0" }
        });
        return;
      }

      if (method === 'tools/list') {
        res.json({
          tools: [
            { name: "get_race_status", description: "Get the current race status", inputSchema: { type: "object", properties: {} } },
            { name: "start_race", description: "Start a new race", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Get the current leaderboard", inputSchema: { type: "object", properties: {} } },
            { name: "optimize_speed", description: "Optimize speed for current conditions", inputSchema: { type: "object", properties: {} } },
            { name: "get_track_info", description: "Get details about the current track", inputSchema: { type: "object", properties: {} } }
          ]
        });
        return;
      }

      if (method === 'tools/call') {
        res.json({ content: [{ type: "text", text: `Tool ${body?.params?.name} executed successfully.` }] });
        return;
      }

      if (method === 'prompts/list') {
        res.json({ prompts: [] });
        return;
      }

      if (method === 'resources/list') {
        res.json({ resources: [] });
        return;
      }

      res.json({
        status: "success",
        message: "MCP command received",
        agent: "DreamCaster Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  // API Route: /api/agent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "DreamCaster Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "DreamCaster",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
