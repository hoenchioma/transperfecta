import { DictItem } from 'lib/types';

// contains necessary info to create a hash function instance
export interface UnivHashFuncInfo {
    a: number,
    p: number,
    m: number,
}
export interface SecHashTable {
    hashFunc: UnivHashFuncInfo,
    data: Array<DictItem | null>,
}
export interface PerfHashTable {
    hashFunc: UnivHashFuncInfo,
    data: Array<SecHashTable | null>,
}

// create a universal hash family for a set of keys (of size m)
function getRandUnivHashFunc(m: number): UnivHashFuncInfo {
    // returns a prime number greater than n
    function getNextPrime(n: number): number {
        function isPrime(num: number): boolean {
            if (num <= 1) return false;
            if (num % 2 == 0 && num > 2) return false;
            const s = Math.sqrt(num);
            for (let i = 3; i <= s; i += 2) {
                if(num % i === 0) return false;
            }
            return true;
        }

        let p = n;
        // iterate until we get a prime number
        while (!isPrime(p)) p++;
        return p;
    }

    // return random integer in range [min, max)
    function getRandInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }   

    const p = getNextPrime(Math.max(m, 65536)); // 65536 is the alphabet size (16 bit)
    const a = getRandInt(1, p);

    return {a, p, m};
}

// construct the function (universal hash function) from the info
function makeFunc(info: UnivHashFuncInfo) {
    const { a, p, m } = info;
    // universal hashing for strings
    // https://en.wikipedia.org/wiki/Universal_hashing#Hashing_strings
    return (key: string) => {
        const n = key.length;
        let h = 0;
        for (let i = 0; i < n; i++) {
            const c = key.charCodeAt(i);
            h = ((h * a) + c) % p;
        }
        return h % m;
    }
}

// make a perfect hash table from an array of data
export function genPerfHashTable(data: DictItem[]): PerfHashTable {
    const m = data.length;
    const hashFuncInfo = getRandUnivHashFunc(m);
    const hash = makeFunc(hashFuncInfo);
    
    // primary hash
    const tmp: DictItem[][] = new Array(m).fill(null);
    for (const entry of data) {
        const { en: key } = entry; // use the en key of record as key
        const ind = hash(key);
        if (tmp[ind] === null) tmp[ind] = []
        tmp[ind].push(entry);
    }

    const res: PerfHashTable = {
        hashFunc: hashFuncInfo, // primary hash funciton
        data: new Array<SecHashTable | null>(m).fill(null),
    }

    // secondary hash
    for (let i = 0; i < m; i++) {
        const mi = tmp[i]?.length || 0;

        if (mi > 0) { // if at least one element hashed into this slot
            let secTmp = new Array<DictItem | null>(mi*mi); // make a hash table of size n^2
            let col = false, cnt = 0, hashFuncInfo;

            // try hashing until no collisions occur
            do {
                hashFuncInfo = getRandUnivHashFunc(mi*mi);
                const hash = makeFunc(hashFuncInfo);
                col = false;
                secTmp.fill(null);
                for (const entry of tmp[i]) {
                    const { en: key } = entry; // use the en key of record as key
                    const ind = hash(key);
                    if (secTmp[ind] === null) {
                        secTmp[ind] = entry;
                    } else if (secTmp[ind]?.en === key) { // ignore duplicate keys
                        console.log(`duplicate key ${key} !! ignoring...`);
                    } else {
                        col = true;
                        break;
                    }
                }
                if (++cnt > mi*mi) { // trying too many times (fail-safe just in case)
                    console.log({i, mi});
                    console.log({tmp: tmp[i], secTmp});
                    throw new Error(`repeated collision!! something's wrong :(`);
                }
            } while (col); // repeat until a collision free run

            res.data[i] = {
                hashFunc: hashFuncInfo, // secondary hash function
                data: secTmp,
            };
        }
    }

    return res;
}

// get data from perfect hash table
export function get(dict: PerfHashTable, keyStr: string): (DictItem | null) {
    // search in primary hash table
    const hash = makeFunc(dict.hashFunc);
    const key = hash(keyStr);
    const sdict = dict.data[key];
    if (sdict === null) return null; // key not found in primary hash table

    // search in secondary hash table
    const shash = makeFunc(sdict.hashFunc);
    const skey = shash(keyStr);
    const data = sdict.data[skey];

    return data;
}