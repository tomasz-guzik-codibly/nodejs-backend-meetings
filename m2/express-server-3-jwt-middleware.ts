import express, { json } from 'express';
import dotenv from 'dotenv';
import { RequestHandler } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

dotenv.config({ path: __dirname  + '/.env' });

const { PORT, AUTH_SECRET } = process.env;

if (!AUTH_SECRET) {
    throw new Error('Invalid AUTH_SECRET!')
}

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}

declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

const app = express();
app.use(json());

const jwtMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, AUTH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded;

        next();
    });
};


// Routing
app.get('/protected', jwtMiddleware, (req, res) => {
    console.log('Current user', req.user);
    res.json({ message: 'Authorized access' });
});

// Event listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

