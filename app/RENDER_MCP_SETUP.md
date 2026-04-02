# Render Integration for VS Code and Copilot

## Quick Start

### ✅ Requirements
- Node.js 18+ (Check: `node --version`)
- Render Account with API key
- VS Code with GitHub Copilot extension

### 📋 Step 1: Get Your Render API Key
1. Visit https://dashboard.render.com/api-keys
2. Click "Create API Key"
3. Name it (e.g., "VS Code MCP")
4. Copy the generated key (save it safely!)

### 🔧 Step 2: Set API Key in VS Code

**Option A: Using VS Code Terminal (Recommended)**
```powershell
# Open VS Code terminal (Ctrl+`)
# On Windows PowerShell:
$env:RENDER_API_KEY = "rnd_xxx..."

# On Windows CMD:
set RENDER_API_KEY=rnd_xxx...

# On macOS/Linux:
export RENDER_API_KEY="rnd_xxx..."
```

**Option B: Create .env.local File**
```bash
# In the app directory, create .env.local:
RENDER_API_KEY=rnd_xxx...

# This file is gitignored - your key is safe
```

**Option C: System Environment Variable**
- Windows: Settings → Environment Variables → New (USER or SYSTEM)
- macOS/Linux: Add to ~/.bashrc or ~/.zshrc

### 🚀 Step 3: Load MCP Server in VS Code

**Option A: Start MCP Server (Windows)**
```powershell
# In app directory:
.\start-render-mcp.bat
```

**Option B: Start MCP Server (macOS/Linux)**
```bash
# In app directory:
chmod +x start-render-mcp.sh
./start-render-mcp.sh
```

**Option C: Manual Start**
```bash
node render-mcp-server.js
```

### 🔄 Step 4: Reload VS Code
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
- Type "Developer: Reload Window"
- Press Enter

## Available Copilot Commands

Once configured, you can use Copilot Chat to manage Render services:

### List Services
Ask Copilot: **"Show all my Render services"**
- Displays all services with their IDs, names, and status

### Deploy a Service
Ask Copilot: **"Deploy the Tesla app service"** or **"Trigger deployment for srv_xxxxx"**
- Starts a new deployment
- Shows deployment progress

### Check Status
Ask Copilot: **"What's the status of my Tesla deployment?"**
- Current service status
- URL and environment info
- Recent updates

### View Logs
Ask Copilot: **"Show me recent logs from the Tesla service"**
- Last 100 log entries
- Timestamps and messages

## Testing Your Setup

### Test 1: Verify API Key
```powershell
# In VS Code terminal:
$env:RENDER_API_KEY
# Should show: rnd_xxx...
```

### Test 2: Run MCP Server
```bash
node render-mcp-server.js
# Should output: MCP server listening...
```

### Test 3: Use Copilot Chat
1. Open Copilot Chat (Ctrl+L or Cmd+L)
2. Mention @render in your message
3. Try: "@render list all my services"

## Troubleshooting

### ❌ "MCP Server not found"
**Solution:**
- Ensure `render-mcp-server.js` exists in the app root: `ls render-mcp-server.js`
- Check Node.js is installed: `node --version`
- Try running directly: `node render-mcp-server.js`

### ❌ "RENDER_API_KEY not set"
**Solution:**
- Open VS Code terminal (Ctrl+`)
- Set the key: `$env:RENDER_API_KEY = "your-key"`
- Restart the MCP server
- Reload VS Code window (Ctrl+Shift+P → Developer: Reload Window)

### ❌ "Unauthorized - Invalid API Key"
**Solution:**
- Go to https://dashboard.render.com/api-keys
- Generate a new API key
- Update your environment variable
- Restart the MCP server

### ❌ "Cannot connect to Render API"
**Solution:**
- Check internet connection
- Check firewall settings (port 443 should be open)
- Verify API endpoint: https://api.render.com/v1

### ❌ "Copilot doesn't recognize @render"
**Solution:**
1. Ensure VS Code is reloaded:
   - Ctrl+Shift+P → Developer: Reload Window
2. Check MCP server is running:
   - Terminal should show: "Render MCP Server ready"
3. Verify .vscode/settings.json exists in the app directory

## Security Best Practices

⚠️ **Never commit your API key!**
- `.env.local` is in `.gitignore` (safe)
- Never hardcode keys in code
- Regenerate keys if accidentally exposed
- Use environment variables only

## Files Reference

```
app/
├── render-mcp-server.js          # MCP server implementation
├── start-render-mcp.bat          # Windows launcher
├── start-render-mcp.sh           # macOS/Linux launcher
├── .env.example                  # API key template
├── render.yaml                   # Render deployment config
├── RENDER_MCP_SETUP.md          # This file
└── .vscode/
    └── settings.json             # VS Code MCP config
```

## Quick Reference

### Windows PowerShell
```powershell
# Set API key
$env:RENDER_API_KEY = "rnd_xxx..."

# Start MCP server
.\start-render-mcp.bat

# Or manually:
node render-mcp-server.js
```

### macOS/Linux Bash
```bash
# Set API key
export RENDER_API_KEY="rnd_xxx..."

# Start MCP server
chmod +x start-render-mcp.sh
./start-render-mcp.sh

# Or manually:
node render-mcp-server.js
```

## Documentation Links

- 📖 [Render API Documentation](https://api-docs.render.com/)
- 🔑 [Render Dashboard](https://dashboard.render.com)
- 🤖 [Copilot Extensions Docs](https://docs.github.com/en/copilot)
- 🔌 [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure Node.js v18+ is installed
4. Check .vscode/settings.json exists in the app directory
5. Try reloading VS Code: Ctrl+Shift+P → Developer: Reload Window

## Version Information

- **Render MCP**: 1.0.0
- **Node.js Required**: 18.0.0+
- **VS Code Required**: 1.90.0+
- **Copilot Extension**: Latest version

## Credits

Render MCP Server integration for GitHub Copilot in VS Code.
Built for seamless deployment management from your editor.

Last Updated: April 2, 2026
