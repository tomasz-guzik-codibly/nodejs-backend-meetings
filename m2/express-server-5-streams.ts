import dotenv from 'dotenv';
dotenv.config({ path: __dirname  + '/.env' });

import express, { json } from 'express';
import * as fs from 'fs';
import csvParser from 'csv-parser';

const { PORT, ENV } = process.env;

if (!PORT || Number.isNaN(+PORT)) {
    throw new Error('Invalid PORT!')
}


const app = express();
app.use(json());

// Routing
app.get('/json', (req, res) => {
    // Readable stream to read the CSV file
    const readableStream = fs.createReadStream(__dirname + '/data/data.csv');

    // Transformation stream to convert CSV records to JSON objects
    const transformStream = csvParser();

    // Writable stream to store the JSON objects in an array
    const jsonArray: Record<string, any>[] = [];

    // Pipe the streams together
    readableStream
        .pipe(transformStream) // Pipe through the CSV parser
        .on('data', (data) => {
            // Perform any additional transformations or operations on the data if needed
            jsonArray.push(data);
        })
        .on('end', () => {
            // Send the JSON response with the transformed data
            res.json(jsonArray);
        })
        .on('error', (err) => {
            console.error('An error occurred during file processing:', err);
            res.status(500).json({ error: 'An error occurred during file processing.' });
        });
});


// Error handling

// Event listener
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

