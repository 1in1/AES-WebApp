import React, { useState, useEffect } from 'react'
import Box from './Box.js'
import EditBox from './EditBox.js'
import util from './Utility.js'


//const irredCoeffs = [1, 0, 0, 0, 1, 1, 0, 1, 1];
const irredCoeffs = [1, 1, 0, 1, 1, 0, 0, 0];
//In generating the mult tables we are assuming this already
const modulo = [1, 0, 0, 1];


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


function MultTable(props) {
    console.log(props.n);
    useEffect(() => {
        window.MathJax.typeset(document.getElementsByClassName('multTable'));
    });
    return (
        <p className='multTable'>\[ \begin{'{bmatrix}'}{getF8MultTable(props.n).texString}\end{'{bmatrix}'} \]
        </p>
    );
}
function MultTableWidget(props) {
    const [val, setVal] = useState({text: '', valid: false});
    return (
        <div className='multTableWidget'>
            <label for='multTableInput'>Try it - matrix for: </label>
            <input 
                type='text' 
                value={val.text}
                onChange={event => {
                    if(event.target.value==='') {
                        setVal({text: '', valid: false});
                    } else {
                        let i = parseInt(event.target.value, 16);
                        if(i>=0 && i < 256){
                            setVal({text: event.target.value, valid: true});
                        }
                    }
                }}
                placeholder={props.default}
                id='inverseInput' 
                style={{width: 20}} />
            {val.valid && 
                <MultTable key={val.text} n={parseInt(val.text, 16)}/>
            }
        </div>
    );
}

function MixColumnsPage(props) {
    const [editOpen, setEditOpen] = useState(false);
    const [input, setInput] = useState(props.input);


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


    const getOutput = (a) => {
        //For each col we want to calculate (=col in output = col in right matrix)    
        const output = new Array(a.length);
        for(let k=0; k<4; k++) {
            let column = [0, 0, 0, 0];
            //For each col in the left matrix
            for(let j=0; j<4; j++) {
                column = util.addVec(
                    column, 
                    transp[j].map(n => 
                        multTables[n].times(a[4*j + k])
                    ),
                    (a, b) => a^b
                );
            }
            for(let l=0; l<4; l++)
                output[4*l + k] = column[l];
        }
        return output;
    };


    return (
        <div className='page'>
            <h2>Mix Columns</h2>
            <p>Here's where things start to get tricky. We now work in \(\mathbb{'{'}F{'}'}(2^8)[y]\), that is, the ring of polynomials with coefficients in \(\mathbb{'{'}F{'}'}(2^8)\). We still really want to be thinking in terms of our isomorphism earlier, so the hex notation introduced will now be very helpful for keeping our two variables \(x\) and \(y\) apart in our heads.</p>
            <p>We want to think of each column, in turn, as a polynomial of degree strictly less than 4. To this end, we fix a column, and let its elements be the coefficients in ascending order (i.e., the last value is the coefficient of \(y^3\)).</p>
            <p>Now, just the notion that we are working with polynomials of a maximum degree should indicate we are again thinking about a quotient ring. Here, we are doing all following calculations in:
                \[
                    R := \frac{'{'}\mathbb{'{F}'}(2^8)[y]{'}'}{'{'}({'{\\color{green}\\{'}01{'\\}}'}y^4 + {'{\\color{green}\\{'}01{'\\}}'} ) {'}'}.
                \]
            For this step of the algorithm, we want to multiply each column by a fixed element of \(R\). In Rijndael, this element is \[ 
                a(y) = {poly.map( (n, d) => 
                    '{\\color{green}\\{' + n.toString(16) + '\\}}\\cdot y^{' + (3 - d).toString() + '}'
                ).join(' + ')}.
            \]
            Of course, this involves multiplying elements in \(\mathbb{'{F}'}(2^8)\), which is certainly not trivial, so we need to get hold of the multiplication tables for each coefficient. (Why for the coefficients? There are only four of them, and once calculated once, they can be reused). It is fairly easy to find the representation of an element of \(\mathbb{'{F}'}(2^8)\) as a matrix acting on the vector space \(\mathbb{'{F}'}(2^8)^8\), by considering its action on the standard basis \({'\\{'}1, x, ..., x^7{'\\}'}\). (Talk about the module). You can enter such an element into the box below to see this representation of it.</p>


            <MultTableWidget default='00'/>

            <p>Notice that the coefficients of \(a\) make for some very easy calculations! Not only is the identity repeated, \({'{\\color{green}\\{'}03{'\\}}'}\) is just the sum of the other two.</p>
            
            <p>Now the particular choice of quotient ring \(R\) is very nice - since we saw before that all elements in \(\mathbb{'{F}'}\) are additively self-inverse, taking this quotient is the same as setting \({'{\\color{green}\\{'}01{'\\}}={\\color{green}\\{'}01{'\\}}'}y^4\), and so the action on each basis element of \(R\) is very easy to work out: the vector expression representing the action of \(a(y)\) with respect to the basis \( {'\\{{\\color{green}\\{'}01{'\\}}'}, ..., {'{\\color{green}\\{'}01{'\\}}y^3\\}'}\) is:
                \[
                    \begin{'{'}bmatrix{'}'} b_0\\b_1\\b_2\\b_3 \end{'{'}bmatrix{'}'}
                    =
                    \begin{'{'}bmatrix{'}'} {s} \end{'{'}bmatrix{'}'}
                    \begin{'{'}bmatrix{'}'} a_0\\a_1\\a_2\\a_3 \end{'{'}bmatrix{'}'},
                \]
            </p>

            <p>Have a play with the boxes below, which will apply the full column mixing transformation.</p>

            <div className='boxContainerOuter'>
                <div className='boxContainerInner' onClick={() => setEditOpen(true)}>State:
                    <Box key={'in'+input.toString()} data={input} /></div>
                <div className='boxContainerInner'>Output:
                    <Box key={'out'+input.toString()}
                    data={getOutput(input)} />
                </div>
            </div>
            {editOpen && 
            <div><div className='fadeBackground'
            onClick={() => setEditOpen(false)}></div>
            <div className='editBoxContainer'>
                <EditBox initial={input} editHandler={(v) => {
                    setInput(v);
                }}/>
            </div></div>
            }
        </div>
    );
}

export default MixColumnsPage;