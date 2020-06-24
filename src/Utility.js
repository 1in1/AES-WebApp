const util = {
    toBinArray: (b) => {
        let out = [];
        for(let i=0; i<8; i++)
            out[i] = (b>>i)&1;
        return out;
    },
    toInt: (arr) => {
        return arr.reverse().reduce((acc, curr) => 2*acc + curr);
    },
    xorVec: (a, b) => {
        let out = [];
        for(let i in a)
            out[i] = a[i]^b[i];
        return out;
    },
    andVec: (a, b) => {
        let out = [];
        for(let i in a)
            out[i] = a[i]&b[i];
        return out;
    },
    addVec: (a, b, fn) => {
        let out = [];
        for(let i in a)
            out[i] = fn(a[i], b[i]);
        return out;
    },
}

export default util;