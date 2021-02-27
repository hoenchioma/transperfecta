import express from 'express';
import { readFile } from 'fs';
import { join } from 'path';
import { PerfHashTable, makeFunc } from './lib/perfect-hashing';

const app = express();
const port = 3000;
const addr = '0.0.0.0';
let dict: (PerfHashTable | null) = null; // will contain the dictionary

readFile(join(__dirname, '../data/hashed-dict.json'), 'utf8', (err, data) => {
    if (err) {
        console.log("Error reading file ...");
        console.log(err);
    } else {
        dict = JSON.parse(data);
        console.log("loaded dictionary from file successfully");
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Dictionary API 😃');
});

app.get('/dict', (req, res) => {
    if (dict === null) {
        return res.json({ error: "dictionary not loaded" })
    } else {
        const { word } = req.query;
        const hash = makeFunc(dict.hashFunc);
        const key = hash(word as string);
        const sdict = dict.data[key];
        if (sdict === null) {
            return res.json({ error: "word not found" });
        }
        const shash = makeFunc(sdict.hashFunc);
        const skey = shash(word as string);
        const data = sdict.data[skey];
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