#!/bin/bash
# Start Render MCP Server for VS Code Copilot Integration

echo "======================================"
echo "   Render MCP Server Launcher"
echo "======================================"
echo ""

if [ -z "$RENDER_API_KEY" ]; then
    echo "ERROR: RENDER_API_KEY environment variable not set"
    echo ""
    echo "Please set your Render API key:"
    echo "  export RENDER_API_KEY=\"your-key-here\""
    echo ""
    echo "Or copy your key to .env.local"
    exit 1
fi

echo "Starting Render MCP Server..."
echo "API Key configured: ${RENDER_API_KEY:0:10}..."
echo ""

node render-mcp-server.js
