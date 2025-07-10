const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {BedrockAgent} = require('./services/BedrockAgent');
const {logger} = require('./utils/logger');
//const { validateRequest } = require('./middleware/validation');
//const { errorHandler } = require('./middleware/errorHandler');
//const { rateLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));
//app.use(rateLimiter);

// Initialize Bedrock Agent
const bedrockAgent = new BedrockAgent({
    region: process.env.AWS_REGION || 'us-east-1',
    agentId: process.env.BEDROCK_AGENT_ID,
    agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID || 'TSTALIASID'
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({status: 'healthy', timestamp: new Date().toISOString()});
});

// Chat endpoint
app.post('/chat', /*validateRequest,*/ async (req, res) => {
    try {
        const {message, sessionId, userId} = req.body;

        logger.info(`Received chat request from user: ${userId}`);

        const response = await bedrockAgent.invoke({
            inputText: message,
            sessionId,
            userId
        });

        res.json({
            success: true,
            response: response.output,
            sessionId: response.sessionId,
            citations: response.citations || []
        });
    } catch (error) {
        logger.error('Chat endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat request'
        });
    }
});

// Get session history
app.get('/sessions/:sessionId/history', async (req, res) => {
    try {
        const {sessionId} = req.params;
        const history = await bedrockAgent.getSessionHistory(sessionId);

        res.json({
            success: true,
            history
        });
    } catch (error) {
        logger.error('Session history error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve session history'
        });
    }
});

// Clear session
app.delete('/sessions/:sessionId', async (req, res) => {
    try {
        const {sessionId} = req.params;
        await bedrockAgent.clearSession(sessionId);

        res.json({
            success: true,
            message: 'Session cleared successfully'
        });
    } catch (error) {
        logger.error('Clear session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear session'
        });
    }
});

// Error handling middleware
//app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    logger.info(`Copilot Bedrock Agent server running on port ${PORT}`);
});

module.exports = app;
