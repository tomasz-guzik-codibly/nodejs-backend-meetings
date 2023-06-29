import http from 'http';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname  + '/.env' });

const { PORT } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}

let vehicles = [
    { id: 1, brand: 'Tesla', model: 'Model 3' },
    { id: 2, brand: 'Nissan', model: 'Leaf' }
];

const BASE_PATH = '/vehicles';

const server = http.createServer((req, res) => {
    console.log('Incoming request:', `[${req.method}] ${req.url}`);

    if (!req.url) {
        return res.end();
    }

    // ROUTING 🫣
    if (req.url === BASE_PATH && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(vehicles));
    } else if (req.url.startsWith(`${BASE_PATH}/`) && req.method === 'GET') {
        const vehicleId = parseInt(req.url.split('/')[2]);
        const vehicle = vehicles.find(v => v.id === vehicleId);

        if (vehicle) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(vehicle));
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Vehicle not found' }));
        }
    } else if (req.url === BASE_PATH && req.method === 'POST') {
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk;
        });
        req.on('end', () => {
            const newVehicle = JSON.parse(requestBody);
            vehicles.push({ id: vehicles.length + 1, ...newVehicle });
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(newVehicle));
        });
    } else if (req.url.startsWith(`${BASE_PATH}/`) && req.method === 'PUT') {
        const vehicleId = parseInt(req.url.split('/')[2]);
        let requestBody = '';
        req.on('data', chunk => {
            requestBody += chunk;
        });
        req.on('end', () => {
            const updatedVehicle = JSON.parse(requestBody);
            const index = vehicles.findIndex(v => v.id === vehicleId);

            if (index !== -1) {
                vehicles[index] = { ...vehicles[index], ...updatedVehicle };
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(vehicles[index]));
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Vehicle not found' }));
            }
        });
    } else if (req.url.startsWith(`${BASE_PATH}/`) && req.method === 'DELETE') {
        const vehicleId = parseInt(req.url.split('/')[2]);
        const index = vehicles.findIndex(v => v.id === vehicleId);

        if (index !== -1) {
            vehicles.splice(index, 1);
            res.statusCode = 204;
            res.end();
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Vehicle not found' }));
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Invalid API path' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});