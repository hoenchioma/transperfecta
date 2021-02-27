import { DictItem } from 'lib/types';

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

    const p = getNextPrime(Math.max(m, 65536));
    const a = getRandInt(1, p);

    return {a, p, m};
}

export function makeFunc(info: UnivHashFuncInfo) {
    const { a, p, m } = info;
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

export function genPerfHashTable(data: DictItem[]): PerfHashTable {
    const m = data.length;
    const hashFuncInfo = getRandUnivHashFunc(m);
    const hash = makeFunc(hashFuncInfo);
    
    const tmp: DictItem[][] = new Array(m).fill(null);
    for (const entry of data) {
        const { en: key } = entry;
        const ind = hash(key);
        if (tmp[ind] === null) tmp[ind] = []
        tmp[ind].push(entry);
    }

    const res: PerfHashTable = {
        hashFunc: hashFuncInfo,
        data: new Array<SecHashTable | null>(m).fill(null),
    }
    for (let i = 0; i < m; i++) {
        const mi = tmp[i]?.length || 0;
        // console.log(i, mi);
        if (mi > 0) {
            let secTmp = new Array<DictItem | null>(mi*mi);
            let col = false, cnt = 0, hashFuncInfo;
            do {
                hashFuncInfo = getRandUnivHashFunc(mi*mi);
                const hash = makeFunc(hashFuncInfo);
                col = false;
                secTmp.fill(null);
                for (const entry of tmp[i]) {
                    const { en: key } = entry;
                    const ind = hash(key);
                    if (secTmp[ind] === null) {
                        secTmp[ind] = entry;
                    } else if (secTmp[ind]?.en === key) {
                        console.log(`duplicate key ${key} !! ignoring...`);
                    } else {
                        col = true;
                        break;
                    }
                }
                if (++cnt > mi*mi) {
                    console.log({i, mi});
                    console.log({tmp: tmp[i], secTmp});
                    throw new Error(`repeated collision!! something's wrong :(`);
                }
            } while (col); // repeat until a collision free run
            res.data[i] = {
                hashFunc: hashFuncInfo,
                data: secTmp,
            };
        }
    }

    return res;
}