import React, { useState } from 'react'
import util from './Utility.js'

const cols = [[1, 1, 1, 1, 1, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 1, 1, 1], [1, 1, 0, 0, 0, 1, 1, 1], [1, 1, 1, 0, 0, 0, 1, 1], [1, 1, 1, 1, 0, 0, 0, 1]];


function ATDraw(props) {
    const Latex = require('react-latex');
    
    const input = util.toBinArray(props.value);
    let partial = [0,0,0,0,0,0,0,0];
    for(let i in input) {
        if(input[i]) {
            partial = util.xorVec(partial, cols[i]);
        }
    }
    const output = util.xorVec(partial, [1, 1, 0, 0, 0, 1, 1, 0]);
    return (
        <Latex>{`$$
            \\begin{bmatrix} 1&0&0&0&1&1&1&1\\\\1&1&0&0&0&1&1&1\\\\1&1&1&0&0&0&1&1&\\\\1&1&1&1&0&0&0&1\\\\1&1&1&1&1&0&0&0\\\\0&1&1&1&1&1&0&0\\\\0&0&1&1&1&1&1&0\\\\0&0&0&1&1&1&1&1 \\end{bmatrix}
            \\begin{bmatrix}`+ input.join('\\\\') + `\\end{bmatrix}
            +
            \\begin{bmatrix} 1\\\\1\\\\0\\\\0\\\\0\\\\1\\\\1\\\\0 \\end{bmatrix}
            =
            \\begin{bmatrix}` + partial.join('\\\\') + `\\end{bmatrix}
            +
            \\begin{bmatrix} 1\\\\1\\\\0\\\\0\\\\0\\\\1\\\\1\\\\0 \\end{bmatrix}
            =
            \\begin{bmatrix}` + output.join('\\\\') + `\\end{bmatrix}
            = ` + util.toInt(output).toString(16) + `
        $$`}</Latex>
    );
}

function ATWidget(props) {
    const [val, setVal] = useState('00');
    return (
        <div class='affine'>
            <label for='affineInput'>Try it - transform of: </label>
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
                id='affineInput' 
                style={{width: 20}} />
            <p>{val.valid && 
            <ATDraw key={val.text} value={parseInt(val.text, 16)}/>}</p>
        </div>
    );
}

export default ATWidget;