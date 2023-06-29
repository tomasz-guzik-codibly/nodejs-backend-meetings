import express, { json } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ErrorRequestHandler } from 'express-serve-static-core';
dotenv.config({ path: __dirname  + '/.env' });

const { PORT } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}

const app = express();
app.use(json());

// Routing
app.get('/error', async (req, res, next) => {
    try {
        throw new Error('Database error');
    } catch (err) {
        next(err);
    }
});

// Error handling
app.use(((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
}) as ErrorRequestHandler);

// Event listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

