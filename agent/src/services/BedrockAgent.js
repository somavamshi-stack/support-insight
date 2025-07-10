const {BedrockAgentClient, InvokeAgentCommand} = require('@aws-sdk/client-bedrock-agent');
const {fromEnv} = require('@aws-sdk/credential-providers');
const {v4: uuidv4} = require('uuid');
const {logger} = require('../utils/logger');

class BedrockAgent {
    constructor(config) {
        this.config = config;
        this.client = new BedrockAgentClient({
            region: config.region,
            credentials: fromEnv()
        });
        this.sessions = new Map(); // In-memory session storage
    }

    async invoke({inputText, sessionId, userId}) {
        try {
            // Generate session ID if not provided
            if (!sessionId) {
                sessionId = uuidv4();
            }

            const command = new InvokeAgentCommand({
                agentId: this.config.agentId,
                agentAliasId: this.config.agentAliasId,
                sessionId,
                inputText,
                sessionState: {
                    sessionAttributes: {
                        userId: userId || 'anonymous'
                    }
                }
            });

            logger.info(`Invoking Bedrock agent for session: ${sessionId}`);

            const response = await this.client.send(command);

            // Process the response stream
            const output = await this.processResponseStream(response.completion);

            // Store session history
            this.updateSessionHistory(sessionId, {
                input: inputText,
                output: output.text,
                timestamp: new Date().toISOString(),
                citations: output.citations
            });

            return {
                output: output.text,
                sessionId,
                citations: output.citations
            };

        } catch (error) {
            logger.error('Bedrock agent invocation error:', error);
            throw new Error(`Failed to invoke Bedrock agent: ${error.message}`);
        }
    }

    async processResponseStream(completionStream) {
        let text = '';
        let citations = [];

        try {
            for await (const chunk of completionStream) {
                if (chunk.chunk?.bytes) {
                    const chunkText = Buffer.from(chunk.chunk.bytes).toString('utf-8');
                    text += chunkText;
                }

                if (chunk.trace?.orchestrationTrace?.rationale?.text) {
                    logger.debug('Agent rationale:', chunk.trace.orchestrationTrace.rationale.text);
                }

                if (chunk.trace?.orchestrationTrace?.invocationInput?.actionGroupInvocationInput) {
                    logger.debug('Action group invocation:',
                        chunk.trace.orchestrationTrace.invocationInput.actionGroupInvocationInput);
                }

                if (chunk.trace?.orchestrationTrace?.observation?.actionGroupInvocationOutput) {
                    const output = chunk.trace.orchestrationTrace.observation.actionGroupInvocationOutput;
                    if (output.text) {
                        text += output.text;
                    }
                }

                // Extract citations if available
                if (chunk.trace?.orchestrationTrace?.observation?.knowledgeBaseLookupOutput?.retrievedReferences) {
                    const refs = chunk.trace.orchestrationTrace.observation.knowledgeBaseLookupOutput.retrievedReferences;
                    citations = citations.concat(refs.map(ref => ({
                        content: ref.content?.text || '',
                        location: ref.location?.s3Location || ref.location?.webLocation,
                        score: ref.score || 0
                    })));
                }
            }
        } catch (error) {
            logger.error('Error processing response stream:', error);
            throw error;
        }

        return {text, citations};
    }

    updateSessionHistory(sessionId, entry) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, []);
        }

        const history = this.sessions.get(sessionId);
        history.push(entry);

        // Keep only last 50 entries per session
        if (history.length > 50) {
            history.splice(0, history.length - 50);
        }

        this.sessions.set(sessionId, history);
    }

    async getSessionHistory(sessionId) {
        return this.sessions.get(sessionId) || [];
    }

    async clearSession(sessionId) {
        this.sessions.delete(sessionId);
        logger.info(`Session ${sessionId} cleared`);
    }

    // Get all active sessions
    getActiveSessions() {
        return Array.from(this.sessions.keys());
    }

    // Clean up old sessions (sessions older than 24 hours)
    cleanupOldSessions() {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

        for (const [sessionId, history] of this.sessions.entries()) {
            if (history.length > 0) {
                const lastActivity = new Date(history[history.length - 1].timestamp);
                if (lastActivity < cutoff) {
                    this.sessions.delete(sessionId);
                    logger.info(`Cleaned up old session: ${sessionId}`);
                }
            }
        }
    }
}

module.exports = {BedrockAgent};
