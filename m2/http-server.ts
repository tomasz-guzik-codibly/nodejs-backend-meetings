import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname  + '/.env' });

const { PORT } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}

const httpServer = http.createServer((req, res) => {
    console.log('Incoming request:', `[${req.method}] ${req.url}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello!');
})

httpServer.listen(+PORT, 'localhost', () => {
   console.log(`Server running at http://localhost:${PORT}`);
});