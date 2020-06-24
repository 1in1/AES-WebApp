import React, { useState } from 'react'
import Box from './Box.js'
import EditBox from './EditBox.js'
import util from './Utility.js'


function getF8MultTable(n) {
    const irredCoeffs = [1, 1, 0, 1, 1, 0, 0, 0];
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


function MultTableDraw(props) {
    const Latex = props.tex;
    return (
        <Latex className='multTable' displayMode={true}>{'$$\\begin{bmatrix}' + getF8MultTable(props.n).texString + '\\end{bmatrix} $$'}</Latex>
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
                <MultTableDraw key={val.text} n={parseInt(val.text, 16)} tex={props.tex} />
            }
        </div>
    );
}

function MixColumnsPage(props) {
    const [editOpen, setEditOpen] = useState(false);
    const [input, setInput] = useState(props.input);
    const Latex = props.tex;


    //We assume we have the polynomial with greatest power of x first
    const poly = [3, 1, 1, 2];
    const rpoly = poly.slice(0).reverse();
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
            <p>Here's where things start to get tricky. We now work in <Latex>{'$\\mathbb{F}(2^8)[y]$'}</Latex>, that is, the ring of polynomials with coefficients in <Latex>{'$\\mathbb{F}(2^8)$'}</Latex>. We still really want to be thinking in terms of our isomorphism earlier, so the hex notation introduced will now be very helpful for keeping our two variables <Latex>{'$x$ and $y$'}</Latex> apart in our heads.</p>
            <p>We want to think of each column, in turn, as a polynomial of degree strictly less than 4. To this end, we fix a column, and let its elements be the coefficients in ascending order (i.e., the last value is the coefficient of <Latex>$y^3$</Latex>).</p>
            <p>Now, just the notion that we are working with polynomials of a maximum degree should indicate we are again thinking about a quotient ring. Here, we are doing all following calculations in: <Latex displayMode={true}>{'$$ R := \\frac{\\mathbb{F}(2^8)[y]}{ ( {\\color{green}\\{01\\}}y^4 + {\\color{green}\\{01\\}} ) }. $$'}</Latex>
            For this step of the algorithm, we want to multiply each column by a fixed element of <Latex>$R$</Latex>. In Rijndael, this element is 
            <Latex displayMode={true}>{
                '$$a(y) = ' + poly.map( (n, d) => 
                    '{\\color{green}\\{' + n.toString(16) + '\\}}\\cdot y^{' + (3 - d).toString() + '}'
                ).join(' + ') + '.$$'
            }</Latex></p>

            <p>Of course, this involves multiplying elements in <Latex>{'$\\mathbb{F}(2^8)$'}</Latex>, which is certainly not trivial, so we need to get hold of the multiplication tables for each coefficient. (Why for the coefficients? There are only four of them, and once calculated once, they can be reused). It is fairly easy to find the representation of an element of <Latex>{'$\\mathbb{F}(2^8)$'}</Latex> as a matrix acting on the vector space <Latex>{'$\\mathbb{F}(2^8)^8$, by considering its action on the standard basis $\\{1, x, ..., x^7\\}$'}</Latex>. (Talk about the module). You can enter such an element into the box below to see this representation of it.</p>


            <MultTableWidget default='00' tex={props.tex} />

            <p>Notice that the coefficients of <Latex>$a$</Latex> make for some very easy calculations! Not only is the identity repeated, <Latex>{'$ {\\color{green}\\{03\\}}$'}</Latex> is just the sum of the other two.</p>
            
            <p>Now the particular choice of quotient ring <Latex>$R$</Latex> is very nice - since we saw before that all elements in <Latex>{'$\\mathbb{F}(2^8)$'}</Latex> are additively self-inverse, taking this quotient is the same as setting <Latex>{'$ {\\color{green}\\{01\\}}={\\color{green}\\{01\\}}y^4$'}</Latex>, and so the action on each basis element of <Latex>$R$</Latex> is very easy to work out: the vector expression representing the action of <Latex>$a$</Latex> with respect to the basis <Latex>{'$\\{{\\color{green}\\{01\\}} , ..., {\\color{green}\\{01\\}}y^3\\}$'}</Latex> is:
                <Latex displayMode={true}>{`$$
                    \\begin{bmatrix} b_0\\\\b_1\\\\b_2\\\\b_3 \\end{bmatrix}
                    =
                    \\begin{bmatrix} ` + s + ` \\end{bmatrix}
                    \\begin{bmatrix} a_0\\\\a_1\\\\a_2\\\\a_3 \\end{bmatrix},
                $$`}</Latex>
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