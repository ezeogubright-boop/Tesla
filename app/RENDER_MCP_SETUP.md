# Render Integration for VS Code and Copilot

## Setup Instructions

### Step 1: Install Node.js
Ensure you have Node.js 18+ installed: `node --version`

### Step 2: Get Your Render API Key
1. Go to https://dashboard.render.com/api-keys
2. Create a new API key
3. Copy the key

### Step 3: Set Environment Variable
In VS Code terminal (or system environment):
```bash
# On Windows (PowerShell):
$env:RENDER_API_KEY = "your-api-key-here"

# On Windows (CMD):
set RENDER_API_KEY=your-api-key-here

# On macOS/Linux:
export RENDER_API_KEY="your-api-key-here"
```

Or create a `.env.local` file in the app directory:
```
RENDER_API_KEY=your-api-key-here
```

### Step 4: Reload VS Code
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
- Type "Developer: Reload Window" and press Enter

## Available Copilot Commands

Once configured, you can use Copilot to:

1. **List all services:**
   - "Show me all Render services"
   - "List my Render deployments"

2. **Deploy a service:**
   - "Deploy service [serviceId]"
   - "Trigger deployment for [service-name]"

3. **Check status:**
   - "What's the status of [serviceId]?"
   - "Check deployment status for [service-name]"

4. **View logs:**
   - "Show logs for [serviceId]"
   - "Get recent logs from [service-name]"

## Example Usage

In Copilot Chat:
```
@render list_services
→ Shows all your Render services

@render deploy_service serviceId=srv_xxxxx
→ Deploys the specified service

@render get_deployment_status serviceId=srv_xxxxx
→ Checks the current status
```

## Troubleshooting

**MCP Server not found:**
- Ensure the `render-mcp-server.js` file is in the app root
- Check that Node.js is installed: `node --version`

**API Key not recognized:**
- Verify the `RENDER_API_KEY` environment variable is set
- Check the Render dashboard for valid API keys

**Permission errors:**
- Ensure your API key has the correct scopes
- Go to https://dashboard.render.com/api-keys to regenerate if needed

## Files Included

- `render-mcp-server.js` - MCP server implementation
- `.vscode/settings.json` - VS Code MCP configuration
- `render.yaml` - Render deployment manifest

## References

- [Render API Documentation](https://api-docs.render.com/)
- [VS Code MCP Protocol](https://modelcontextprotocol.io)
- [GitHub Copilot MCP Integration](https://github.com/copilot-extensions)
