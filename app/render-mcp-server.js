#!/usr/bin/env node

/**
 * Render MCP Server for Copilot
 * Enables deployment, monitoring, and management of Render services
 */

const http = require('http');
const https = require('https');

class RenderMCPServer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.render.com/v1';
    this.tools = {
      'list_services': this.listServices.bind(this),
      'deploy_service': this.deployService.bind(this),
      'get_deployment_status': this.getDeploymentStatus.bind(this),
      'view_logs': this.viewLogs.bind(this),
    };
  }

  async makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : null;
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  async listServices() {
    try {
      const result = await this.makeRequest('GET', '/services');
      return {
        type: 'text',
        text: JSON.stringify(result.data, null, 2),
      };
    } catch (error) {
      return { type: 'text', text: `Error: ${error.message}` };
    }
  }

  async deployService(serviceId) {
    try {
      const result = await this.makeRequest('POST', `/services/${serviceId}/deploys`);
      return {
        type: 'text',
        text: `Deployment triggered for service ${serviceId}\n${JSON.stringify(result.data, null, 2)}`,
      };
    } catch (error) {
      return { type: 'text', text: `Error: ${error.message}` };
    }
  }

  async getDeploymentStatus(serviceId) {
    try {
      const result = await this.makeRequest('GET', `/services/${serviceId}`);
      const service = result.data;
      return {
        type: 'text',
        text: `Service: ${service.name}\nStatus: ${service.status}\nURL: ${service.serviceDetails?.url || 'N/A'}`,
      };
    } catch (error) {
      return { type: 'text', text: `Error: ${error.message}` };
    }
  }

  async viewLogs(serviceId, limit = 100) {
    try {
      const result = await this.makeRequest('GET', `/services/${serviceId}/events?limit=${limit}`);
      const events = result.data?.events || [];
      const logs = events.map(e => `[${e.createdAt}] ${e.message}`).join('\n');
      return { type: 'text', text: logs || 'No logs found' };
    } catch (error) {
      return { type: 'text', text: `Error: ${error.message}` };
    }
  }

  async handleToolCall(toolName, args) {
    if (!this.tools[toolName]) {
      return { type: 'text', text: `Unknown tool: ${toolName}` };
    }
    return await this.tools[toolName](args);
  }
}

// Initialize server
const apiKey = process.env.RENDER_API_KEY || '';
const server = new RenderMCPServer(apiKey);

// MCP Server interface
const mcp = {
  implementationMetadata: {
    name: 'Render MCP',
    version: '1.0.0',
  },
  tools: [
    {
      name: 'list_services',
      description: 'List all Render services in your account',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'deploy_service',
      description: 'Trigger a deployment for a Render service',
      inputSchema: {
        type: 'object',
        properties: {
          serviceId: { type: 'string', description: 'ID of the service to deploy' },
        },
        required: ['serviceId'],
      },
    },
    {
      name: 'get_deployment_status',
      description: 'Check deployment status and details of a service',
      inputSchema: {
        type: 'object',
        properties: {
          serviceId: { type: 'string', description: 'ID of the service' },
        },
        required: ['serviceId'],
      },
    },
    {
      name: 'view_logs',
      description: 'View recent logs for a Render service',
      inputSchema: {
        type: 'object',
        properties: {
          serviceId: { type: 'string', description: 'ID of the service' },
          limit: { type: 'number', description: 'Number of log entries to fetch', default: 100 },
        },
        required: ['serviceId'],
      },
    },
  ],
  async processMessage(message) {
    if (message.type === 'toolCall') {
      return await server.handleToolCall(message.toolName, message.args);
    }
    return { type: 'text', text: 'Invalid message type' };
  },
};

// Export for MCP integration
module.exports = mcp;
