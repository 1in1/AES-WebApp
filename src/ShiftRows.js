import React from 'react'
import Box from './Box.js'

function ShiftRowsPage(props) {
    const output = Array(props.input.length);
    for (let i=0; i<4; i++) {
        for (let j=0; j<4; j++) {
            output[4*i + j] = props.input[4*i + ((j+i) % 4)];
        }
    }

    return (
        <div>
            <Box key={'in'} data={props.input} />
            <h1>This is some more sep text</h1>
            <Box key={'out'} data={output} />
        </div>
    )
}


export default ShiftRowsPage;