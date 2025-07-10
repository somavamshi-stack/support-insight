const config = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        bedrockAgent: {
            agentId: process.env.BEDROCK_AGENT_ID,
            agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID || 'TSTALIASID'
        }
    },
    server: {
        port: process.env.PORT || 3001,
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

module.exports = config;
