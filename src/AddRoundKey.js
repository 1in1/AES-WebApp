import React from 'react'
import Box from './Box.js'

function AddRoundKeyPage(props) {
    const output = new Array(props.input.data.length);
    for(let i=0; i<props.input.data.length; i++)
        output[i] = props.input.data[i]^props.input.roundKey[i];
    
    console.log(props.input.data);
    console.log(props.input.roundKey);
    console.log(output);

    return (
        <div>
            <Box key={'in'} data={props.input.data} />
            <h1>This is just some separating text</h1>
            <Box key={'out'} data={output} />
        </div>
    );
}

export default AddRoundKeyPage;