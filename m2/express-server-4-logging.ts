import dotenv from 'dotenv';
dotenv.config({ path: __dirname  + '/.env' });

import express, { json } from 'express';
import morgan from 'morgan';
import type { ErrorRequestHandler } from 'express-serve-static-core';

import { logger } from './utils/logger'

const { PORT, ENV } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}


const app = express();
app.use(json());

if (ENV === 'development') {
    app.use(morgan('dev'));
}

// Middlewares
app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request to ${req.url}`, { params: req.params, query: req.query });

    next();
});

// Routing
app.get('/success', async (req, res, next) => {
    res.sendStatus(200);
});

app.get('/error', async (req, res, next) => {
    try {
        throw new Error('Database error');
    } catch (err) {
        next(err);
    }
});

// Error handling
app.use(((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ error: err.message });
}) as ErrorRequestHandler);

// Event listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

