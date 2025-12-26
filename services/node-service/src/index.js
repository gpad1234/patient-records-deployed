/**
 * Patient Records - Node.js API Gateway Service
 * Orchestrates communication between Java and Python services
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import winston from 'winston';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import webScraperRoutes from './routes/webscraper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    req.id = uuidv4();
    logger.info(`[${req.id}] ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: process.env.SERVICE_NAME || 'node-service',
        version: '1.0.0'
    });
});

// Service info endpoint
app.get('/info', (req, res) => {
    res.json({
        name: 'Patient Records - Node.js API Gateway',
        version: '1.0.0',
        description: 'Orchestrates Java and Python MCP services',
        port: PORT,
        connectedServices: {
            java: process.env.JAVA_SERVICE_URL,
            python: process.env.PYTHON_SERVICE_URL
        }
    });
});

// Health check for downstream services
app.get('/services/health', async (req, res) => {
    const serviceHealth = {
        javaService: { status: 'checking' },
        pythonService: { status: 'checking' }
    };

    try {
        const javaHealth = await axios.get(`${process.env.JAVA_SERVICE_URL}/health`, { timeout: 5000 });
        serviceHealth.javaService = javaHealth.data;
    } catch (error) {
        serviceHealth.javaService = { status: 'unavailable', error: error.message };
    }

    try {
        const pythonHealth = await axios.get(`${process.env.PYTHON_SERVICE_URL}/health`, { timeout: 5000 });
        serviceHealth.pythonService = pythonHealth.data;
    } catch (error) {
        serviceHealth.pythonService = { status: 'unavailable', error: error.message };
    }

    res.json(serviceHealth);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`[${req.id}] Error: ${err.message}`);
    res.status(500).json({
        error: 'Internal Server Error',
        requestId: req.id
    });
});

// Register WebScraper routes
app.use('/api/research', webScraperRoutes);

app.listen(PORT, () => {
    logger.info(`Node.js API Gateway started on port ${PORT}`);
    logger.info(`Java Service: ${process.env.JAVA_SERVICE_URL}`);
    logger.info(`Python Service: ${process.env.PYTHON_SERVICE_URL}`);
});

export default app;
