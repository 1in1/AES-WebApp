import React, { Component } from 'react'
import Box from './Box.js'


//const irredCoeffs = [1, 0, 0, 0, 1, 1, 0, 1, 1];
const irredCoeffs = [1, 1, 0, 1, 1, 0, 0, 0];
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
    }
}



function getF8MultTable(n) {
    let transpose = [];
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
                    out[i] = util.xorVec(arr, transpose[i]);
            }
            return util.toInt(out);
        }
    };
}


class MultTableF8 extends Component {
    constructor(props) {
        super(props);

        this.transpose = [];
        this.poly = util.toBinArray(props.n);
        this.transpose[0] = this.poly.slice(0);
        for(let i=1; i<8; i++) {
            this.poly.unshift(0);
            if(this.poly.pop() === 1) {
                this.poly = this.poly.map((k, index) => (k + irredCoeffs[index]) % 2);
            }
            this.transpose[i] = this.poly.slice(0);
        }

        this.table = new Array(8);
        for(let i=0; i<8; i++) {
            this.table[i] = new Array(8);
            for(let j=0; j<8; j++) {
                this.table[i][j] = this.transpose[j][i];
            }
        }

        this.s = this.table.map(k => k.join(' & ')).join('\\\\\n');
    }

    times(arr) {
        //We can expect arr to be an array of 1s and 0s
        //So can just condition on the value

        let out = [0,0,0,0,0,0,0,0];
        for(let i=0; i<8; i++) {
            if(arr[i])
                out[i] = util.xorVec(arr, this.transpose[i]);
        }
        return out;
    }

    render() {
        return (
            <p>
                \({'\{' + this.props.n.toString(16) + '\}: '}
                    \begin{'{'}bmatrix{'}'}
                        {this.s}
                    \end{'{'}bmatrix{'}'}\)
            </p>
    );}
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
    const s = table.map(k => '\\{' + k.join('\\} & \\{') + '\\}').join('\\\\\n');

    const multTables = poly.reduce((acc, curr) => {
        if(acc && !(acc.hasOwnProperty(curr))) {
            acc[curr] = getF8MultTable(curr);
        }
        return acc;
    }, {});


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
        </div>
    );
}

export default MixColumnsPage;