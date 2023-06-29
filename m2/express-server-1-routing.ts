import express, { json } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname  + '/.env' });

const { PORT } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}

const BASE_PATH = '/vehicles';

// Data
let vehicles = [
    { id: 1, brand: 'Tesla', model: 'Model 3' },
    { id: 2, brand: 'Nissan', model: 'Leaf' }
];

const app = express();
app.use(json());
// app.use(helmet()); TODO additional headers

// Middlewares
app.use((req, res, next) => {
    console.log(`Received a ${req.method} request to ${req.url}`);

    next();
});

// Routing
app.get(BASE_PATH, (req, res) => {
    res.json(vehicles);
});

app.get(`${BASE_PATH}/:id`, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const vehicle = vehicles.find(v => v.id === vehicleId);

    if (vehicle) {
        res.json(vehicle);
    } else {
        res.status(404).json({ error: 'Vehicle not found' });
    }
});

app.post(BASE_PATH, (req, res) => {
    const newVehicle = req.body;
    console.log(newVehicle);
    vehicles.push({ id: vehicles.length + 1, ...newVehicle });
    res.status(201).json(newVehicle);
});

app.put(`${BASE_PATH}/:id`, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const updatedVehicle = req.body;

    const index = vehicles.findIndex(v => v.id === vehicleId);

    if (index !== -1) {
        vehicles[index] = { ...vehicles[index], ...updatedVehicle };
        res.json(vehicles[index]);
    } else {
        res.status(404).json({ error: 'Vehicle not found' });
    }
});

app.delete(`${BASE_PATH}/:id`, (req, res) => {
    const vehicleId = parseInt(req.params.id);
    const index = vehicles.findIndex(v => v.id === vehicleId);

    if (index !== -1) {
        vehicles.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.status(404).json({ error: 'Vehicle not found' });
    }
});

app.all('*', (req, res) => {
    res.status(404).json({ error: 'Path not found' });
})

// Event listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

