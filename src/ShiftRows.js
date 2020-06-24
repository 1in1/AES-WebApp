import React, { useState, useEffect } from 'react'
import Box from './Box.js'
import EditBox from './EditBox.js'


const init_data = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];


function ShiftRowsPage(props) {
    const [editOpen, setEditOpen] = useState(false);
    const [input, setInput] = useState(init_data);

    const getOutput = (a) => {
        const output = Array(a.length);
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                output[4*i + j] = a[4*i + ((j+i) % 4)];
            }
        }
        return output;
    };
    

    return (
        <div className='page'>
            <h2>Shift Rows</h2>
            <p>Once we have swapped out elements in the state for others, we want to take each row of the box, and "rotate" it. For Rijndael, we move each element in the \( i^{'{'}th{'}'}\) row \(i\) elements to the left, with the ones going past the edge wrapping back around (the top row is row 0!). Note that when we fill our initial state, we are filling column by column, and so this is quite a significant scrambling of the data!</p>
            <p>Try it out below. Again, the state box can be edited by clicking on it.</p>


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
    )
}


export default ShiftRowsPage;