import express from 'express';
import { readFile } from 'fs';
import { join } from 'path';
import { PerfHashTable, get } from './lib/perfect-hashing';

const app = express();
const port = +(process.env.PORT || 5000);
const addr = process.env.ADDR || '0.0.0.0';
let dict: (PerfHashTable | null) = null; // will contain the dictionary

// read file and store in dict
readFile(join(__dirname, '../data/hashed-dict.json'), 'utf8', (err, data) => {
    if (err) {
        console.log("Error reading file ...");
        console.log(err);
    } else {
        dict = JSON.parse(data);
        console.log("loaded dictionary from file successfully");
    }
});

// default route
app.get('/', (req, res) => {
    res.send('Welcome to the Dictionary API 😃');
});

// dictionary api route
app.get('/dict', (req, res) => {
    if (dict === null) {
        return res.json({ error: "dictionary not loaded" })
    } else {
        const { word } = req.query;
        const data = get(dict, word as string);
        if (data === null) {
            return res.json({ error: "word not found" });
        } else {
            return res.json({ word, data });
        }
    }
});

app.listen(port, addr, () => {
    console.log(`server is listening on ${port}`);
});