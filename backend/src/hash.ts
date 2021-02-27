import { readFile, writeFile } from 'fs';
import { join } from 'path';    
import { DictItem } from './lib/types';
import { genPerfHashTable } from './lib/perfect-hashing';

function stripBOM(str: string): string {
    if (str.charCodeAt(0) === 0xFEFF) {
        return str.slice(1);
    }
    return str;
}

readFile(join(__dirname, '../data/dict.json'), 'utf8', (err, data) => {
    if (err) {
        console.log("Error reading file ...");
        console.log(err);
    } else {
        const dict: DictItem[] = JSON.parse(stripBOM(data));
        const perfHashTable = genPerfHashTable(dict);
        const dataToWrite = JSON.stringify(perfHashTable);
        writeFile(join(__dirname, '../data/hashed-dict.json'), dataToWrite, 'utf8', (err) => {
            if (err) {
                console.log("Error writing file ...")
                console.log(err);
            }
        })
    }
})