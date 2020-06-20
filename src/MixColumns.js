import React, { Component } from 'react'
import Box from './Box.js'


//const irredCoeffs = [1, 0, 0, 0, 1, 1, 0, 1, 1];
const irredCoeffs = [1, 1, 0, 1, 1, 0, 0, 0];
//In generating the mult tables we are assuming this already
const modulo = [1, 0, 0, 1];



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



function getF8MultTable(n) {
    const transpose = [];
    let poly = util.toBinArray(n);
    transpose[0] = poly.slice(0);
    for(let i=1; i<8; i++) {
        poly.unshift(0);
        if(poly.pop() === 1) {
            poly = poly.map((k, index) => (k + irredCoeffs[index]) % 2);
        }
        transpose[i] = poly.slice(0);
    }

    const table = new Array(8);
    for(let i=0; i<8; i++) {
        table[i] = new Array(8);
        for(let j=0; j<8; j++) {
            table[i][j] = transpose[j][i];
        }
    }

    return { 
        texString: table.map(k => k.join(' & ')).join('\\\\\n'),
        times: (m) => {
            let arr = util.toBinArray(m);
            let out = [0,0,0,0,0,0,0,0];
            for(let i=0; i<8; i++) {
                if(arr[i])
                    out = util.xorVec(out, transpose[i]);
            }
            return util.toInt(out);
        }
    };
}

function MixColumnsPage(props) {
    //We assume we have the polynomial with greatest power of x first
    const poly = props.poly;
    const rpoly = poly.slice(0).reverse();
    const coeffs = [...new Set(poly)]; //Distinct coefficients
    const table = [[],[],[],[]];
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            table[j][i] = rpoly[(3*i+j) % 4];
        }
    }
    const transp = new Array(4);
    for(let i=0; i<4; i++) {
        transp[i] = new Array(4);
        for(let j=0; j<4; j++) {
            transp[i][j] = table[j][i];
        }
    }
    const s = table.map(k => '\\{' + k.join('\\} & \\{') + '\\}').join('\\\\\n');
    const multTables = poly.reduce((acc, curr) => {
        if(acc && !(acc.hasOwnProperty(curr))) {
            acc[curr] = getF8MultTable(curr);
        }
        return acc;
    }, {});

    console.log(multTables[3].times(2))

    const output = new Array(props.input.length);

    //For each col we want to calculate (=col in output = col in right matrix)
    for(let k=0; k<4; k++) {
        let column = [0, 0, 0, 0];
        //For each col in the left matrix
        for(let j=0; j<4; j++) {
            column = util.addVec(
                column, 
                transp[j].map(n => 
                    multTables[n].times(props.input[4*j + k])
                ),
                (a, b) => a^b
            );
        }
        for(let l=0; l<4; l++)
            output[4*l + k] = column[l];
    }

    return (
        <div>
            <p>Our invertible polynomial is \[ 
                {poly.map( (n, d) => 
                    '\\{' + n.toString(16) + '\\}\\cdot x^{' + (3 - d).toString() + '}'
                ).join(' + ')}
            \]
            So we need to get hold of the multiplication tables for each coefficient.</p>
            
            {coeffs.map( n=> 
                <p>\(
                    {'\{' + n.toString(16) + '\}: '}
                    \begin{'{'}bmatrix{'}'}
                        {multTables[n].texString}
                    \end{'{'}bmatrix{'}'}
                \)</p>
            )}

            <p>The calculation on our data is 
                \[
                    \begin{'{'}bmatrix{'}'} b_0\\b_1\\b_2\\b_3 \end{'{'}bmatrix{'}'}
                    =
                    \begin{'{'}bmatrix{'}'} {s} \end{'{'}bmatrix{'}'}
                    \begin{'{'}bmatrix{'}'} a_0\\a_1\\a_2\\a_3 \end{'{'}bmatrix{'}'},
                \]
                which gives us
            </p>

            <Box key={'in'} data={props.input} />
            <h1>sep text</h1>
            <Box key={'out'} data={output} />
        </div>
    );
}

export default MixColumnsPage;